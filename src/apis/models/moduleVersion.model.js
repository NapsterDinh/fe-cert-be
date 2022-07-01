const mongoose = require('mongoose')
const Schema = mongoose.Schema

const moduleVersionSchema = new mongoose.Schema(
    {
        structure: {
            type: String,
            trim: true,
        },
        version: {
            type: Number,
            default: 1,
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

module.exports = mongoose.model('ModuleVersion', moduleVersionSchema)
