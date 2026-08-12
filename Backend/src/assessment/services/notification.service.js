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

const brandLogoUrl = `${config.clientUrl.replace(/\/$/, '')}/favicon/favicon-96x96.png`

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
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:12px">
                      <img src="${escapeHtml(brandLogoUrl)}" width="44" height="44" alt="POWORK" style="display:block;border-radius:10px;background:#ffffff" />
                    </td>
                    <td>
                      <div style="font-size:18px;font-weight:700;letter-spacing:2px;color:#ffffff">POWORK</div>
                      <div style="margin-top:3px;font-size:12px;color:#a9bbc5">Blind Audition Platform</div>
                    </td>
                  </tr>
                </table>
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

const send = async ({ toEmail, subject, html, context }, mailer = transporter) => {
  try {
    await mailer.sendMail({ from: config.mail.from, to: toEmail, subject, html })
    console.log(`[Notification] Đã gửi ${context} tới ${toEmail}`)
  } catch (error) {
    console.error(`[Notification] Không gửi được ${context}:`, error.message)
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
