/**
 * IAM MODULE — Auth Controller
 * Prefix: /api/v1/auth
 */
import { sendSuccess, sendCreated } from '../../shared/utils/response.js'

const MOCK_TOKEN = 'mock.jwt.token.sprint0'

// POST /api/v1/auth/login
export const login = async (req, res) => {
  const { email } = req.body
  // TODO Sprint 1: const result = await AuthService.login(req.body)
  return sendSuccess(res, {
    access_token: MOCK_TOKEN,
    token_type: 'Bearer',
    user: {
      user_id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
      full_name: 'Trương Minh Quang',
      role: 'Candidate',
      email,
    },
  })
}

// POST /api/v1/auth/register
export const register = async (req, res) => {
  const { email, role, full_name } = req.body
  // TODO Sprint 1: const result = await AuthService.register(req.body)
  return sendCreated(
    res,
    {
      access_token: MOCK_TOKEN,
      token_type: 'Bearer',
      user: {
        user_id: `mock-${Date.now()}`,
        full_name: full_name ?? 'New User',
        role: role ?? 'Candidate',
        email,
      },
    },
    'Đăng ký thành công',
  )
}

// GET /api/v1/auth/me
export const getMe = async (req, res) => {
  // TODO Sprint 1: const user = await AuthService.getById(req.user.userId)
  return sendSuccess(res, {
    user_id: req.user?.userId ?? 'de305d54-75b4-431b-adb2-eb6b9e546014',
    full_name: 'Trương Minh Quang',
    role: req.user?.role ?? 'Candidate',
  })
}
