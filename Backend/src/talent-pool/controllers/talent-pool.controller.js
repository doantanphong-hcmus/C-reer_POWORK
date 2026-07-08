/**
 * TALENT POOL MODULE — Talent Pool Controller
 * Prefix: /api/v1/talent-pool
 *
 * Cho phép Employer lưu lại danh sách ứng viên đã unlock để tiện theo dõi.
 *
 * Ranh giới module (ERD mục 2.5):
 *   - Bảng talent_pools lưu companyId và userId dạng DATA FIELD — không FK cứng
 *   - Không JOIN trực tiếp sang IAM Module ở tầng DB
 *   - Thông tin ứng viên (full_name, university...) lấy qua Internal Service Interface
 */

import { sendSuccess, sendCreated } from '../../shared/utils/response.js'
import { AppError } from '../../shared/utils/AppError.js'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_POOL_ENTRY = {
  poolId: '8b9e67a1-1234-421c-a32e-11bc9aef4421',
  candidate: {
    userId: 'de305d54-75b4-431b-adb2-eb6b9e546014',
    fullName: 'Đoàn Tấn Phong',
    university: 'HCMUS',
    year: 'Năm 4',
    primarySkills: ['System Design', 'Redis'],
  },
  highestScore: 92.0,
  challengesTaken: ['Caching', 'API Design'],
  status: 'INVITED',
  addedAt: '2026-06-12T10:00:00Z',
}

// ─── POST /api/v1/talent-pool ─────────────────────────────────────────────────
// Ai gọi: Employer — sau khi unlock ứng viên, muốn lưu vào danh sách theo dõi
// Auth:   Bearer Employer_Token
// Nhận:  { userId } — userId của ứng viên đã được unlock trước đó
// Lưu ý: Chỉ được thêm ứng viên đã unlock (isUnlocked = true trong identity_mappings)
//        Việc kiểm tra này sẽ do TalentPoolService xử lý ở Sprint 1
export const addToTalentPool = async (req, res) => {
  const { userId } = req.body

  if (!userId) throw new AppError('userId là bắt buộc', 400, 'POOL_001')

  // companyId lấy từ JWT (Employer đang đăng nhập) — không để FE tự gửi

  // TODO Sprint 1: await TalentPoolService.add(companyId, userId)
  // Service sẽ:
  //   1. Kiểm tra userId này đã được unlock bởi company này chưa
  //   2. Kiểm tra đã có trong pool chưa (tránh trùng)
  //   3. INSERT talent_pools { companyId, userId, status: 'IN_POOL' }

  return sendCreated(res, null, 'Candidate added to Talent Pool')
}

// ─── GET /api/v1/talent-pool ──────────────────────────────────────────────────
// Ai gọi: Employer — xem danh sách ứng viên đang theo dõi
// Auth:   Bearer Employer_Token
// Trả:   danh sách ứng viên kèm highestScore, challengesTaken, status
export const getTalentPool = async (req, res) => {
  // TODO Sprint 1: const pool = await TalentPoolService.getByCompany(companyId)
  // Service sẽ:
  //   1. SELECT từ talent_pools WHERE companyId = :companyId
  //   2. Với mỗi userId → gọi IAMService.getUserInfo(userId) qua Interface
  //   3. Gọi AssessmentService.getHighestScore(userId, companyId)
  //   4. Gộp data trả về (KHÔNG JOIN trực tiếp DB)

  return sendSuccess(res, [MOCK_POOL_ENTRY])
}
