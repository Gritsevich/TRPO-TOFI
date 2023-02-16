import express from 'express'

import product from './product.js'
import category from './category.js'
import brand from './brand.js'
import user from './user.js'
import basket from './basket.js'
import rating from './rating.js'
import order from './order.js'
import stripe from './stripe.js'

const router = new express.Router()

router.use('/product', product)
router.use('/category', category)
router.use('/brand', brand)
router.use('/user', user)
router.use('/basket', basket)
router.use('/rating', rating)
router.use('/order', order)
router.use('/stripe', stripe)

export default router