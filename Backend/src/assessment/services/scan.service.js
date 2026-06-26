/**
 * ASSESSMENT MODULE — Scan Service
 *
 * Tải file từ MinIO về buffer tạm, đưa qua ClamAV để quét.
 * Nếu phát hiện mã độc → cập nhật Submission.status = 'REJECTED',
 * KHÔNG cho phép Employer xem được file này.
 */
import minioClient from '../../shared/config/minio.js'
import { getClamScan } from '../../shared/config/clamav.js'
import { config } from '../../shared/config/index.js'
import * as submissionRepository from '../repositories/submission.repository.js'

// Quét 1 file theo object_key trong MinIO — trả về { isInfected, viruses }
export const scanObjectForVirus = async (objectKey) => {
  const clamscan = await getClamScan()

  // Lấy file dưới dạng stream để quét trực tiếp, không cần tải hẳn xuống disk
  const stream = await minioClient.getObject(config.minio.bucket, objectKey)
  const { isInfected, viruses } = await clamscan.scanStream(stream)

  return { isInfected, viruses }
}

// Quét 1 Submission cụ thể và cập nhật trạng thái tương ứng
export const scanSubmission = async (submissionId) => {
  const submission = await submissionRepository.findSubmissionById(submissionId)
  if (!submission) {
    console.warn(`[ClamAV Job] Submission ${submissionId} không tồn tại, bỏ qua`)
    return
  }

  try {
    const { isInfected, viruses } = await scanObjectForVirus(submission.solutionUrl)

    if (isInfected) {
      // File dính mã độc — từ chối ngầm, KHÔNG cho Employer thấy nội dung
      await submissionRepository.updateSubmissionStatus(
        submissionId,
        'REJECTED',
        `[Hệ thống] File bị từ chối do phát hiện mã độc: ${viruses?.join(', ') || 'unknown'}`,
      )
      console.warn(`🦠 [ClamAV Job] Submission ${submissionId} NHIỄM VIRUS — đã reject`)
    } else {
      console.log(`✅ [ClamAV Job] Submission ${submissionId} an toàn`)
    }
  } catch (err) {
    // Lỗi quét (ClamAV down, file lỗi...) — KHÔNG tự ý reject, chỉ log để dev xử lý
    console.error(`[ClamAV Job] Lỗi khi quét submission ${submissionId}:`, err.message)
  }
}
