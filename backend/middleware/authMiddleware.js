const jwt = require('jsonwebtoken')
const actualizeUserBlock = require("../utils/actualizeUserBlock");



module.exports = async function (req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log('Первое')
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const token = authHeader.split(' ')[1]; // Bearer token

        if (!token) {
            console.log('Второе')
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const blockState = await actualizeUserBlock(decoded.id);


        if (!blockState.exists) {
            return res.status(401).json({
                message: "Пользователь не найден",
            });
        }

        if (decoded.role === "USER" && blockState.blocked) {
            return res.status(403).json({
                code: "USER_BLOCKED",
                message: "Ваш аккаунт заблокирован",
                reason: blockState.reason,
                blockedUntil: blockState.blockedUntil,
                permanent: blockState.permanent,
            });
        }

        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Не авторизован' });
    }
};