const Router = require('express')
const router = new Router()

const chatController = require('../controllers/chatController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')




/*
========================
        USER
========================
*/

// создать чат (если нет активного)
router.post(
    '/:userId',
    chatController.createChat
)

// получить мои чаты
router.get(
    '/my',
    authMiddleware,
    chatController.getMyChats
)

// получить один чат
router.get(
    '/:chatId',
    authMiddleware,
    chatController.getChatById
)

// получить сообщения
router.get(
    '/:chatId/messages',
    authMiddleware,
    chatController.getMessages
)

// отправить сообщение
router.post(
    '/:chatId/messages',
    authMiddleware,
    chatController.sendMessage
)


/*
========================
        ADMIN
========================
*/

// получить все чаты (админ)
router.get(
    '/',
    authMiddleware,
    checkRole(['ADMIN', 'VIEWER']),
    chatController.getAllChats
)

// закрыть чат
router.patch(
    '/:chatId/close',
    authMiddleware,
    checkRole(['ADMIN', 'VIEWER']),
    chatController.closeChat
)
router.post(
    '/:chatId/read',
    authMiddleware,
    chatController.markMessagesAsRead
)

// редактировать
router.patch(
    '/messages/:messageId',
    authMiddleware,
    chatController.editMessage
)

// удалить
router.delete(
    '/messages/:messageId',
    authMiddleware,
    chatController.deleteMessage
)


module.exports = router
