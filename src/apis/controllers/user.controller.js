const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { userService, tokenService } = require('../services')
const ApiError = require('../../utils/api-error')

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body)
    const tokens = await tokenService.generateAuthTokens(user)
    res.status(httpStatus.CREATED).send({ user, tokens })
})

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body
    const user = await userService.login(email, password)
    const tokens = await tokenService.generateAuthTokens(user?.user)
    res.send({ user, tokens })
})

const refreshToken = catchAsync(async (req, res) => {
    const user = await userService.refreshToken(req.body)

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
    }
    const token = await tokenService.generateAuthTokens(user)

    res.send({ user, token })
})

const logout = catchAsync(async (req, res) => {
    await userService.logout(req.body.refreshToken)
    res.status(httpStatus.NO_CONTENT).send()
})

const getAll = catchAsync(async (req, res) => {
    const users = await userService.getAll()
    res.send({ users })
})

const deleteUser = catchAsync(async (req, res) => {
    const users = await userService.deleteUser(req.body)
    res.send({ users })
})

const googleLogin = catchAsync(async (req, res) => {
    try {
        const { user, token, pricing } = await userService.googleLogin(req.body)

        res.json({
            tokens: token,  
            user: {
                user: user,
                pricing: pricing,
            },
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

const facebookLogin = catchAsync(async (req, res) => {
    try {
        const { user, token, pricing } = await userService.facebookLogin(req.body)

        res.json({
            tokens: token,
            user: {
                user: user,
                pricing: pricing,
            },
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

const forgotPassword = catchAsync(async (req, res) => {
    try {
        const result = await userService.forgotPassword(req.body)
        res.json({ result })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

const resetPassword = catchAsync(async (req, res) => {
    try {
        const result = await userService.resetPassword(req)
        res.json({ result })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

const updateStatus = catchAsync(async (req, res) => {
    try {
        const result = await userService.updateStatusUser({
            ...req.body,
            user: req.user,
        })
        res.json({ result })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getAll,
    deleteUser,
    googleLogin,
    facebookLogin,
    forgotPassword,
    resetPassword,
    updateStatus,
}
