const express = require('express')

const { questionController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/', authenticateMiddleware,questionController.getQuestionById)
router.get('/list', authenticateMiddleware,questionController.getQuestionList)
router.post('/', authenticateMiddleware,questionController.createQuestion)
router.put('/', authenticateMiddleware,questionController.updateQuestion)
router.delete('/', authenticateMiddleware, adminMiddleware, questionController.deleteQuestion)
router.post('/with-exam', authenticateMiddleware,questionController.createQuestionWithExam)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Question
 *   description: Question
 */

/**
 * @swagger
 * /v1/question/{id}:
 *   get:
 *     summary: Get list of question
 *     tags: [Question]
 *     responses:
 *       "200":
 *         description: OK
 *   post:
 *     summary: Create a new question
 *     tags: [Question]
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