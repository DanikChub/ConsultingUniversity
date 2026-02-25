const { Enrollment } = require("../models/models");

const checkProgramAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const programId = req.params.id;

        // ADMIN — полный доступ
        if (userRole === 'ADMIN' | userRole === 'VIEWER') {
            return next();
        }

        const enrollment = await Enrollment.findOne({
            where: {
                userId,
                programId
            }
        });

        if (!enrollment) {
            return res.status(403).json({ message: 'Нет доступа' });
        }

        if (
            userRole === 'USER' &&
            enrollment.status !== 'active' &&
            enrollment.status !== 'completed'
        ) {
            return res.status(403).json({ message: 'Нет доступа' });
        }

        return next();

    } catch (err) {
        return next(err);
    }
};

module.exports = checkProgramAccess;