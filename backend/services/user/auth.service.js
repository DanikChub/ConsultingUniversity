const bcrypt = require("bcrypt");

const ApiError = require("../../error/ApiError");
const { User } = require("../../models/models");
const { generateJwt } = require("../../utils/jwt");

class AuthService {
    async login({ login, password }) {
        if (!login) {
            throw ApiError.badRequest("Не указан логин");
        }

        if (!password) {
            throw ApiError.badRequest("Не указан пароль");
        }

        const user = await User.findOne({
            where: {
                login,
                is_delete: false,
            },
        });

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        let isPasswordValid = false;
        let authenticatedByTemporaryPassword = false;

        if (user.password) {
            isPasswordValid = bcrypt.compareSync(password, user.password);
        }

        if (!isPasswordValid && user.temporary_password_hash) {
            isPasswordValid = bcrypt.compareSync(
                password,
                user.temporary_password_hash
            );

            if (isPasswordValid) {
                authenticatedByTemporaryPassword = true;
            }
        }

        if (!isPasswordValid) {
            throw ApiError.badRequest("Указан неверный пароль");
        }

        user.last_login_at = new Date();
        await user.save();

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
                name: user.name,
                role: user.role,
                must_change_password: user.must_change_password,
            },
            mustChangePassword: user.must_change_password,
            authenticatedByTemporaryPassword,
        };
    }

    async setInitialPassword(userId, newPassword) {
        if (!newPassword || newPassword.length < 6) {
            throw ApiError.badRequest(
                "Новый пароль должен быть не короче 6 символов"
            );
        }

        const user = await User.findByPk(userId);

        if (!user) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        if (!user.must_change_password) {
            throw ApiError.badRequest("Смена временного пароля не требуется");
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 5);

        user.password = hashedPassword;
        user.temporary_password_plain = null;
        user.temporary_password_hash = null;
        user.must_change_password = false;

        await user.save();

        const token = generateJwt(user.id, user.login, user.role, false);

        return {
            message: "Пароль успешно изменен",
            token,
            user: {
                id: user.id,
                login: user.login,
                email: user.email,
                role: user.role,
                name: user.name,
                must_change_password: user.must_change_password,
            },
        };
    }

    async check(authUser) {
        const token = generateJwt(
            authUser.id,
            authUser.login,
            authUser.role,
            authUser.must_change_password
        );

        return {
            token,
            user: {
                id: authUser.id,
                login: authUser.login,
                role: authUser.role,
                must_change_password: authUser.must_change_password,
            },
            mustChangePassword: authUser.must_change_password,
        };
    }
}

module.exports = new AuthService();