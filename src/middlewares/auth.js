const jwt = require('jsonwebtoken')
const ApiError = require('../utils/api-error')
const httpStatus = require('http-status')

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')

        if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authentication')

        jwt.verify(token, process.env.JWT, (err, user) => {
            if (err) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authentication')
            req.user = user

            next()
        })
    } catch (err) {
        return res.status(err.statusCode).send({ msg: err.message })
    }
}

module.exports = auth
