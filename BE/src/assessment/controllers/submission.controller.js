/**
 * ASSESSMENT MODULE — Submission Controller
 * Prefix: /api/v1/assessment
 *
 * Ranh giới bất khả xâm phạm :
 *   - KHÔNG query trực tiếp DB của module khác
 *   - Giao tiếp với Profile Module qua Event (Submission_Unlocked)
 *   - KHÔNG JOIN submissions sang users ở bất kỳ đâu
 */
import { sendSuccess, sendCreated } from '../../shared/utils/response.js'
import { generateHashId } from '../../shared/utils/hashId.js'
import { AppError } from '../../shared/utils/AppError.js'

const MOCK_SUBMISSION = {
  submission_id: 'f5e921dd-14bb-421c-a32e-11bc9aef4421',
  hash_id: 'Candidate_3941',
  status: 'Pending',
  submitted_at: new Date().toISOString(),
  solution_url: 'https://github.com/mock-candidate/solution',
}

// POST /api/v1/assessment/submissions
export const submitSolution = async (req, res) => {
  const { challenge_id, solution_url } = req.body
  // user_id chỉ lấy từ JWT — blindAuditionGuard đã chặn FE gửi lên
  const user_id = req.user?.userId ?? 'mock-user-id'
  const hash_id = generateHashId(user_id, challenge_id)

  // TODO Sprint 1: await SubmissionService.create({ challenge_id, user_id, hash_id, solution_url })
  // 2 INSERT: identity_mappings + submissions (sạch bóng user_id)
  return sendCreated(res, {
    submission_id: `mock-${Date.now()}`,
    hash_id,
    status: 'Pending',
    submitted_at: new Date().toISOString(),
    // user_id: ← TUYỆT ĐỐI KHÔNG có
  })
}

// GET /api/v1/assessment/challenges/:challenge_id/submissions
export const getSubmissionsByChallenge = async (req, res) => {
  const { challenge_id } = req.params
  // TODO Sprint 1: await SubmissionService.getByChallengeId(challenge_id, req.user.userId)
  return sendSuccess(res, [
    {
      submission_id: MOCK_SUBMISSION.submission_id,
      hash_id: MOCK_SUBMISSION.hash_id,
      status: MOCK_SUBMISSION.status,
      solution_url: MOCK_SUBMISSION.solution_url,
      // user_id / full_name / email: ← KHÔNG có
    },
  ])
}

// POST /api/v1/assessment/submissions/:submission_id/evaluate
export const evaluateSubmission = async (req, res) => {
  const { submission_id } = req.params
  const { evaluations, general_comment } = req.body
  const total_score = evaluations?.reduce((acc, e) => acc + (e.score ?? 0), 0) ?? 8.5

  // TODO Sprint 1: await SubmissionService.evaluate(submission_id, req.user.userId, { evaluations, general_comment })
  return sendCreated(res, {
    submission_id, evaluations, general_comment, total_score,
    evaluated_at: new Date().toISOString(),
  })
}

// POST /api/v1/assessment/submissions/:submission_id/unlock
export const unlockCandidate = async (req, res) => {
  const { submission_id } = req.params
  const { action } = req.body

  if (action !== 'APPROVE') throw new AppError('action phải là APPROVE', 400, 'ASSESS_001')

  // TODO Sprint 1: await SubmissionService.unlock(submission_id, req.user.userId)
  // Flow: UPDATE identity_mappings SET is_unlocked=true
  //       → query IAM lấy thông tin thật
  //       → bắn Event "Submission_Unlocked" { user_id, challenge_id, total_score }
  //       → Profile Module bắt event, ghi Snapshot vào verified_evidences

  return sendSuccess(res, {
    message: 'Identity unlocked.',
    unlocked_candidate_profile: {
      user_id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
      full_name: 'Đoàn Tấn Phong',
      email: 'phong.dt@gmail.com',
    },
  })
}
