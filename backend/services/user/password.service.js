const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const ApiError = require("../../error/ApiError");
const { User } = require("../../models/models");

class PasswordService {
    async forgotPassword(email) {
        if (!email) {
            throw ApiError.badRequest("Укажите email");
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const hashCode = await bcrypt.hash(code, 5);

        user.forgot_pass_code = hashCode;
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
                to: email,
                subject: "Код для восстановления пароля",
                html: `<p>Код: <b>${code}</b></p>`,
            });
        } catch (mailErr) {
            console.error("Mail send error:", mailErr);
            throw ApiError.internal("Ошибка отправки письма");
        }

        return {
            message: "Код отправлен на почту",
        };
    }

    async checkForgotPassword({ email, code, pass }) {
        if (!email || !code || !pass) {
            throw ApiError.badRequest("Не все данные указаны");
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        if (!user.forgot_pass_code) {
            throw ApiError.badRequest("Код не был запрошен");
        }

        const compareCode = bcrypt.compareSync(
            String(code),
            user.forgot_pass_code
        );

        if (!compareCode) {
            throw ApiError.badRequest("Код неверный");
        }

        user.password = await bcrypt.hash(pass, 5);
        user.forgot_pass_code = null;
        user.temporary_password_plain = null;
        user.temporary_password_hash = null;
        user.must_change_password = false;

        await user.save();

        return {
            message: "Пароль успешно изменён",
        };
    }
}

module.exports = new PasswordService();