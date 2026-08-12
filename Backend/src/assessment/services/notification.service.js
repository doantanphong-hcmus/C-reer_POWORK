import transporter from '../../shared/config/mailer.js'
import { config } from '../../shared/config/index.js'
import prisma from '../../shared/config/prisma.js'
import * as userLookupService from '../../iam/services/user-lookup.service.js'

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const renderEmail = ({ eyebrow, title, greeting, introduction, content, footer }) => `
<!doctype html>
<html lang="vi">
  <body style="margin:0;background:#f1f5f7;font-family:Arial,sans-serif;color:#17212b">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f7;padding:32px 12px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dce4e8;border-radius:16px;overflow:hidden">
            <tr>
              <td style="background:#0b1720;padding:24px 32px">
                <div style="font-size:30px;font-weight:800;letter-spacing:5px;line-height:1;color:#ffffff">POWORK</div>
                <div style="margin-top:9px;font-size:12px;letter-spacing:0.6px;color:#a9bbc5">Blind Audition Platform</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 30px">
                <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0b7180">${escapeHtml(eyebrow)}</div>
                <h1 style="margin:10px 0 22px;font-size:27px;line-height:1.3;color:#17212b">${escapeHtml(title)}</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#33434f">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#52616b">${escapeHtml(introduction)}</p>
                ${content}
                <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#52616b">${escapeHtml(footer)}</p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e6ecef;padding:20px 32px;font-size:12px;line-height:1.6;color:#77858e">
                Email này được gửi tự động từ POWORK. Thông tin ứng viên vẫn được bảo vệ theo quy trình đánh giá ẩn danh.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

export const buildSubmissionOutcomeEmail = ({
  outcome,
  hashId,
  version,
  challengeTitle,
  rejectionReason,
}) => {
  const rejected = outcome === 'REJECTED'
  const reason =
    rejectionReason ||
    'Tệp bài làm không vượt qua bước kiểm tra an toàn nên chưa thể được chuyển tới nhà tuyển dụng.'
  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f9fa;border:1px solid #e1e8eb;border-radius:12px;padding:18px">
      <tr><td style="padding:4px 0;font-size:13px;color:#77858e">Thử thách</td><td align="right" style="padding:4px 0;font-size:14px;font-weight:700;color:#17212b">${escapeHtml(challengeTitle)}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#77858e">Mã ẩn danh</td><td align="right" style="padding:4px 0;font-family:monospace;font-size:13px;color:#0b7180">${escapeHtml(hashId)}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#77858e">Phiên bản</td><td align="right" style="padding:4px 0;font-size:14px;font-weight:700;color:#17212b">v${escapeHtml(version)}</td></tr>
    </table>
    ${
      rejected
        ? `<div style="margin-top:18px;border-left:3px solid #b45309;background:#fff8eb;padding:14px 16px;font-size:14px;line-height:1.7;color:#52616b"><strong style="display:block;margin-bottom:5px;color:#17212b">Lý do</strong>${escapeHtml(reason)}</div>`
        : ''
    }`

  return {
    subject: rejected
      ? 'POWORK | Bài nộp chưa được chấp nhận'
      : 'POWORK | Bài làm đã được ghi nhận thành công',
    text: rejected
      ? `Chào bạn,\n\nBài nộp cho thử thách “${challengeTitle}” chưa được chấp nhận.\n\nLý do: ${reason}\n\nBạn có thể kiểm tra lại tệp và nộp một phiên bản mới.\n\nMã ẩn danh: ${hashId} — Phiên bản v${version}\n\nĐội ngũ POWORK`
      : `Chào bạn,\n\nCảm ơn bạn đã hoàn thành và gửi bài cho thử thách “${challengeTitle}”. Bài làm đã được ghi nhận và sẵn sàng cho quá trình đánh giá ẩn danh.\n\nMã ẩn danh: ${hashId} — Phiên bản v${version}\n\nĐội ngũ POWORK`,
    html: renderEmail({
      eyebrow: rejected ? 'Cập nhật bài nộp' : 'Xác nhận bài nộp',
      title: rejected ? 'Bài nộp chưa được chấp nhận' : 'Bài làm đã được ghi nhận thành công',
      greeting: 'Chào bạn,',
      introduction: rejected
        ? 'Tệp bài làm chưa vượt qua bước kiểm tra an toàn và chưa được chuyển tới nhà tuyển dụng.'
        : 'Cảm ơn bạn đã hoàn thành bài thử thách. Bài làm đã sẵn sàng cho quá trình đánh giá ẩn danh.',
      content,
      footer: rejected
        ? 'Bạn có thể kiểm tra lại tệp, loại bỏ nội dung có nguy cơ và nộp một phiên bản mới.'
        : 'Nhà tuyển dụng sẽ đánh giá năng lực thể hiện trong bài làm trước khi có thể tiếp cận danh tính của bạn.',
    }),
  }
}

const send = async ({ toEmail, subject, html, context }, mailer = transporter) => {
  try {
    await mailer.sendMail({ from: config.mail.from, to: toEmail, subject, html })
    console.log(`[Notification] Đã gửi ${context} tới ${toEmail}`)
  } catch (error) {
    console.error(`[Notification] Không gửi được ${context}:`, error.message)
  }
}

const deliverSubmissionOutcome = async ({ toEmail, ...details }, mailer = transporter) => {
  const message = buildSubmissionOutcomeEmail(details)
  await mailer.sendMail({ from: config.mail.from, to: toEmail, ...message })
}

export const sendSubmissionAcceptedEmail = async (details, mailer = transporter) => {
  try {
    await deliverSubmissionOutcome({ ...details, outcome: 'ACCEPTED' }, mailer)
  } catch (error) {
    console.error('[Notification] Không gửi được email xác nhận bài nộp:', error.message)
  }
}

export const sendSubmissionScanOutcomeEmail = async (
  submissionId,
  outcome,
  rejectionReason,
  { database = prisma, getUserById = userLookupService.getUserById, mailer = transporter } = {},
) => {
  try {
    const submission = await database.submission.findUnique({
      where: { id: submissionId },
      select: {
        hashId: true,
        version: true,
        identityMapping: { select: { userId: true } },
        challenge: { select: { title: true } },
      },
    })
    if (!submission?.identityMapping?.userId) return

    const { email } = await getUserById(submission.identityMapping.userId)
    await deliverSubmissionOutcome(
      {
        toEmail: email,
        outcome,
        hashId: submission.hashId,
        version: submission.version,
        challengeTitle: submission.challenge.title,
        rejectionReason,
      },
      mailer,
    )
  } catch (error) {
    console.error('[Notification] Không gửi được email kết quả quét bài nộp:', error.message)
  }
}

export const sendSubmissionConfirmationEmail = async (
  { toEmail, hashId, version, challengeTitle },
  mailer = transporter,
) => {
  const content = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f9fa;border:1px solid #e1e8eb;border-radius:12px;padding:18px">
      <tr><td style="padding:4px 0;font-size:13px;color:#77858e">Thử thách</td><td align="right" style="padding:4px 0;font-size:14px;font-weight:700;color:#17212b">${escapeHtml(challengeTitle)}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#77858e">Mã ẩn danh</td><td align="right" style="padding:4px 0;font-family:monospace;font-size:13px;color:#0b7180">${escapeHtml(hashId)}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#77858e">Phiên bản</td><td align="right" style="padding:4px 0;font-size:14px;font-weight:700;color:#17212b">v${escapeHtml(version)}</td></tr>
    </table>`

  return send(
    {
      toEmail,
      subject: 'POWORK | Bài làm của bạn đã được ghi nhận',
      context: `email xác nhận bài nộp ${hashId}`,
      html: renderEmail({
        eyebrow: 'Xác nhận bài nộp',
        title: 'Bài làm đã được ghi nhận thành công',
        greeting: 'Chào bạn,',
        introduction:
          'Cảm ơn bạn đã hoàn thành bài thử thách. Nhà tuyển dụng sẽ đánh giá nội dung bằng mã ẩn danh trước khi có thể xem thông tin cá nhân của bạn.',
        content,
        footer:
          'Bạn không cần thực hiện thêm thao tác nào ở thời điểm này. POWORK sẽ tiếp tục cập nhật khi bài làm có kết quả đánh giá mới.',
      }),
    },
    mailer,
  )
}

export const sendEvaluationCompletedEmail = async (
  { toEmail, fullName, challengeTitle, hashId, evaluations, generalComment },
  mailer = transporter,
) => {
  const evaluationRows = evaluations
    .map(
      ({ criteriaName, score, maxScore }) => `
        <tr>
          <td style="border-bottom:1px solid #e7ecef;padding:10px 0;font-size:14px;color:#33434f">${escapeHtml(criteriaName)}</td>
          <td align="right" style="border-bottom:1px solid #e7ecef;padding:10px 0;font-size:14px;font-weight:700;color:#17212b">${escapeHtml(score)}/${escapeHtml(maxScore)}</td>
        </tr>`,
    )
    .join('')
  const comment = generalComment
    ? `<div style="margin-top:18px;border-left:3px solid #0b7180;background:#f6f9fa;padding:14px 16px;font-size:14px;line-height:1.7;color:#52616b"><strong style="display:block;margin-bottom:5px;color:#17212b">Nhận xét chung</strong>${escapeHtml(generalComment)}</div>`
    : ''
  const content = `
    <div style="margin-bottom:18px;font-size:14px;line-height:1.7;color:#52616b">
      <strong style="color:#17212b">${escapeHtml(challengeTitle)}</strong><br />
      Mã bài ẩn danh: <span style="font-family:monospace;color:#0b7180">${escapeHtml(hashId)}</span>
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${evaluationRows}</table>
    ${comment}`

  return send(
    {
      toEmail,
      subject: 'POWORK | Bài làm của bạn đã được chấm',
      context: `email kết quả đánh giá ${hashId}`,
      html: renderEmail({
        eyebrow: 'Cập nhật đánh giá',
        title: 'Bài làm của bạn đã được chấm',
        greeting: `Chào ${fullName || 'bạn'},`,
        introduction:
          'Nhà tuyển dụng đã hoàn tất chấm điểm bài làm theo bộ tiêu chí của thử thách. Đây là cập nhật về kết quả đánh giá, chưa đồng nghĩa với quyết định tuyển dụng cuối cùng.',
        content,
        footer:
          'Cảm ơn bạn đã dành thời gian thể hiện năng lực trên POWORK. Hệ thống sẽ tiếp tục thông báo khi quy trình có cập nhật mới.',
      }),
    },
    mailer,
  )
}
