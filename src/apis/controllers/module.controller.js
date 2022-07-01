const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { moduleService } = require('../services')
const ApiError = require('../../utils/api-error')

const getModule = catchAsync(async (req, res) => {
    const module = await moduleService.getAll(req.body)
    res.status(httpStatus.OK).send({ module })
})

const createModule = catchAsync(async (req, res) => {
    const module = await moduleService.create(req.body)
    res.status(httpStatus.CREATED).send({ module })
})

const createModuleVersion = catchAsync(async (req, res) => {
    const moduleVersion = await moduleService.createVersion(req.body)
    res.status(httpStatus.CREATED).send({ moduleVersion })
})

const getModuleVersion = catchAsync(async (req, res) => {
    const moduleVersion = await moduleService.getVersion(req.body)
    res.status(httpStatus.OK).send({ moduleVersion })
})

module.exports = {
    getModule,
    createModule,
    createModuleVersion,
    getModuleVersion, 
}
