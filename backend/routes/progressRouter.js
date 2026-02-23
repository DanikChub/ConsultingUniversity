const Router = require('express');
const router = new Router();

const progressController = require('../controllers/progressController')
const checkRole = require("../middleware/checkRoleMiddleware");


// Обновить прогресс
router.put('/',progressController.updateProgress)

// Получить детальный прогресс по enrollment
router.get('/:enrollmentId', progressController.getEnrollmentProgress)
router.get('/content/:contentId', progressController.getContentProgress)



module.exports = router;