const express = require('express')

const { pricingController } = require('../../controllers')
const router = express.Router()
const authenticateMiddleware = require('../../../middlewares/auth')
const adminMiddleware = require('../../../middlewares/adminAuth')

router.get('/list', pricingController.getAll)
router.get('/', pricingController.getById)
router.put('/', authenticateMiddleware, pricingController.updatePricing)
router.post('/', authenticateMiddleware, pricingController.createPricing)
router.delete('/', authenticateMiddleware, adminMiddleware, pricingController.deletePricing)

router.get('/ability/list', pricingController.getAllAbility)
router.get('/ability', pricingController.getAbilityById)
router.put('/ability', authenticateMiddleware, pricingController.updateAbility)
router.post('/ability', authenticateMiddleware, pricingController.createAbility)
router.delete('/ability', authenticateMiddleware, adminMiddleware, pricingController.deleteAbility)

router.post('/pay', authenticateMiddleware, pricingController.payForSubscription)
router.get('/pay/success', pricingController.paySuccess)
router.get('/get-user-purchase', authenticateMiddleware, pricingController.getAllPurchase)
router.get('/get-all-purchase', authenticateMiddleware, pricingController.getAllUserPurchase)

router.post('/expire', pricingController.submitExpires)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Pricing
 *   description: Pricing
 */

/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Pricing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: object
 *                 properties:
 *                   name:
 *                     name: string
 *                     description: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               role:
 *                 name: user
 *                 description: Company HR
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Pricing'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *
 * /v1/user/login:
 *   post:
 *     summary: Login with existing user
 *     tags: [Pricing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: At least one number and one letter
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 * /v1/user:
 *   get:
 *     summary: Get list of users
 *     tags: [Pricing]
 *     responses:
 *       "200":
 *         description: OK
 *   delete:
 *     summary: Remove specified user
 *     tags: [Pricing]
 *     responses:
 *       "200":
 *         description: OK
 */
