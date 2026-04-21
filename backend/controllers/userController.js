const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User,
    Messages,
    Enrollment,
    Program,
    Event,
    UserDocument
} = require('../models/models');
const { Op, fn, Sequelize } = require('sequelize');
const sequelize = require('../db');
const nodemailer = require('nodemailer');
const path = require("path");
const uuid = require("uuid");
const fs = require("fs");




const generateJwt = (id, login, role, must_change_password = false) => {
    return jwt.sign(
        { id, login, role, must_change_password },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

const STATIC_DIR = path.resolve(__dirname, '..', 'static');
if (!fs.existsSync(STATIC_DIR)) fs.mkdirSync(STATIC_DIR, { recursive: true });
const USER_DOCS_DIR = path.resolve(STATIC_DIR, 'user-documents');

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
                login,
                temporary_password,
                email,
                role,
                name,
                number,
                organization,
                programs_id,
                diplom,
                inn,
                address,
                passport,
                education_document,
                snils,
            } = req.body;

            // --- валидация ---
            if (!login) return next(ApiError.badRequest('Некорректный логин'));
            if (!temporary_password) return next(ApiError.badRequest('Некорректный временный пароль'));
            if (!number) return next(ApiError.badRequest('Некорректный номер'));
            if (!Array.isArray(programs_id) || programs_id.length === 0) {
                return next(ApiError.badRequest('Отсутствует программа у пользователя'));
            }

            const loginExists = await User.findOne({
                where: { login },
                transaction: t,
            });

            if (loginExists) {
                return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
            }

            // --- временный пароль ---
            const temporaryPasswordHash = await bcrypt.hash(temporary_password, 5);

            // --- создаём пользователя ---
            const user = await User.create({
                login,
                email: email || null,
                role,
                password: null, // постоянного пароля пока нет
                temporary_password_plain: temporary_password,
                temporary_password_hash: temporaryPasswordHash,
                must_change_password: true,

                name,
                number,
                organization,
                diplom,
                inn,
                address,
                passport: passport || null,
                education_document: education_document || null,
                snils: snils || null,
            }, { transaction: t });

            // --- создаём enrollment'ы ---
            const enrollments = programs_id.map(programId => ({
                userId: user.id,
                programId,
                status: 'active',
            }));

            await Enrollment.bulkCreate(enrollments, { transaction: t });

            await Event.create({
                event_text: 'Добавлен новый слушатель',
                name,
                organization,
                type: 'user',
                event_id: user.id,
            }, { transaction: t });

            await t.commit();

            return res.json({
                message: 'Пользователь успешно создан',
                user: {
                    id: user.id,
                    login: user.login,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                    role: user.role,
                    must_change_password: user.must_change_password,
                    temporary_password_plain: user.temporary_password_plain,
                },
            });
        } catch (e) {
            await t.rollback();
            console.error('Registration error:', e);
            return next(ApiError.internal('Ошибка при регистрации'));
        }
    }


    async registrationAdmin(req, res, next) {
        try {
            const {
                login,
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
                admin_signature
            } = req.body;

            if (!login) {
                return next(ApiError.badRequest('Некорректный логин'));
            }

            if (!password) {
                return next(ApiError.badRequest('Некорректный пароль'));
            }

            if (!number) {
                return next(ApiError.badRequest('Некорректный номер'));
            }

            const loginExists = await User.findOne({
                where: { login },
            });

            if (loginExists) {
                return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
            }


            const hashPassword = await bcrypt.hash(password, 5);

            const user = await User.create({
                login,
                email: email || null,
                role: role || 'ADMIN',
                password: hashPassword,

                // для админа временный пароль не нужен
                temporary_password_plain: null,
                temporary_password_hash: null,
                must_change_password: false,

                name,
                number,
                organization,
                diplom,
                inn,
                address,
                admin_signature
            });

            await Event.create({
                event_text: 'Добавлен новый администратор',
                name,
                organization,
                type: 'admin',
                event_id: user.id,
            });

            const token = generateJwt(
                user.id,
                user.login,
                user.role,
                user.must_change_password
            );

            return res.json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    number: user.number,
                    must_change_password: user.must_change_password,
                },
            });

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
                login,
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
                passport,
                education_document,
                snils,
            } = req.body;

            const user = await User.findByPk(id, { transaction: t });
            if (!user) {
                await t.rollback();
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            if (!login) {
                await t.rollback();
                return next(ApiError.badRequest('Некорректный логин'));
            }

            if (!number) {
                await t.rollback();
                return next(ApiError.badRequest('Некорректный номер'));
            }

            if (!Array.isArray(programs_id)) {
                await t.rollback();
                return next(ApiError.badRequest('programs_id должен быть массивом'));
            }

            // уникальность login и number
            const loginExists = await User.findOne({ where: { login }, transaction: t });



            if (loginExists && loginExists.id !== user.id) {
                await t.rollback();
                return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
            }


            // обновляем пользователя
            user.login = login;
            user.email = email || null;
            user.role = role;
            user.name = name;
            user.number = number;
            user.organization = organization;
            user.inn = inn;
            user.address = address;
            user.diplom = diplom;

            user.passport = passport !== undefined ? passport : user.passport;
            user.education_document = education_document !== undefined ? education_document : user.education_document;
            user.snils = snils !== undefined ? snils : user.snils;

            // если админ передал password — считаем это новым временным паролем
            if (password) {
                user.password = null;
                user.temporary_password_plain = password;
                user.temporary_password_hash = await bcrypt.hash(password, 5);
                user.must_change_password = true;
            }

            await user.save({ transaction: t });

            // --- Enrollment логика ---
            const existingEnrollments = await Enrollment.findAll({
                where: { userId: user.id },
                transaction: t,
            });

            const existingProgramIds = existingEnrollments.map(e => e.programId);
            const newProgramIds = programs_id;

            // добавить новые программы
            const toAdd = newProgramIds.filter(
                pid => !existingProgramIds.includes(pid)
            );

            // архивировать удалённые
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

            return res.json({
                message: 'Пользователь обновлён',
                user: {
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    number: user.number,
                    organization: user.organization,
                    diplom: user.diplom,
                    inn: user.inn,
                    address: user.address,
                    passport: user.passport,
                    education_document: user.education_document,
                    snils: user.snils,
                    must_change_password: user.must_change_password,
                    temporary_password: user.temporary_password_plain,
                },
            });

        } catch (e) {
            await t.rollback();
            console.error('remakeUser error:', e);
            return next(ApiError.internal('Ошибка при обновлении пользователя'));
        }
    }


    // ======================== REMAKE ADMIN ========================
    async remakeAdmin(req, res, next) {
        try {
            const { id, login, email, password, role, name, number, admin_signature } = req.body;

            const user = await User.findOne({ where: { id } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            if (!login) {
                return next(ApiError.badRequest('Некорректный логин'));
            }

            if (!number) {
                return next(ApiError.badRequest('Некорректный номер'));
            }

            const loginExists = await User.findOne({ where: { login } });

            if (loginExists && loginExists.id !== user.id) {
                return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
            }

            user.login = login;
            user.email = email || null;
            user.name = name;
            user.number = number;

            if (password) {
                user.password = await bcrypt.hash(password, 5);
                user.must_change_password = false;
                user.temporary_password_plain = null;
                user.temporary_password_hash = null;
            }

            if (role) {
                user.role = role;
            }

            user.admin_signature =
                admin_signature !== undefined
                    ? admin_signature
                    : user.admin_signature;

            await user.save();

            return res.json({
                message: 'Администратор обновлён',
                user: {
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    number: user.number,
                    admin_signature: user.admin_signature,
                    must_change_password: user.must_change_password,
                },
            });

        } catch (e) {
            console.error('remakeAdmin error:', e);
            return next(ApiError.internal('Ошибка при обновлении администратора'));
        }
    }

    // ======================== LOGIN ========================
    async login(req, res, next) {
        try {
            const { login, password } = req.body;

            if (!login) {
                return next(ApiError.badRequest('Не указан логин'));
            }

            if (!password) {
                return next(ApiError.badRequest('Не указан пароль'));
            }

            const user = await User.findOne({ where: { login } });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            let isPasswordValid = false;
            let authenticatedByTemporaryPassword = false;

            // 1. Проверяем постоянный пароль
            if (user.password) {
                isPasswordValid = bcrypt.compareSync(password, user.password);
            }

            // 2. Если постоянный не подошел, пробуем временный
            if (!isPasswordValid && user.temporary_password_hash) {
                isPasswordValid = bcrypt.compareSync(password, user.temporary_password_hash);

                if (isPasswordValid) {
                    authenticatedByTemporaryPassword = true;
                }
            }

            if (!isPasswordValid) {
                return next(ApiError.badRequest('Указан неверный пароль'));
            }

            user.last_login_at = new Date();
            await user.save();

            const token = generateJwt(
                user.id,
                user.login,
                user.role,
                user.must_change_password
            );

            return res.json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    must_change_password: user.must_change_password,
                },
                mustChangePassword: user.must_change_password,
                authenticatedByTemporaryPassword,
            });

        } catch (e) {
            console.error('login error:', e);
            return next(ApiError.internal('Ошибка при авторизации'));
        }
    }

    async setInitialPassword(req, res, next) {
        try {
            const userId = req.user.id;
            const { newPassword } = req.body;

            if (!newPassword || newPassword.length < 6) {
                return next(ApiError.badRequest('Новый пароль должен быть не короче 6 символов'));
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            if (!user.must_change_password) {
                return next(ApiError.badRequest('Смена временного пароля не требуется'));
            }

            const hashedPassword = bcrypt.hashSync(newPassword, 5);

            user.password = hashedPassword;
            user.temporary_password_plain = null;
            user.temporary_password_hash = null;
            user.must_change_password = false;

            await user.save();

            const token = generateJwt(
                user.id,
                user.login,
                user.role,
                false
            );

            return res.json({
                message: 'Пароль успешно изменен',
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    must_change_password: user.must_change_password,
                }
            })

        } catch (e) {
            console.error('setInitialPassword error:', e);
            return next(ApiError.internal('Ошибка при установке пароля'));
        }
    }

    // ======================== FORGOT PASSWORD ========================
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                return next(ApiError.badRequest('Укажите email'));
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            // 4-значный код (оставляем как есть)
            const code = Math.floor(1000 + Math.random() * 9000).toString();

            const hashCode = await bcrypt.hash(code, 5);

            user.forgot_pass_code = hashCode;
            await user.save();

            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'chabanovdan@gmail.com',
                        pass: 'fmdn veek hhnz wirs',
                    },
                });

                await transporter.sendMail({
                    from: "chabanovdan@gmail.com",
                    to: email,
                    subject: 'Код для восстановления пароля',
                    html: `<p>Код: <b>${code}</b></p>`,
                });

            } catch (mailErr) {
                console.error('Mail send error:', mailErr);
                return next(ApiError.internal('Ошибка отправки письма'));
            }

            return res.json({ message: 'Код отправлен на почту' });

        } catch (e) {
            console.error('forgotPassword error:', e);
            return next(ApiError.internal('Ошибка при восстановлении пароля'));
        }
    }
    async checkForgotPassword(req, res, next) {
        try {
            const { email, code, pass } = req.body;

            if (!email || !code || !pass) {
                return next(ApiError.badRequest('Не все данные указаны'));
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            if (!user.forgot_pass_code) {
                return next(ApiError.badRequest('Код не был запрошен'));
            }

            const compareCode = bcrypt.compareSync(String(code), user.forgot_pass_code);

            if (!compareCode) {
                return next(ApiError.badRequest('Код неверный'));
            }

            // новый пароль
            user.password = await bcrypt.hash(pass, 5);

            // чистим код
            user.forgot_pass_code = null;

            // важно для твоей новой системы
            user.temporary_password_plain = null;
            user.temporary_password_hash = null;
            user.must_change_password = false;

            await user.save();

            return res.json({ message: 'Пароль успешно изменён' });

        } catch (e) {
            console.error('checkForgotPassword error:', e);
            return next(ApiError.internal('Ошибка при проверке кода'));
        }
    }

    // ======================== CHECK TOKEN ========================
    async check(req, res, next) {
        try {
            const token = generateJwt(
                req.user.id,
                req.user.login,
                req.user.role,
                req.user.must_change_password
            );

            return res.json({
                token,
                user: {
                    id: req.user.id,
                    login: req.user.login,
                    role: req.user.role,
                    must_change_password: req.user.must_change_password,
                },
                mustChangePassword: req.user.must_change_password,
            });
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
                    {
                        model: UserDocument,
                        as: 'documents',
                        attributes: [
                            'id',
                            'original_name',
                            'file_name',
                            'file_path',
                            'mime_type',
                            'size',
                            'document_type',
                            'createdAt',
                            'updatedAt',
                        ],
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
                type: 'admin',
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

    async addUserDocuments(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            if (!req.files || !req.files.documents) {
                return next(ApiError.badRequest('Файлы не переданы'));
            }

            if (!fs.existsSync(USER_DOCS_DIR)) {
                fs.mkdirSync(USER_DOCS_DIR, { recursive: true });
            }

            const uploaded = Array.isArray(req.files.documents)
                ? req.files.documents
                : [req.files.documents];

            const allowedMimes = [
                'image/png',
                'image/jpeg',
                'application/pdf',
            ];

            const createdDocuments = [];

            for (const file of uploaded) {
                if (!allowedMimes.includes(file.mimetype)) {
                    return next(ApiError.badRequest('Допустимы только файлы PNG, JPG, PDF'));
                }

                const ext = path.extname(file.name);
                const fileName = `${uuid.v4()}${ext}`;
                const savePath = path.join(USER_DOCS_DIR, fileName);

                await file.mv(savePath);

                const createdDoc = await UserDocument.create({
                    userId: user.id,
                    original_name: file.name,
                    file_name: fileName,
                    file_path: `user-documents/${fileName}`,
                    mime_type: file.mimetype,
                    size: file.size,
                });

                createdDocuments.push(createdDoc);
            }

            return res.json({
                message: 'Документы загружены',
                documents: createdDocuments,
            });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка загрузки документов'));
        }
    }

    // ======================== DELETE USER DOCUMENT ========================
    async deleteUserDocument(req, res, next) {
        try {
            const { id } = req.params;

            const document = await UserDocument.findByPk(id);
            if (!document) return next(ApiError.badRequest('Документ не найден'));

            if (document.file_path) {
                const filePath = path.join(STATIC_DIR, document.file_path);

                try {
                    if (fs.existsSync(filePath)) {
                        await fs.promises.unlink(filePath);
                        console.log('🗑 User document deleted:', filePath);
                    }
                } catch (err) {
                    console.warn('Не удалось удалить файл документа:', filePath, err);
                }
            }

            await document.destroy();

            return res.json({ message: 'Документ удалён' });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка удаления документа'));
        }
    }

    // ======================== GET USER DOCUMENTS ========================
    async getUserDocuments(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) return next(ApiError.badRequest('Пользователь не найден'));

            const documents = await UserDocument.findAll({
                where: { userId: id },
                order: [['createdAt', 'DESC']],
            });

            return res.json(documents);
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка получения документов'));
        }
    }
}

module.exports = new UserController();
