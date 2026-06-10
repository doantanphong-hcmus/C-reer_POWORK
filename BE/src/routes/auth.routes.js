import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

// Prefix: /api/v1/auth
router.post('/register', register)
router.post('/login',    login)
router.get('/me',        authenticate, getMe)

export default router
