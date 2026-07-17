/**
 * CHALLENGE MODULE — Challenge Controller
 * Prefix: /api/v1/challenges
 *
 * Controller chỉ đọc req, gọi service, trả response.
 * Logic nghiệp vụ (validate weight=100, deadline, trùng tên...) nằm ở
 * challenge.service.js — đối chiếu Test_Cases_Challenge.md
 */
import { sendSuccess, sendCreated } from '../../shared/utils/response.js'
import * as challengeService from '../services/challenge.service.js'
import * as companyService from '../../iam/services/company.service.js' // Internal Service Interface

// GET /api/v1/challenges?industry=...
export const getChallenges = async (req, res) => {
  const { industry } = req.query
  const challenges = await challengeService.getChallenges({ industry })
  return sendSuccess(res, challenges)
}

// GET /api/v1/challenges/:challenge_id
export const getChallengeById = async (req, res) => {
  const { challengeId } = req.params
  const challenge = await challengeService.getChallengeById(challengeId)
  return sendSuccess(res, challenge)
}

// POST /api/v1/challenges
export const createChallenge = async (req, res) => {
  // companyId/companyName lấy qua IAM Internal Service Interface — KHÔNG tự
  // query bảng companies trực tiếp (đúng ranh giới module trong Coding Convention)
  const { company_id: companyId, company_name: companyName } = await companyService.getCompanyByUserId(req.user.userId)

  const challenge = await challengeService.createChallenge({
    employerUserId: req.user.userId,
    companyId: companyId,
    companyName: companyName,
    payload: req.body,
  })

  return sendCreated(res, challenge)
}

// PATCH /api/v1/challenges/:challenge_id/status
export const updateChallengeStatus = async (req, res) => {
  const { challengeId } = req.params
  const { status } = req.body
  const { company_id: companyId } = await companyService.getCompanyByUserId(req.user.userId)

  const updated = await challengeService.updateChallengeStatus(challengeId, companyId, status)
  return sendSuccess(res, updated)
}
