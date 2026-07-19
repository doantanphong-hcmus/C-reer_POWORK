/**
 * ASSESSMENT MODULE — Upload Service
 *
 * Theo API_Contracts mục 3.3:
 *   [GET] /assessment/challenges/{challenge_id}/presigned-url
 *
 * Flow: FE xin URL tạm → FE tự PUT file thẳng lên MinIO (không qua Backend)
 *       → Backend chỉ trả về object_key để dùng cho bước confirm submission sau
 */
import minioClient from '../../shared/config/minio.js'
import { config } from '../../shared/config/index.js'
import { v4 as uuidv4 } from 'uuid'

export const generatePresignedUploadUrl = async ({ challengeId, filename }) => {
  // Sử dụng UUID ngẫu nhiên thay vì userId để tránh rò rỉ danh tính ứng viên qua link tải bài
  const randomDir = uuidv4()
  const objectKey = `submissions/${challengeId}/${randomDir}/${Date.now()}_${filename}`

  const uploadUrl = await minioClient.presignedPutObject(
    config.minio.bucket,
    objectKey,
    config.minio.presignedExpirySeconds,
  )

  return {
    upload_url: uploadUrl,
    object_key: objectKey,
    expires_in: config.minio.presignedExpirySeconds,
  }
}
