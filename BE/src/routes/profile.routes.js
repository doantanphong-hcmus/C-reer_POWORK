import { Router } from 'express'
import { getProfile } from '../controllers/profile.controller.js'

const router = Router()

// Prefix: /api/v1/profiles
router.get('/:user_id', getProfile)

export default router
