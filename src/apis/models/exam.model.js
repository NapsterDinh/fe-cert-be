const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { examTypes } = require('../../configs/enum')


const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        time: {
            type: Number,
            trim: true,
        },
        isPublic: {
            type: String,
            trim: true,
        },
        isSessionMorning: {
            type: Boolean,
            trim: true,
        },
        eventDate: {
            type: Date,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        totalQuestions: {
            type: Number,
            trim: true,
        },
        numberPass: {
            type: Number,
            trim: true,
        },
        numberExaminees: {
            type: Number,
            default: 0,
        },
        maxTotalTests: {
            type: Number,
            trim: true,
        },
        hasCheckTab: {
            type: Number,
            trim: true,
        },
        hasShowExplanation: {
            type: Boolean,
            trim: true,
        },
        hasShowRightAnswer: {
            type: Boolean,
            trim: true,
        },
        showRanking: {
            type: Boolean,
            trim: true,
        },
        type: {
            type: String,
            enum: [examTypes.PRACTICE, examTypes.EXAM, examTypes.NORMAL_PRACTICE, examTypes.TOPIC_PRACTICE],
            default: examTypes.EXAM,
        },
        questions: [{
            type: Schema.Types.ObjectId,
            ref: 'Question',
        }],
        isDeleted: {
            type: Boolean,
            trim: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Exam', examSchema)
