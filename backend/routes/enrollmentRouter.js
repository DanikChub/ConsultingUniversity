const Router = require('express');
const router = new Router();

const enrollmentController = require('../controllers/enrollmentController')



router.post('/getEnrollment/:programId', enrollmentController.getEnrollment)




module.exports = router;