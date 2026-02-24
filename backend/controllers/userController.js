const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User,
    Messages,
    Enrollment,
    Program,
    Event
} = require('../models/models');
const { Op, fn, Sequelize } = require('sequelize');
const sequelize = require('../db');
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
        const t = await sequelize.transaction();

        try {
            const {
                email,
                password,
                role,
                name,
                number,
                organization,
                programs_id,
                diplom,
                inn,
                address
            } = req.body;

            // --- валидация ---
            if (!email) return next(ApiError.badRequest('Некорректный email'));
            if (!password) return next(ApiError.badRequest('Некорректный пароль'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));
            if (!Array.isArray(programs_id) || programs_id.length === 0)
                return next(ApiError.badRequest('Отсутствует программа у пользователя'));

            const [emailExists, phoneExists] = await Promise.all([
                User.findOne({ where: { email } }),
                User.findOne({ where: { number } }),
            ]);

            if (emailExists)
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            if (phoneExists)
                return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'));

            // --- создаём пользователя ---
            const hashPassword = await bcrypt.hash(password, 5);

            const user = await User.create({
                email,
                role,
                password: hashPassword,
                name,
                number,
                organization,
                diplom,
                inn,
                address,
            }, { transaction: t });

            // --- создаём enrollment'ы ---
            const enrollments = programs_id.map(programId => ({
                userId: user.id,
                programId,
                status: 'active',
            }));

            console.log(enrollments, Enrollment)

            await Enrollment.bulkCreate(enrollments, { transaction: t });

            await Event.create({
                event_text: 'Добавлен новый слушатель',
                name,
                organization,
            }, { transaction: t });

            await t.commit();

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });

        } catch (e) {
            await t.rollback();
            console.error('Registration error:', e);
            return next(ApiError.internal('Ошибка при регистрации'));
        }
    }


    async registrationAdmin(req, res, next) {
        try {
            const { email, password, role, name, number, organization, programs_id, diplom, inn, address } = req.body;

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
                organization,
                diplom,
                inn,
                address
            });

            await Event.create({
                event_text: 'Добавлен новый администратор',
                name,
                organization,
            }, { transaction: t });

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
        const t = await sequelize.transaction();

        try {
            const {
                id,
                email,
                password,
                role,
                name,
                number,
                organization,
                programs_id,
                diplom,
                inn,
                address,
            } = req.body;

            const user = await User.findByPk(id, { transaction: t });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            if (!email) return next(ApiError.badRequest('Некорректный email'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));
            if (!Array.isArray(programs_id))
                return next(ApiError.badRequest('programs_id должен быть массивом'));

            // уникальность
            const [emailExists, phoneExists] = await Promise.all([
                User.findOne({ where: { email }, transaction: t }),
                User.findOne({ where: { number }, transaction: t }),
            ]);

            if (emailExists && emailExists.id !== user.id)
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            if (phoneExists && phoneExists.id !== user.id)
                return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'));

            // обновляем пользователя
            user.email = email;
            if (password) user.password = await bcrypt.hash(password, 5);
            user.role = role;
            user.name = name;
            user.number = number;
            user.organization = organization;
            user.inn = inn;
            user.address = address;
            user.diplom = diplom;

            await user.save({ transaction: t });

            // --- Enrollment логика ---

            const existingEnrollments = await Enrollment.findAll({
                where: { userId: user.id },
                transaction: t,
            });

            const existingProgramIds = existingEnrollments.map(e => e.programId);
            const newProgramIds = programs_id;

            // ➕ добавить
            const toAdd = newProgramIds.filter(
                pid => !existingProgramIds.includes(pid)
            );

            // ➖ архивировать
            const toArchive = existingEnrollments.filter(
                e => !newProgramIds.includes(e.programId)
            );

            if (toAdd.length) {
                await Enrollment.bulkCreate(
                    toAdd.map(programId => ({
                        userId: user.id,
                        programId,
                        status: 'active',
                    })),
                    { transaction: t }
                );
            }

            if (toArchive.length) {
                await Enrollment.update(
                    { status: 'archived' },
                    {
                        where: { id: toArchive.map(e => e.id) },
                        transaction: t,
                    }
                );
            }

            await t.commit();
            return res.json({ user });

        } catch (e) {
            await t.rollback();
            console.error('remakeUser error:', e);
            return next(ApiError.internal('Ошибка при обновлении пользователя'));
        }
    }


    // ======================== REMAKE ADMIN ========================
    async remakeAdmin(req, res, next) {
        try {
            const { id, email, password, role, name, number } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));
            if (!email) return next(ApiError.badRequest('Некорректный email'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));

            user.email = email;
            if (password) user.password = await bcrypt.hash(password, 5);
            user.name = name;
            user.number = number;
            if (role) {
                user.role = role;
            }
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

            const user = await User.findByPk(id, {
                include: [
                    {
                        model: Program,
                        attributes: ['id', 'title', 'short_title', 'price', 'img'],
                        through: {
                            attributes: [
                                'id',
                                'status',
                                'progress_percent',
                                'started_at',
                                'completed_at',
                            ],
                        },
                        required: false,
                    },
                ],
            });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

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

            const users = await User.findAndCountAll({
                where: { role: 'USER' },
                include: [
                    {
                        model: Program,
                        attributes: ['id', 'title', 'short_title'],
                        through: {
                            where: { status: 'completed' }, // только активные Enrollment
                            attributes: ['progress_percent', 'completed_at'], // подтягиваем процент прохождения
                        },
                        required: true,
                    },
                ],
            });

            // Мапим JSON, чтобы прогресс был прямо внутри программы
            const result = users.rows.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                number: user.number,
                organization: user.organization,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                programs: user.programs.map(p => ({
                    id: p.id,
                    title: p.title,
                    short_title: p.short_title,
                    progress: p.enrollment ? p.enrollment.progress_percent : null,
                    completed_at: p.enrollment ? p.enrollment.completed_at : null,
                })),
            }));

            return res.json(result);
        } catch (e) {
            console.error('getAllUsersGraduation error:', e);
            return next(ApiError.internal('Ошибка получения пользователей с датой окончания'));
        }
    }

    async getAllAdmins(req, res, next) {
        try {
            const users = await User.findAll({
                where: {
                    role: {
                        [Op.in]: ['ADMIN', 'VIEWER']
                    }
                }
            });
            return res.json(users);
        } catch (e) {
            console.error('getAllAdmins error:', e);
            return next(ApiError.internal('Ошибка получения администраторов'));
        }
    }

    // ======================== PAGINATION ========================
    async getAllUsersWithPage(req, res, next) {
        try {
            const page = Number(req.params.page) || 1;
            const limit = 10;

            // Разрешённые поля для сортировки
            const allowedSortFields = ['id', 'name', 'email', 'createdAt', 'updatedAt'];
            const sortType = allowedSortFields.includes(req.query.sort_type) ? req.query.sort_type : 'id';
            const sortDirection = req.query.sort_down === 'true' ? 'DESC' : 'ASC';

            const users = await User.findAndCountAll({
                offset: (page - 1) * limit,
                limit,
                where: { role: 'USER' },
                order: [[sortType, sortDirection]],
                include: [
                    {
                        model: Program,
                        attributes: ['id', 'title', 'short_title'],
                        through: {
                            where: { status: 'active' }, // только активные Enrollment
                            attributes: ['progress_percent'], // подтягиваем процент прохождения
                        },
                        required: true,
                    },
                ],
            });

            // Мапим JSON, чтобы прогресс был прямо внутри программы
            const result = users.rows.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                number: user.number,
                organization: user.organization,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                programs: user.programs.map(p => ({
                    id: p.id,
                    title: p.title,
                    short_title: p.short_title,
                    progress: p.enrollment ? p.enrollment.progress_percent : null,
                })),
            }));

            return res.json({
                count: users.count,
                page,
                totalPages: Math.ceil(users.count / limit),
                rows: result,
            });

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
                        Sequelize.where(fn('LOWER', Sequelize.col('organization')), { [Op.like]: `%${q.toLowerCase()}%` })
                    ]
                },
                include: [
                    {
                        model: Program,
                        attributes: ['id', 'title', 'short_title'],
                        through: {
                            where: { status: 'active' }, // только активные Enrollment
                            attributes: ['progress_percent'], // подтягиваем процент прохождения
                        },
                        required: true,
                    },
                ],
            });

            const result = users.rows.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                number: user.number,
                organization: user.organization,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                programs: user.programs.map(p => ({
                    id: p.id,
                    title: p.title,
                    short_title: p.short_title,
                    progress: p.enrollment ? p.enrollment.progress_percent : null,
                })),
            }));

            return res.json({
                count: users.count,
                page,
                totalPages: Math.ceil(users.count / 10),
                rows: result,
            });

        } catch (e) {
            console.error('searchUsers error:', e);
            return next(ApiError.internal('Ошибка поиска пользователей'));
        }
    }

    // ======================== DELETE USER ========================
    async deleteUser(req, res, next) {
        try {
            const { id } = req.body;
            const user = await User.findOne({ where: { id } });
            await Event.create({
                event_text: 'Пользователь удален',
                name: user.name,
                organization: user.organization,
            });
            user.destroy();
            return res.json(user);
        } catch (e) {
            console.error('deleteUser error:', e);
            return next(ApiError.internal('Ошибка удаления пользователя'));
        }
    }


    // ======================== LAST MESSAGES ========================
    async getUsersWithLastMessages(req, res, next) {
        try {
            const users = await User.findAll({ where: { role: 'USER' } });
            for (const user of users) {
                const message = await Messages.findOne({ where: { user_id: user.id }, order: [['createdAt', 'DESC']] });
                const numberUnReadMessages = await Messages.count({
                    where: {
                        user_id: user.id,
                        role: 'user',
                        readAt: null
                    }
                });
                if (message) {
                    user.dataValues.message = message.text;
                    user.dataValues.messageDate = message.createdAt;
                    user.dataValues.role = message.role;
                    user.dataValues.numberUnReadMessages = numberUnReadMessages;
                } else {
                    user.dataValues.message = 'Пока нет сообщений...';
                    user.dataValues.messageDate = 0;
                    user.dataValues.role = '';
                    user.dataValues.numberUnReadMessages = null;
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
