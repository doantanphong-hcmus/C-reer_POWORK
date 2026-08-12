import { AppError } from '../../shared/utils/AppError.js'
import prisma from '../../shared/config/prisma.js'
import { assertChallengeOwnership, assertSubmissionReviewable } from './ownership.service.js'
import * as userLookupService from '../../iam/services/user-lookup.service.js'
import { sendEvaluationCompletedEmail } from './notification.service.js'

export const evaluateSubmission = async (
  submissionId,
  { evaluations, generalComment },
  companyId,
  database = prisma,
) => {
  const notification = await database.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { id: submissionId },
      include: { identityMapping: true },
    })

    if (!submission) throw new AppError('Không tìm thấy submission', 404, 'ASSESS_002')

    const challenge = await tx.challenge.findUnique({ where: { id: submission.challengeId } })
    assertChallengeOwnership(challenge, companyId)
    assertSubmissionReviewable(submission)

    if (!submission.identityMapping) {
      throw new AppError('Không tìm thấy identity mapping', 404, 'ASSESS_003')
    }
    if (submission.identityMapping.isUnlocked) {
      throw new AppError(
        'Cannot evaluate. This submission has already been unlocked and frozen.',
        403,
        'ASSESS_006',
      )
    }

    if (submission.status !== 'PENDING') {
      throw new AppError('Submission không còn ở trạng thái có thể chấm.', 409, 'ASSESS_011')
    }

    const criteriaIds = evaluations.map((evaluation) => evaluation.criteriaId)
    if (new Set(criteriaIds).size !== criteriaIds.length) {
      throw new AppError('Không được gửi trùng rubric criteria.', 400, 'ASSESS_007')
    }

    const criteria = await tx.rubricCriteria.findMany({
      where: { id: { in: criteriaIds }, challengeId: submission.challengeId },
      select: { id: true, criteriaName: true, maxScore: true },
    })
    if (criteria.length !== criteriaIds.length) {
      throw new AppError('Rubric criteria không thuộc challenge của submission.', 400, 'ASSESS_007')
    }

    const maxScoreByCriteria = new Map(criteria.map(({ id, maxScore }) => [id, maxScore]))
    if (
      evaluations.some(
        ({ criteriaId, score }) =>
          !Number.isFinite(score) || score < 0 || score > maxScoreByCriteria.get(criteriaId),
      )
    ) {
      throw new AppError('Điểm phải nằm trong khoảng từ 0 đến maxScore.', 400, 'ASSESS_007')
    }

    await tx.evaluationResult.createMany({
      data: evaluations.map((evaluation) => ({
        submissionId,
        criteriaId: evaluation.criteriaId,
        score: evaluation.score,
        comment: evaluation.comment,
      })),
    })
    await tx.submission.update({
      where: { id: submissionId },
      data: { status: 'EVALUATED', generalComment },
    })

    const criteriaById = new Map(criteria.map((item) => [item.id, item]))
    return {
      userId: submission.identityMapping.userId,
      challengeTitle: challenge.title,
      hashId: submission.hashId,
      evaluations: evaluations.map((evaluation) => ({
        criteriaName: criteriaById.get(evaluation.criteriaId).criteriaName,
        score: evaluation.score,
        maxScore: criteriaById.get(evaluation.criteriaId).maxScore,
      })),
    }
  })

  if (notification.userId) {
    userLookupService
      .getUserById(notification.userId)
      .then((user) =>
        sendEvaluationCompletedEmail({
          toEmail: user.email,
          fullName: user.full_name,
          challengeTitle: notification.challengeTitle,
          hashId: notification.hashId,
          evaluations: notification.evaluations,
          generalComment,
        }),
      )
      .catch((error) => console.error('[Evaluation] Không gửi được email kết quả:', error.message))
  }

  const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)

  return {
    submissionId,
    evaluations,
    generalComment,
    totalScore,
    evaluatedAt: new Date().toISOString(),
  }
}
