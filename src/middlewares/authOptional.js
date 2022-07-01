const jwt = require('jsonwebtoken')
const ApiError = require('../utils/api-error')
const httpStatus = require('http-status')

const authOptional = (req, res, next) => {
    try {
        const token = req.header('Authorization')

        if (!!token) {
            jwt.verify(token, process.env.JWT, (err, user) => {
                if (err) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authentication')
                req.user = user

                next()
            })
        } else {
            next()
        }

    } catch (err) {
        return res.status(err.statusCode).send({ msg: err.message })
    }
}

module.exports = authOptional
