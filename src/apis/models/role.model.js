const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new mongoose.Schema(
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

roleSchema.statics.isRoleExist = async function (name) {
    const role = await this.findOne({ roleName: name })
    return !!role
}

module.exports = mongoose.model('Role', roleSchema)
