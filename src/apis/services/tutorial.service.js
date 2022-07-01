const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')
const { Tutorials, TutorialVersion } = require('../models')

const getAll = async () => {
    return await Tutorials.find({ isDeleted: false })
}

const create = async (body) => {
    return await Tutorials.create(body)
}

const getVersion = async () => {
    return await TutorialVersion.find({ isDeleted: false }).sort({_id: -1}).limit(1)
}

const createVersion = async (body) => {
    return await TutorialVersion.create(body)
}

module.exports = {
    getAll,
    create,
    getVersion,
    createVersion,
}
