const enrollmentService = require("../services/enrollment/enrollment.service");

class EnrollmentController {
    async getEnrollment(req, res, next) {
        try {
            const enrollment = await enrollmentService.getEnrollment({
                userId: req.user.id,
                programId: req.params.programId,
            });

            return res.json(enrollment);
        } catch (e) {
            next(e);
        }
    }

    async getEnrollmentsByProgram(req, res, next) {
        try {
            const enrollments = await enrollmentService.getEnrollmentsByProgram(
                req.params.programId
            );

            return res.json(enrollments);
        } catch (e) {
            next(e);
        }
    }

    async getEnrollmentsByUser(req, res, next) {
        try {
            const enrollments = await enrollmentService.getEnrollmentsByUser(
                req.params.userId
            );

            return res.json(enrollments);
        } catch (e) {
            next(e);
        }
    }

    async createEnrollment(req, res, next) {
        try {
            const result = await enrollmentService.createEnrollment({
                userId: req.body.userId,
                programId: req.body.programId,
            });

            return res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateEnrollmentStatus(req, res, next) {
        try {
            const result = await enrollmentService.updateEnrollmentStatus({
                enrollmentId: req.params.enrollmentId,
                status: req.body.status,
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateEnrollmentProgress(req, res, next) {
        try {
            const result = await enrollmentService.updateEnrollmentProgress({
                enrollmentId: req.params.enrollmentId,
                progress_percent: req.body.progress_percent,
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async archiveEnrollment(req, res, next) {
        try {
            const result = await enrollmentService.archiveEnrollment(
                req.params.enrollmentId
            );

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async restoreEnrollment(req, res, next) {
        try {
            const result = await enrollmentService.restoreEnrollment(
                req.params.enrollmentId
            );

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteEnrollment(req, res, next) {
        try {
            const result = await enrollmentService.deleteEnrollment(
                req.params.enrollmentId
            );

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new EnrollmentController();