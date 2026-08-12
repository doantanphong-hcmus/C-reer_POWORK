import assert from 'node:assert/strict'
import test from 'node:test'

import { sendEvaluationCompletedEmail } from '../src/assessment/services/notification.service.js'

test('evaluation email is branded, informative, and escapes user-provided content', async () => {
  let message
  const mailer = {
    sendMail: async (payload) => {
      message = payload
    },
  }

  await sendEvaluationCompletedEmail(
    {
      toEmail: 'candidate@example.com',
      fullName: 'An <script>alert(1)</script>',
      challengeTitle: 'Thiết kế hệ thống',
      hashId: 'ANON-1234',
      evaluations: [{ criteriaName: 'Lập luận', score: 8, maxScore: 10 }],
      generalComment: '<b>Nội dung chưa được escape</b>',
    },
    mailer,
  )

  assert.equal(message.to, 'candidate@example.com')
  assert.match(message.subject, /đã được chấm/)
  assert.doesNotMatch(message.html, /favicon/)
  assert.match(message.html, /letter-spacing:5px[^>]*>POWORK</)
  assert.match(message.html, /POWORK/)
  assert.match(message.html, /Lập luận/)
  assert.match(message.html, /8\/10/)
  assert.doesNotMatch(message.html, /<script>/)
  assert.doesNotMatch(message.html, /<b>Nội dung/)
  assert.match(message.html, /&lt;script&gt;/)
  assert.match(message.html, /&lt;b&gt;Nội dung/)
})
