/**
 * PROFILE CONTROLLER — Profile Module
 * Prefix: /api/v1/profiles
 *
 * Convention ERD — Profile Module dùng Snapshot Data:
 *   Bảng Verified_Evidences lưu challenge_name, company_name, industry
 *   trực tiếp tại thời điểm unlock — KHÔNG JOIN về Challenge hay IAM Module.
 *
 *   Lý do: bảo vệ hồ sơ vĩnh viễn kể cả khi Challenge gốc bị xóa,
 *   đồng thời đảm bảo tốc độ query nhanh (không cần join nhiều bảng).
 *
 * Route public — ai cũng xem được profile của ứng viên.
 */

import { sendSuccess } from '../utils/response.js'

// ─── GET /api/v1/profiles/:user_id ───────────────────────────────────────────
// Public — không cần auth
// Trả:  { user_id, full_name, verified_evidences: [...] }
export const getProfile = async (req, res) => {
  const { user_id } = req.params

  // TODO Sprint 1: const profile = await ProfileService.getByUserId(user_id)
  // Query: SELECT * FROM Verified_Evidences WHERE user_id = :user_id
  // (KHÔNG JOIN về Challenges hay Users — dùng Snapshot đã lưu sẵn)

  return sendSuccess(res, {
    user_id,
    full_name: 'Đoàn Tấn Phong',
    verified_evidences: [
      {
        evidence_id: '7712aaeb-3a1c-4e8d-9f2b-123456789abc',
        challenge_name: 'Tối ưu Thuật toán Xử lý Bản đồ',   // Snapshot
        company_name: 'MTech Solutions',                       // Snapshot
        industry: 'Công nghệ thông tin',                       // Snapshot
        total_score: 8.6,
        unlocked_at: '2026-06-10T02:16:45Z',
      },
    ],
  })
}
