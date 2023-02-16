import express from 'express'
import UserController from '../controllers/User.js'
import authMiddleware from '../middleware/authMiddleware.js'
import superadminMiddleware from '../middleware/superadminMiddleware.js'

const router = new express.Router()

router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.get('/check', authMiddleware, UserController.check)

router.get('/getall', authMiddleware, superadminMiddleware, UserController.getAll)
router.get('/getone/:id([0-9]+)', authMiddleware, superadminMiddleware, UserController.getOne)
router.post('/create', authMiddleware, superadminMiddleware, UserController.create)
router.put('/update/:id([0-9]+)', authMiddleware, superadminMiddleware, UserController.update)
router.delete('/delete/:id([0-9]+)', authMiddleware, superadminMiddleware, UserController.delete)

export default router