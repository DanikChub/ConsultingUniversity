
const Router = require('express');
const router = new Router();


const programRouter = require('./programRouter')
const userRouter = require('./userRouter')
const eventRouter = require('./eventRouter')
const application = require('./application');
const testRouter = require('./testRouter');
const statisticRouter = require('./statisticRouter');
const practicalWorkRouter = require('./practicalWorkRouter');
const chatRouter = require('./chatRouter');

router.use('/user', userRouter)
router.use('/event', eventRouter)
router.use('/program', programRouter)
router.use('/application', application)
router.use('/test', testRouter)
router.use('/chat', chatRouter)
router.use('/statistic', statisticRouter)
router.use('/practical_work', practicalWorkRouter)

module.exports = router;