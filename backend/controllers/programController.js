const { Program, Theme, Punct, Test, User, Statistic, ThemeStatistic, PunctStatistic } = require("../models/models");
const sequelize = require('../db'); 
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');

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
      if (!punct.lection_title && !punct.video_src && !punct.test_id && !punct.practical_work && !punct.lection_pdf) return `Тема "${ti + 1}.${pi + 1}" не может быть пустой`;
    }
    if (boolCount === 0) return `В модуле "${theme.title}" нет теста! (В каждой теме должен быть один тест для подсчета статистики!)`;
    if (boolCount > 1) return `В модуле "${theme.title}" ${boolCount} тестов! (В каждой теме может быть только один тест)`;
  }
  return null;
}

class ProgramController {
  async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, admin_id, number_of_practical_work, number_of_test, number_of_videos, themes, short_title, price } = req.body;

      if (!title) return next(ApiError.badRequest('Программа не имеет названия!'));

      const parsedThemes = (() => {
        try { return JSON.parse(themes); } catch (e) { return null; }
      })();

      const validationError = validateParsedThemes(parsedThemes);
      if (validationError) return next(ApiError.badRequest(validationError));

      // Save incoming files (if any) in a predictable structure
      // req.files might contain: docs, presentation_src, theme_lection_src, img
      const files = req.files || {};

      const docsSaved = await saveFilesArrayOrSingle(files.docs);
      const lection_pdfsSaved = await saveFilesArrayOrSingle(files.lection_pdfs);
      const presentationsSaved = await saveFilesArrayOrSingle(files.presentation_src);
      const themeLectionSaved = await saveFilesArrayOrSingle(files.theme_lection_src);
      const imgSaved = files.img ? (await saveSingleFile(files.img)) : '';

      // Create program
      const program = await Program.create({ title, admin_id, number_of_practical_work, number_of_test, number_of_videos, short_title, price, img: imgSaved }, { transaction: t });

      // Create themes and puncts in sequence (avoid forEach with async)
      for (const theme_el of parsedThemes) {
        // Determine presentation/lection filenames (either existing string in theme_el or new saved file by index)
        const presentation_src = typeof theme_el.presentation_src === 'string' && theme_el.presentation_src ? theme_el.presentation_src : (presentationsSaved[theme_el.presentation_id] || null);
        const theme_lection_src = typeof theme_el.lection_src === 'string' && theme_el.lection_src ? theme_el.lection_src : (themeLectionSaved[theme_el.lection_id] || null);

        const themeLectionHtml = await convertDocxToHtmlIfExists(theme_lection_src);

        const createdTheme = await Theme.create({
          title: theme_el.title,
          programId: program.id,
          theme_id: theme_el.theme_id,
          presentation_src: presentation_src,
          presentation_title: theme_el.presentation_title || null,
          video_src: theme_el.video_src || null,
          lection_src: theme_lection_src || null,
          lection_html: themeLectionHtml,
          lection_title: theme_el.lection_title || null,
          lection_id: theme_el.lection_id
        }, { transaction: t });

        // Puncts
        for (const punct_el of theme_el.puncts) {
          const punctLectionSrc = typeof punct_el.lection_src === 'string' && punct_el.lection_src ? punct_el.lection_src : (docsSaved[punct_el.lection_id] || null);
          const punctLectionPdfSrc = typeof punct_el.lection_pdf === 'string' && punct_el.lection_pdf ? punct_el.lection_pdf : (lection_pdfsSaved[punct_el.lection_pdf_id] || null);
          const punctLectionHtml = await convertDocxToHtmlIfExists(punctLectionSrc);
          console.log('######################', punctLectionPdfSrc, '######################')
          await Punct.create({
            title: punct_el.title,
            themeId: createdTheme.id,
            video_src: punct_el.video_src || null,
            lection_src: punctLectionSrc || null,
            lection_html: punctLectionHtml,
            lection_title: punct_el.lection_title || null,
            lection_id: punct_el.lection_id,
            lection_pdf: punctLectionPdfSrc || null,
            lection_pdf_id: punct_el.lection_pdf_id,
            practical_work: punct_el.practical_work || null,
            practical_work_task: punct_el.practical_work_task || null,
            test_id: punct_el.test_id || null,
            punct_id: punct_el.punct_id
          }, { transaction: t });
        }
      }

      await t.commit();
      return res.json(program);
    } catch (e) {
      await t.rollback();
      console.error('Create program failed', e.stack || e.message || e);
      return next(ApiError.internal('Ошибка при создании программы'));
    }
  }

  async getAll(req, res, next) {
    try {
      const programs = await Program.findAll();
      // Count users for each program
      const results = [];
      for (const program of programs) {
        const usersCount = await User.count({ where: { programs_id: [program.id] } });
        program.dataValues["users_quantity"] = usersCount;
        results.push(program);
      }
      return res.json(results);
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка получения программ'));
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
      const program = await Program.findOne({ where: { id } });
      if (!program) return next(ApiError.notFound('Программа не найдена'));

      const users = await User.count({ where: { programs_id: [program.id] } });
      program.dataValues['users_quantity'] = users;

      const themes = await Theme.findAll({ where: { programId: program.id }, order: [['theme_id', 'ASC']] });
      const themeIds = themes.map(t => t.id);

      const puncts = await Punct.findAll({ where: { themeId: { [Op.or]: themeIds } } });

      // attach puncts
      for (const theme of themes) {
        const related = puncts.filter(p => p.themeId === theme.id);
        related.sort((a, b) => a.punct_id - b.punct_id);
        theme.dataValues['puncts'] = related;
      }

      program.dataValues['themes'] = themes;
      return res.json(program);
    } catch (e) {
      console.error(e);
      return next(ApiError.internal('Ошибка получения программы'));
    }
  }

  async deleteProgram(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.body;

      const program = await Program.findOne({ where: { id } });
      if (!program) return next(ApiError.notFound('Программа для удаления не найдена'));

      const users = await User.findAll({ where: { programs_id: [program.id] } });
      if (users.length > 0) return next(ApiError.badRequest(`Программу уже проходят ${users.length} пользователей и ее удаление невозможно!`));

      const themes = await Theme.findAll({ where: { programId: program.id } });
      for (const theme of themes) {
        // try to remove files if they exist (presentation, lection)
        try {
          if (theme.presentation_src) {
            const p = path.join(STATIC_DIR, theme.presentation_src);
            if (fs.existsSync(p)) fs.unlinkSync(p);
          }
          if (theme.lection_src) {
            const l = path.join(STATIC_DIR, theme.lection_src);
            if (fs.existsSync(l)) fs.unlinkSync(l);
          }
        } catch (e) {
          console.warn('File delete warning for theme', theme.id, e.message || e);
        }

        const puncts = await Punct.findAll({ where: { themeId: theme.id } });
        for (const punct of puncts) {
          try {
            if (punct.lection_src) {
              const lp = path.join(STATIC_DIR, punct.lection_src);
              if (fs.existsSync(lp)) fs.unlinkSync(lp);
            }
          } catch (e) {
            console.warn('File delete warning for punct', punct.id, e.message || e);
          }
        }
      }

      await Program.destroy({ where: { id } }, { transaction: t });
      await t.commit();
      return res.json({ message: 'Program deleted' });
    } catch (e) {
      await t.rollback();
      console.error(e);
      return next(ApiError.internal('Ошибка удаления программы'));
    }
  }

  async remake(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, number_of_practical_work, number_of_test, number_of_videos, themes, id, short_title, price } = req.body;
      if (!title) return next(ApiError.badRequest('Программа не имеет названия!'));

      const parsedThemes = (() => {
        try { return JSON.parse(themes); } catch (e) { return null; }
      })();
      const validationError = validateParsedThemes(parsedThemes);
      if (validationError) return next(ApiError.badRequest(validationError));

      const files = req.files || {};
      const docsSaved = await saveFilesArrayOrSingle(files.docs);

      const presentationsSaved = await saveFilesArrayOrSingle(files.presentation_src);
      const lection_pdfsSaved = await saveFilesArrayOrSingle(files.lection_pdfs);
      const themeLectionSaved = await saveFilesArrayOrSingle(files.theme_lection_src);
      const imgSaved = files.img ? (await saveSingleFile(files.img)) : '';

      const program = await Program.findOne({ where: { id } });
      if (!program) return next(ApiError.notFound('Программа не найдена'));

      if (number_of_test < program.number_of_test) return next(ApiError.badRequest('Нельзя удалять тесты при изменении программы'));

      // update program fields
      program.img = imgSaved || program.img;
      console.log("#########################", typeof program.img === 'string' && program.img ? program.img : imgSaved || null, program.img, files.img,  "#########################")
      program.title = title;
      program.short_title = short_title;
      program.price = price;
      program.number_of_practical_work = number_of_practical_work;
      program.number_of_test = number_of_test;
      program.number_of_videos = number_of_videos;
      await program.save({ transaction: t });

      // Remove old themes & puncts
      await Theme.destroy({ where: { programId: program.id } }, { transaction: t });

      // Update statistics if needed
      const statistics = await Statistic.findAll({ where: { programs_id: program.id } });
      for (const statistic of statistics) {
        for (let i = statistic.max_tests; i < number_of_test; i++) {
          const themeStatistic = await ThemeStatistic.create({ theme_id: i, well: false, statisticId: statistic.id }, { transaction: t });
          await PunctStatistic.create({ punct_id: i, lection: false, practical_work: null, video: false, test_bool: false, themeStatisticId: themeStatistic.id }, { transaction: t });
        }
        statistic.max_videos = number_of_videos;
        statistic.max_tests = number_of_test;
        statistic.max_practical_works = number_of_practical_work;
        await statistic.save({ transaction: t });
      }

      // Recreate themes & puncts (similar to create)
      for (const theme_el of parsedThemes) {
        const presentation_src = typeof theme_el.presentation_src === 'string' && theme_el.presentation_src ? theme_el.presentation_src : (presentationsSaved[theme_el.presentation_id] || null);
        const theme_lection_src = typeof theme_el.lection_src === 'string' && theme_el.lection_src ? theme_el.lection_src : (themeLectionSaved[theme_el.lection_id] || null);

        const themeLectionHtml = await convertDocxToHtmlIfExists(theme_lection_src);

        const createdTheme = await Theme.create({
          title: theme_el.title,
          programId: program.id,
          theme_id: theme_el.theme_id,
          presentation_src: presentation_src,
          presentation_title: theme_el.presentation_title || null,
          presentation_id: theme_el.presentation_id,
          video_src: theme_el.video_src || null,
          lection_src: theme_lection_src || null,
          lection_html: themeLectionHtml,
          lection_title: theme_el.lection_title || null,
          lection_id: theme_el.lection_id
        }, { transaction: t });

        for (const punct_el of theme_el.puncts) {
          const punctLectionSrc = typeof punct_el.lection_src === 'string' && punct_el.lection_src ? punct_el.lection_src : (docsSaved[punct_el.lection_id] || null);
          const punctLectionPdfSrc = typeof punct_el.lection_pdf === 'string' && punct_el.lection_pdf ? punct_el.lection_pdf : (lection_pdfsSaved[punct_el.lection_pdf_id] || null);
          const punctLectionHtml = await convertDocxToHtmlIfExists(punctLectionSrc);

          await Punct.create({
            title: punct_el.title,
            themeId: createdTheme.id,
            video_src: punct_el.video_src || null,
            lection_src: punctLectionSrc || null,
            lection_html: punctLectionHtml,
            lection_title: punct_el.lection_title || null,
            lection_id: punct_el.lection_id,
            lection_pdf: punctLectionPdfSrc || null,
            lection_pdf_id: punct_el.lection_pdf_id,
            practical_work: punct_el.practical_work || null,
            practical_work_task: punct_el.practical_work_task || null,
            test_id: punct_el.test_id || null,
            punct_id: punct_el.punct_id
          }, { transaction: t });
        }
      }

      await t.commit();
      return res.json({ message: 'Program updated' });
    } catch (e) {
      await t.rollback();
      console.error('Remake failed', e.stack || e.message || e);
      return next(ApiError.internal('Ошибка при обновлении программы'));
    }
  }
}

module.exports = new ProgramController();
