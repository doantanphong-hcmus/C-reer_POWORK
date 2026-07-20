/**
 * PROFILE MODULE — Evidence Lookup Service (Internal Service Interface)
 *
 * Talent Pool Module gọi qua đây để lấy:
 *   - highest_score: điểm cao nhất trong verified_evidences của ứng viên
 *   - challenges_taken: danh sách tên challenge đã vượt qua
 *
 * KHÔNG JOIN trực tiếp từ talent_pools sang verified_evidences ở tầng DB.
 */
import prisma from '../../shared/config/prisma.js'

export const getEvidenceSummaryByUserId = async (userId) => {
  const evidences = await prisma.verifiedEvidence.findMany({
    where: { userId },
    select: {
      totalScore: true,
      challengeName: true,
    },
  })

  if (evidences.length === 0) {
    return { highest_score: 0, challenges_taken: [] }
  }

  const highestScore = Math.max(...evidences.map((e) => e.totalScore))
  const challengesTaken = evidences.map((e) => e.challengeName)

  return { highest_score: highestScore, challenges_taken: challengesTaken }
}
