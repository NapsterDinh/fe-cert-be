const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new mongoose.Schema(
    {
        name: {
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

module.exports = mongoose.model('Tag', tagSchema)
