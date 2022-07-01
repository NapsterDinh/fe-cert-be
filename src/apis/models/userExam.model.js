const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { examStatusTypes } = require('../../configs/enum')

const userExamSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        exam: {
            type: Schema.Types.ObjectId,
            ref: 'Exam',
        },
        submissions: [{
            type: Schema.Types.ObjectId,
            ref: 'Submission',
        }],
        no: {
            type: Number,
        },
        status: {
            type: String,
            enum: [examStatusTypes.PROGRESSING, examStatusTypes.DONE],
            default: examStatusTypes.PROGRESSING,
            required: true,
        },
        isPassed: {
            type: Boolean,
            default: false,
        },
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

module.exports = mongoose.model('UserExam', userExamSchema)
