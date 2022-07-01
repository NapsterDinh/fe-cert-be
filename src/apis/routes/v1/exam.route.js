const express = require('express')

const { examController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const authOptionalMiddleware = require('../../../middlewares/authOptional')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/list', examController.getExamList)
router.get('/', authOptionalMiddleware, examController.getExamById)
router.post('/', authenticateMiddleware, examController.createExam)
router.get('/session', authenticateMiddleware, examController.getExamInformation)
router.get('/current-session', authenticateMiddleware, examController.getCurrentExam)
router.post('/create-session', authenticateMiddleware, examController.createExamSession)
router.post('/update-result', authenticateMiddleware, examController.updateResult)
router.post('/result', authenticateMiddleware, examController.getResult)
router.post('/submit', authOptionalMiddleware, examController.submitResult)
router.put('/', authenticateMiddleware, examController.updateExam)
router.delete('/', authenticateMiddleware, adminMiddleware, examController.deleteExam)
router.get('/history', authenticateMiddleware, examController.getHistory)
router.post('/create-random-session', authenticateMiddleware, examController.createRandomExamSession)
router.get('/current-random-session', authenticateMiddleware, examController.getCurrentRandomExam)
router.post('/create-random-topic-session', authenticateMiddleware, examController.createRandomExamSessionByTopic)
router.get('/predict', authenticateMiddleware, examController.getPredictMark)
router.get('/history-by-id', authenticateMiddleware, examController.getHistoryByExamId)
router.get('/statistic', authenticateMiddleware, examController.getExamStatistic)
router.get('/topic/statistic', authenticateMiddleware, examController.getTopicExamOverview)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Exam
 *   description: Exam
 */

/**
 * @swagger
 * /v1/exam/{id}:
 *   get:
 *     summary: Get list of exam
 *     tags: [Exam]
 *     responses:
 *       "200":
 *         description: OK
 *   post:
 *     summary: Create a new exam
 *     tags: [Exam]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
