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
  const { user_id } = req.params
  // TODO Sprint 1: const profile = await ProfileService.getByUserId(user_id)
  // Query: SELECT * FROM verified_evidences WHERE user_id = :user_id
  // KHÔNG JOIN về challenges hay users — dùng snapshot đã lưu
  return sendSuccess(res, {
    user_id,
    full_name: 'Đoàn Tấn Phong',
    verified_evidences: [
      {
        evidence_id: '7712aaeb-3a1c-4e8d-9f2b-123456789abc',
        challenge_name: 'Tối ưu Thuật toán Xử lý Bản đồ',  // Snapshot
        company_name: 'MTech Solutions',                      // Snapshot
        industry: 'Công nghệ thông tin',                      // Snapshot
        total_score: 8.6,
        unlocked_at: '2026-06-10T02:16:45Z',
      },
    ],
  })
}
