const express = require('express')

const { moduleController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/', authenticateMiddleware,moduleController.getModule)
router.post('/', authenticateMiddleware,moduleController.createModule)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Module
 *   description: Module
 */

/**
 * @swagger
 * /v1/module/{id}:
 *   get:
 *     summary: Get list of module
 *     tags: [Module]
 *     responses:
 *       "200":
 *         description: OK
 *   post:
 *     summary: Create a new module
 *     tags: [Module]
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