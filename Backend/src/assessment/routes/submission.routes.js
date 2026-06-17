import { Router } from 'express'
import {
  submitSolution,
  getSubmissionsByChallenge,
  evaluateSubmission,
  unlockCandidate,
} from '../controllers/submission.controller.js'
import {
  authenticate,
  authorize,
  blindAuditionGuard,
} from '../../shared/middlewares/auth.middleware.js'

const router = Router()

// Candidate nộp bài — blindAuditionGuard chặn user_id từ FE
router.post(
  '/submissions',
  authenticate,
  authorize('CANDIDATE'),
  blindAuditionGuard,
  submitSolution,
)

// Employer xem danh sách bài nộp (ẩn danh)
router.get(
  '/challenges/:challenge_id/submissions',
  authenticate,
  authorize('EMPLOYER'),
  getSubmissionsByChallenge,
)

// Employer chấm điểm
router.post(
  '/submissions/:submission_id/evaluate',
  authenticate,
  authorize('EMPLOYER'),
  evaluateSubmission,
)

// Employer unlock — thời điểm duy nhất lộ thông tin thật
router.post(
  '/submissions/:submission_id/unlock',
  authenticate,
  authorize('EMPLOYER'),
  unlockCandidate,
)

export default router
