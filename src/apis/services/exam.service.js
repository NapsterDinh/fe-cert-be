const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')
const { Exams, UserExams, Submissions, Questions, Topics } = require('../models')
const { examStatusTypes, examTypes, sectionTypes } = require('../../configs/enum')
const { default: axios } = require('axios')

const getAll = async ({ type }) => {
    if (type) {
        return await Exams.find({ type, isDeleted: false }).populate('questions')
    }
    return await Exams.find({ isDeleted: false }).populate('questions')
}

const getById = async ({ _id, user }) => {
    let userExams = null
    if (user) {
        userExams = await UserExams.find({ user: user.sub, isDeleted: false })
        userExams = {
            total: userExams.length,
        }
    }

    const exam = await Exams.find({ _id, isDeleted: false }).populate({
        path: 'questions',
        populate: {
            path: 'choices',
        },
    })
    return {
        exam,
        ...(userExams ?? {}),
    }
}

const create = async (body) => {
    return await Exams.create(body)
}

const update = async ({ _id, ...rest }) => {
    return await Exams.findOneAndUpdate({ _id, isDeleted: false }, { ...rest })
}

const deleteExam = async ({ _id }) => {
    return await Exams.findOneAndUpdate({ _id }, { isDeleted: true })
}

const createExamSession = async ({ user, exam }) => {
    const isAnyOccurred = await UserExams.findOne({ user, exam, status: examStatusTypes.PROGRESSING, isDeleted: false })
    let latest = null

    if (!isAnyOccurred) {
        await Exams.findOneAndUpdate(
            { _id: exam, isDeleted: false },
            {
                $inc: { numberExaminees: 1 },
            }
        )

        await axios
            .post('http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5001/queue-exam', {
                exam: exam,
                user: {
                    sub: user?.sub,
                },
            })
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                console.log(err)
            })

        latest = await UserExams.find({ user, exam, status: examStatusTypes.DONE, isDeleted: false })
            .limit(1)
            .sort({ $natural: -1 })
            .lean()
    }
    return isAnyOccurred ?? (await UserExams.create({ user, exam, no: latest?.length > 0 ? latest[0]?.no + 1 : 1 }))
}

const createRandomExam = async ({ _id, user, exams }) => {
    let update = await UserExams.find({ status: examStatusTypes.PROGRESSING, user: user.sub, isDeleted: false })
        .populate({
            path: 'exam',
        })
        .lean()

    update = update
        .filter(
            (item) =>
                (item?.exam?.type === examTypes.NORMAL_PRACTICE || item?.exam?.type === examTypes.TOPIC_PRACTICE) &&
                item?.status === examStatusTypes.PROGRESSING
        )
        .map((item) => item?._id.toString())

    await UserExams.updateMany({ _id: { $in: update } }, { $set: { status: examStatusTypes.DONE } })

    let randomedExams = []
    const allExams = await Exams.find({ _id: { $in: exams }, isDeleted: false }).lean()

    const examName = allExams.map((item) => item?.title || '').join(' - ')
    const examListHtml = allExams.map((item) => (item?.title ? `<li>${item?.title}</li>` : ''))

    const content =
        `
    <p>This Exam is based on the Morning session of origin FE exam. There would be 80 questions in total, which distribute largely in 3 exams:</p>
    <ul>` +
        examListHtml.join('') +
        `</ul>
    <p>All questions are in single-choice question type. Candidate is considered as "Passed" if he/she has more than 60% of right answers.</p>`

    allExams.map((item) => {
        const shuffled = item?.questions?.sort(function () {
            return 0.5 - Math.random()
        })
        const selectedPercent =
            Math.round(80 / exams?.length) % 2 === 0 ? Math.round(80 / exams?.length) : Math.round(80 / exams?.length) + 1
        const selected = shuffled.slice(0, selectedPercent)
        randomedExams = randomedExams.concat(selected)
    })

    const newExam = await Exams.create({
        title: `Practice By Exam: ${examName}`,
        content: btoa(unescape(encodeURIComponent(content))),
        questions: randomedExams.slice(0, 80),
        type: examTypes.NORMAL_PRACTICE,
        time: 9000,
    })

    await axios
        .post('http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5001/queue-exam', {
            exam: newExam?._id?.toString(),
            user: {
                sub: user?.sub,
            },
        })
        .then((response) => {
            return response.data
        })
        .catch((err) => {
            console.log(err)
        })

    return await UserExams.create({ user: user?.sub, exam: newExam._id })
}

const createRandomExamByTopic = async ({ numberOfQuestions, user, topics, time }) => {
    let update = await UserExams.find({ status: examStatusTypes.PROGRESSING, user: user.sub, isDeleted: false })
        .populate({
            path: 'exam',
        })
        .lean()

    update = update
        .filter(
            (item) =>
                (item?.exam?.type === examTypes.NORMAL_PRACTICE || item?.exam?.type === examTypes.TOPIC_PRACTICE) &&
                item?.status === examStatusTypes.PROGRESSING
        )
        .map((item) => item?._id.toString())

    await UserExams.updateMany({ _id: { $in: update } }, { $set: { status: examStatusTypes.DONE } })

    const allQuestions = await Questions.find({ topic: { $in: topics }, isDeleted: false })
    const allTopics = await Topics.find({ _id: { $in: topics }, isDeleted: false }).lean()

    const shuffled = allQuestions.sort(function () {
        return 0.5 - Math.random()
    })
    const topicName = allTopics.map((item) => item?.title || '').join(' - ')
    const topicListHtml = allTopics.map((item) => (item?.title ? `<li>${item?.title}</li>` : ''))

    const content =
        `
    <p>This Exam is based on the Morning session of origin FE exam. There would be 80 questions in total, which distribute largely in 3 topics:</p>
    <ul>` +
        topicListHtml.join('') +
        `</ul>
    <p>All questions are in single-choice question type. Candidate is considered as "Passed" if he/she has more than 60% of right answers.</p>`

    const selectedPercent =
        Math.round(numberOfQuestions / topics?.length) % 2 === 0
            ? Math.round(numberOfQuestions / topics?.length)
            : Math.round(numberOfQuestions / topics?.length) + 1
    const selected = shuffled.slice(0, selectedPercent)

    const newExam = await Exams.create({
        title: `Practice By Topic: ${topicName}`,
        content: btoa(unescape(encodeURIComponent(content))),
        questions: selected.slice(0, 80),
        type: examTypes.TOPIC_PRACTICE,
        time,
    })

    await axios
        .post('http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5001/queue-exam', {
            exam: newExam?._id?.toString(),
            user: {
                sub: user?.sub,
            },
            time,
        })
        .then((response) => {
            return response.data
        })
        .catch((err) => {
            console.log(err)
        })

    return await UserExams.create({ user: user?.sub, exam: newExam._id })
}

const getExamInformation = async ({ user, exam }) => {
    const isAnySessionOccurred = await UserExams.findOne({
        user: user?.sub,
        status: examStatusTypes.PROGRESSING,
        isDeleted: false,
    })
        .populate({ path: 'exam' })
        .lean()

    const data = await UserExams.find({
        user: user?.sub,
        exam: exam || isAnySessionOccurred?.exam?._id.toString(),
        status: examStatusTypes.DONE,
        isDeleted: false,
    }).lean()

    if (!!isAnySessionOccurred) {
        return {
            status: 'failed',
            userExam: isAnySessionOccurred,
            exam: isAnySessionOccurred?.exam,
            total: data.length,
        }
    }

    return {
        status: 'success',
        exam: isAnySessionOccurred?.exam,
        total: data.length,
    }
}

const updateResult = async ({ exam, user, submissions }) => {
    let result = null
    const currentUserExam = await UserExams.findOne({
        user: user.sub,
        exam: exam,
        status: examStatusTypes.PROGRESSING,
        isDeleted: false,
    }).populate({ path: 'submissions' })

    const currentSubmission = currentUserExam?.submissions?.find(
        (item) => item.question_id?.toString() === submissions.question_id
    )
    if (!!currentSubmission) {
        if (!submissions?.answers) {
            result = await Submissions.deleteOne({
                _id: currentSubmission._id,
            })
        } else {
            result = await Submissions.findOneAndUpdate(
                { _id: currentSubmission._id, isDeleted: false },
                {
                    answers: submissions?.answers,
                }
            )
        }
    } else {
        const submission = await Submissions.create(submissions)
        result = await UserExams.findOneAndUpdate(
            { _id: currentUserExam._id, isDeleted: false },
            {
                $push: { submissions: { _id: submission._id } },
            }
        )
    }

    if (!!result) {
        return true
    }

    return false
}

const submitResult = async ({ exam, user }) => {
    let totalPassed = 0
    const current = await UserExams.findOne({
        exam,
        user: user?.sub,
        status: examStatusTypes.PROGRESSING,
        isDeleted: false,
    }).populate([
        {
            path: 'submissions',
            populate: [
                {
                    path: 'question_id',
                },
                { path: 'answers' },
            ],
        },
        {
            path: 'exam',
        },
    ])

    current?.submissions?.map((item) => {
        if (!!(item?.question_id?.answer.toString() == item?.answers?._id.toString()) && !!item?.answers?._id) totalPassed++
    })

    const results = await UserExams.findOneAndUpdate(
        { exam, user: user?.sub, status: examStatusTypes.PROGRESSING, isDeleted: false },
        {
            status: examStatusTypes.DONE,
            isPassed: totalPassed > (60 / 100) * current?.exam?.questions?.length,
        },
        { new: true }
    )

    return results._id
}

const getCurrentExam = async ({ exam, user }) => {
    const currentUserExam = await UserExams.findOne({
        user: user.sub,
        exam,
        status: examStatusTypes.PROGRESSING,
        isDeleted: false,
    }).populate([
        {
            path: 'exam',
            populate: [
                {
                    path: 'questions',
                    populate: [
                        {
                            path: 'choices',
                        },
                    ],
                },
            ],
        },
        { path: 'submissions' },
        { path: 'user' },
    ])

    return currentUserExam
}

const getCurrentRandomExam = async ({ user, type }) => {
    const currentUserRandomExam = await UserExams.findOne({
        user: user.sub,
        type,
        status: examStatusTypes.PROGRESSING,
        isDeleted: false,
    })
        .sort({ $natural: -1 })
        .populate([
            {
                path: 'exam',
                populate: [
                    {
                        path: 'questions',
                        populate: [
                            {
                                path: 'choices',
                            },
                        ],
                    },
                ],
            },
            { path: 'submissions' },
            { path: 'user' },
        ])

    return currentUserRandomExam
}

const getResult = async ({ userExam }) => {
    const result = await UserExams.findById(userExam).populate([
        {
            path: 'submissions',
            populate: [
                {
                    path: 'question_id',
                },
                { path: 'answers' },
            ],
        },
        { path: 'user' },
        {
            path: 'exam',
            populate: {
                path: 'questions',
                populate: {
                    path: 'choices',
                },
            },
        },
    ])

    let newSubmissions = result?.exam?.questions?.map((question) => {
        return {
            answers: '',
            question_id: question?._id.toString(),
            rightAnswer: false,
            correct: false,
        }
    })

    newSubmissions = newSubmissions?.map((submission) => {
        const answer = result?.submissions?.find((item) => item?.question_id?._id == submission?.question_id)
        if (answer) {
            submission = {
                answers: answer?.answers?._id.toString(),
                question_id: answer?.question_id?._id.toString(),
                rightAnswer: result?.exam?.hasShowRightAnswer ? answer?.question_id?.answer.toString() : false,
                correct:
                    !!(answer?.question_id?.answer.toString() == answer?.answers?._id.toString()) && !!answer?.answers?._id,
            }

            return submission
        }

        return submission
    })

    return {
        result,
        newSubmissions,
    }
}

const getHistory = async ({ user }) => {
    const results = await UserExams.find({ user: user?.sub, status: examStatusTypes.DONE, isDeleted: false })
        .populate([
            {
                path: 'submissions',
                populate: [
                    {
                        path: 'question_id',
                    },
                    { path: 'answers' },
                ],
            },
            { path: 'user' },
            {
                path: 'exam',
                populate: {
                    path: 'questions',
                    populate: {
                        path: 'choices',
                    },
                },
            },
        ])
        .lean()

    let allPassed = 0
    const data = await Promise.all(
        results.map(async (item) => {
            const result = await getResult({ userExam: item._id })
            result.newSubmissions?.map((subItem) => {
                if (subItem?.correct) allPassed++
            })

            return {
                ...item,
                totalCorrect: allPassed,
                totalQuestions: item?.exam?.questions?.length || 0,
            }
        })
    )

    return data
}

const getHistoryByExamId = async ({ exam, user }) => {
    let results = await UserExams.find({ exam, user: user?.sub, status: examStatusTypes.DONE, isDeleted: false }).populate([
        {
            path: 'submissions',
            populate: [
                {
                    path: 'question_id',
                },
                { path: 'answers' },
            ],
        },
        { path: 'user' },
        {
            path: 'exam',
            populate: {
                path: 'questions',
                populate: {
                    path: 'choices',
                },
            },
        },
    ])

    results = results.map((result) => {
        let newSubmissions = result?.exam?.questions?.map((question) => {
            return {
                answers: '',
                question_id: question?._id.toString(),
                rightAnswer: false,
                correct: false,
            }
        })

        newSubmissions = newSubmissions?.map((submission) => {
            const answer = result?.submissions?.find((item) => item?.question_id?._id == submission?.question_id)
            if (answer) {
                submission = {
                    answers: answer?.answers?._id.toString(),
                    question_id: answer?.question_id?._id.toString(),
                    rightAnswer: result?.exam?.hasShowRightAnswer ? answer?.question_id?.answer.toString() : false,
                    correct:
                        !!(answer?.question_id?.answer.toString() == answer?.answers?._id.toString()) &&
                        !!answer?.answers?._id,
                }

                return submission
            }

            return submission
        })

        return {
            result,
            newSubmissions,
        }
    })

    return results
}

const getPredictMark = async ({ exam, user }) => {
    let allPassed = 0
    let numberOfQuestions = 0
    const allUserExams = await UserExams.find({
        exam,
        user: user?.sub,
        status: examStatusTypes.DONE,
        isDeleted: false,
    }).populate({ path: 'exam' })

    const data = await Promise.all(
        allUserExams.map(async (item) => {
            const result = await getResult({ userExam: item._id })
            result.newSubmissions?.map((subItem) => {
                if (subItem?.correct) allPassed++
            })
        })
    )

    allUserExams.map((item) => {
        numberOfQuestions += item?.exam?.questions?.length || 0
    })

    allPassed = (allPassed / numberOfQuestions) * 100

    const predictMark = await axios
        .post('http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5002/predict', { mark: allPassed })
        .then((response) => {
            return response.data
        })
        .catch((err) => {
            console.log(err)
        })

    return predictMark
}

const getExamStatistic = async ({ user, exam }) => {
    let totalPassed = 0
    const currentExam = await Exams.findOne({ _id: exam, isDeleted: false })
    let allUserExams = await UserExams.find({ exam, isDeleted: false }).lean()
    const totalTaken = allUserExams?.length

    allUserExams.map((item) => {
        if (item?.isPassed) {
            totalPassed++
        }
    })

    allUserExams = allUserExams.map((item) => {
        return item?.user?.toString()
    })

    allUserExams = [...new Set(allUserExams)]

    return {
        eventDate: currentExam?.eventDate,
        numberOfExaminees: currentExam.numberExaminees,
        numberOfApplicants: allUserExams?.length ?? 0,
        passRate: Math.floor((totalPassed / totalTaken) * 100) / 100,
    }
}

const getTopicOverview = async ({ user, type }) => {
    let allUserExams = await UserExams.find({ status: examStatusTypes.DONE, user: user.sub, isDeleted: false })
        .populate({
            path: 'exam',
        })
        .lean()

    const totalExams = allUserExams.filter((item) => item?.exam?.type === examTypes.EXAM)
    const totalPractices = allUserExams.filter(
        (item) => item?.exam?.type === examTypes.NORMAL_PRACTICE || item?.exam?.type === examTypes.TOPIC_PRACTICE
    )

    allUserExams = allUserExams.filter((item) => item?.exam?.type === type)
    const topics = await Topics.find({ status: sectionTypes.PUBLIC, isDeleted: false }).lean()

    let topicsList = await Promise.all(
        topics.map(async (item) => {
            const totalQuestions = await Questions.find({ topic: item._id, isDeleted: false })
            return {
                _id: item._id,
                title: item?.title,
                totalQuestion: totalQuestions.length,
                totalCorrect: 0,
            }
        })
    )

    let maxMark = 0
    let maxMarkUserExamId = null
    let maxMarkExamId = null
    let minMark = Number.MAX_VALUE
    let minMarkUserExamId = null
    let minMarkExamId = null
    let allCorrect = 0
    let allQuestions = 0

    let allExamsOfTopics = await UserExams.find({
        status: examStatusTypes.DONE,
        user: user.sub,
        isDeleted: false,
    })
        .populate({ path: 'exam' })
        .lean()
    allExamsOfTopics = allExamsOfTopics.filter((item) => item?.exam?.type === type)

    await Promise.all(
        allExamsOfTopics.map(async (subTopicItem) => {
            const result = await getResult({ userExam: subTopicItem._id })
            let currentMark = 0
            result.newSubmissions?.map((subItem) => {
                if (subItem?.correct) {
                    currentMark++
                    allCorrect++
                }
            })

            allQuestions += subTopicItem?.exam?.questions?.length || 0

            if (currentMark / subTopicItem?.exam?.questions?.length > maxMark) {
                maxMark = currentMark / subTopicItem?.exam?.questions?.length
                maxMarkUserExamId = subTopicItem._id?.toString()
                maxMarkExamId = subTopicItem?.exam?._id?.toString()
            }

            if (currentMark / subTopicItem?.exam?.questions?.length < minMark) {
                minMark = currentMark / subTopicItem?.exam?.questions?.length
                minMarkUserExamId = subTopicItem._id?.toString()
                minMarkExamId = subTopicItem?.exam?._id?.toString()
            }
        })
    )

    const data = await Promise.all(
        allUserExams.map(async (item) => {
            const examResult = await getResult({ userExam: item._id.toString() })
            const questionList = examResult?.result?.exam?.questions

            examResult.newSubmissions?.map((sub) => {
                if (sub?.correct) {
                    const question = questionList?.find((subItem) => subItem?._id == sub?.question_id)

                    const index = topicsList.findIndex((item) => item._id?.toString() === question?.topic?.toString())
                    topicsList[index].totalCorrect++
                }
            })
        })
    )

    return {
        topicsList,
        totalExams: totalExams?.length ?? 0,
        totalPractices: totalPractices?.length ?? 0,
        minMark: {
            minMark: minMark === Number.MAX_VALUE ? 0 : minMark,
            minMarkExamId,
            minMarkUserExamId,
        },
        maxMark: {
            maxMark,
            maxMarkExamId,
            maxMarkUserExamId,
        },
        avgMark: allCorrect / allQuestions,
    }
}

module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteExam,
    createExamSession,
    getExamInformation,
    updateResult,
    submitResult,
    getCurrentExam,
    getResult,
    getHistory,
    createRandomExam,
    getCurrentRandomExam,
    createRandomExamByTopic,
    getPredictMark,
    getHistoryByExamId,
    getExamStatistic,
    getTopicOverview,
}
