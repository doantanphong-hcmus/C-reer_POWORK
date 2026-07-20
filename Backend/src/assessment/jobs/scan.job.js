/**
 * ASSESSMENT MODULE — Scan Job (Background)
 *
 * Đây là job chạy NGẦM, KHÔNG block response của API submit.
 * Theo nhiệm vụ: "Background Job gọi ClamAV quét file trên MinIO,
 * nếu file dính mã độc, hệ thống sẽ từ chối ngầm bài nộp."
 *
 * Cách dùng đơn giản nhất (Sprint hiện tại — chưa cần queue thật như BullMQ):
 *   queueScanJob(submissionId) → chạy scanSubmission() bất đồng bộ,
 *   không await trong request/response cycle.
 *
 * TODO Sprint sau: thay bằng BullMQ + Redis khi cần retry/concurrency control.
 */
import * as scanService from '../services/scan.service.js'

export const queueScanJob = (submissionId) => {
  // setImmediate đảm bảo job chạy SAU khi response đã trả về cho FE,
  // không làm chậm trải nghiệm "nộp bài" của ứng viên
  setImmediate(() => {
    scanService.scanSubmission(submissionId).catch((err) => {
      console.error(`[ScanJob] Lỗi không bắt được khi quét submission ${submissionId}:`, err)
    })
  })
}
