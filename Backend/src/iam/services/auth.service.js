/**
 * IAM MODULE — Auth Service
 *
 * Toàn bộ logic nghiệp vụ của Auth nằm ở đây:
 *   - Hash / verify password (bcrypt)
 *   - Validate input nghiệp vụ (email trùng, role hợp lệ...)
 *   - Sign JWT
 *
 * Service KHÔNG biết Express là gì (không có req/res) — chỉ nhận data thuần và trả data thuần, để dễ test và tái sử dụng.
 */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../../shared/config/index.js'
import { AppError } from '../../shared/utils/AppError.js'
import * as userRepository from '../repositories/user.repository.js'

const SALT_ROUNDS = 10

// ─── Register ──────────────────────────────────────────────────────────────────
export const register = async ({ email, password, full_name, role, company_name }) => {
  // 1. Validate role hợp lệ
  if (!['Candidate', 'Employer'].includes(role)) {
    throw new AppError('role phải là Candidate hoặc Employer', 400, 'AUTH_004')
  }

  // 2. Employer bắt buộc phải có company_name
  if (role === 'Employer' && !company_name) {
    throw new AppError('company_name là bắt buộc khi role là Employer', 400, 'AUTH_005')
  }

  // 3. Kiểm tra email đã tồn tại chưa
  const existing = await userRepository.findByEmail(email)
  if (existing) {
    throw new AppError('Email đã được đăng ký', 409, 'AUTH_006')
  }

  // 4. Hash password — KHÔNG BAO GIỜ lưu password thô
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  // 5. Tạo user (Nested Write nếu là Employer — xem user.repository.js)
  const user = await userRepository.createUser({
    email,
    passwordHash,
    fullName: full_name,
    role,
    companyName: company_name,
  })

  // 6. Trả về theo đúng format API Contracts — KHÔNG trả passwordHash
  return {
    user_id: user.id,
    email: user.email,
    full_name: user.fullName,
    role: user.role,
    company_id: user.company?.id ?? null,
  }
}

// ─── Login ─────────────────────────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  // 1. Tìm user theo email
  const user = await userRepository.findByEmail(email)
  if (!user) {
    // Không tiết lộ "email không tồn tại" để tránh user enumeration
    throw new AppError('Email hoặc mật khẩu không đúng', 401, 'AUTH_007')
  }

  // 2. So khớp password với hash đã lưu
  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    throw new AppError('Email hoặc mật khẩu không đúng', 401, 'AUTH_007')
  }

  // 3. Sign JWT — payload chứa userId, role, companyId (nếu có)
  const access_token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      companyId: user.company?.id ?? null,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )

  // 4. Trả về theo đúng format API Contracts
  return {
    access_token,
    token_type: 'Bearer',
    user: {
      user_id: user.id,
      full_name: user.fullName,
      role: user.role,
    },
  }
}

// ─── Get current user (dùng cho GET /auth/me) ─────────────────────────────────
export const getById = async (userId) => {
  const user = await userRepository.findById(userId)
  if (!user) throw new AppError('Không tìm thấy người dùng', 404, 'AUTH_008')

  return {
    user_id: user.id,
    email: user.email,
    full_name: user.fullName,
    role: user.role,
    company_id: user.company?.id ?? null,
  }
}
