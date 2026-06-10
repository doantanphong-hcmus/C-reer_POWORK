/**
 * AUTH CONTROLLER — IAM Module
 * Prefix: /api/v1/auth
 *
 * Response naming: snake_case theo API Contracts
 * Format: { status: "success", data: { ... } }
 */

import { sendSuccess, sendCreated } from '../utils/response.js'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  user_id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
  full_name: 'Trương Minh Quang',
  role: 'Candidate',
}
const MOCK_TOKEN = 'mock.jwt.token.sprint0'

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────
// Nhận:  { email, password }
// Trả:   { access_token, token_type, user: { user_id, full_name, role } }
export const login = async (req, res) => {
  const { email } = req.body

  // TODO Sprint 1: const result = await AuthService.login(req.body)
  return sendSuccess(res, {
    access_token: MOCK_TOKEN,
    token_type: 'Bearer',
    user: { ...MOCK_USER, email },
  })
}

// ─── POST /api/v1/auth/register ──────────────────────────────────────────────
// Nhận:  { email, password, role, full_name }
// Trả:   { access_token, token_type, user }
export const register = async (req, res) => {
  const { email, role, full_name } = req.body

  // TODO Sprint 1: const result = await AuthService.register(req.body)
  return sendCreated(res, {
    access_token: MOCK_TOKEN,
    token_type: 'Bearer',
    user: {
      user_id: `mock-${Date.now()}`,
      full_name: full_name ?? 'New User',
      role: role ?? 'Candidate',
      email,
    },
  }, 'Đăng ký thành công')
}

// ─── GET /api/v1/auth/me ──────────────────────────────────────────────────────
// Auth:  Bearer token (authenticate middleware gắn req.user)
// Trả:   { user_id, full_name, role }
export const getMe = async (req, res) => {
  // TODO Sprint 1: const user = await AuthService.getById(req.user.userId)
  return sendSuccess(res, {
    ...MOCK_USER,
    user_id: req.user?.userId ?? MOCK_USER.user_id,
  })
}
