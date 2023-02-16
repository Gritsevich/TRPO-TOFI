import AppError from '../errors/AppError.js'
import loadStripe from 'stripe';

const stripe = loadStripe((process.env.STRIPE_SECRET_KEY))

class Stripe {

    async config(req, res, next){
         try {
            res.send({
                publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
            });
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async createPaymentIntent(req, res, next) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
            currency: "BYN",
            amount: req.body.amount,
            automatic_payment_methods: { enabled: true },
            });

            // Send publishable key and PaymentIntent details to client
            res.send({
            clientSecret: paymentIntent.client_secret,
            });
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new Stripe()