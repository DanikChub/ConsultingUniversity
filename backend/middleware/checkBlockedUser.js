const { User } = require("../models/models");

module.exports = async function checkBlockedUser(req, res, next) {
    try {
        if (!req.user?.id) {
            return next();
        }

        if (req.user.role === "ADMIN" || req.user.role === "VIEWER") {
            return next();
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }

        if (user.status !== "blocked") {
            return next();
        }

        if (user.blocked_until && new Date(user.blocked_until) <= new Date()) {
            user.status = "active";
            user.blocked_until = null;
            user.blocked_reason = null;
            await user.save();

            return next();
        }

        return res.status(403).json({
            message: "Аккаунт заблокирован",
            blocked: true,
            blocked_until: user.blocked_until,
            blocked_reason: user.blocked_reason,
        });
    } catch (e) {
        next(e);
    }
};