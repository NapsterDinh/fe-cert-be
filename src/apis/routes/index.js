const express = require('express')

const userRoute = require('./v1/user.route')
const moduleRoute = require('./v1/module.route')
const tutorialRoute = require('./v1/tutorial.route')
const questionRoute = require('./v1/question.route')
const examRoute = require('./v1/exam.route')
const topicRoute = require('./v1/topic.route')
const pricingRoute = require('./v1/pricing.route')

const router = express.Router()

const defaultRoutes = [
    {
        path: '/v1/user',
        route: userRoute,
    },
    {
        path: '/v1/module',
        route: moduleRoute,
    },
    {
        path: '/v1/tutorial',
        route: tutorialRoute,
    },
    {
        path: '/v1/question',
        route: questionRoute,
    },
    {
        path: '/v1/exam',
        route: examRoute,
    },
    {
        path: '/v1/topic',
        route: topicRoute,
    },
    {
        path: '/v1/pricing',
        route: pricingRoute,
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router
