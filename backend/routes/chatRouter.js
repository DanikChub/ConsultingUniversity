const Router = require('express');
const router = new Router();
const userController = require('../controllers/chatController')
const authMiddleware = require('../middleware/authMiddleware')

const checkRole = require('../middleware/checkRoleMiddleware')


router.get('/getMessages/:id', userController.getMessages)
router.get('/deleteMessages/:id', userController.deleteMessage)
router.post('/sendMessages/', userController.sendMessage)

module.exports = router;