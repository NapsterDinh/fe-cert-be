const jwt = require('jsonwebtoken')
const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')

const { Users, Roles, UserPricing } = require('../models')
const tokenService = require('./token.service')
const { sendMail } = require('./mail.service')
const env = require('../../configs/env')

const { FACEBOOK_SECRET, MAILING_SERVICE_CLIENT_ID, GOOGLE_SECRET, APP_SCHEMA, APP_HOST, CLIENT_PORT } = process.env
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const client = new OAuth2(MAILING_SERVICE_CLIENT_ID)
const fetch = require('node-fetch')
const { pricingTypes, userStatusTypes } = require('../../configs/enum')

const createUser = async (userBody) => {
    if (await Users.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    const userRole = await Roles.findOne({ where: { name: 'user', isDeleted: false } })
    const result = await Users.create({
        ...userBody,
        role: userRole._id.toString(),
    })
    return result
}

const login = async (email, password) => {
    const user = await getUserByEmail(email)
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
    }

    const pricing = await UserPricing.findOne({
        user: user?._id?.toString(),
        status: pricingTypes.VALID,
    })
        .populate({ path: 'pricing' })
        .lean()

    if (pricing) {
        return {
            user,
            pricing,
        }
    }

    return user
}

const getUserByEmail = async (email) => {
    return await Users.findOne({ email, isDeleted: false }).populate('role')
}

const getUserById = async (_id) => {
    return await Users.findOne({ _id, isDeleted: false }).populate('role')
}

const logout = async (refreshToken) => {
    const refreshTokenDoc = await tokenService.getTokenByRefresh(refreshToken)
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found')
    }
    await refreshTokenDoc.remove()
    return true
}

const refreshToken = async (data) => {
    const { refreshToken } = data

    const oldRefresh = await tokenService.getTokenByRefresh(refreshToken)
    const oldRefreshToken = jwt.verify(oldRefresh?.token, env.passport.jwtToken)

    if (!oldRefreshToken || oldRefreshToken.exp < moment().unix()) {
        return null
    }

    const user = await getUserById(oldRefreshToken.sub)

    return user
}

const getAll = async () => {
    return await Users.find({ isDeleted: false })
}

const deleteUser = async (_id) => {
    return await Users.findOneAndUpdate({ _id }, { isDeleted: true })
}

const googleLogin = async (data) => {
    const { tokenId } = data
    const result = await client.verifyIdToken({
        idToken: tokenId,
        audience: MAILING_SERVICE_CLIENT_ID,
    })
    const { email_verified, email, name, picture } = result?.payload

    if (!email_verified) {
        return {
            result: false,
            msg: 'Email verification failed. ',
        }
    }

    const user = await Users.findOne({ email, isDeleted: false }).populate('role')

    if (user) {
        const token = await tokenService.generateAuthTokens(user)

        const pricing = await UserPricing.findOne({
            user: user?._id?.toString(),
            status: pricingTypes.VALID,
        })
            .populate({ path: 'pricing' })
            .lean()
    
        if (pricing) {
            return {
                user,
                token,
                pricing,
            }
        }

        return { user, token }
    }

    const newUser = await Users.create({
        name,
        email,
        avatar: picture,
        password: email + GOOGLE_SECRET,
        isEmailVerified: email_verified,
        phone: 0,
    })

    const token = await tokenService.generateAuthTokens(newUser)

    return { user: newUser, token, pricing: null  }
}

const facebookLogin = async (body) => {
    const { email, name, picture } = body
    const user = await Users.findOne({ email, isDeleted: false }).populate('role')

    if (user) {
        const token = await tokenService.generateAuthTokens(user)

        const pricing = await UserPricing.findOne({
            user: user?._id?.toString(),
            status: pricingTypes.VALID,
        })
            .populate({ path: 'pricing' })
            .lean()
    
        if (pricing) {
            return {
                user,
                token,
                pricing,
            }
        }

        return { user, token }
    }

    const newUser = await Users.create({
        name,
        email,
        avatar: picture,
        password: email + FACEBOOK_SECRET,
        isEmailVerified: true,
    })

    const token = await tokenService.generateAuthTokens(newUser)

    return { user: newUser, token, pricing: null }
}

const forgotPassword = async (data) => {
    const { email } = data
    const user = await Users.findOne({ email, isDeleted: false })

    if (!user) {
        return {
            result: false,
            msg: 'Email is not found ',
        }
    }

    const token = await tokenService.generateAuthTokens(user)

    sendMail(
        email,
        `${APP_SCHEMA}://${APP_HOST}:${CLIENT_PORT}/reset-password/${token.access.token}`,
        'Verify your email address'
    )
    return true
}

const resetPassword = async (data) => {
    const { password } = data.body

    const hashPassword = await bcrypt.hash(password, 10)

    await Users.findOneAndUpdate(
        { _id: data.user.sub },
        {
            password: hashPassword,
        }
    )
}

const updateStatusUser = async ({ user, status }) => {
    await Users.findOneAndUpdate(
        { _id: user?.sub, isDeleted: false },
        {
            status,
        }
    )
}

module.exports = {
    createUser,
    login,
    googleLogin,
    facebookLogin,
    getUserByEmail,
    refreshToken,
    logout,
    getUserById,
    getAll,
    deleteUser,
    forgotPassword,
    resetPassword,
    updateStatusUser,
}
