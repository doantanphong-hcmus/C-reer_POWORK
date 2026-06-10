import { Router } from 'express'
import {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallengeStatus,
} from '../controllers/challenge.controller.js'
import { authenticate, authorize } from '../middlewares/auth.middleware.js'

const router = Router()

// Prefix: /api/v1/challenges
router.get('/',                           getChallenges)
router.get('/:challenge_id',             getChallengeById)
router.post('/',                          authenticate, authorize('EMPLOYER'), createChallenge)
router.patch('/:challenge_id/status',    authenticate, authorize('EMPLOYER'), updateChallengeStatus)

export default router
