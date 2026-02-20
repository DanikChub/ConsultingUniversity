const Router = require('express');
const router = new Router();

const TestController = require('../controllers/testController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/:testId/publish', TestController.publishTest)
router.get('/:id', TestController.getOne)
router.post('/', checkRole('ADMIN'), TestController.createTest); // создание болванки теста (привязка к пункту)
router.patch('/:testId', checkRole('ADMIN'), TestController.updateTestFields); // обновление полей теста
router.delete('/:testId', checkRole('ADMIN'), TestController.deleteTest); // удаление теста (каскад)

router.post('/question', checkRole('ADMIN'), TestController.createQuestion); // создание болванки вопроса
router.patch('/question/:questionId', checkRole('ADMIN'), TestController.updateQuestionFields); // обновление вопроса
router.delete('/question/:questionId', checkRole('ADMIN'), TestController.deleteQuestion); // удаление вопроса

router.post('/answer', checkRole('ADMIN'), TestController.createAnswer); // создание болванки ответа
router.patch('/answer/:answerId', checkRole('ADMIN'), TestController.updateAnswerFields); // обновление ответа
router.delete('/answer/:answerId', checkRole('ADMIN'), TestController.deleteAnswer); // удаление ответа

router.post('/:testId/attempts', TestController.submitTestAttempt); // пользователь отправляет попытку
router.get('/:testId/attempts', TestController.getAllAttempts); // список всех попыток пользователя по тесту
router.get('/attempt/:attemptId', TestController.getAttemptById);   // получение конкретной попытки с разбором


module.exports = router;