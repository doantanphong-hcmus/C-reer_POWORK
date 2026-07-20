/**
 * ASSESSMENT MODULE — Notification Service
 *
 * Gửi email xác nhận sau khi ứng viên nộp bài thành công.
 * QUAN TRỌNG: Email gửi tới địa chỉ thật của ứng viên (lấy qua IAM Interface),
 * nhưng NỘI DUNG email chỉ nói "Candidate_XYZ" — không tiết lộ thông tin
 * sang phía Employer. Đây vẫn là giao tiếp 1-1 giữa hệ thống và ứng viên,
 * không vi phạm Blind Audition.
 */
import transporter from '../../shared/config/mailer.js'
import { config } from '../../shared/config/index.js'

export const sendSubmissionConfirmationEmail = async ({
  toEmail,
  hashId,
  version,
  challengeTitle,
}) => {
  const html = `
    <p>Chào bạn,</p>
    <p>Bài làm của bạn cho thử thách <strong>${challengeTitle}</strong> đã được ghi nhận thành công.</p>
    <p>Mã ẩn danh của bạn là: <strong>${hashId}</strong> (phiên bản nộp: v${version})</p>
    <p>Nhà tuyển dụng sẽ chấm điểm bài làm này mà không biết danh tính của bạn,
       cho đến khi họ quyết định mở khóa thông tin liên hệ.</p>
    <p>— Đội ngũ POWORK</p>
  `

  // Gửi email KHÔNG được phép làm chậm hoặc làm fail luồng submit chính
  // → caller (submission.service.js) gọi hàm này theo kiểu "fire and forget"
  try {
    await transporter.sendMail({
      from: config.mail.from,
      to: toEmail,
      subject: 'POWORK — Bài làm đã được ghi nhận',
      html,
    })
    console.log(`📧 [Notification] Đã gửi email xác nhận tới ${toEmail} — ${hashId}`)
  } catch (err) {
    // Lỗi gửi mail KHÔNG được throw lên — chỉ log, không ảnh hưởng response submit
    console.error('[Notification] Gửi email thất bại:', err.message)
  }
}
