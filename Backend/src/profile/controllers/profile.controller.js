/**
 * PROFILE MODULE — Profile Controller
 * Prefix: /api/v1/profiles
 *
 * Ranh giới: Profile Module KHÔNG JOIN về Challenge hay IAM Module.
 * Dùng Snapshot Data đã lưu sẵn trong verified_evidences.
 * Giao tiếp với Assessment Module qua Event "Submission_Unlocked".
 */
import { sendSuccess } from '../../shared/utils/response.js'

// GET /api/v1/profiles/:user_id — public, không cần auth
export const getProfile = async (req, res) => {
  const { userId } = req.params
  // TODO Sprint 1: const profile = await ProfileService.getByUserId(user_id)
  // Query: SELECT * FROM verified_evidences WHERE user_id = :user_id
  // KHÔNG JOIN về challenges hay users — dùng snapshot đã lưu
  return sendSuccess(res, {
    userId,
    fullName: 'Đoàn Tấn Phong',
    verifiedEvidences: [
      {
        evidenceId: '7712aaeb-3a1c-4e8d-9f2b-123456789abc',
        challengeName: 'Tối ưu Thuật toán Xử lý Bản đồ',
        companyName: 'MTech Solutions',
        industry: 'Công nghệ thông tin',
        totalScore: 8.6,
        unlockedAt: '2026-06-10T02:16:45Z',
      },
    ]
  })
}
