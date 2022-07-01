const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')
const { Modules, ModuleVersion } = require('../models')

const getAll = async () => {
    return await Modules.find({ isDeleted: false })
}

const create = async (body) => {
    return await Modules.create(body)
}

const getVersion = async () => {
    return await ModuleVersion.find({ isDeleted: false }).sort({_id: -1}).limit(1)
}

const createVersion = async (body) => {
    return await ModuleVersion.create(body)
}

module.exports = {
    getAll,
    create,
    getVersion,
    createVersion
}
