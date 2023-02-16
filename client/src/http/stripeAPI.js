import { guestInstance } from './index.js'

export const fetchStripeConfig = async () => {
    const { data } = await guestInstance.get('stripe/config')
    return data
}

export const createPayment = async (property) => {
    const { data } = await guestInstance.post(`stripe/create-payment-intent`, property)
    return data
}