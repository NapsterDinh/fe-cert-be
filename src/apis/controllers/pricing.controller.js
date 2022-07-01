const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { pricingService, tokenService } = require('../services')
const ApiError = require('../../utils/api-error')

const getAll = catchAsync(async (req, res) => {
    const pricing = await pricingService.getAll()
    res.send({ pricing })
})

const getById = catchAsync(async (req, res) => {
    const pricing = await pricingService.getById(req.query)
    res.send({ pricing })
})

const createPricing = catchAsync(async (req, res) => {
    const pricing = await pricingService.createPricing(req.body)
    res.send({ pricing })
})

const updatePricing = catchAsync(async (req, res) => {
    const pricing = await pricingService.updatePricing(req.body)
    res.send({ pricing })
})

const deletePricing = catchAsync(async (req, res) => {
    const pricing = await pricingService.deletePricing(req.query)
    res.send({ pricing })
})

const getAllAbility = catchAsync(async (req, res) => {
    const ability = await pricingService.getAllAbility()
    res.send({ ability })
})

const getAbilityById = catchAsync(async (req, res) => {
    const ability = await pricingService.getAbilityById(req.query)
    res.send({ ability })
})

const createAbility = catchAsync(async (req, res) => {
    const ability = await pricingService.createAbility(req.body)
    res.send({ ability })
})

const updateAbility = catchAsync(async (req, res) => {
    const ability = await pricingService.updateAbility(req.body)
    res.send({ ability })
})

const deleteAbility = catchAsync(async (req, res) => {
    const ability = await pricingService.deleteAbility(req.query)
    res.send({ ability })
})

const payForSubscription = catchAsync(async (req, res) => {
    const ability = await pricingService.payForSubscription({
        ...req.body,
        user: req?.user,
    })
    res.send({ ability })
})

const paySuccess = catchAsync(async (req, res) => {
    const ability = await pricingService.paySuccess(req.query)
    res.redirect(
        `http://localhost:3000/result-checkout/success?pricing=${ability?.pricing?.toString()}&userPricing=${ability?._id?.toString()}`
    )
})

const getAllPurchase = catchAsync(async (req, res) => {
    const userPricing = await pricingService.getAllPurchase({
        _id: req.user?.sub
    })
    res.send({ userPricing })
})

const getAllUserPurchase = catchAsync(async (req, res) => {
    const userPricing = await pricingService.getAllUserPurchase()
    res.send({ userPricing })
})

const submitExpires = catchAsync(async (req, res) => {
    const userPricing = await pricingService.submitExpires(req.body)
    res.send({ userPricing })
})

module.exports = {
    getAll,
    createPricing,
    updatePricing,
    deletePricing,
    getById,
    getAllAbility,
    createAbility,
    updateAbility,
    deleteAbility,
    getAbilityById,
    payForSubscription,
    paySuccess,
    getAllPurchase,
    getAllUserPurchase,
    submitExpires,
}
