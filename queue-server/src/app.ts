import express from 'express'
import bodyParser from 'body-parser'
import { sendExamQueue } from './queues/exam.queue'
import examProcess from './processes/exam.process'

const Queue = require('bull')

const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')
const { ExpressAdapter } = require('@bull-board/express')

const examQueue = new Queue('exam', {
    redis: {
        port: 21180,
        host: 'ec2-34-226-92-114.compute-1.amazonaws.com',
        password: 'p4521f7cba6d1e72bbc5b82f48844f465a7b76c7a7610f66fa6f73901bd1ce887',
        tls: {
            rejectUnauthorized: false,
        },
    },
})

const serverAdapter = new ExpressAdapter()

createBullBoard({
    queues: [new BullAdapter(examQueue)],
    serverAdapter: serverAdapter,
})
serverAdapter.setBasePath('/admin/queues')

examQueue.process(1000, examProcess)

const app = express()

app.use(bodyParser.json())

app.use('/admin/queues', serverAdapter.getRouter())

app.post('/queue-exam', async (req, res) => {
    await sendExamQueue({
        ...req.body,
        examQueue,
        type: 'exam'
    })
    res.send({ status: 'ok' })
})

app.post('/queue-pricing', async (req, res) => {
    await sendExamQueue({
        ...req.body,
        examQueue,
        type: 'pricing',
        time: 2628000000
    })
    res.send({ status: 'ok' })
})

app.listen(5001, () => console.log('App running on port 5001'))
