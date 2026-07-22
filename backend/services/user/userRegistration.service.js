const bcrypt = require("bcrypt");
const { sendWelcomeEmail } = require("../mail.service");
const ApiError = require("../../error/ApiError");
const sequelize = require("../../db");
const { User, Enrollment, Event } = require("../../models/models");
const { generateJwt } = require("../../utils/jwt");

class UserRegistrationService {
    async registration(payload) {
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
            } = payload;

            if (!login) {
                throw ApiError.badRequest("Некорректный логин");
            }

            if (!temporary_password) {
                throw ApiError.badRequest("Некорректный временный пароль");
            }

            if (!Array.isArray(programs_id) || programs_id.length === 0) {
                throw ApiError.badRequest("Отсутствует программа у пользователя");
            }

            const loginExists = await User.findOne({
                where: {
                    login,
                    is_delete: false,
                },
                transaction: t,
            });

            if (loginExists) {
                throw ApiError.badRequest(
                    "Пользователь с таким логином уже существует"
                );
            }

            const temporaryPasswordHash = await bcrypt.hash(
                temporary_password,
                5
            );

            const user = await User.create(
                {
                    login,
                    email: email || null,
                    role: role || "USER",
                    password: null,
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
                },
                { transaction: t }
            );

            const enrollments = programs_id.map(programId => ({
                userId: user.id,
                programId,
                status: "active",
            }));

            await Enrollment.bulkCreate(enrollments, { transaction: t });

            await Event.create(
                {
                    event_text: "Добавлен новый слушатель",
                    name,
                    organization,
                    type: "user",
                    event_id: user.id,
                },
                { transaction: t }
            );

            await t.commit();

            if (user.email) {
                await sendWelcomeEmail(
                    user.email,
                    user.name,
                    user.login,
                    temporary_password
                );
            }

            return {
                message: "Пользователь успешно создан",
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
            };
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    async registrationAdmin(payload) {
        const {
            login,
            email,
            password,
            role,
            name,
            number,
            organization,
            diplom,
            inn,
            address,
            admin_signature,
        } = payload;

        if (!login) {
            throw ApiError.badRequest("Некорректный логин");
        }

        if (!password) {
            throw ApiError.badRequest("Некорректный пароль");
        }

        if (!number) {
            throw ApiError.badRequest("Некорректный номер");
        }

        const loginExists = await User.findOne({
            where: { login },
        });

        if (loginExists) {
            throw ApiError.badRequest(
                "Пользователь с таким логином уже существует"
            );
        }

        const hashPassword = await bcrypt.hash(password, 5);

        const user = await User.create({
            login,
            email: email || null,
            role: role || "ADMIN",
            password: hashPassword,

            temporary_password_plain: null,
            temporary_password_hash: null,
            must_change_password: false,

            name,
            number,
            organization,
            diplom,
            inn,
            address,
            admin_signature,
        });

        await Event.create({
            event_text: "Добавлен новый администратор",
            name,
            organization,
            type: "admin",
            event_id: user.id,
        });

        const token = generateJwt(
            user.id,
            user.login,
            user.role,
            user.must_change_password
        );

        return {
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
        };
    }
}

module.exports = new UserRegistrationService();