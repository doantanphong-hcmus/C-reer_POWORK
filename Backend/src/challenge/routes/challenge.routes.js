import { Router } from 'express'
import {
  getChallenges, getChallengeById, createChallenge, updateChallengeStatus,
} from '../controllers/challenge.controller.js'
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js'

const router = Router()

router.get('/',                        getChallenges)           // public
router.get('/:challenge_id',           getChallengeById)        // public
router.post('/',                       authenticate, authorize('EMPLOYER'), createChallenge)
router.patch('/:challenge_id/status',  authenticate, authorize('EMPLOYER'), updateChallengeStatus)

export default router
