const {Enrollment} = require("../models/models");;


class enrollmentController {
    async getEnrollment(req, res) {
        try {
            const { programId } = req.params
            const {userId} = req.body
            console.log(Number(userId))
            const enrollment = await Enrollment.findOne({
                where: { userId, programId }
            })

            if (!enrollment) {
                return res.status(404).json({ message: 'Not enrolled' })
            }

            res.json(enrollment)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error fetching enrollment' })
        }
    }

    async getEnrollmentsByProgram(req, res) {
        try {
            const { programId } = req.params

            const enrollment = await Enrollment.findAll({
                where: {
                    programId,
                }
            })

            if (!enrollment) {
                return res.status(404).json({ message: 'Not enrolled' })
            }
            console.log(enrollment)
            res.json(enrollment)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error fetching enrollment' })
        }
    }
}

module.exports = new enrollmentController();