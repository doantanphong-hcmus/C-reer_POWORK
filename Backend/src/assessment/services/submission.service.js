/**
 * ASSESSMENT MODULE — Submission Service
 *
 * Đây là service trung tâm của Task 4 Module 2 — gộp cả 3 nhiệm vụ:
 *   1. Tạo Submission có hỗ trợ versioning (tăng version nếu đã từng nộp)
 *   2. Đẩy job quét virus (ClamAV) chạy ngầm sau khi tạo Submission
 *   3. Gửi email xác nhận cho ứng viên (Nodemailer)
 *
 * Toàn bộ vẫn giữ đúng nguyên tắc Blind Audition — không bao giờ trả
 * user_id ra response của submitSolution/getSubmissionsByChallenge.
 */
import { AppError } from '../../shared/utils/AppError.js'
import { generateHashId } from '../../shared/utils/hashId.js'
import * as submissionRepository from '../repositories/submission.repository.js'
import * as userLookupService from '../../iam/services/user-lookup.service.js' // IAM Interface
import { queueScanJob } from '../jobs/scan.job.js'
import { sendSubmissionConfirmationEmail } from './notification.service.js'

// ─── POST /api/v1/assessment/submissions ──────────────────────────────────────
export const submitSolution = async ({ userId, challengeId, solutionUrl, challengeTitle }) => {
  // 1. Tìm hoặc tạo IdentityMapping — 1 cặp (user_id, challenge_id) chỉ có 1 hash_id duy nhất,
  //    dù ứng viên nộp lại nhiều lần (version tăng, hash_id giữ nguyên)
  let mapping = await submissionRepository.findIdentityMapping(userId, challengeId)

  if (!mapping) {
    const hashId = generateHashId(userId, challengeId)
    mapping = await submissionRepository.createIdentityMapping({
      hashId,
      userId,
      challengeId,
    })
  }

  // 2. Tính version tiếp theo — tăng dần nếu ứng viên đã nộp trước đó (TC versioning)
  const latestVersion = await submissionRepository.getLatestVersion(mapping.hashId)
  const nextVersion = latestVersion + 1

  // 3. Tạo Submission — KHÔNG có cột user_id, chỉ có hash_id
  const submission = await submissionRepository.createSubmission({
    challengeId,
    hashId: mapping.hashId,
    version: nextVersion,
    solutionUrl,
  })

  // 4. Đẩy Background Job quét virus — KHÔNG await, không block response
  queueScanJob(submission.id)

  // 5. Gửi email xác nhận — KHÔNG await trong luồng chính (fire-and-forget),
  //    lấy email qua IAM Interface, không lộ ra response cho FE
  userLookupService
    .getUserContactById(userId)
    .then(({ email }) =>
      sendSubmissionConfirmationEmail({
        toEmail: email,
        hashId: mapping.hashId,
        version: nextVersion,
        challengeTitle: challengeTitle ?? 'Challenge',
      }),
    )
    .catch((err) =>
      console.error('[SubmissionService] Không gửi được email xác nhận:', err.message),
    )

  // 6. Trả về theo đúng API Contracts — TUYỆT ĐỐI không có user_id
  return {
    submissionId: submission.id,
    hashId: submission.hashId,
    version: submission.version,
    status: submission.status,
    submittedAt: submission.submittedAt.toISOString(),
  }
}

// ─── GET /api/v1/assessment/challenges/:challenge_id/submissions ─────────────
export const getSubmissionsByChallenge = async (challengeId) => {
  const grouped = await submissionRepository.findSubmissionsByChallengeGroupedByHash(challengeId)

  // Format đúng theo API Contracts mới — mỗi hash_id có mảng submissions[]
  return grouped.map((g) => ({
    hashId: g.hashId,
    isUnlocked: g.isUnlocked,
    submissions: g.submissions.map((s) => ({
      submissionId: s.id,
      version: s.version,
      status: s.status,
      solutionUrl: s.solutionUrl,
      submittedAt: s.submittedAt.toISOString(),
    })),
  }))
}

// ─── POST /api/v1/assessment/submissions/:submission_id/unlock ──────────────
export const unlockCandidate = async (submissionId, action) => {
  if (action !== 'APPROVE') {
    const rejected = await submissionRepository.updateSubmissionStatus(submissionId, 'REJECTED')
    return { message: 'Submission rejected.', submissionId: rejected.id }
  }

  const submission = await submissionRepository.findSubmissionById(submissionId)
  if (!submission) throw new AppError('Không tìm thấy submission', 404, 'ASSESS_002')

  const mapping = await submissionRepository.findIdentityMappingByHashId(submission.hashId)
  if (!mapping) throw new AppError('Không tìm thấy identity mapping', 404, 'ASSESS_003')

  await submissionRepository.updateSubmissionStatus(submissionId, 'APPROVED')
  await submissionRepository.markIdentityMappingUnlocked(submission.hashId)

  // Lấy thông tin thật qua IAM Interface — chỉ lúc này mới được phép
  const { email, fullName } = await userLookupService.getUserContactById(mapping.userId)

  // TODO: bắn Event "Submission_Unlocked" { user_id: mapping.userId, challenge_id, total_score }
  // để Profile Module ghi vào verified_evidences (Sprint sau khi có Event Bus)

  return {
    message: 'Identity unlocked.',
    unlockedCandidateProfile: {
      userId: mapping.userId,
      fullName,
      email,
    },
  }
}
