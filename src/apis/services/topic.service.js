const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')
const { Topics, TopicSections, TopicLessons, Questions } = require('../models')

const getAll = async () => {
    return await Topics.find({ isDeleted: false }).populate({
        path: 'sections',
        populate: [
            {
                path: 'lessons',
            },
        ],
    })
}

const getWithDeleted = async () => {
    return await Topics.find({}).populate({
        path: 'sections',
        populate: [
            {
                path: 'lessons',
            },
        ],
    })
}

const getFull = async () => {
    let topic = await Topics.find({ isDeleted: false })
        .populate({
            path: 'sections',
            populate: [
                {
                    path: 'lessons',
                },
            ],
        })
        .lean()

    topic = await Promise.all(
        topic.map(async (item) => {
            const question = await Questions.find({ topic: item._id, isDeleted: false }).lean()

            return {
                ...item,
                questions: question,
            }
        })
    )

    return topic
}

const getById = async ({ _id }) => {
    return await Topics.find({ _id, isDeleted: false })
}

const create = async ({ sections, ...rest }) => {
    if (sections) {
        sections = await Promise.all[
            sections.map(async (item) => {
                if (item?.lessons) {
                    item.lessons = await Promise.all[
                        item.lessons.map(async (lesson) => {
                            const lessonItem = await TopicLessons.create(lesson)

                            return {
                                _id: lessonItem._id,
                            }
                        })
                    ]
                }

                const section = await TopicSections.create(item)

                return {
                    _id: section._id,
                }
            })
        ]
    }
    return await Topics.create({
        ...rest,
        sections,
    })
}

const update = async ({ _id, ...rest }) => {
    return await Topics.findOneAndUpdate({ _id, isDeleted: false }, { ...rest })
}

const deleteTopic = async ({ _id }) => {
    return await Topics.findOneAndUpdate({ _id }, { isDeleted: true })
}

const getAllSection = async () => {
    return await TopicSections.find({ isDeleted: false }).populate({
        path: 'lessons',
        path: 'topic',
        match: { isDeleted: { $eq: false } },
    })
}

const getSectionById = async ({ _id }) => {
    const result = await TopicSections.find({ _id, isDeleted: false }).populate([
        {
            path: 'lessons',
        },
        {
            path: 'topic',
        },
    ])

    return [
        {
            ...result[0]._doc,
            lessons: result[0]._doc?.lessons.filter((t) => t?.isDeleted === false),
        },
    ]
}

const getSectionByNonId = async ({ topicId }) => {
    if (topicId) {
        const topicedSection = await Topics.find({ _id: topicId, isDeleted: false }).populate({
            path: 'sections',
            match: { isDeleted: { $eq: false } },
            populate: [{ path: 'lessons', match: { isDeleted: { $eq: false } } }],
        })

        return topicedSection?.questions || []
    }
    const allTopics = await Topics.find({ isDeleted: false })
    let result = []

    allTopics.map((item) => {
        result = result.concat(item?.sections || [])
    })

    return await TopicSections.find({ isDeleted: false, _id: { $nin: result } }).populate({
        path: 'lessons',
        path: 'topic',
        match: { isDeleted: { $eq: false } },
    })
}

const createSection = async ({ topic, ...rest }) => {
    const section = await TopicSections.create(rest)
    await Topics.findOneAndUpdate(
        { _id: topic, isDeleted: false },
        {
            $addToSet: { sections: { _id: section?._id } },
        }
    )
    return section
}

const updateSection = async ({ _id, topic, ...rest }) => {
    const newSection = await TopicSections.findOneAndUpdate({ _id, isDeleted: false }, { ...rest, topic }).populate({
        path: 'topic',
    })

    if (topic) {
        const oldSection = await TopicSections.findOne({ _id }).populate({ path: 'topic' }).lean()
        const newTopicSection = newSection?.topic?.sections.filter((item) => item?.toString() != oldSection?._id?.toString())
        const test = await Topics.findOneAndUpdate(
            { _id: newSection?.topic?._id?.toString() },
            {
                sections: newTopicSection,
            },
            {
                new: true,
            }
        )

        const test2 = await Topics.findOneAndUpdate(
            { _id: topic },
            {
                $addToSet: { sections: { _id: newSection?._id } },
            },
            {
                new: true,
            }
        )
    }

    return newSection
}

const deleteSection = async ({ _id }) => {
    const newSection = await TopicSections.findOneAndUpdate({ _id }, { isDeleted: true }).lean()

    const oldSection = await TopicSections.findOne({ _id }).populate({ path: 'topic' }).lean()
    const newTopicSection = oldSection?.topic?.sections.filter((item) => item?.toString() != _id)

    await Topics.findOneAndUpdate(
        { _id: newSection?.topic?.toString() },
        {
            sections: newTopicSection,
        }
    )

    return newSection
}

const getAllLesson = async () => {
    return await TopicLessons.find({ isDeleted: false })
}

const getLessonById = async ({ _id }) => {
    return await TopicLessons.find({ _id, isDeleted: false })
}

const createLesson = async ({ sectionId, ...rest }) => {
    const lesson = await TopicLessons.create({ ...rest })

    await TopicSections.findOneAndUpdate(
        { _id: sectionId, isDeleted: false },
        {
            $push: { lessons: { _id: lesson._id } },
        }
    )
    return lesson
}

const updateLesson = async ({ _id, ...rest }) => {
    return await TopicLessons.findOneAndUpdate({ _id, isDeleted: false }, { ...rest })
}

const deleteLesson = async ({ _id }) => {
    return await TopicLessons.findOneAndUpdate({ _id }, { isDeleted: true })
}

module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteTopic,
    getAllSection,
    getSectionById,
    createSection,
    updateSection,
    deleteSection,
    getAllLesson,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    getSectionByNonId,
    getFull,
    getWithDeleted,
}
