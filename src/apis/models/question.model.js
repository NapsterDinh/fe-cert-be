const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            trim: true,
        },
        question: {
            type: String,
            trim: true,
        },
        explanation: {
            type: String,
            trim: true,
        },
        topic:  {
            type: Schema.Types.ObjectId,
            ref: 'Topic' 
        },
        section: {
            type: Schema.Types.ObjectId,
            ref: 'TopicSection' 
        },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: 'TopicLesson' 
        },
        parent: {
            type: String,
            ref: 'Question' 
        },
        choices: [{ type: Schema.Types.ObjectId, ref: 'QuestionItem' }],
        answer: { type: Schema.Types.ObjectId, ref: 'QuestionItem' },
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

module.exports = mongoose.model('Question', questionSchema)
