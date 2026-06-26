/**
 * ASSESSMENT MODULE — Upload Controller
 * Endpoint: GET /api/v1/assessment/challenges/:challenge_id/presigned-url
 */
import { sendSuccess } from '../../shared/utils/response.js'
import * as uploadService from '../services/upload.service.js'

export const getPresignedUrl = async (req, res) => {
  const { challenge_id } = req.params
  const { filename, content_type } = req.query

  const result = await uploadService.generatePresignedUploadUrl({
    userId: req.user.userId,   // lấy từ JWT, không nhận từ FE
    challengeId: challenge_id,
    filename,
    contentType: content_type,
  })

  return sendSuccess(res, result)
}
