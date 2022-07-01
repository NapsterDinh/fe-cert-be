const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { topicService } = require('../services')
const ApiError = require('../../utils/api-error')

const getTopicById = catchAsync(async (req, res) => {
    const topic = await topicService.getById(req.query)
    res.status(httpStatus.OK).send({ topic })
})

const getTopicList = catchAsync(async (req, res) => {
    const topic = await topicService.getAll()
    res.status(httpStatus.OK).send({ topic })
})

const getTopicFullList = catchAsync(async (req, res) => {
    const topic = await topicService.getFull()
    res.status(httpStatus.OK).send({ topic })
})

const createTopic = catchAsync(async (req, res) => {
    const topic = await topicService.create(req.body)
    res.status(httpStatus.CREATED).send({ topic })
})

const updateTopic = catchAsync(async (req, res) => {
    const topic = await topicService.update(req.body)
    res.status(httpStatus.CREATED).send({ topic })
})

const deleteTopic = catchAsync(async (req, res) => {
    const topic = await topicService.deleteTopic(req.query)
    res.status(httpStatus.OK).send({ topic })
})

const getTopicSectionById = catchAsync(async (req, res) => {
    const topicSection = await topicService.getSectionById(req.query)
    res.status(httpStatus.OK).send({ topicSection })
})

const getTopicSectionList = catchAsync(async (req, res) => {
    const topicSection = await topicService.getAllSection()
    res.status(httpStatus.OK).send({ topicSection })
})

const createTopicSection = catchAsync(async (req, res) => {
    const topicSection = await topicService.createSection(req.body)
    res.status(httpStatus.CREATED).send({ topicSection })
})

const updateTopicSection = catchAsync(async (req, res) => {
    const topicSection = await topicService.updateSection(req.body)
    res.status(httpStatus.CREATED).send({ topicSection })
})

const deleteTopicSection = catchAsync(async (req, res) => {
    const topicSection = await topicService.deleteSection(req.query)
    res.status(httpStatus.OK).send({ topicSection })
})

const getTopicLessonById = catchAsync(async (req, res) => {
    const topicLesson = await topicService.getLessonById(req.query)
    res.status(httpStatus.OK).send({ topicLesson })
})

const getTopicLessonList = catchAsync(async (req, res) => {
    const topicLesson = await topicService.getAllLesson()
    res.status(httpStatus.OK).send({ topicLesson })
})

const createTopicLesson = catchAsync(async (req, res) => {
    const topicLesson = await topicService.createLesson(req.body)
    res.status(httpStatus.CREATED).send({ topicLesson })
})

const updateTopicLesson = catchAsync(async (req, res) => {
    const topicLesson = await topicService.updateLesson(req.body)
    res.status(httpStatus.CREATED).send({ topicLesson })
})

const deleteTopicLesson = catchAsync(async (req, res) => {
    const topicLesson = await topicService.deleteLesson(req.query)
    res.status(httpStatus.OK).send({ topicLesson })
})

const getTopicSectionByNonId = catchAsync(async (req, res) => {
    const topicSection = await topicService.getSectionByNonId(req.query)
    res.status(httpStatus.OK).send({ topicSection })
})

const getTopicFullWithDeleted = catchAsync(async (req, res) => {
    const topic = await topicService.getWithDeleted()
    res.status(httpStatus.OK).send({ topic })
})

module.exports = {
    getTopicById,
    getTopicList,
    createTopic,
    updateTopic,
    deleteTopic, 
    getTopicSectionById,
    getTopicSectionList,
    createTopicSection,
    updateTopicSection,
    deleteTopicSection,
    getTopicLessonById,
    getTopicLessonList,
    createTopicLesson,
    updateTopicLesson,
    deleteTopicLesson,
    getTopicSectionByNonId,
    getTopicFullList,
    getTopicFullWithDeleted,
}
