import crypto from 'crypto'

/**
 * Format: Candidate_{4 ký số hex viết hoa}
 * Ví dụ: Candidate_3941, Candidate_7A9B, Candidate_F2C0
 */
export const generateHashId = (userId, challengeId) => {
  const raw = `${userId}:${challengeId}:${process.env.JWT_SECRET}`
  const hash = crypto
    .createHash('sha256')
    .update(raw)
    .digest('hex')
    .slice(0, 4)
    .toUpperCase()
  return `Candidate_${hash}`
}
