/**
 * ASSESSMENT MODULE — Submission Controller
 * Prefix: /api/v1/assessment
 */
import { sendSuccess, sendCreated } from '../../shared/utils/response.js'
import * as submissionService from '../services/submission.service.js'
import * as evaluationService from '../services/evaluation.service.js'
import prisma from '../../shared/config/prisma.js'

// POST /api/v1/assessment/submissions
export const submitSolution = async (req, res) => {
  const { challenge_id, solution_url } = req.body
  const userId = req.user.userId   // chỉ lấy từ JWT — blindAuditionGuard đã chặn FE gửi lên

  // Lấy title để đưa vào nội dung email xác nhận (không bắt buộc, chỉ làm đẹp email)
  const challenge = await prisma.challenge.findUnique({ where: { id: challenge_id } })

  const result = await submissionService.submitSolution({
    userId,
    challengeId: challenge_id,
    solutionUrl: solution_url,
    challengeTitle: challenge?.title,
  })

  return sendCreated(res, result)
}

// GET /api/v1/assessment/challenges/:challenge_id/submissions
export const getSubmissionsByChallenge = async (req, res) => {
  const { challenge_id } = req.params
  const result = await submissionService.getSubmissionsByChallenge(challenge_id)
  return sendSuccess(res, result)
}

// POST /api/v1/assessment/submissions/:submission_id/evaluate
export const evaluateSubmission = async (req, res) => {
  const { submission_id } = req.params
  const result = await evaluationService.evaluateSubmission(submission_id, req.body)
  return sendCreated(res, result)
}

// POST /api/v1/assessment/submissions/:submission_id/unlock
export const unlockCandidate = async (req, res) => {
  const { submission_id } = req.params
  const { action } = req.body
  const result = await submissionService.unlockCandidate(submission_id, action)
  return sendSuccess(res, result)
}
