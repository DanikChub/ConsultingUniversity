const { File, Punct, Theme, Enrollment } = require('../models/models');
const { Op} = require('sequelize');
const checkFileAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const fileId = req.params.id;

        // 1️⃣ Находим файл с вложенностью до программы
        const file = await File.findByPk(fileId, {
            include: [
                {
                    model: Punct,
                    include: [
                        {
                            model: Theme
                        }
                    ]
                },
                {
                    model: Theme
                }
            ]
        });

        if (!file) {
            return res.status(404).json({ message: 'Файл не найден' });
        }

        // 2️⃣ Определяем programId
        let programId = null;

        if (file.themeId) {
            programId = file.theme.programId;
        }

        if (file.punctId) {
            programId = file.punct.theme.programId;
        }

        if (!programId) {
            return res.status(400).json({ message: 'Файл не привязан к программе' });
        }

        // 3️⃣ Проверяем enrollment
        const enrollment = await Enrollment.findOne({
            where: {
                userId,
                programId,
                status: {
                    [Op.in]: ['active', 'completed']
                }
            }
        });

        if (!enrollment) {
            return res.status(403).json({ message: 'Нет доступа к этому файлу' });
        }

        // можно прокинуть enrollment дальше
        req.enrollment = enrollment;

        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка проверки доступа' });
    }
};

module.exports = checkFileAccess;
