const mongoose = require('mongoose')
const Schema = mongoose.Schema

const submissionSchema = new mongoose.Schema(
    {
        answers: {
            type: Schema.Types.ObjectId,
            ref: 'QuestionItem'
        },
        question_id: {
            type: Schema.Types.ObjectId,
            ref: 'Question'
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

module.exports = mongoose.model('Submission', submissionSchema)
