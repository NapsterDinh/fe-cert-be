const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionItemSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            trim: true,
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

module.exports = mongoose.model('QuestionItem', questionItemSchema)
