const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { tutorialService } = require('../services')
const ApiError = require('../../utils/api-error')

const getTutorial = catchAsync(async (req, res) => {
    const tutorial = await tutorialService.getAll(req.body)
    res.status(httpStatus.OK).send({ tutorial })
})

const createTutorial = catchAsync(async (req, res) => {
    const tutorial = await tutorialService.create(req.body)
    res.status(httpStatus.CREATED).send({ tutorial })
})

const createTutorialVersion = catchAsync(async (req, res) => {
    const tutorialVersion = await tutorialService.createVersion(req.body)
    res.status(httpStatus.CREATED).send({ tutorialVersion })
})

const getTutorialVersion = catchAsync(async (req, res) => {
    const tutorialVersion = await tutorialService.getVersion(req.body)
    res.status(httpStatus.OK).send({ tutorialVersion })
})


module.exports = {
    getTutorial,
    createTutorial,
    createTutorialVersion,
    getTutorialVersion, 
}
