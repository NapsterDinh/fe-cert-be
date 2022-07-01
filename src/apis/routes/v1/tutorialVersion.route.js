const express = require('express')

const { tutorialController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/', authenticateMiddleware,tutorialController.getTutorialVersion)
router.post('/', authenticateMiddleware,tutorialController.createTutorialVersion)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Tutorial Version
 *   description: Tutorial Version
 */

/**
 * @swagger
 * /v1/tutorial-version/{id}:
 *   get:
 *     summary: Get list of tutorial version
 *     tags: [Tutorial Version]
 *     responses:
 *       "200":
 *         description: OK
 *   post:
 *     summary: Create a new tutorial version
 *     tags: [Tutorial Version]
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