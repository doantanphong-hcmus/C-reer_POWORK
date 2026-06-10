/**
 * SUBMISSION CONTROLLER — Assessment Module
 * Prefix: /api/v1/assessment
 *
 * Kiến trúc ERD cần nắm:
 *   - Bảng kín `Identity_Mappings`: { hash_id, user_id, challenge_id, is_unlocked }
 *   - Bảng công khai `Submissions`: KHÔNG có cột user_id, chỉ có hash_id
 *   - Bảng `Evaluation_Results`: điểm từng criteria_id
 *
 * Quy tắc bất biến:
 *   - user_id KHÔNG BAO GIỜ xuất hiện trong response của getSubmissions & getScoringView
 *   - Chỉ sau lệnh APPROVE ở unlock mới được JOIN Identity_Mappings để lộ thông tin thật
 */

import { sendSuccess, sendCreated } from '../utils/response.js'
import { generateHashId } from '../utils/hashId.js'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_SUBMISSION = {
  submission_id: 'f5e921dd-14bb-421c-a32e-11bc9aef4421',
  hash_id: 'Candidate_3941',
  status: 'Pending',
  submitted_at: new Date().toISOString(),
  solution_url: 'https://github.com/mock-candidate/solution',
}

// ─── POST /api/v1/assessment/submissions ─────────────────────────────────────
// Auth:  Bearer Candidate_Token
// Nhận: { challenge_id, solution_url }
// Trả:  { submission_id, hash_id, status, submitted_at } — KHÔNG có user_id
export const submitSolution = async (req, res) => {
  const { challenge_id, solution_url } = req.body

  // user_id lấy từ JWT — blindAuditionGuard đã chặn nếu FE cố gửi user_id lên
  const user_id = req.user?.userId ?? 'mock-user-id'

  // Sinh hash_id: SHA256(user_id + challenge_id + SECRET) → "Candidate_3941"
  // Ghi vào bảng kín Identity_Mappings: { hash_id, user_id, challenge_id, is_unlocked: false }
  const hash_id = generateHashId(user_id, challenge_id)

  // TODO Sprint 1: await SubmissionService.create({ challenge_id, user_id, hash_id, solution_url })
  // Service sẽ thực hiện 2 INSERT:
  //   1. Identity_Mappings: { hash_id, user_id, challenge_id, is_unlocked: false }
  //   2. Submissions:       { submission_id, challenge_id, hash_id, solution_url, status: Pending }

  return sendCreated(res, {
    submission_id: `mock-${Date.now()}`,
    hash_id,               // Trả hash_id để candidate biết bài đã vào hệ thống
    status: 'Pending',
    submitted_at: new Date().toISOString(),
  })
}

// ─── GET /api/v1/assessment/challenges/:challenge_id/submissions ──────────────
// Auth:  Bearer Employer_Token
// Trả:  list bài nộp CHỈ gồm submission_id, hash_id, status, solution_url
//       NGHIÊM CẤM trả bất kỳ thông tin profile ứng viên
export const getSubmissionsByChallenge = async (req, res) => {
  const { challenge_id } = req.params

  // TODO Sprint 1: const submissions = await SubmissionService.getByChallengeId(
  //   challenge_id, req.user.userId
  // )
  // Query: SELECT submission_id, hash_id, status, solution_url
  //        FROM Submissions WHERE challenge_id = :id
  //        (KHÔNG JOIN sang Users hay Identity_Mappings)

  return sendSuccess(res, [
    {
      submission_id: MOCK_SUBMISSION.submission_id,
      hash_id: MOCK_SUBMISSION.hash_id,       // "Candidate_3941" — employer chỉ thấy đây
      status: MOCK_SUBMISSION.status,
      solution_url: MOCK_SUBMISSION.solution_url,
      // user_id:    ← KHÔNG có
      // full_name:  ← KHÔNG có
      // email:      ← KHÔNG có
    },
  ])
}

// ─── POST /api/v1/assessment/submissions/:submission_id/evaluate ──────────────
// Auth:  Bearer Employer_Token
// Nhận: { evaluations: [{ criteria_id, score, comment }], general_comment }
// Ghi:  vào bảng Evaluation_Results (kết nối với Submissions qua submission_id)
export const evaluateSubmission = async (req, res) => {
  const { submission_id } = req.params
  const { evaluations, general_comment } = req.body

  // Tính total_score từ các criteria (weighted average)
  const total_score = evaluations?.reduce((acc, e) => acc + (e.score ?? 0), 0) ?? 8.5

  // TODO Sprint 1: await SubmissionService.evaluate(submission_id, req.user.userId, {
  //   evaluations, general_comment, total_score
  // })
  // Ghi vào Evaluation_Results: { submission_id, criteria_id, score, comment }
  // Cập nhật Submissions.status = 'Evaluated'

  return sendCreated(res, {
    submission_id,
    evaluations,
    general_comment,
    total_score,
    evaluated_at: new Date().toISOString(),
  })
}

// ─── POST /api/v1/assessment/submissions/:submission_id/unlock ────────────────
// Auth:  Bearer Employer_Token
// Nhận: { action: "APPROVE" }
//
// Đây là thời điểm DUY NHẤT thông tin thật được tiết lộ.
// Flow theo ERD:
//   1. Cập nhật Submissions.status = 'Approved'
//   2. UPDATE Identity_Mappings SET is_unlocked = true WHERE hash_id = :hash_id
//   3. Đọc user_id từ Identity_Mappings → query IAM để lấy thông tin thật
//   4. Bắn Event "Submission_Unlocked" { user_id, challenge_id, total_score }
//      → Profile Module bắt event, ghi vào Verified_Evidences (Snapshot)
export const unlockCandidate = async (req, res) => {
  const { submission_id } = req.params
  const { action } = req.body

  // TODO Sprint 1: const result = await SubmissionService.unlock(submission_id, req.user.userId, action)
  // Service sẽ kiểm tra action === 'APPROVE', is_unlocked chưa, rồi mới mở

  return sendSuccess(res, {
    message: 'Identity unlocked.',
    unlocked_candidate_profile: {
      user_id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
      full_name: 'Đoàn Tấn Phong',
      email: 'phong.dt@gmail.com',
    },
  })
}
