const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { examService } = require('../services')
const ApiError = require('../../utils/api-error')

const getExamById = catchAsync(async (req, res) => {
    const exam = await examService.getById({
        ...req.query,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const getExamList = catchAsync(async (req, res) => {
    const exam = await examService.getAll(req.query)
    res.status(httpStatus.OK).send({ exam })
})

const createExam = catchAsync(async (req, res) => {
    const exam = await examService.create(req.body)
    res.status(httpStatus.CREATED).send({ exam })
})

const updateExam = catchAsync(async (req, res) => {
    const exam = await examService.update(req.body)
    res.status(httpStatus.CREATED).send({ exam })
})

const deleteExam = catchAsync(async (req, res) => {
    const exam = await examService.deleteExam(req.query)
    res.status(httpStatus.OK).send({ exam })
})

const getExamInformation = catchAsync(async (req, res) => {
    const exam = await examService.getExamInformation({
        ...req.query,
        user: req.user
    })
    res.status(httpStatus.OK).send({ exam })
})

const createExamSession = catchAsync(async (req, res) => {
    const exam = await examService.createExamSession(req.body)
    res.status(httpStatus.OK).send({ exam })
})

const updateResult = catchAsync(async (req, res) => {
    const exam = await examService.updateResult({
        ...req.body,
        user: req.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const submitResult = catchAsync(async (req, res) => {
    const exam = await examService.submitResult({ ...req.body, user: req?.user || req?.body?.user })
    res.status(httpStatus.OK).send({ exam })
})

const getCurrentExam = catchAsync(async (req, res) => {
    const exam = await examService.getCurrentExam({
        ...req.query,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const getResult = catchAsync(async (req, res) => {
    const exam = await examService.getResult({
        ...req.body,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const getHistory = catchAsync(async (req, res) => {
    const exam = await examService.getHistory({ user: req?.user })
    res.status(httpStatus.OK).send({ exam })
})

const createRandomExamSession = catchAsync(async (req, res) => {
    const exam = await examService.createRandomExam({
        ...req.body,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const createRandomExamSessionByTopic = catchAsync(async (req, res) => {
    const exam = await examService.createRandomExamByTopic({
        ...req.body,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const getCurrentRandomExam = catchAsync(async (req, res) => {
    const exam = await examService.getCurrentRandomExam({
        ...req.query,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const getPredictMark = catchAsync(async (req, res) => {
    const exam = await examService.getPredictMark({
        ...req.query,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const getHistoryByExamId = catchAsync(async (req, res) => {
    const exam = await examService.getHistoryByExamId({ ...req?.query, user: req?.user })
    res.status(httpStatus.OK).send({ exam })
})

const getExamStatistic = catchAsync(async (req, res) => {
    const exam = await examService.getExamStatistic({
        ...req.query,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})

const getTopicExamOverview = catchAsync(async (req, res) => {
    const exam = await examService.getTopicOverview({
        ...req.query,
        user: req?.user,
    })
    res.status(httpStatus.OK).send({ exam })
})


module.exports = {
    getExamById,
    getExamList,
    createExam,
    updateExam,
    deleteExam,
    createExamSession,
    getExamInformation,
    updateResult,
    submitResult,
    getCurrentExam,
    getResult,
    getHistory,
    createRandomExamSession,
    getCurrentRandomExam,
    createRandomExamSessionByTopic,
    getPredictMark,
    getHistoryByExamId,
    getExamStatistic,
    getTopicExamOverview,
}
