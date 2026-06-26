import { AppError } from '../../shared/utils/AppError.js'
import prisma from '../../shared/config/prisma.js'

export const evaluateSubmission = async (submissionId, { evaluations, general_comment }) => {
  const submission = await prisma.submission.findUnique({ where: { id: submissionId } })
  if (!submission) throw new AppError('Không tìm thấy submission', 404, 'ASSESS_002')

  await prisma.$transaction([
    ...evaluations.map((e) =>
      prisma.evaluationResult.create({
        data: {
          submissionId,
          criteriaId: e.criteria_id,
          score: e.score,
          comment: e.comment,
        },
      })
    ),
    prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'EVALUATED', generalComment: general_comment },
    }),
  ])

  const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)

  return {
    submission_id: submissionId,
    evaluations,
    general_comment,
    total_score: totalScore,
    evaluated_at: new Date().toISOString(),
  }
}
