const Joi = require('joi')

const { password } = require('./customize.validation')

const topicSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

module.exports = {
    topicSchema,
}
