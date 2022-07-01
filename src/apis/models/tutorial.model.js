const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tutorialSchema = new mongoose.Schema(
    {
        nameAuthor: {
            type: String,
            trim: true,
        },
        title: {
            type: String,
            trim: true,
        },
        metaTitle: {
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
        
        metaDescription: {
            type: String,
            trim: true,
        },
        metaKeyWord: {
            type: String,
            trim: true,
        },
        metaLink: {
            type: String,
            trim: true,
        },
        body: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            trim: true,
        },
        tag: {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
        },
        allowComment: {
            type: Boolean,
            trim: true,
            default: true,
        },
        totalViews: {
            type:  Number,
            default: 0,
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
    
module.exports = mongoose.model('Tutorial', tutorialSchema)
