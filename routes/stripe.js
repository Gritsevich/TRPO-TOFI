import express from 'express'
import StripeController from '../controllers/Stripe.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = new express.Router()

router.get('/config', /*authMiddleware,*/ StripeController.config)
router.post('/create-payment-intent', /*authMiddleware,*/ StripeController.createPaymentIntent)

export default router