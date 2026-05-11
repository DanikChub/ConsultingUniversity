const Router = require('express');
const router = new Router();

const enrollmentController = require('../controllers/enrollmentController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/getEnrollment/:programId', authMiddleware,  enrollmentController.getEnrollment)
router.get('/getEnrollment/:programId', enrollmentController.getEnrollmentsByProgram)


router.get("/user/:userId", enrollmentController.getEnrollmentsByUser);

router.patch("/:id/status", enrollmentController.updateEnrollmentStatus);
router.patch("/:id/progress", enrollmentController.updateEnrollmentProgress);

router.delete("/:id", enrollmentController.deleteEnrollment);

module.exports = router;

module.exports = router;