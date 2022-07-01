const mongoose = require('mongoose')
const { sectionTypes } = require('../../configs/enum')
const Schema = mongoose.Schema

const abilitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        isDefault: {
            type: Boolean,
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

module.exports = mongoose.model('Ability', abilitySchema)
