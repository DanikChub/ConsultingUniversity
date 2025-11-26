const Router = require('express');
const router = new Router();
const eventController = require('../controllers/eventController')



router.get('/getAll', eventController.getAll)
router.get('/delete/:id', eventController.deleteEvent)
router.post('/delete', eventController.deleteEvents)
router.post('/create', eventController.create)

module.exports = router;