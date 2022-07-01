const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')
const { Questions, QuestionItems, Exams } = require('../models')

const getAll = async () => {
    return await Questions.find({ isDeleted: false }).populate('choices')
}

const getById = async ({ _id }) => {
    return await Questions.find({ _id, isDeleted: false }).populate('choices')
}

const create = async ({ choices, answer, ...rest }) => {
    choices = await Promise.all(
        choices.map(async (item) => {
            const questionItem = await QuestionItems.create({ label: item?.label })
            if (item?._id === answer?._id) {
                answer = {
                    _id: questionItem._id,
                }
            }

            return {
                _id: questionItem._id,
            }
        })
    )
    return await Questions.create({
        choices,
        answer,
        ...rest,
    })
}

const update = async ({ _id, choices, ...rest }) => {
    choices = await Promise.all(
        choices.map(async (item) => {
            await QuestionItems.findOneAndUpdate({ _id: item._id }, { label: item?.label })
        })
    )
    return await Questions.findOneAndUpdate({ _id, isDeleted: false }, { ...rest })
}

const deleteQuestion = async ({ _id }) => {
    return await Questions.findOneAndUpdate({ _id }, { isDeleted: true })
}

const addQuestionToExam = async ({ choices, answer, examId,...rest }) => {
    const question = await create({choices, answer, ...rest});

    result = await Exams.findOneAndUpdate(
        { _id: examId, isDeleted: false },
        {
            $push: { questions: { _id: question._id } },
        }
    )
}

module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteQuestion,
    addQuestionToExam,
}
