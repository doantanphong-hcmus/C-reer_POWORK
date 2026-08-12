import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildSubmissionOutcomeEmail,
  sendSubmissionScanOutcomeEmail,
} from '../src/assessment/services/notification.service.js'

test('scan notification exports remain compatible and render a safe rejection reason', async () => {
  const sent = []
  const email = buildSubmissionOutcomeEmail({
    outcome: 'REJECTED',
    hashId: 'Candidate_ABC',
    version: 2,
    challengeTitle: '<script>Challenge</script>',
    rejectionReason: '<b>Tệp không an toàn</b>',
  })

  assert.match(email.subject, /chưa được chấp nhận/i)
  assert.doesNotMatch(email.html, /<script>|<b>Tệp/)
  assert.match(email.html, /&lt;script&gt;Challenge/)

  await sendSubmissionScanOutcomeEmail('submission-1', 'ACCEPTED', undefined, {
    database: {
      submission: {
        findUnique: async () => ({
          hashId: 'Candidate_ABC',
          version: 1,
          identityMapping: { userId: 'candidate-1' },
          challenge: { title: 'Thiết kế API' },
        }),
      },
    },
    getUserById: async () => ({ email: 'candidate@example.com' }),
    mailer: { sendMail: async (message) => sent.push(message) },
  })

  assert.equal(sent.length, 1)
  assert.equal(sent[0].to, 'candidate@example.com')
})
