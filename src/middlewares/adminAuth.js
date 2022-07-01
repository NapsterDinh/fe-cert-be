const jwt = require('jsonwebtoken')
const { userService } = require('../apis/services')
const { roleTypes } = require('../configs/enum')
const ApiError = require('../utils/api-error')
const httpStatus = require('http-status')

const adminAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authentication')

        jwt.verify(token, process.env.JWT, async (err, user) => {
            if (err) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authentication')
                const currentUser = await userService.getUserById(user.sub)

                if (currentUser?.role?.name !== roleTypes.ADMIN) {
                    throw new ApiError(httpStatus.UNAUTHORIZED, 'No Permission to access') 
                }

                next()
        })
    } catch (err) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
}

module.exports = adminAuth
