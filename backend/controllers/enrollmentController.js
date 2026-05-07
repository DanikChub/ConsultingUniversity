const { Enrollment } = require("../models/models");

class EnrollmentController {
    async getEnrollment(req, res) {
        try {
            const { programId, userId } = req.params;

            const enrollment = await Enrollment.findOne({
                where: { userId, programId }
            });

            if (!enrollment) {
                return res.status(404).json({ message: "Not enrolled" });
            }

            return res.json(enrollment);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching enrollment" });
        }
    }

    async getEnrollmentsByProgram(req, res) {
        try {
            const { programId } = req.params;

            const enrollments = await Enrollment.findAll({
                where: { programId }
            });

            return res.json(enrollments);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching enrollments" });
        }
    }

    async getEnrollmentsByUser(req, res) {
        try {
            const { userId } = req.params;

            const enrollments = await Enrollment.findAll({
                where: { userId }
            });

            return res.json(enrollments);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching user enrollments" });
        }
    }

    async createEnrollment(req, res) {
        try {
            const { userId, programId } = req.body;

            if (!userId || !programId) {
                return res.status(400).json({ message: "userId and programId are required" });
            }

            const existingEnrollment = await Enrollment.findOne({
                where: { userId, programId }
            });

            if (existingEnrollment) {
                return res.status(409).json({
                    message: "User already enrolled in this program",
                    enrollment: existingEnrollment
                });
            }

            const enrollment = await Enrollment.create({
                userId,
                programId,
                status: "active",
                progress_percent: 0,
                started_at: new Date(),
            });

            return res.status(201).json(enrollment);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error creating enrollment" });
        }
    }

    async updateEnrollmentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const allowedStatuses = ["active", "paused", "completed", "archived"];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const enrollment = await Enrollment.findByPk(id);

            if (!enrollment) {
                return res.status(404).json({ message: "Enrollment not found" });
            }

            enrollment.status = status;

            if (status === "completed") {
                enrollment.progress_percent = 100;
                enrollment.completed_at = new Date();
            } else {
                enrollment.completed_at = null;
            }

            await enrollment.save();

            return res.json(enrollment);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error updating enrollment status" });
        }
    }

    async updateEnrollmentProgress(req, res) {
        try {
            const { id } = req.params;
            const { progress_percent } = req.body;

            if (
                progress_percent === undefined ||
                Number(progress_percent) < 0 ||
                Number(progress_percent) > 100
            ) {
                return res.status(400).json({ message: "Progress must be from 0 to 100" });
            }

            const enrollment = await Enrollment.findByPk(id);

            if (!enrollment) {
                return res.status(404).json({ message: "Enrollment not found" });
            }

            enrollment.progress_percent = Number(progress_percent);

            if (Number(progress_percent) === 100) {
                enrollment.status = "completed";
                enrollment.completed_at = new Date();
            }

            await enrollment.save();

            return res.json(enrollment);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error updating enrollment progress" });
        }
    }

    async deleteEnrollment(req, res) {
        try {
            const { id } = req.params;

            const enrollment = await Enrollment.findByPk(id);

            if (!enrollment) {
                return res.status(404).json({ message: "Enrollment not found" });
            }

            await enrollment.destroy();

            return res.json({ message: "Enrollment deleted" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error deleting enrollment" });
        }
    }
}

module.exports = new EnrollmentController();