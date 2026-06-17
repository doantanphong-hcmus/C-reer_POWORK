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

const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
  status: 'success',
  data,
  ...(message ? { message } : {}),
});

const MOCK_SUBMISSION: SubmissionSummary = {
  submission_id: 'f5e921dd-14bb-421c-a32e-11bc9aef4421',
  hash_id: 'Candidate_3941',
  status: 'Pending',
  solution_url: 'https://github.com/mock-candidate/solution',
  submitted_at: new Date().toISOString(),
};

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
    return HttpResponse.json(success(submission), { status: 201 });
  }),

  http.get(`${BASE}/challenges/:challenge_id/submissions`, () => {
    return HttpResponse.json(success([MOCK_SUBMISSION]), { status: 200 });
  }),

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
