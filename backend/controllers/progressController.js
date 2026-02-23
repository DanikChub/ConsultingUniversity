const { Program,
    UserContentProgress,
    Enrollment,
    Punct,
    Theme, File, FileAsset, Test, Question, Answer
} = require("../models/models");

const ApiError = require('../error/ApiError')

class progressController {
    async updateProgress(req, res, next) {
        try {
            const { enrollmentId, contentType, contentId, status, score } = req.body

            if (!enrollmentId || !contentType || !contentId || !status) {
                return next(ApiError.badRequest('Недостаточно данных'))
            }

            const [progress] = await UserContentProgress.findOrCreate({
                where: { enrollmentId, contentType, contentId },
                defaults: { status }
            })
            console.log(status)
            progress.status = status

            if (score !== undefined) {
                progress.score = score
            }

            if (status === 'completed') {
                progress.completedAt = new Date()
            }

            await progress.save()


            return res.json(
                progress
            )

        } catch (e) {
            console.error('updateProgress error:', e)
            return next(ApiError.internal('Ошибка обновления прогресса'))
        }
    }


    // 🔥 Получить детальный прогресс по enrollment
    async getEnrollmentProgress(req, res, next) {
        try {
            const { enrollmentId } = req.params

            const enrollment = await Enrollment.findByPk(enrollmentId)

            if (!enrollment) {
                return res.status(404).json({ message: 'Enrollment not found' })
            }

            const userProgressItems = await UserContentProgress.findAll({
                where: { enrollmentId },
                raw: true
            })

            const byContent = {}
            userProgressItems.forEach(item => {
                const key = `${item.contentType}-${item.contentId}`
                byContent[key] = item
            })

            return res.json({
                byContent,
                percent: enrollment.progress_percent
            })

        } catch (e) {
            console.error('getEnrollmentProgress error:', e)
            return next(ApiError.internal('Ошибка получения прогресса'))
        }
    }

// 🔥 Получить прогресс конкретного контента
    async getContentProgress(req, res, next) {
        try {
            const { enrollmentId, contentType } = req.query
            const {contentId} = req.params

            if (!enrollmentId || !contentType || !contentId) {
                return next(ApiError.badRequest('Недостаточно данных'))
            }

            const progress = await UserContentProgress.findOne({
                where: {
                    enrollmentId,
                    contentType,
                    contentId
                }
            })
            console.log(progress, enrollmentId, contentType, contentId)
            if (!progress) {
                return res.json({
                    exists: false,
                    progress: null
                })
            }

            return res.json({
                exists: true,
                progress
            })

        } catch (e) {
            console.error('getContentProgress error:', e)
            return next(ApiError.internal('Ошибка получения прогресса'))
        }
    }


}

module.exports = new progressController();