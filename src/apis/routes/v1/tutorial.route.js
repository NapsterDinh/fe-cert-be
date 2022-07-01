const express = require('express')

const { tutorialController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/', authenticateMiddleware,tutorialController.getTutorial)
router.post('/', authenticateMiddleware,tutorialController.createTutorial)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Tutorial
 *   description: Tutorial
 */

/**
 * @swagger
 * /v1/tutorial/{id}:
 *   get:
 *     summary: Get list of tutorial
 *     tags: [Tutorial]
 *     responses:
 *       "200":
 *         description: OK
 *   post:
 *     summary: Create a new tutorial
 *     tags: [Tutorial]
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