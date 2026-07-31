import { http, HttpResponse } from 'msw';
import type {
  ApiSuccess,
  EvaluateRequest,
  EvaluateResponse,
  SubmissionSummary,
  SubmitSolutionRequest,
  UnlockRequest,
  UnlockResponse,
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/v1/assessment`;
const MOCK_UPLOAD_URL = `${API_URL}/mock-upload`;

const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
  status: 'success',
  data,
  ...(message ? { message } : {}),
});

const submissionsByChallenge = new Map<string, SubmissionSummary[]>();

function getSubmissions(challengeId: string): SubmissionSummary[] {
  const existing = submissionsByChallenge.get(challengeId);
  if (existing) return existing;

  const suffix = challengeId.slice(0, 6);
  const seeded: SubmissionSummary[] = [
    {
      submission_id: `${challengeId}-bai-nop-01`,
      hash_id: `Candidate_${suffix.toUpperCase()}`,
      status: 'PENDING',
      solution_url: 'data:text/plain;charset=utf-8,Ban%20thuyet%20minh%20giai%20phap%20POWORK',
      submitted_at: '2026-07-29T09:24:00.000Z',
    },
    {
      submission_id: `${challengeId}-bai-nop-02`,
      hash_id: `Candidate_${suffix.slice(0, 4).toUpperCase()}B2`,
      status: 'EVALUATED',
      solution_url: 'data:text/plain;charset=utf-8,Ho%20so%20giai%20phap%20da%20duoc%20cham',
      submitted_at: '2026-07-27T14:10:00.000Z',
    },
    {
      submission_id: `${challengeId}-bai-nop-03`,
      hash_id: `Candidate_${suffix.slice(0, 4).toUpperCase()}C3`,
      status: 'APPROVED',
      solution_url: 'data:text/plain;charset=utf-8,Giai%20phap%20xuat%20sac%20da%20unlock',
      submitted_at: '2026-07-24T08:45:00.000Z',
    },
  ];
  submissionsByChallenge.set(challengeId, seeded);
  return seeded;
}

export const assessmentHandlers = [
  http.post(`${BASE}/submissions`, async ({ request }) => {
    const body = (await request.json()) as SubmitSolutionRequest;
    const hashId = `Candidate_${Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0')}`;
    const submission: SubmissionSummary = {
      submission_id: `mock-${Date.now()}`,
      hash_id: hashId,
      status: 'Pending',
      solution_url: body.solution_url,
      submitted_at: new Date().toISOString(),
    };
    const challengeSubmissions = getSubmissions(body.challenge_id);
    challengeSubmissions.unshift(submission);
    return HttpResponse.json(success(submission), { status: 201 });
  }),

  http.get(`${BASE}/challenges/:challenge_id/submissions`, ({ params }) => {
    return HttpResponse.json(success(getSubmissions(String(params.challenge_id))), { status: 200 });
  }),

  http.post(`${BASE}/submissions/presigned-url`, async ({ request }) => {
    const body = (await request.json()) as { file_name: string };
    return HttpResponse.json(
      success({
        upload_url: `${MOCK_UPLOAD_URL}/${encodeURIComponent(body.file_name)}`,
        file_key: `demo/${Date.now()}-${body.file_name}`,
      }),
      { status: 200 }
    );
  }),

  http.put(`${MOCK_UPLOAD_URL}/:file_name`, () => new HttpResponse(null, { status: 200 })),

  http.post(`${BASE}/submissions/:submission_id/evaluate`, async ({ params, request }) => {
    const body = (await request.json()) as EvaluateRequest;
    const total = body.evaluations.reduce((sum, e) => sum + (e.score ?? 0), 0);
    const response: EvaluateResponse = {
      submission_id: String(params.submission_id),
      evaluations: body.evaluations,
      general_comment: body.general_comment,
      total_score: total,
      evaluated_at: new Date().toISOString(),
    };
    return HttpResponse.json(success(response), { status: 201 });
  }),

  http.post(`${BASE}/submissions/:submission_id/unlock`, async ({ request }) => {
    const body = (await request.json()) as UnlockRequest;
    if (body.action !== 'APPROVE') {
      return HttpResponse.json(
        { status: 'error', error_code: 'ASSESS_001', message: 'action phải là APPROVE' },
        { status: 400 }
      );
    }
    const response: UnlockResponse = {
      message: 'Identity unlocked.',
      unlocked_candidate_profile: {
        user_id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
        full_name: 'Đoàn Tấn Phong',
        email: 'phong.dt@gmail.com',
      },
    };
    return HttpResponse.json(success(response), { status: 200 });
  }),
];
