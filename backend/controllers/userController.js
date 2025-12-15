const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User,
    Statistic,
    Program,
    Theme,
    Punct,
    ThemeStatistic,
    PunctStatistic,
    Messages,
    Event
} = require('../models/models');
const { Op, fn, Sequelize } = require('sequelize');
const nodemailer = require('nodemailer');
const path = require("path");
const uuid = require("uuid");
const fs = require("fs");

const generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

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

class UserController {
    // ======================== REGISTRATION ========================
    async registration(req, res, next) {
        try {
            const { email, password, role, name, number, organiztion, programs_id, diplom, inn, address } = req.body;

            if (!email) return next(ApiError.badRequest('Некорректный email'));
            if (!password) return next(ApiError.badRequest('Некорректный пароль'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));
            if (!Array.isArray(programs_id) || !programs_id[0]) return next(ApiError.badRequest('Отсутствует программа у пользователя'));

            const candidate = await User.findOne({ where: { email } });
            if (candidate) return next(ApiError.badRequest('Пользователь с таким email уже существует'));

            const candidate2 = await User.findOne({ where: { number } });
            if (candidate2) return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'));

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, role, password: hashPassword, name, number, organiztion, programs_id, diplom, inn, address });

            const program = await Program.findOne({ where: { id: programs_id[0] } });
            if (!program) return next(ApiError.badRequest('Программа не найдена'));

            const statistic = await Statistic.create({
                users_id: user.id,
                programs_id: program.id,
                max_videos: program.number_of_videos,
                max_tests: program.number_of_test,
                max_practical_works: program.number_of_practical_work
            });

            const themes = await Theme.findAll({ where: { programId: program.id } });
            const arrOfThemeId = themes.map(t => t.id);

            const puncts = await Punct.findAll({ where: { themeId: { [Op.or]: arrOfThemeId } } });

            for (const theme of themes) {
                const themeStat = await ThemeStatistic.create({ theme_id: theme.id, well: false, statisticId: statistic.id });
                for (const punct of puncts) {
                    if (theme.id === punct.themeId) {
                        await PunctStatistic.create({
                            punct_id: punct.id,
                            lection: false,
                            practical_work: null,
                            video: false,
                            test_bool: false,
                            themeStatisticId: themeStat.id
                        });
                    }
                }
            }

            await Event.create({ event_text: 'Добавлен новый слушатель', name, organiztion });

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });

        } catch (e) {
            console.error('Registration error:', e);
            return next(ApiError.internal('Ошибка при регистрации'));
        }
    }

    async registrationAdmin(req, res, next) {
        try {
            const { email, password, role, name, number, organiztion, programs_id, diplom, inn, address } = req.body;

            if (!email) return next(ApiError.badRequest('Некорректный email'));
            if (!password) return next(ApiError.badRequest('Некорректный пароль'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));

            const candidate = await User.findOne({ where: { email } });
            if (candidate) return next(ApiError.badRequest('Пользователь с таким email уже существует'));

            const candidate2 = await User.findOne({ where: { number } });
            if (candidate2) return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'));

            const hashPassword = await bcrypt.hash(password, 5);

            const user = await User.create({
                email,
                role,
                password: hashPassword,
                name,
                number,
                organiztion,
                programs_id: programs_id || [-1],
                diplom,
                inn,
                address
            });

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });

        } catch (e) {
            console.error('RegistrationAdmin error:', e);
            return next(ApiError.internal('Ошибка при регистрации администратора'));
        }
    }

    // ======================== GRADUATION ========================
    async setGraduationDate(req, res, next) {
        try {
            const { id, graduation_date } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            if (!user.graduation_date) {
                user.graduation_date = graduation_date;
                await user.save();

                try {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: { user: 'chabanovdan@gmail.com', pass: 'fmdn veek hhnz wirs' }
                    });

                    const mailOptions = {
                        from: "chabanovdan@gmail.com",
                        to: "chabanovdan@gmail.com",
                        subject: 'Поздравляем с окончанием обучения!',
                        html: `<h1>Поздравляем вас с окончанием обучения!</h1>`
                    };

                    await transporter.sendMail(mailOptions);

                } catch (mailErr) {
                    console.error('Mail send error:', mailErr);
                }
            }

            return res.json(user);

        } catch (e) {
            console.error('setGraduationDate error:', e);
            return next(ApiError.internal('Ошибка при установке даты окончания обучения'));
        }
    }

    // ======================== REMAKE USER ========================
    async remakeUser(req, res, next) {
        try {
            const { id, email, password, role, name, number, organiztion, programs_id, diplom, inn, address } = req.body;

            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));
            if (!email) return next(ApiError.badRequest('Некорректный email'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));
            if (!Array.isArray(programs_id) || !programs_id[0]) return next(ApiError.badRequest('Отсутствует программа у пользователя'));

            const candidate = await User.findOne({ where: { email } });
            if (candidate && candidate.id !== user.id) return next(ApiError.badRequest('Пользователь с таким email уже существует'));

            const candidate2 = await User.findOne({ where: { number } });
            if (candidate2 && candidate2.id !== user.id) return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'));

            user.email = email;
            if (password) user.password = await bcrypt.hash(password, 5);
            user.role = role;
            user.name = name;
            user.number = number;
            user.organiztion = organiztion;
            user.inn = inn;
            user.address = address;

            // Если меняется программа, пересоздаем статистику
            if (user.programs_id[0] !== programs_id[0]) {
                await Statistic.destroy({ where: { [Op.and]: [{ users_id: id, programs_id: user.programs_id[0] }] } });

                const program = await Program.findOne({ where: { id: programs_id[0] } });
                if (!program) return next(ApiError.badRequest('Программа не найдена'));

                const statistic = await Statistic.create({
                    users_id: user.id,
                    programs_id: program.id,
                    max_videos: program.number_of_videos,
                    max_tests: program.number_of_test,
                    max_practical_works: program.number_of_practical_work
                });

                const themes = await Theme.findAll({ where: { programId: program.id } });
                const arrOfThemeId = themes.map(t => t.id);
                const puncts = await Punct.findAll({ where: { themeId: { [Op.or]: arrOfThemeId } } });

                for (const theme of themes) {
                    const themeStat = await ThemeStatistic.create({ theme_id: theme.id, well: false, statisticId: statistic.id });
                    for (const punct of puncts) {
                        if (theme.id === punct.themeId) {
                            await PunctStatistic.create({
                                punct_id: punct.id,
                                lection: false,
                                practical_work: null,
                                video: false,
                                test_bool: false,
                                themeStatisticId: themeStat.id
                            });
                        }
                    }
                }
            }

            user.programs_id = programs_id;
            user.diplom = diplom;
            await user.save();
            return res.json({ user });

        } catch (e) {
            console.error('remakeUser error:', e);
            return next(ApiError.internal('Ошибка при обновлении пользователя'));
        }
    }

    // ======================== REMAKE ADMIN ========================
    async remakeAdmin(req, res, next) {
        try {
            const { id, email, password, name, number } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));
            if (!email) return next(ApiError.badRequest('Некорректный email'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));

            user.email = email;
            if (password) user.password = await bcrypt.hash(password, 5);
            user.name = name;
            user.number = number;
            await user.save();
            return res.json({ user });

        } catch (e) {
            console.error('remakeAdmin error:', e);
            return next(ApiError.internal('Ошибка при обновлении администратора'));
        }
    }

    // ======================== LOGIN ========================
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return next(ApiError.internal('Пользователь не найден'));

            const comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) return next(ApiError.internal('Указан неверный пароль'));

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });

        } catch (e) {
            console.error('login error:', e);
            return next(ApiError.internal('Ошибка при авторизации'));
        }
    }

    // ======================== FORGOT PASSWORD ========================
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            const code = Math.floor(1000 + Math.random() * 9000); // 4-значный код
            const hashCode = await bcrypt.hash(`${code}`, 5);
            user.forgot_pass_code = hashCode;
            await user.save();

            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: 'chabanovdan@gmail.com', pass: 'fmdn veek hhnz wirs' }
                });

                const mailOptions = {
                    from: "chabanovdan@gmail.com",
                    to: email,
                    subject: 'Код для восстановления пароля',
                    html: `<p>Код: ${code}</p>`
                };

                await transporter.sendMail(mailOptions);

            } catch (mailErr) {
                console.error('Mail send error:', mailErr);
            }

            return res.json({ user });

        } catch (e) {
            console.error('forgotPassword error:', e);
            return next(ApiError.internal('Ошибка при восстановлении пароля'));
        }
    }

    async checkForgotPassword(req, res, next) {
        try {
            const { email, code, pass } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            const compareCode = bcrypt.compareSync(code, user.forgot_pass_code);
            if (!compareCode) return next(ApiError.internal('Код неверный'));

            user.password = await bcrypt.hash(pass, 5);
            user.forgot_pass_code = null;
            await user.save();

            return res.json({ user });

        } catch (e) {
            console.error('checkForgotPassword error:', e);
            return next(ApiError.internal('Ошибка при проверке кода восстановления'));
        }
    }

    // ======================== CHECK TOKEN ========================
    async check(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role);
            return res.json({ token });
        } catch (e) {
            console.error('check error:', e);
            return next(ApiError.internal('Ошибка проверки токена'));
        }
    }

    // ======================== GET USERS ========================
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));
            return res.json(user);
        } catch (e) {
            console.error('getUserById error:', e);
            return next(ApiError.internal('Ошибка получения пользователя'));
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({ where: { role: 'USER' } });
            return res.json(users);
        } catch (e) {
            console.error('getAllUsers error:', e);
            return next(ApiError.internal('Ошибка получения пользователей'));
        }
    }

    async getAllUsersGraduation(req, res, next) {
        try {
            const users = await User.findAll({
                where: { role: 'USER', graduation_date: { [Op.not]: null } }
            });
            return res.json(users);
        } catch (e) {
            console.error('getAllUsersGraduation error:', e);
            return next(ApiError.internal('Ошибка получения пользователей с датой окончания'));
        }
    }

    async getAllAdmins(req, res, next) {
        try {
            const users = await User.findAll({ where: { role: 'ADMIN' } });
            return res.json(users);
        } catch (e) {
            console.error('getAllAdmins error:', e);
            return next(ApiError.internal('Ошибка получения администраторов'));
        }
    }

    // ======================== PAGINATION ========================
    async getAllUsersWithPage(req, res, next) {
        try {
            const page = parseInt(req.params.page) || 1;
            const sort_type = req.query.sort_type || 'id';
            const sort_down = req.query.sort_down === 'true' ? 'DESC' : 'ASC';

            const users = await User.findAndCountAll({
                offset: (page - 1) * 10,
                limit: 10,
                where: { role: 'USER' },
                order: [[sort_type, sort_down]]
            });

            // Добавляем статистику для пользователей
            for (const user of users.rows) {
                if (user.role !== 'ADMIN') {
                    const statistic = await Statistic.findOne({ where: { [Op.and]: [{ users_id: user.id, programs_id: user.programs_id[0] }] } });
                    if (statistic) user.dataValues.statistic = Math.round((statistic.well_tests / statistic.max_tests) * 100);
                }
                const program = await Program.findOne({ where: { id: user.programs_id[0] } });
                if (program) user.dataValues.program = program;
            }

            return res.json(users);

        } catch (e) {
            console.error('getAllUsersWithPage error:', e);
            return next(ApiError.internal('Ошибка получения пользователей с пагинацией'));
        }
    }

    async searchUsers(req, res, next) {
        try {
            const page = parseInt(req.params.page) || 1;
            const q = req.query.q || '';

            const users = await User.findAndCountAll({
                offset: (page - 1) * 10,
                limit: 10,
                where: {
                    role: 'USER',
                    [Op.or]: [
                        Sequelize.where(fn('LOWER', Sequelize.col('name')), { [Op.like]: `%${q.toLowerCase()}%` }),
                        Sequelize.where(fn('LOWER', Sequelize.col('organiztion')), { [Op.like]: `%${q.toLowerCase()}%` })
                    ]
                }
            });

            for (const user of users.rows) {
                if (user.role !== 'ADMIN') {
                    const statistic = await Statistic.findOne({ where: { [Op.and]: [{ users_id: user.id, programs_id: user.programs_id[0] }] } });
                    if (statistic) user.dataValues.statistic = Math.round((statistic.well_tests / statistic.max_tests) * 100);
                }
            }

            return res.json(users);

        } catch (e) {
            console.error('searchUsers error:', e);
            return next(ApiError.internal('Ошибка поиска пользователей'));
        }
    }

    // ======================== DELETE USER ========================
    async deleteUser(req, res, next) {
        try {
            const { id } = req.body;
            const deleted = await User.destroy({ where: { id } });
            return res.json(deleted);
        } catch (e) {
            console.error('deleteUser error:', e);
            return next(ApiError.internal('Ошибка удаления пользователя'));
        }
    }

    // ======================== INCREMENT STATS ========================
    async setWellTests(req, res, next) {
        try {
            const { id } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));
            user.well_tests += 1;
            await user.save();
            return res.json(user);
        } catch (e) {
            console.error('setWellTests error:', e);
            return next(ApiError.internal('Ошибка обновления тестов'));
        }
    }

    async setWellVideos(req, res, next) {
        try {
            const { id } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));
            user.well_videos += 1;
            await user.save();
            return res.json(user);
        } catch (e) {
            console.error('setWellVideos error:', e);
            return next(ApiError.internal('Ошибка обновления видео'));
        }
    }

    async setWellPracticalWorks(req, res, next) {
        try {
            const { id } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));
            user.well_practical_works += 1;
            await user.save();
            return res.json(user);
        } catch (e) {
            console.error('setWellPracticalWorks error:', e);
            return next(ApiError.internal('Ошибка обновления практических работ'));
        }
    }

    // ======================== LAST MESSAGES ========================
    async getUsersWithLastMessages(req, res, next) {
        try {
            const users = await User.findAll({ where: { role: 'USER' } });
            for (const user of users) {
                const message = await Messages.findOne({ where: { user_id: user.id }, order: [['createdAt', 'DESC']] });
                if (message) {
                    user.dataValues.message = message.text;
                    user.dataValues.messageDate = message.createdAt;
                    user.dataValues.role = message.role;
                } else {
                    user.dataValues.message = 'Пока нет сообщений...';
                    user.dataValues.messageDate = 0;
                    user.dataValues.role = '';
                }
            }

            users.sort((a, b) => b.dataValues.messageDate - a.dataValues.messageDate);
            return res.json(users);

        } catch (e) {
            console.error('getUsersWithLastMessages error:', e);
            return next(ApiError.internal('Ошибка получения последних сообщений пользователей'));
        }
    }

    async setUserProfileImg(req, res, next) {
        try {
            const { id } = req.body;
            const files = req.files || {};

            const imgSaved = await saveSingleFile(files.img)

            const user = await User.findOne({where: {id: id}})

            user.img = imgSaved;
            user.save();

            return res.json('успешно')
        } catch (e) {
            console.error('setUserProfileImg error:', e);
            return next(ApiError.internal('Ошибка установления фото пользователя'));
        }
    }
}

module.exports = new UserController();
