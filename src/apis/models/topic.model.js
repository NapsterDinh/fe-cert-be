const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { sectionTypes } = require('../../configs/enum')

const topicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        objective: {
            type: [String],
            trim: true,
        },
        status: {
            type: String,
            enum: [sectionTypes.PUBLIC, sectionTypes.PRIVATE],
        },
        sections:  [{
            type: Schema.Types.ObjectId,
            ref: 'TopicSection' 
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

module.exports = mongoose.model('Topic', topicSchema)
