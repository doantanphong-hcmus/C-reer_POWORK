import { AppError } from '../../shared/utils/AppError.js'
import prisma from '../../shared/config/prisma.js'

export const evaluateSubmission = async (submissionId, { evaluations, generalComment }) => {
  const submission = await prisma.submission.findUnique({ where: { id: submissionId } })
  if (!submission) throw new AppError('Không tìm thấy submission', 404, 'ASSESS_002')

  await prisma.$transaction([
    ...evaluations.map((e) =>
      prisma.evaluationResult.create({
        data: {
          submissionId,
          criteriaId: e.criteriaId,
          score: e.score,
          comment: e.comment,
        },
      }),
    ),
    prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'EVALUATED', generalComment: generalComment },
    }),
  ])

  const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)

  return {
    submissionId,
    evaluations,
    generalComment,
    totalScore,
    evaluatedAt: new Date().toISOString(),
  }
}
