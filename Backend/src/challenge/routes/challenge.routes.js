import { Router } from 'express'
import {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallengeStatus,
} from '../controllers/challenge.controller.js'
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js'
import { validateBody } from '../../shared/middlewares/validate.middleware.js'
import { createChallengeSchema, updateChallengeStatusSchema } from '../models/challenge.schema.js'

const router = Router()

router.get('/', getChallenges) // public
router.get('/:challenge_id', getChallengeById) // public

// TC_CHAL_003: thiếu/hỏng token → authenticate chặn (401)
// TC_CHAL_002: role không phải Employer → authorize chặn (403)
// TC_CHAL_006,007,010: cấu trúc cơ bản → validateBody(createChallengeSchema) chặn (400)
router.post(
  '/',
  authenticate,
  authorize('EMPLOYER'),
  validateBody(createChallengeSchema),
  createChallenge,
)

router.patch(
  '/:challenge_id/status',
  authenticate,
  authorize('EMPLOYER'),
  validateBody(updateChallengeStatusSchema),
  updateChallengeStatus,
)

export default router
