import { Router } from 'express'
import { getProfile } from '../controllers/profile.controller.js'

const router = Router()

// Public — ai cũng xem được Dynamic Profile của ứng viên
router.get('/:user_id', getProfile)

export default router
