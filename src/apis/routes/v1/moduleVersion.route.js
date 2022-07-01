const express = require('express')

const { moduleController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/', authenticateMiddleware,moduleController.getModuleVersion)
router.post('/', authenticateMiddleware,moduleController.createModuleVersion)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Module Version
 *   description: Module Version
 */

/**
 * @swagger
 * /v1/module-version/{id}:
 *   get:
 *     summary: Get list of module version
 *     tags: [Module Version]
 *     responses:
 *       "200":
 *         description: OK
 *   post:
 *     summary: Create a new module version
 *     tags: [Module Version]
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