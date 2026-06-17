import { Router } from 'express'
import { addToTalentPool, getTalentPool } from '../controllers/talent-pool.controller.js'
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js'

const router = Router()

// Prefix: /api/v1/talent-pool
// Chỉ EMPLOYER mới được dùng Talent Pool
router.post('/', authenticate, authorize('EMPLOYER'), addToTalentPool)
router.get('/',  authenticate, authorize('EMPLOYER'), getTalentPool)

export default router
