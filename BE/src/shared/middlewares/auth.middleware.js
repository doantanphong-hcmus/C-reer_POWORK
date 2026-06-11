/**
 * Shared Middleware — dùng chung cho tất cả domain
 * Theo Coding Convention: shared/ chỉ chứa code dùng chung như JWT check
 */
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { AppError } from '../utils/AppError.js'

// Xác thực JWT — gắn req.user = { userId, role }
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Chưa đăng nhập hoặc token bị thiếu', 401, 'AUTH_001')
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch {
    throw new AppError('Token không hợp lệ hoặc đã hết hạn', 401, 'AUTH_002')
  }
}

// Kiểm tra role — dùng sau authenticate
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new AppError('Không đủ quyền thực hiện hành động này', 403, 'AUTH_003')
    }
    next()
  }
}

/**
 * Blind Audition Guard — Assessment Module
 * Xóa user_id nếu FE cố tình gửi lên trong body/query
 * Đảm bảo controller chỉ nhận user_id từ JWT (req.user), không từ FE
 */
export const blindAuditionGuard = (req, res, next) => {
  if (req.body) {
    delete req.body.user_id
    delete req.body.userId
    delete req.body.candidate_id
  }
  if (req.query) {
    delete req.query.user_id
    delete req.query.userId
  }
  next()
}
