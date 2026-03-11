const { Program,
  Theme,
  Punct,
  Test,
  User,
  Statistic,
  ThemeStatistic,
  PunctStatistic,
  File, FileAsset, Question, Answer, Event
} = require("../models/models");
const sequelize = require('../db'); 
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const mammoth = require('mammoth');
const util = require('node:util');

const yauzl = require('yauzl');

const writeFileAsync = util.promisify(fs.writeFile);
const unlinkAsync = util.promisify(fs.unlink);

// Utility helpers
const STATIC_DIR = path.resolve(__dirname, '..', 'static');
if (!fs.existsSync(STATIC_DIR)) fs.mkdirSync(STATIC_DIR, { recursive: true });

function safeFilename(originalName) {
  const ext = originalName && originalName.includes('.') ? '.' + originalName.split('.').pop() : '';
  return uuid.v4() + ext;
}

async function saveSingleFile(file) {
  if (!file) return null;
  const filename = safeFilename(file.name || 'file');
  const fullPath = path.join(STATIC_DIR, filename);
  await new Promise((resolve, reject) => {
    file.mv(fullPath, (err) => err ? reject(err) : resolve());
  });
  return filename;
}

async function saveFilesArrayOrSingle(multi, expectedExt = '') {
  // returns array of saved filenames (possibly empty)
  if (!multi) return [];
  if (Array.isArray(multi)) {
    const res = [];
    for (const f of multi) {
      res.push(await saveSingleFile(f));
    }
    return res;
  }
  // single
  return [await saveSingleFile(multi)];
}

async function convertDocxToHtmlIfExists(filename) {
  if (!filename) return '';
  const fullPath = path.join(STATIC_DIR, filename);
  try {
    const stats = fs.statSync(fullPath);
    if (!stats || stats.size === 0) {
      throw new Error('file empty');
    }
  } catch (e) {
    // file missing or unreadable — treat as empty
    return '';
  }

  try {
    const result = await mammoth.convertToHtml({ path: fullPath });
    return result && result.value ? result.value : '';
  } catch (e) {
    // conversion error — return empty string but do not throw to avoid crashing server
    console.error('Mammoth conversion failed for', filename, e.message || e);
    return '';
  }
}

function validateParsedThemes(parsedThemes) {
  if (!Array.isArray(parsedThemes)) return 'themes must be an array';

  for (let ti = 0; ti < parsedThemes.length; ti++) {
    const theme = parsedThemes[ti];
    if (!theme.title) return `Модуль "${ti + 1}" не имеет названия!`;
    let boolCount = 0;
    if (!Array.isArray(theme.puncts) || theme.puncts.length === 0) return `В модуле "${theme.title}" нет пунктов!`;
    for (let pi = 0; pi < theme.puncts.length; pi++) {
      const punct = theme.puncts[pi];
      if (!punct.title) return `Тема "${ti + 1}.${pi + 1}" не имеет названия!`;
      if (punct.test_id) boolCount++;
      if (punct.practical_work) boolCount++;
      if (!punct.lection_title && !punct.video_src && !punct.test_id && !punct.practical_work && !punct.lection_pdf && !punct.audio_src) return `Тема "${ti + 1}.${pi + 1}" не может быть пустой`;
    }
    if (boolCount === 0) return `В модуле "${theme.title}" нет теста! (В каждой теме должен быть один тест для подсчета статистики!)`;
    if (boolCount > 1) return `В модуле "${theme.title}" ${boolCount} тестов! (В каждой теме может быть только один тест)`;
  }
  return null;
}

class ProgramController {


  async importProgramZip(req, res, next) {
    try {
      const { id } = req.params; // programId
      const zipFile = req.files?.zip;
      const resetProgram = req.body.resetProgram === 'true';
      if (!zipFile) {
        return res.status(400).json({ error: 'No zip uploaded' });
      }

      const tmpDir = path.join(__dirname, '../tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      const tmpPath = path.join(tmpDir, zipFile.name);
      await zipFile.mv(tmpPath);

      const themeMap = new Map(); // themeName -> themeId
      const punctMap = new Map(); // themeId-punctName -> punctId

      const getOrCreateTheme = async (themeName) => {
        if (themeMap.has(themeName)) {
          return themeMap.get(themeName);
        }

        const maxOrder = await Theme.max('order_index', {
          where: { programId: id },
        });

        const theme = await Theme.create({
          programId: id,
          title: themeName,
          order_index: (maxOrder || 0) + 1,
        });

        themeMap.set(themeName, theme.id);
        return theme.id;
      };

      const getOrCreatePunct = async (themeId, punctName) => {
        const key = `${themeId}-${punctName}`;
        if (punctMap.has(key)) {
          return punctMap.get(key);
        }

        const maxOrder = await Punct.max('order_index', {
          where: { themeId },
        });

        const punct = await Punct.create({
          themeId,
          title: punctName,
          order_index: (maxOrder || 0) + 1,
        });

        punctMap.set(key, punct.id);
        return punct.id;
      };

      if (resetProgram) {
        await sequelize.transaction(async (t) => {
          await Theme.destroy({ where: { programId: id }, transaction: t });
          // не трогаем файлы/пункты, cascade удалит всё автоматически
        });
      }

      const processEntry = (zip, entry) => {
        return new Promise((resolve, reject) => {
          if (/\/$/.test(entry.fileName)) {
            return resolve(); // директория
          }

          const parts = entry.fileName.split('/').filter(Boolean);

          // Минимум: Program/Theme/file
          if (parts.length < 3) {
            return resolve();
          }

          const themeName = parts[1];
          const fileName = parts[parts.length - 1];
          const storedName = safeFilename(fileName);
          const fullPath = path.join(STATIC_DIR, storedName);

          const isThemeFile = parts.length === 3;
          const isPunctFile = parts.length >= 4;
          const punctName = isPunctFile ? parts[2] : null;

          zip.openReadStream(entry, async (err, readStream) => {
            if (err) return reject(err);

            try {
              const themeId = await getOrCreateTheme(themeName);
              let punctId = null;

              if (isPunctFile && punctName) {
                punctId = await getOrCreatePunct(themeId, punctName);
              }

              const chunks = [];
              readStream.on('data', (chunk) => chunks.push(chunk));

              readStream.on('end', async () => {
                try {
                  const buffer = Buffer.concat(chunks);
                  await writeFileAsync(fullPath, buffer);

                  const ext = fileName.split('.').pop()?.toLowerCase();

                  const EXTENSION_MAP = {
                    docx: 'docx',
                    pdf: 'pdf',
                    mp3: 'audio',
                    wav: 'audio',
                    ogg: 'audio',
                  };

                  const type = EXTENSION_MAP[ext ?? ''];

                  // ❗️ если тип не поддерживается — просто выходим
                  if (type) {

                    const whereOrder = isPunctFile
                        ? { punctId }
                        : { themeId, punctId: null };

                    const maxOrder = await File.max('order_index', {
                      where: whereOrder,
                    });

                    const order_index = isNaN(maxOrder) ? 0 : maxOrder + 1;

                    const fileRecord = await File.create({
                      original_name: fileName,
                      stored_name: storedName,
                      mime_type: 'application/octet-stream',
                      size: buffer.length,
                      storage: 'local',
                      type,
                      themeId: isThemeFile ? themeId : null,
                      punctId: isPunctFile ? punctId : null,
                      order_index,
                      status: 'idle',
                    });

                    if (type === 'docx') {
                      const html = await convertDocxToHtmlIfExists(storedName);
                      if (html) {
                        await FileAsset.create({
                          fileId: fileRecord.id,
                          type: 'html',
                          content: html,
                        });
                      }
                    }
                  }

                  resolve();
                } catch (e) {
                  reject(e);
                }
              });
            } catch (e) {
              reject(e);
            }
          });
        });
      };

      await new Promise((resolve, reject) => {
        yauzl.open(tmpPath, { lazyEntries: true }, (err, zip) => {
          if (err) return reject(err);

          zip.readEntry();

          zip.on('entry', async (entry) => {
            try {
              await processEntry(zip, entry);
              zip.readEntry(); // ← ключевая строка
            } catch (e) {
              zip.close();
              reject(e);
            }
          });

          zip.on('end', resolve);
          zip.on('error', reject);
        });
      });


      await unlinkAsync(tmpPath);

      const program = await Program.findOne({
        where: { id },
        include: [
          {
            model: Theme,
            separate: true,
            order: [['order_index', 'ASC']],
            include: [
              {
                model: Punct,
                separate: true,
                order: [['order_index', 'ASC']],
                include: [
                  {
                    model: File,
                    separate: true,
                    order: [['order_index', 'ASC']],
                    include: [FileAsset],
                  },
                ],
              },
              {
                model: File,
                separate: true,
                where: { punctId: null },
                required: false,
                order: [['order_index', 'ASC']],
              },
            ],
          },
        ],
      });

      if (!program) {
        return next(ApiError.notFound('Программа не найдена'));
      }

      return res.json(program);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to import zip' });
    }
  }



  async create(req, res, next) {
    try {
      const { admin_id } = req.body;
      console.log(req.body)
      if (!admin_id) {
        return next(ApiError.badRequest('admin_id обязателен'));
      }

      const program = await Program.create({
        admin_id,
        title: null,
        short_title: null,
        price: null,
        img: null,
        number_of_practical_work: 0,
        number_of_test: 0,
        number_of_videos: 0,
        status: 'draft'
      });

      await Event.create({
        event_text: 'Создана новая программа',
        type: 'program',
        event_id: program.id,
      });

      return res.json(program);
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка создания программы'));
    }
  }

  async updatePartial(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const program = await Program.findOne({ where: { id } });
      if (!program) return next(ApiError.notFound('Программа не найдена'));

      const body = req.body || {};

      // Обновляем поля текста
      if (body.title !== undefined) program.title = body.title;
      if (body.short_title !== undefined) program.short_title = body.short_title;
      if (body.price !== undefined) program.price = body.price;

      // Обновляем количество элементов, если пришло
      if (body.number_of_videos !== undefined) program.number_of_videos = body.number_of_videos;
      if (body.number_of_test !== undefined) program.number_of_test = body.number_of_test;
      if (body.number_of_practical_work !== undefined) program.number_of_practical_work = body.number_of_practical_work;

      // ----------------- Обновляем картинку -----------------

      program.status = 'draft'
      await program.save({ transaction: t });
      await t.commit();

      return res.json(program);
    } catch (e) {
      await t.rollback();
      console.error(e);
      return next(ApiError.internal('Ошибка обновления программы'));
    }
  }

  // Обновление картинки
  async updateImage(req, res, next) {
    try {
      const { id } = req.params;
      const program = await Program.findByPk(id);
      const file = req.files?.img;
      if (!program) return next(ApiError.notFound('Программа не найдена'));

      if (!file) return next(ApiError.badRequest('Файл не передан'));

      // Сохраняем новый файл
      const imgSaved = await saveSingleFile(file);

      // Удаляем старый файл, если есть
      if (program.img) {
        const oldImgPath = path.join(STATIC_DIR, program.img);
        try {
          if (fs.existsSync(oldImgPath)) {
            await fs.promises.unlink(oldImgPath);
            console.log('🗑 Old program image deleted:', oldImgPath);
          }
        } catch (err) {
          console.warn('Не удалось удалить старую картинку:', oldImgPath, err);
        }
      }

      // Обновляем поле в базе
      program.status = 'draft'
      program.img = imgSaved;
      await program.save();

      return res.json({ img: program.img, message: 'Картинка обновлена' });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка обновления картинки'));
    }
  }

  // Удаление картинки
  async destroyImage(req, res, next) {
    try {
      const { id } = req.params;
      const program = await Program.findByPk(id);
      if (!program) return next(ApiError.notFound('Программа не найдена'));

      if (program.img) {
        const oldImgPath = path.join(STATIC_DIR, program.img);
        try {
          if (fs.existsSync(oldImgPath)) {
            await fs.promises.unlink(oldImgPath);
            console.log('🗑 Old program image deleted:', oldImgPath);
          }
        } catch (err) {
          console.warn('Не удалось удалить старую картинку:', oldImgPath, err);
        }
      }
      program.status = 'draft'
      program.img = null;
      await program.save();

      return res.json({ img: null, message: 'Картинка удалена' });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка удаления картинки'));
    }
  }

  async createTheme(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: 'programId обязателен' });

      // Определяем order_index: берем максимальный существующий и +1
      const maxOrder = await Theme.max('order_index', { where: { programId: id } });
      const order_index = (maxOrder || 0) + 1;

      const theme = await Theme.create({
        programId: id,
        order_index,
        title: '', // пустое название

      });

      return res.json(theme);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async updateThemeTitle(req, res, next) {
    try {
      const { title } = req.body;
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: 'themeId обязателен' });
      if (typeof title !== 'string') return res.status(400).json({ message: 'title обязателен' });

      const theme = await Theme.findByPk(id);
      if (!theme) return res.status(404).json({ message: 'Пункт не найден' });

      theme.title = title;
      await theme.save();

      return res.json({ id: theme.id, title: theme.title });
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }


  async createPunct(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: 'themeId обязателен' });

      // Определяем order_index: берем максимальный существующий и +1
      const maxOrder = await Punct.max('order_index', { where: { themeId: id } });
      const order_index = (maxOrder || 0) + 1;

      const punct = await Punct.create({
        themeId: id,
        order_index,
        title: '' // пустое название
      });

      return res.json(punct);
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  // Обновление title пункта

  async updatePunctTitle(req, res, next) {
    try {
      const { title } = req.body;
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: 'punctId обязателен' });
      if (typeof title !== 'string') return res.status(400).json({ message: 'title обязателен' });

      const punct = await Punct.findByPk(id);
      if (!punct) return res.status(404).json({ message: 'Пункт не найден' });

      punct.title = title;
      await punct.save();

      return res.json({ id: punct.id, title: punct.title });
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async updatePunctDescription(req, res, next) {
    try {
      const { description } = req.body;
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: 'punctId обязателен' });
      if (typeof description !== 'string') return res.status(400).json({ message: 'description обязателен' });

      const punct = await Punct.findByPk(id);
      if (!punct) return res.status(404).json({ message: 'Пункт не найден' });

      punct.description = description;
      await punct.save();

      return res.json({ id: punct.id, description: punct.description });
    } catch (e) {
      console.error(e);
      return next(e);
    }
  }

  async addFileToPunctOrTheme(req, res, next) {
    try {
      const { targetType, targetId, type, url } = req.body;
      const files = req.files;

      if (!targetType || !targetId) {
        return res.status(400).json({ error: 'targetType and targetId are required' });
      }

      if (!['theme', 'punct'].includes(targetType)) {
        return res.status(400).json({ error: 'Invalid targetType' });
      }

      if (!['docx', 'pdf', 'audio', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
      }

      // ----------------- order_index -----------------
      const orderWhere =
          targetType === 'punct'
              ? { punctId: targetId }
              : { themeId: targetId };

      const maxOrder = await File.max('order_index', { where: orderWhere });
      const order_index = isNaN(maxOrder) ? 0 : maxOrder + 1;


      // ----------------- ЗАГРУЗКА ВИДЕО -----------------
      if (type === 'video') {
        if (!url) {
          return res.status(400).json({ error: 'Video url required' });
        }

        const videoRecord = await File.create({
          original_name: 'Видео',
          stored_name: null,
          mime_type: null,
          type: 'video',
          size: null,
          url,
          storage: 'vimeo',

          themeId: targetType === 'theme' ? targetId : null,
          punctId: targetType === 'punct' ? targetId : null,

          order_index,
          status: 'idle',
        });

        return res.json({
          success: true,
          file: videoRecord,
        });
      }

      if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const fileKey = Object.keys(files)[0];
      const file = files[fileKey];

      // ----------------- Проверка расширения -----------------
      const ext = file.name.split('.').pop().toLowerCase();

      const typeExtensions = {
        docx: ['docx'],
        pdf: ['pdf'],
        audio: ['mp3', 'wav', 'ogg'],
      };

      if (!typeExtensions[type].includes(ext)) {
        return res.status(400).json({
          error: `File extension .${ext} does not match type ${type}`,
        });
      }



      // ----------------- Создаём файл (uploading) -----------------
      const originalName = Buffer.from(file.name, 'latin1').toString('utf8');

      const tempFileRecord = await File.create({
        original_name: originalName,
        stored_name: '',
        mime_type: file.mimetype,
        size: file.size,
        storage: 'local',
        type,

        themeId: targetType === 'theme' ? targetId : null,
        punctId: targetType === 'punct' ? targetId : null,

        order_index,
        status: 'uploading',
      });

      // ----------------- Сохраняем файл -----------------
      const storedName = safeFilename(file.name);
      const fullPath = path.join(STATIC_DIR, storedName);

      try {
        await new Promise((resolve, reject) => {
          file.mv(fullPath, (err) => (err ? reject(err) : resolve()));
        });

        await tempFileRecord.update({
          stored_name: storedName,
          status: 'idle',
        });
      } catch (err) {
        console.error('File save failed:', err);
        await tempFileRecord.update({ status: 'error' });
        return res.status(500).json({ error: 'File save failed' });
      }

      // ----------------- DOCX → HTML -----------------
      let fileAsset = null;
      if (type === 'docx') {
        const htmlContent = await convertDocxToHtmlIfExists(storedName);
        if (htmlContent) {
          fileAsset = await FileAsset.create({
            fileId: tempFileRecord.id,
            type: 'html',
            content: htmlContent,
          });
        }
      }

      const fullFile = await File.findByPk(tempFileRecord.id, {
        separate: true, // отдельный запрос для файлов
        order: [['order_index', 'ASC']],
        include: [
          {
            model: FileAsset,
          },
        ],
      });


      return res.json({
        success: true,
        file: fullFile,
      });

    } catch (err) {
      console.error('Add file failed:', err);
      return res.status(500).json({ error: 'File upload failed' });
    }
  }

  async updateFileName (req, res, next) {

    try {
      const fileId = req.params.id;
      const { original_name } = req.body;

      if (!original_name) {
        return res.status(400).json({ error: 'original_name is required' });
      }

      // Находим файл
      const file = await File.findByPk(fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Обновляем
      file.original_name = original_name;
      await file.save();

      return res.json({ file });
    } catch (err) {
      console.error('Error updating file name:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


  async getAll(req, res, next) {
    try {
      const programs = await Program.findAll({
        attributes: {
          include: [
            [
              sequelize.fn('COUNT', sequelize.col('users.id')),
              'users_quantity',
            ],
          ],
        },
        include: [
          {
            model: User,
            attributes: [],
            through: {
              where: { status: 'active' },
              attributes: [],
            },
            required: false, // чтобы программы без пользователей тоже вернулись
          },
        ],
        group: ['program.id'],
      });

      return res.json(programs);
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка получения программ'));
    }
  }

  async getAllPublishedPrograms(req, res, next) {
    try {
      const programs = await Program.findAll({
        where: {
          status: 'published',
        },
        order: [['id', 'DESC']],
        attributes: [
          'id',
          'title',
          'short_title',
          'price',
          'img',
          [
            sequelize.fn('COUNT', sequelize.col('users.id')),
            'users_quantity',
          ],
        ],
        include: [
          {
            model: User,
            attributes: [],
            through: {
              where: { status: 'active' }, // считаем только активных
              attributes: [],
            },
            required: false,
          },
        ],
        group: ['program.id'],
      });

      return res.json(programs);
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка получения программ'));
    }
  }

  async getAllDraftPrograms(req, res, next) {
    try {
      const programs = await Program.findAll({
        where: { status: 'draft' },
        order: [['id', 'DESC']]
      });

      return res.json(programs);
    } catch (e) {
      return next(ApiError.internal('Ошибка получения черновиков'));
    }
  }

  async getOnePunct(req, res, next) {
    try {
      const { id } = req.params;
      const punct = await Punct.findOne({ where: { id } });
      if (!punct) return next(ApiError.notFound('Пункт не найден'));
      return res.json(punct);
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка получения пункта'));
    }
  }

  async getOneTheme(req, res, next) {
    try {
      const { id } = req.params;
      const theme = await Theme.findOne({ where: { id } });
      if (!theme) return next(ApiError.notFound('Тема не найдена'));
      return res.json(theme);
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка получения темы'));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      const program = await Program.findOne({
        where: { id },
        include: [
          {
            model: Theme,
            separate: true, // отдельный запрос для тем
            order: [['order_index', 'ASC']],
            include: [
              {
                model: Punct,
                separate: true, // отдельный запрос для пунктов
                order: [['order_index', 'ASC']],
                include: [
                  {
                    model: File,
                    separate: true, // отдельный запрос для файлов
                    order: [['order_index', 'ASC']],
                    include: [
                      {
                        model: FileAsset,
                        // можно добавить order, если FileAsset тоже имеет order_index
                        // order: [['order_index', 'ASC']]
                      }
                    ]
                  },
                  {
                    model: Test,
                    separate: true, // отдельный запрос для файлов
                    order: [['order_index', 'ASC']],
                    include: [
                      {
                        model: Question,
                        as: 'questions',
                        include: [Answer],
                      },
                    ],
                  }
                ]
              },
              {
                model: File,
                separate: true, // отдельный запрос для файлов
                order: [['order_index', 'ASC']],
                include: [
                  {
                    model: FileAsset,
                    // можно добавить order, если FileAsset тоже имеет order_index
                    // order: [['order_index', 'ASC']]
                  }
                ]
              }
            ]
          },
          {
            model: Test,
            order: [['order_index', 'ASC']],
            include: [
              {
                model: Question,
                as: 'finalQuestions',
                include: [Answer],
              },
            ],
          }
        ]
      });

      if (!program) return next(ApiError.notFound('Программа не найдена'));

      // Считаем пользователей, как раньше

      return res.json(program);

    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка получения программы'));
    }
  }

  async deleteProgram(req, res, next) {
    try {
      const { id } = req.params;

      const program = await Program.findByPk(id);
      if (!program) {
        return res.status(404).json({ message: 'Программа не найдена' });
      }
      await Event.create({
        event_text: 'Программа удалена',
        name: program.title,
        type: 'program',

      });
      await program.destroy();

      return res.json({ message: 'Программа успешно удалена' });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка удаления программы'));
    }
  }

  async deleteTheme(req, res, next) {
    try {
      const { id } = req.params; // themeId
      const theme = await Theme.findByPk(id);
      if (!theme) return next(ApiError.notFound('Тема не найдена'));

      // destroy автоматически удалит все File, FileAsset и Punct (если есть каскады)
      await theme.destroy();

      return res.json({ success: true, message: 'Тема успешно удалена' });
    } catch (e) {
      console.error('Delete theme failed:', e);
      return next(ApiError.internal('Не удалось удалить тему'));
    }
  }

  async deletePunct(req, res, next) {
    try {
      const { id } = req.params; // punctId
      const punct = await Punct.findByPk(id);
      if (!punct) return next(ApiError.notFound('Пункт не найден'));

      // destroy автоматически удалит все File, FileAsset и связанные с пунктом лекции (если каскады)
      await punct.destroy();

      return res.json({ success: true, message: 'Пункт успешно удалён' });
    } catch (e) {
      console.error('Delete punct failed:', e);
      return next(ApiError.internal('Не удалось удалить пункт'));
    }
  }

  // Перемещение пункта в теме
  async movePunct(req, res, next) {
    try {
      const { newIndex, themeId } = req.body;
      const { id } = req.params;
      console.log(newIndex, themeId, id)
      if (!id || typeof newIndex == undefined || !themeId) {
        return res.status(400).json({ error: 'id, newIndex, targetType and targetId are required' });
      }

      // получаем все пункты темы отсортированные по order_index


      const puncts = await Punct.findAll({ where: { themeId }, order: [['order_index', 'ASC']] });

      const number_id = Number(req.params.id);
      if (isNaN(number_id)) return res.status(400).json({ error: 'Invalid punct id' });

      const index = puncts.findIndex(p => p.id === number_id);
      if (index === -1) return res.status(404).json({ error: 'Punct not found' });

      // оптимистично меняем порядок
      const [moved] = puncts.splice(index, 1);
      puncts.splice(newIndex, 0, moved);

      // пересчитываем order_index
      for (let i = 0; i < puncts.length; i++) {
        await puncts[i].update({ order_index: i });
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to move punct' });
    }
  }

  async deleteFile(req, res, next) {
    try {
      const { id } = req.params; // fileId
      const file = await File.findByPk(id);

      if (!file) return next(ApiError.notFound('Файл не найден'));

      // destroy сработает с хуками:
      // - удалит сам файл из базы
      // - удалит файл с диска (хуки)
      // - удалит FileAsset (каскад)
      await file.destroy();

      return res.json({ success: true, message: 'Файл успешно удалён' });
    } catch (e) {
      console.error('Delete file failed:', e);
      return next(ApiError.internal('Не удалось удалить файл'));
    }
  }

  async getFile(req, res, next) {
    try {
      const { id } = req.params; // fileId

      const file = await File.findByPk(id, {
        include: [
          {
            model: FileAsset,

          }
        ]
      });

      if (!file) {
        return next(ApiError.notFound('Файл не найден'));
      }

      return res.json(file);
    } catch (e) {
      console.error('Get file failed:', e);
      return next(ApiError.internal('Не удалось получить файл'));
    }
  }

  async publishProgram(req, res, next) {
    try {
      const { id } = req.params;
      const program = await Program.findOne({
        where: { id },
        include: [
          {
            model: Theme,
            separate: true, // отдельный запрос для тем
            order: [['order_index', 'ASC']],
            include: [
              {
                model: Punct,
                separate: true, // отдельный запрос для пунктов
                order: [['order_index', 'ASC']],
                include: [
                  {
                    model: File,
                    separate: true, // отдельный запрос для файлов
                    order: [['order_index', 'ASC']],
                    include: [
                      {
                        model: FileAsset,
                        // можно добавить order, если FileAsset тоже имеет order_index
                        // order: [['order_index', 'ASC']]
                      }
                    ]
                  },
                  {
                    model: Test,
                    separate: true, // отдельный запрос для файлов
                    order: [['order_index', 'ASC']],

                  }
                ]
              },
              {
                model: File,
                separate: true, // отдельный запрос для файлов
                order: [['order_index', 'ASC']],
                include: [
                  {
                    model: FileAsset,
                    // можно добавить order, если FileAsset тоже имеет order_index
                    // order: [['order_index', 'ASC']]
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!program) return next(ApiError.notFound('Программа не найдена'));

      // ----------------- Проверяем поля программы -----------------
      const requiredProgramFields = ['title', 'short_title', 'img', 'price'];
      const translatePole = {
        title: 'Полное название',
        short_title: 'Короткое название',
        img: 'Изображение',
        price: 'Цена'
      }
      for (const field of requiredProgramFields) {
        if (!program[field]) {
          return res.status(400).json({
            error: `Программа не может быть опубликована: поле "${translatePole[field]}" не заполнено`
          });
        }
      }

      // ----------------- Проверяем темы и пункты -----------------
      for (const theme of program.themes) {
        if (!theme.title) {
          return res.status(400).json({
            error: `Модуль с номером ${theme.order_index}  не имеет названия`
          });
        }
        for (const punct of theme.puncts) {
          if (!punct.title) {
            return res.status(400).json({
              error: `Тема с номером ${punct.order_index} в теме "${theme.title}" не имеет названия`
            });
          }
          if (!punct.files || punct.files.length === 0) {
            return res.status(400).json({
              error: `Пункт "${punct.title}" не содержит ни одного файла`
            });
          }
        }
      }

      let hasPublishedTest = false;
      for (const theme of program.themes) {
        for (const punct of theme.puncts) {
          if (punct.tests && punct.tests.some((test) => test.status === 'published')) {
            hasPublishedTest = true;
            break;
          }
        }
        if (hasPublishedTest) break;
      }

      if (!hasPublishedTest) {
        return res.status(400).json({
          error: 'Программа не содержит ни одного опубликованного теста'
        });
      }

      await Event.create({
        event_text: 'Программа опубликована',
        name: program.title,
        event_id: program.id,
        type: 'program',
      });

      // ----------------- Все проверки пройдены, публикуем программу -----------------
      program.status = 'published';
      await program.save();

      return res.json({ success: true, message: 'Программа успешно опубликована', program });

    } catch (e) {
      console.error('Publish program failed:', e);
      return next(ApiError.internal('Не удалось опубликовать программу'));
    }
  }

  async moveFile(req, res, next) {
    try {

      const { newIndex, targetType, targetId } = req.body;
      const { id } = req.params;

      if (!id || newIndex === undefined || !targetType || !targetId) {
        return res.status(400).json({ error: 'id, newIndex, targetType and targetId are required' });
      }

      // Получаем файл
      const file = await File.findByPk(id);
      console.log(file)
      if (!file) return res.status(404).json({ error: 'File not found' });

      // Определяем где пересчитывать order_index
      const where = {};
      if (targetType === 'punct') where.punctId = targetId;
      else if (targetType === 'theme') where.themeId = targetId;
      else return res.status(400).json({ error: 'Invalid targetType' });

      const currentIndex = file.order_index;
      if (currentIndex === newIndex) return res.json({ success: true, file });

      // Сдвигаем другие файлы
      if (newIndex > currentIndex) {
        // элемент вниз
        await File.update(
            { order_index: sequelize.literal('order_index - 1') },
            {
              where: {
                ...where,
                order_index: { [Op.gt]: currentIndex, [Op.lte]: newIndex },
              },
            }
        );
      } else {
        // элемент вверх
        await File.update(
            { order_index: sequelize.literal('order_index + 1') },
            {
              where: {
                ...where,
                order_index: { [Op.gte]: newIndex, [Op.lt]: currentIndex },
              },
            }
        );
      }

      // Ставим файл на новое место
      file.order_index = newIndex;
      await file.save();

      // Возвращаем обновлённый файл
      return res.json({ success: true, file });
    } catch (err) {
      console.error('Move file failed:', err);
      return res.status(500).json({ error: 'Failed to move file' });
    }
  }



}

module.exports = new ProgramController();
