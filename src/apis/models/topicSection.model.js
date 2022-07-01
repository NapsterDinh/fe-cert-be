const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { sectionTypes } = require('../../configs/enum')

const topicSectionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        lessons: [
            {
                type: Schema.Types.ObjectId,
                ref: 'TopicLesson',
            },
        ],
        topic:  {
            type: Schema.Types.ObjectId,
            ref: 'Topic' 
        },
        description: {
            type: String,
            trim: true,
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

module.exports = mongoose.model('TopicSection', topicSectionSchema)
