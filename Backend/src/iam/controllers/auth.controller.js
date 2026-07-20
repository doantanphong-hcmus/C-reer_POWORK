/**
 * IAM MODULE — Auth Controller
 * Prefix: /api/v1/auth
 *
 * Controller chỉ đọc req, gọi service, trả response.
 * Toàn bộ logic (hash, validate, JWT) nằm ở auth.service.js
 */
import { sendSuccess, sendCreated } from '../../shared/utils/response.js'
import * as authService from '../services/auth.service.js'

// POST /api/v1/auth/register
export const register = async (req, res) => {
  const user = await authService.register(req.body)
  return sendCreated(res, { user }, 'User registered successfully')
}

// POST /api/v1/auth/login
export const login = async (req, res) => {
  const result = await authService.login(req.body)
  return sendSuccess(res, result)
}

// GET /api/v1/auth/me
export const getMe = async (req, res) => {
  const user = await authService.getById(req.user.userId)
  return sendSuccess(res, user)
}
