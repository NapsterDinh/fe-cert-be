const jwt = require('jsonwebtoken')
const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')

const { Pricing, UserPricing, Ability } = require('../models')

const paypal = require('paypal-rest-sdk')
const { pricingTypes } = require('../../configs/enum')
const { default: axios } = require('axios')
let payingPricing = null

paypal.configure({
    mode: 'sandbox',
    client_id: 'AfuS7PgUp_E-1L2jORgJD8SNYQRkrLlCNtfKUuQlFXBd9Zm3CDIlSuRu9VsBhkdsPoqHMtxmw8146B1l',
    client_secret: 'EGbZbZywOIOoqyU6lfFpul2uUNsDmA96Za0Pl2Absb9L-LhN4Dyzc77cPq2Z6BTVM0VrE0rmNUBpUBjs',
})

const getAll = async () => {
    let result = await Pricing.find({ isDeleted: false }).populate({ path: 'abilities' }).lean()

    let users = await UserPricing.find({ isDeleted: false }).lean()
    users = users.map((item) => item?.user?.toString())
    users = new Set([...users])
    return {
        ...result,
        numberOfUser: users.length,
    }
}

const getById = async ({ _id }) => {
    let result = await Pricing.findOne({ _id, isDeleted: false }).populate({ path: 'abilities' }).lean()
    let users = await UserPricing.find({ isDeleted: false }).lean()

    users = users.map((item) => item?.user?.toString())
    users = new Set([...users])

    return {
        ...result,
        numberOfUser: users.length,
    }
}

const updatePricing = async ({ _id, ...rest }) => {
    return await Pricing.findOneAndUpdate({ _id, isDeleted: false }, { ...rest }, { new: true })
}

const createPricing = async (body) => {
    return await Pricing.create(body)
}

const deletePricing = async ({ _id }) => {
    return await Pricing.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true })
}

const getAllAbility = async () => {
    return await Ability.find({ isDeleted: false })
}

const getAbilityById = async ({ _id }) => {
    return await Ability.findOne({ _id, isDeleted: false })
}

const updateAbility = async ({ _id, ...rest }) => {
    return await Ability.findOneAndUpdate({ _id, isDeleted: false }, { ...rest }, { new: true })
}

const createAbility = async (body) => {
    return await Ability.create(body)
}

const deleteAbility = async () => {
    return await Ability.findOneAndUpdate({ _id, isDeleted: false }, { isDeleted: true })
}

const payForSubscription = async ({ _id, user }) => {
    payingPricing = await Pricing.findOne({ _id, isDeleted: false }).lean()
    payingPricing = {
        ...payingPricing,
        user: user?.sub,
    }

    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: 'http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5000/api/v1/pricing/pay/success',
            cancel_url: `http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com/result-checkout/failed?pricing=${payingPricing?._id?.toString()}`,
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: payingPricing?.name,
                            price: payingPricing?.price?.toString(),
                            currency: 'USD',
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: 'USD',
                    total: payingPricing?.price?.toString(),
                },
                description: payingPricing?.description,
            },
        ],
    }

    const result = await new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, async (error, payment) => {
            if (error) {
                reject(error)
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        resolve(payment.links[i].href)
                    }
                }
            }
        })
    })

    return result
}

const paySuccess = async ({ PayerID, paymentId }) => {
    const execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: 'USD',
                    total: payingPricing?.price?.toString(),
                },
            },
        ],
    }
    const result = await new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                reject(error)
            } else {
                await Pricing.findOneAndUpdate(
                    { _id: payingPricing?._id.toString(), isDeleted: false },
                    {
                        $inc: { numberOfPayment: 1, revenue: parseFloat(payingPricing?.price.toString()) },
                    }
                )

                const userPricing = await UserPricing.create({
                    user: payingPricing?.user,
                    pricing: payingPricing?._id,
                    abilities: payingPricing?.abilities,
                    expireDate: new Date(new Date().setDate(new Date().getDate() + payingPricing?.duration)).toISOString(),
                    status: pricingTypes.VALID,
                    price: parseFloat(payingPricing?.price.toString()),
                })

                resolve(userPricing)
            }
        })
    })

    await axios
        .post('http://ec2-18-118-107-150.us-east-2.compute.amazonaws.com:5001/queue-pricing', {
            userPricing: result?._id?.toString(),
            user: {
                sub: payingPricing?.user,
            },
        })
        .then((response) => {
            return response.data
        })
        .catch((err) => {
            console.log(err)
        })

    return result
}

const getAllPurchase = async ({ _id }) => {
    const users = await UserPricing.find({ user: _id, status: pricingTypes.VALID, isDeleted: false })
        .populate({ path: 'user', path: 'pricing' })
        .lean()

    return users
}

const getAllUserPurchase = async ({}) => {
    const users = await UserPricing.find({ isDeleted: false }).populate({ path: 'user', path: 'pricing' }).lean()

    return users
}

const submitExpires = async ({ userPricing }) => {
    const users = await UserPricing.findOneAndUpdate(
        { _id: userPricing, isDeleted: false },
        {
            status: pricingTypes.EXPIRE,
        }
    )

    return users
}

module.exports = {
    getAll,
    updatePricing,
    createPricing,
    deletePricing,
    getById,
    getAllAbility,
    updateAbility,
    createAbility,
    deleteAbility,
    getAbilityById,
    payForSubscription,
    paySuccess,
    getAllPurchase,
    getAllUserPurchase,
    submitExpires,
}
