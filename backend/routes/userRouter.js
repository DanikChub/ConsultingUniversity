const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration', checkRole('ADMIN'), userController.registration)
router.post('/registrationAdmin', userController.registrationAdmin)
router.post('/remake', checkRole('ADMIN'), userController.remakeUser)
router.post('/remakeAdmin', checkRole('ADMIN'), userController.remakeAdmin)
router.post('/delete', checkRole('ADMIN'), userController.deleteUser)
router.post('/login', userController.login)
router.post('/forgot_password', userController.forgotPassword)
router.post('/check_forgot_password', userController.checkForgotPassword)
router.get('/auth', authMiddleware, userController.check)
router.get('/getUser/:id', userController.getUserById)
router.get('/getUser/', checkRole(['ADMIN', 'VIEWER']), userController.getAllUsers)
router.get('/getUsersWithLastMessages/', checkRole(['ADMIN', 'VIEWER']), userController.getUsersWithLastMessages)
router.get('/getAllUsersGraduation/', checkRole(['ADMIN', 'VIEWER']), userController.getAllUsersGraduation)
router.get('/getAdmins/', checkRole(['ADMIN', 'VIEWER']), userController.getAllAdmins)
router.get('/getAllUser/:page', checkRole(['ADMIN', 'VIEWER']), userController.getAllUsersWithPage)
router.get('/search/:page', checkRole(['ADMIN', 'VIEWER']), userController.searchUsers)
router.post('/setGraduationDate/', userController.setGraduationDate)
router.post('/setUserProfileImg/', userController.setUserProfileImg)

module.exports = router;