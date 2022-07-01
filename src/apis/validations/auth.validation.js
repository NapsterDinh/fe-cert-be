const Joi = require('joi')

const { password } = require('./customize.validation')

const loginSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

const logoutSchema = {
    body: Joi.object().keys({
        accessToken: Joi.string().required(),
        refreshToken: Joi.string().required(),
    }),
}

const registerSchema = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
}

const refreshSchema = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
}

module.exports = {
    loginSchema,
    logoutSchema,
    registerSchema,
    refreshSchema,
}
