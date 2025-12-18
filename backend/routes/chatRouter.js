const Router = require('express');
const router = new Router();
const chatController = require('../controllers/chatController')
const authMiddleware = require('../middleware/authMiddleware')

const checkRole = require('../middleware/checkRoleMiddleware')


router.get('/getMessages/:id', chatController.getMessages)
router.get('/deleteMessages/:id', chatController.deleteMessage)
router.post('/sendMessages/', chatController.sendMessage)

router.get('/getUnreadCount/', chatController.getAllUserUnreadCount)
router.get('/getUnreadCount/:userId', chatController.getUnreadCount)
router.post('/markChatAsRead/:userId', chatController.markChatAsRead)

module.exports = router;