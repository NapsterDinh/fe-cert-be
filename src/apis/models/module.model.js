const mongoose = require('mongoose')
const Schema = mongoose.Schema

const moduleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        numberOfLessons: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        blog: [{
            type: Schema.Types.ObjectId,
            ref: 'Blog',
        }],
        tutorial: [{
            type: Schema.Types.ObjectId,
            ref: 'Tutorial',
        }],
        question: [{
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

module.exports = mongoose.model('Module', moduleSchema)
