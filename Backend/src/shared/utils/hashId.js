import crypto from 'crypto'

/**
 * Sinh mã Hash ID ẩn danh: "Candidate_3941"
 * SHA256(user_id + challenge_id + JWT_SECRET) → 4 ký tự hex viết hoa
 * Không thể reverse-engineer ra user_id từ hash_id
 */
export const generateHashId = (userId, challengeId) => {
  const raw = `${userId}:${challengeId}:${process.env.JWT_SECRET}`
  const hash = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 4).toUpperCase()
  return `Candidate_${hash}`
}
