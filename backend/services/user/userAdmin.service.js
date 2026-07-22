const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const ApiError = require("../../error/ApiError");
const sequelize = require("../../db");
const { User, Enrollment, Event } = require("../../models/models");

class UserAdminService {
    async setGraduationDate({ id, graduation_date }) {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        if (!user.graduation_date) {
            user.graduation_date = graduation_date;
            await user.save();

            try {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: process.env.SMTP_USER,
                    subject: "Поздравляем с окончанием обучения!",
                    html: `<h1>Поздравляем вас с окончанием обучения!</h1>`,
                });
            } catch (mailErr) {
                console.error("Mail send error:", mailErr);
            }
        }

        return user;
    }

    async remakeUser(payload) {
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
            } = payload;

            const user = await User.findByPk(id, { transaction: t });

            if (!user) {
                throw ApiError.badRequest("Пользователь не найден");
            }

            if (!login) {
                throw ApiError.badRequest("Некорректный логин");
            }

            if (!number) {
                throw ApiError.badRequest("Некорректный номер");
            }

            if (!Array.isArray(programs_id)) {
                throw ApiError.badRequest("programs_id должен быть массивом");
            }

            const loginExists = await User.findOne({
                where: { login },
                transaction: t,
            });

            if (loginExists && loginExists.id !== user.id) {
                throw ApiError.badRequest(
                    "Пользователь с таким логином уже существует"
                );
            }

            user.login = login;
            user.email = email || null;
            user.role = role;
            user.name = name;
            user.number = number;
            user.organization = organization;
            user.inn = inn;
            user.address = address;
            user.diplom = diplom;

            user.passport =
                passport !== undefined ? passport : user.passport;

            user.education_document =
                education_document !== undefined
                    ? education_document
                    : user.education_document;

            user.snils = snils !== undefined ? snils : user.snils;

            if (password) {
                user.password = null;
                user.temporary_password_plain = password;
                user.temporary_password_hash = await bcrypt.hash(password, 5);
                user.must_change_password = true;
            }

            await user.save({ transaction: t });

            const existingEnrollments = await Enrollment.findAll({
                where: { userId: user.id },
                transaction: t,
            });

            const existingProgramIds = existingEnrollments.map(
                enrollment => enrollment.programId
            );

            const newProgramIds = programs_id;

            const toAdd = newProgramIds.filter(
                programId => !existingProgramIds.includes(programId)
            );

            const toArchive = existingEnrollments.filter(
                enrollment => !newProgramIds.includes(enrollment.programId)
            );

            if (toAdd.length) {
                await Enrollment.bulkCreate(
                    toAdd.map(programId => ({
                        userId: user.id,
                        programId,
                        status: "active",
                    })),
                    { transaction: t }
                );
            }

            if (toArchive.length) {
                await Enrollment.update(
                    { status: "archived" },
                    {
                        where: {
                            id: toArchive.map(enrollment => enrollment.id),
                        },
                        transaction: t,
                    }
                );
            }

            await t.commit();

            return {
                message: "Пользователь обновлён",
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
            };
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    async remakeAdmin(payload) {
        const {
            id,
            login,
            email,
            password,
            role,
            name,
            number,
            admin_signature,
        } = payload;

        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        if (!login) {
            throw ApiError.badRequest("Некорректный логин");
        }

        if (!number) {
            throw ApiError.badRequest("Некорректный номер");
        }

        const loginExists = await User.findOne({ where: { login } });

        if (loginExists && loginExists.id !== user.id) {
            throw ApiError.badRequest(
                "Пользователь с таким логином уже существует"
            );
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

        return {
            message: "Администратор обновлён",
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
        };
    }

    async deleteUser(id) {
        const user = await User.findOne({
            where: {
                id,
                is_delete: false,
            },
        });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        user.is_delete = true;
        await user.save();

        await Event.create({
            event_text: "Пользователь удален",
            name: user.name,
            organization: user.organization,
            type: "user",
            event_id: user.id,
        });

        return {
            message: "Пользователь удалён",
            user,
        };
    }

    async softDeleteUser(userId) {
        const user = await User.findOne({
            where: {
                id: userId,
                role: "USER",
            },
        });

        if (!user) {
            throw ApiError.notFound("Пользователь не найден");
        }

        if (user.is_delete) {
            return {
                message: "Пользователь уже удален",
                user,
            };
        }

        // Освобождаем логин
        user.login = `${user.login}_deleted_${user.id}}`;
        user.is_delete = true;

        await user.save();

        await Event.create({
            event_text: "Пользователь удален",
            name: user.name,
            organization: user.organization,
            type: "user",
            event_id: user.id,
        });

        return {
            message: "Пользователь удален",
            user,
        };
    }

    async restoreUser(userId) {
        const user = await User.findOne({
            where: {
                id: userId,
                role: "USER",
            },
        });

        if (!user) {
            throw ApiError.notFound("Пользователь не найден");
        }

        if (!user.is_delete) {
            return {
                message: "Пользователь уже активен",
                user,
            };
        }

        user.is_delete = false;
        await user.save();

        await Event.create({
            event_text: "Пользователь восстановлен",
            name: user.name,
            organization: user.organization,
            type: "user",
            event_id: user.id,
        });

        return {
            message: "Пользователь восстановлен",
            user,
        };
    }

    async blockUser(userId, durationMinutes, reason) {
        const user = await User.findOne({
            where: {
                id: userId,
                role: "USER",
                is_delete: false,
            },
        });

        if (!user) {
            throw ApiError.notFound("Пользователь не найден");
        }

        if (!reason?.trim()) {
            throw ApiError.badRequest("Необходимо указать причину блокировки");
        }

        let blockedUntil = null;

        if (durationMinutes !== null && durationMinutes !== undefined) {
            const minutes = Number(durationMinutes);

            if (!Number.isFinite(minutes) || minutes <= 0) {
                throw ApiError.badRequest(
                    "Некорректная продолжительность блокировки"
                );
            }

            blockedUntil = new Date(Date.now() + minutes * 60 * 1000);
        }

        await user.update({
            is_blocked: true,
            blocked_until: blockedUntil,
            block_reason: reason.trim(),
        });

        await Event.create({
            event_text: "Пользователь заблокирован",
            name: user.name,
            organization: user.organization,
            type: "user",
            event_id: user.id,
        });

        return {
            message: blockedUntil
                ? "Пользователь временно заблокирован"
                : "Пользователь заблокирован бессрочно",
            user,
        };
    }

    async unblockUser(userId) {
        const user = await User.findOne({
            where: {
                id: userId,
                role: "USER",
                is_delete: false,
            },
        });

        if (!user) {
            throw ApiError.notFound("Пользователь не найден");
        }

        if (!user.is_blocked) {
            return {
                message: "Пользователь уже разблокирован",
                user,
            };
        }

        await user.update({
            is_blocked: false,
            blocked_until: null,
            block_reason: null,
        });

        await Event.create({
            event_text: "Пользователь разблокирован",
            name: user.name,
            organization: user.organization,
            type: "user",
            event_id: user.id,
        });

        return {
            message: "Пользователь разблокирован",
            user,
        };
    }
}

module.exports = new UserAdminService();