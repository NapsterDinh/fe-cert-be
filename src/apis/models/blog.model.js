const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        tag: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag',
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

module.exports = mongoose.model('Blog', blogSchema)
