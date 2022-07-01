const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { sectionTypes } = require('../../configs/enum')

const topicLessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        body: {
            type: String,
        },
        status: {
            type: String,
            enum: [sectionTypes.PUBLIC, sectionTypes.PRIVATE],
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

module.exports = mongoose.model('TopicLesson', topicLessonSchema)
