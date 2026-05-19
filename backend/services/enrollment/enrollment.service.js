const ApiError = require("../../error/ApiError");
const { Enrollment, User, Program } = require("../../models/models");
const enrollmentCompletionService = require("./enrollmentCompletion.service");

const ALLOWED_STATUSES = ["active", "paused", "completed", "archived"];

class EnrollmentService {
    async getEnrollment({ userId, programId }) {
        const enrollment = await Enrollment.findOne({
            where: { userId, programId },
        });

        if (!enrollment) {
            throw ApiError.notFound("Пользователь не записан на программу");
        }

        return enrollment;
    }

    async getEnrollmentsByProgram(programId) {
        return Enrollment.findAll({
            where: { programId },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email", "number", "organization"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async getEnrollmentsByUser(userId) {
        return Enrollment.findAll({
            where: { userId },
            include: [
                {
                    model: Program,
                    attributes: ["id", "title", "short_title", "img", "price"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async createEnrollment({ userId, programId }) {
        if (!userId || !programId) {
            throw ApiError.badRequest("userId и programId обязательны");
        }

        const user = await User.findOne({
            where: { id: userId, role: "USER" },
        });

        if (!user) {
            throw ApiError.notFound("Пользователь не найден");
        }

        const program = await Program.findByPk(programId);

        if (!program) {
            throw ApiError.notFound("Программа не найдена");
        }

        const existingEnrollment = await Enrollment.findOne({
            where: { userId, programId },
        });

        if (existingEnrollment) {
            if (existingEnrollment.status === "active") {
                throw ApiError.badRequest("Программа уже выдана пользователю");
            }

            if (existingEnrollment.status === "completed") {
                throw ApiError.badRequest("Пользователь уже завершил эту программу");
            }

            existingEnrollment.status = "active";
            existingEnrollment.completed_at = null;
            existingEnrollment.started_at = existingEnrollment.started_at || new Date();

            await existingEnrollment.save();

            return {
                message: "Доступ к программе восстановлен",
                enrollment: existingEnrollment,
            };
        }

        const enrollment = await Enrollment.create({
            userId,
            programId,
            status: "active",
            progress_percent: 0,
            started_at: new Date(),
            completed_at: null,
        });

        return {
            message: "Программа успешно выдана",
            enrollment,
        };
    }

    async updateEnrollmentStatus({ enrollmentId, status }) {
        if (!ALLOWED_STATUSES.includes(status)) {
            throw ApiError.badRequest("Некорректный статус");
        }

        const enrollment = await Enrollment.findByPk(enrollmentId);

        if (!enrollment) {
            throw ApiError.notFound("Доступ к программе не найден");
        }

        enrollment.status = status;

        if (status === "completed") {
            return enrollmentCompletionService.completeEnrollment(enrollmentId);
        } else {
            enrollment.completed_at = null;
        }

        await enrollment.save();

        return {
            message: "Статус доступа обновлен",
            enrollment,
        };
    }

    async updateEnrollmentProgress({ enrollmentId, progress_percent }) {
        const progress = Number(progress_percent);

        if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
            throw ApiError.badRequest("Прогресс должен быть от 0 до 100");
        }

        const enrollment = await Enrollment.findByPk(enrollmentId);

        if (!enrollment) {
            throw ApiError.notFound("Доступ к программе не найден");
        }

        enrollment.progress_percent = progress;

        if (progress === 100) {
            return enrollmentCompletionService.completeEnrollment(enrollmentId);
        }

        if (progress < 100 && enrollment.status === "completed") {
            enrollment.status = "active";
            enrollment.completed_at = null;
        }

        await enrollment.save();

        return {
            message: "Прогресс обновлен",
            enrollment,
        };
    }

    async archiveEnrollment(enrollmentId) {
        return this.updateEnrollmentStatus({
            enrollmentId,
            status: "archived",
        });
    }

    async restoreEnrollment(enrollmentId) {
        return this.updateEnrollmentStatus({
            enrollmentId,
            status: "active",
        });
    }

    async deleteEnrollment(enrollmentId) {
        return this.archiveEnrollment(enrollmentId);
    }
}

module.exports = new EnrollmentService();