/**
 * CHALLENGE CONTROLLER — Challenge Module
 * Prefix: /api/v1/challenges
 *
 * Convention ERD:
 *   - Lưu company_name dạng Snapshot (không JOIN sang IAM Module)
 *   - rubrics là mảng có tổng weight = 100 (validate Sprint 1)
 *   - Hỗ trợ filter ?industry=... theo API Contracts
 */

import { sendSuccess, sendCreated } from '../utils/response.js'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_CHALLENGE = {
  challenge_id: '403bf47b-231a-4d22-9214-722a4669812a',
  title: 'Tối ưu Thuật toán Xử lý Bản đồ',
  description: 'Thiết kế và tối ưu thuật toán xử lý bản đồ địa lý...',
  industry: 'Công nghệ thông tin',
  company_name: 'MTech Solutions',   // Snapshot — không JOIN sang IAM
  deadline: '2026-06-30T23:59:59Z',
  status: 'Open',
  rubrics: [
    {
      criteria_id: 'aa152d43-014b-4892-ba21-cb9e443101d2',
      criteria_name: 'Kiến trúc mã nguồn',
      weight: 40,
      max_score: 10,
    },
    {
      criteria_id: 'bb263e54-125c-5903-cb32-dc0f554212e3',
      criteria_name: 'Tối ưu bộ nhớ',
      weight: 60,
      max_score: 10,
    },
  ],
  created_at: new Date().toISOString(),
}

// ─── GET /api/v1/challenges ───────────────────────────────────────────────────
// Query: ?industry=Công nghệ thông tin
// Trả:  array challenges (chỉ gồm trường tóm tắt, không kèm rubrics chi tiết)
export const getChallenges = async (req, res) => {
  const { industry } = req.query

  // TODO Sprint 1: const challenges = await ChallengeService.getAll({ industry })
  const challenges = [MOCK_CHALLENGE]
  const filtered = industry
    ? challenges.filter((c) => c.industry === industry)
    : challenges

  // Trả về dạng tóm tắt theo API Contracts
  const summaries = filtered.map(({ challenge_id, title, company_name, industry, deadline }) => ({
    challenge_id,
    title,
    company_name,
    industry,
    deadline,
  }))

  return sendSuccess(res, summaries)
}

// ─── GET /api/v1/challenges/:challenge_id ─────────────────────────────────────
// Trả: object challenge đầy đủ kèm rubrics — candidate đọc đề
export const getChallengeById = async (req, res) => {
  const { challenge_id } = req.params

  // TODO Sprint 1: const challenge = await ChallengeService.getById(challenge_id)
  return sendSuccess(res, { ...MOCK_CHALLENGE, challenge_id })
}

// ─── POST /api/v1/challenges ──────────────────────────────────────────────────
// Auth:  Bearer Employer_Token
// Nhận: { title, description, industry, deadline, rubrics: [{criteria_name, weight, max_score}] }
// Rule:  tổng weight của rubrics = 100 (validate ở Service Sprint 1)
export const createChallenge = async (req, res) => {
  const { title, description, industry, deadline, rubrics } = req.body

  // company_name lấy từ Employer profile — không để FE tự gửi lên
  // TODO Sprint 1: const employer = await IAMService.getCompanyByUserId(req.user.userId)
  const company_name = 'MTech Solutions' // mock

  // Gắn criteria_id (UUID) cho từng rubric item
  const rubrics_with_id = rubrics?.map((r, i) => ({
    criteria_id: `mock-criteria-${Date.now()}-${i}`,
    ...r,
  }))

  // TODO Sprint 1: const challenge = await ChallengeService.create({ ...req.body, company_name })
  const challenge = {
    challenge_id: `mock-${Date.now()}`,
    title,
    description,
    industry,
    company_name,   // Snapshot ghi luôn vào Challenges table
    deadline,
    status: 'Open',
    rubrics: rubrics_with_id,
    created_at: new Date().toISOString(),
  }

  return sendCreated(res, challenge)
}

// ─── PATCH /api/v1/challenges/:challenge_id/status ───────────────────────────
// Auth:  Bearer Employer_Token (phải là owner)
// Nhận: { status: "Closed" | "Archived" }
export const updateChallengeStatus = async (req, res) => {
  const { challenge_id } = req.params
  const { status } = req.body

  // TODO Sprint 1: await ChallengeService.updateStatus(challenge_id, req.user.userId, status)
  return sendSuccess(res, {
    challenge_id,
    status,
    updated_at: new Date().toISOString(),
  })
}
