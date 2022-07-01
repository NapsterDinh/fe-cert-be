const mongoose = require('mongoose')
const { sectionTypes } = require('../../configs/enum')
const Schema = mongoose.Schema

const pricingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Schema.Types.Decimal128,
            default: 0,
        },
        abilities: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Ability',
            },
        ],
        status: {
            type: String,
            enum: [sectionTypes.PUBLIC, sectionTypes.PRIVATE, sectionTypes.COMING_SOON],
            default: sectionTypes.PRIVATE,
        },
        duration: {
            type: Number,
            trim: true,
        },
        numberOfPayment: {
            type: Number,
            default: 0,
        },
        revenue: {
            type: Schema.Types.Decimal128,
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

module.exports = mongoose.model('Pricing', pricingSchema)
