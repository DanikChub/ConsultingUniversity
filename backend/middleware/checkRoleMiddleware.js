const jwt = require('jsonwebtoken');

/**
 * Проверка роли пользователя
 * @param {string | string[]} roles - допустимые роли
 */
module.exports = function(roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }

        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ message: "Не авторизован" });
            }

            const token = authHeader.split(' ')[1]; // Bearer asdasdasd
            if (!token) {
                return res.status(401).json({ message: "Не авторизован" });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            // если roles — строка, превращаем в массив
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            req.user = decoded;
            next();

        } catch (e) {
            console.error('Role check error:', e);
            return res.status(401).json({ message: "Не авторизован" });
        }
    };
};