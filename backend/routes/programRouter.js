const Router = require('express');
const router = new Router();

const ProgramController = require('../controllers/programController');
const checkRole = require('../middleware/checkRoleMiddleware');
const checkProgramAccess = require('../middleware/checkProgramAccess')
const checkFileAccess = require('../middleware/checkFileAccess')
const authMiddleware = require('../middleware/authMiddleware')

// ---------- Programs ----------
router.post('/', checkRole('ADMIN'), ProgramController.create); // Создать программу
router.post('/:id/import', checkRole('ADMIN'), ProgramController.importProgramZip);
router.patch('/:id', checkRole('ADMIN'), ProgramController.updatePartial); // Частичное обновление программы
router.get('/', checkRole(['ADMIN', 'VIEWER']), ProgramController.getAll); // Получить все программы

router.patch('/:id/img', checkRole('ADMIN'), ProgramController.updateImage); // Получить все программы
router.delete('/:id/img', checkRole('ADMIN'), ProgramController.destroyImage); // Получить все программы

router.get('/published', checkRole(['ADMIN', 'VIEWER']), ProgramController.getAllPublishedPrograms); // Получить все программы
router.get('/draft', checkRole(['ADMIN', 'VIEWER']), ProgramController.getAllDraftPrograms);
router.get('/:id', authMiddleware, checkProgramAccess, ProgramController.getOne); // Получить одну программу
router.post('/:id/publish', checkRole('ADMIN'), ProgramController.publishProgram); // Публикация программы
router.delete('/:id', checkRole('ADMIN'), ProgramController.deleteProgram); // Удаление программы

// ---------- Themes ----------
router.post('/:id/themes', checkRole('ADMIN'), ProgramController.createTheme); // Создать тему в программе
router.patch('/theme/:id', checkRole('ADMIN'), ProgramController.updateThemeTitle); // Обновить название темы
router.delete('/theme/:id', checkRole('ADMIN'), ProgramController.deleteTheme); // Удалить тему

router.get('/theme/:id', ProgramController.getOneTheme); // Получить одну тему

// ---------- Puncts ----------
router.post('/punct/move/:id', checkRole('ADMIN'), ProgramController.movePunct);
router.post('/theme/:id/puncts', checkRole('ADMIN'), ProgramController.createPunct);
router.patch('/punct/:id', checkRole('ADMIN'), ProgramController.updatePunctTitle); // Обновить название пункта
router.patch('/punct/:id/description', checkRole('ADMIN'), ProgramController.updatePunctDescription); // Обновить название пункта
router.delete('/punct/:id', checkRole('ADMIN'), ProgramController.deletePunct); // Удалить пункт
router.get('/punct/:id', ProgramController.getOnePunct); // Получить один пункт

// ---------- Files ----------
router.patch('/file/:id', checkRole('ADMIN'), ProgramController.updateFileName);
router.get('/file/:id', authMiddleware, checkFileAccess, ProgramController.getFile);
router.post('/file/:id/move', checkRole('ADMIN'), ProgramController.moveFile);
router.delete('/file/:id', checkRole('ADMIN'), ProgramController.deleteFile); // Удалить файл
router.post('/file', checkRole('ADMIN'), ProgramController.addFileToPunctOrTheme); // Добавить файл к пункту или теме


module.exports = router;