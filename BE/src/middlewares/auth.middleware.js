import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { AppError } from '../utils/AppError.js'

// Middleware xác thực JWT - gắn user vào req
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized - Token missing', 401)
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded // { userId, role }
    next()
  } catch {
    throw new AppError('Unauthorized - Invalid token', 401)
  }
}

// Chỉ cho phép role cụ thể
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new AppError('Forbidden - Insufficient permissions', 403)
    }
    next()
  }
}

// ─── MIDDLEWARE CỐT LÕI: Blind Audition Guard ───────────────────────────────
// Chặn userId tuyệt đối - không cho phép truyền xuống layer scoring
// Theo đúng yêu cầu: "User_ID bị chặn lại, không được truyền xuống layer chấm điểm"
export const blindAuditionGuard = (req, res, next) => {
  // Xóa bỏ bất kỳ attempt nào inject userId vào body/query của scoring request
  if (req.body) {
    delete req.body.userId
    delete req.body.candidateId
    delete req.body.user_id
    delete req.body.candidate_id
  }
  if (req.query) {
    delete req.query.userId
    delete req.query.candidateId
  }
  next()
}
