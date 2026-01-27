const Router = require('express');
const router = new Router();

const ProgramController = require('../controllers/programController');
const checkRole = require('../middleware/checkRoleMiddleware');

// ---------- Programs ----------
router.post('/', ProgramController.create); // Создать программу
router.post('/:id/import', ProgramController.importProgramZip);
router.patch('/:id', ProgramController.updatePartial); // Частичное обновление программы
router.get('/', ProgramController.getAll); // Получить все программы

router.patch('/:id/img', ProgramController.updateImage); // Получить все программы
router.delete('/:id/img', ProgramController.destroyImage); // Получить все программы

router.get('/published', ProgramController.getAllPublishedPrograms); // Получить все программы
router.get('/draft', ProgramController.getAllDraftPrograms);
router.get('/:id', ProgramController.getOne); // Получить одну программу
router.post('/:id/publish', ProgramController.publishProgram); // Публикация программы
router.delete('/:id', ProgramController.deleteProgram); // Удаление программы

// ---------- Themes ----------
router.post('/:id/themes', ProgramController.createTheme); // Создать тему в программе
router.patch('/theme/:id', ProgramController.updateThemeTitle); // Обновить название темы
router.delete('/theme/:id', ProgramController.deleteTheme); // Удалить тему

router.get('/theme/:id', ProgramController.getOneTheme); // Получить одну тему

// ---------- Puncts ----------
router.post('/punct/move/:id', ProgramController.movePunct);
router.post('/theme/:id/puncts', ProgramController.createPunct);
router.patch('/punct/:id', ProgramController.updatePunctTitle); // Обновить название пункта
router.delete('/punct/:id', ProgramController.deletePunct); // Удалить пункт
router.get('/punct/:id', ProgramController.getOnePunct); // Получить один пункт

// ---------- Files ----------
router.patch('/file/:id', ProgramController.updateFileName);
router.post('/file/:id/move', ProgramController.moveFile);
router.delete('/file/:id', ProgramController.deleteFile); // Удалить файл
router.post('/file', ProgramController.addFileToPunctOrTheme); // Добавить файл к пункту или теме


module.exports = router;