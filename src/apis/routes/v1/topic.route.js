const express = require('express')

const { topicController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/list', topicController.getTopicList)
router.get('/full-list', topicController.getTopicFullList)
router.get('/full-with-deleted', topicController.getTopicFullWithDeleted)
router.get('/', topicController.getTopicById)
router.post('/', authenticateMiddleware, topicController.createTopic)
router.put('/', authenticateMiddleware, topicController.updateTopic)
router.delete('/', authenticateMiddleware, adminMiddleware, topicController.deleteTopic)

router.get('/section/list', topicController.getTopicSectionList)
router.get('/section', topicController.getTopicSectionById)
router.post('/section', authenticateMiddleware, topicController.createTopicSection)
router.put('/section', authenticateMiddleware, topicController.updateTopicSection)
router.delete('/section', authenticateMiddleware, adminMiddleware, topicController.deleteTopicSection)
router.get('/section/by-id', authenticateMiddleware, topicController.getTopicSectionByNonId)

router.get('/lesson/list', topicController.getTopicLessonList)
router.get('/lesson', topicController.getTopicLessonById)
router.post('/lesson', authenticateMiddleware, topicController.createTopicLesson)
router.put('/lesson', authenticateMiddleware, topicController.updateTopicLesson)
router.delete('/lesson', authenticateMiddleware, adminMiddleware, topicController.deleteTopicLesson)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Topic
 *   description: Topic
 */

/**
 * @swagger
 * /v1/topic/{id}:
 *   get:
 *     summary: Get list of topic
 *     tags: [Topic]
 *     responses:
 *       "200":
 *         description: OK
 *   post:
 *     summary: Create a new topic
 *     tags: [Topic]
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
