const mongoose = require('mongoose')
const { pricingTypes } = require('../../configs/enum')
const Schema = mongoose.Schema

const userPricingSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        pricing: {
            type: Schema.Types.ObjectId,
            ref: 'Pricing',
        },
        status: {
            type: String,
            enum: [pricingTypes.VALID, pricingTypes.EXPIRE],
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
        expireDate: {
            type: Date,
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

module.exports = mongoose.model('UserPricing', userPricingSchema)
