const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { questionService } = require('../services')
const ApiError = require('../../utils/api-error')

const getQuestionById = catchAsync(async (req, res) => {
    const question = await questionService.getById(req.query)
    res.status(httpStatus.OK).send({ question })
})

const getQuestionList = catchAsync(async (req, res) => {
    const question = await questionService.getAll()
    res.status(httpStatus.OK).send({ question })
})

const createQuestion = catchAsync(async (req, res) => {
    const question = await questionService.create(req.body)
    res.status(httpStatus.CREATED).send({ question })
})

const createQuestionWithExam = catchAsync(async (req, res) => {
    const question = await questionService.addQuestionToExam(req.body)
    res.status(httpStatus.CREATED).send({ question })
})

const updateQuestion = catchAsync(async (req, res) => {
    const question = await questionService.update(req.body)
    res.status(httpStatus.CREATED).send({ question })
})

const deleteQuestion = catchAsync(async (req, res) => {
    const question = await questionService.deleteQuestion(req.query)
    res.status(httpStatus.OK).send({ question })
})

module.exports = {
    getQuestionById,
    getQuestionList,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createQuestionWithExam,
}
