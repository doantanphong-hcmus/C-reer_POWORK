import { Router } from 'express'
import { login, register, getMe } from '../controllers/auth.controller.js'
import { authenticate } from '../../shared/middlewares/auth.middleware.js'
import { validateBody } from '../../shared/middlewares/validate.middleware.js'
import { loginSchema, registerSchema } from '../models/auth.schema.js'

const router = Router()

router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)
router.get('/me', authenticate, getMe)

export default router
