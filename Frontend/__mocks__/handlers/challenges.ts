import { http, HttpResponse } from 'msw';
import type {
  ApiSuccess,
  Challenge,
  ChallengeSummary,
  CreateChallengeRequest,
  UpdateChallengeStatusRequest,
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/v1/challenges`;

const MOCK_CHALLENGE: Challenge = {
  challenge_id: '403bf47b-231a-4d22-9214-722a4669812a',
  title: 'Tối ưu Thuật toán Xử lý Bản đồ',
  description: 'Thiết kế và tối ưu thuật toán xử lý bản đồ địa lý...',
  industry: 'Công nghệ thông tin',
  company_name: 'MTech Solutions',
  deadline: '2026-06-30T23:59:59Z',
  status: 'Open',
  rubrics: [
    {
      criteria_id: 'aa152d43-014b-4892-ba21-cb9e443101d2',
      criteria_name: 'Kiến trúc mã nguồn',
      weight: 40,
      max_score: 10,
    },
    {
      criteria_id: 'bb263e54-125c-5903-cb32-dc0f554212e3',
      criteria_name: 'Tối ưu bộ nhớ',
      weight: 60,
      max_score: 10,
    },
  ],
  created_at: new Date().toISOString(),
};

const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
  status: 'success',
  data,
  ...(message ? { message } : {}),
});

export const challengeHandlers = [
  http.get(BASE, ({ request }) => {
    const url = new URL(request.url);
    const industry = url.searchParams.get('industry');
    const all: ChallengeSummary[] = [
      {
        challenge_id: MOCK_CHALLENGE.challenge_id,
        title: MOCK_CHALLENGE.title,
        company_name: MOCK_CHALLENGE.company_name,
        industry: MOCK_CHALLENGE.industry,
        deadline: MOCK_CHALLENGE.deadline,
      },
    ];
    const filtered = industry ? all.filter((c) => c.industry === industry) : all;
    return HttpResponse.json(success(filtered), { status: 200 });
  }),

  http.get(`${BASE}/:challenge_id`, ({ params }) => {
    return HttpResponse.json(
      success({ ...MOCK_CHALLENGE, challenge_id: String(params.challenge_id) }),
      { status: 200 }
    );
  }),

  http.post(BASE, async ({ request }) => {
    const body = (await request.json()) as CreateChallengeRequest;
    const challenge: Challenge = {
      challenge_id: `mock-${Date.now()}`,
      title: body.title,
      description: body.description,
      industry: body.industry,
      company_name: 'MTech Solutions',
      deadline: body.deadline,
      status: 'Open',
      rubrics: body.rubrics.map((r, i) => ({
        criteria_id: `mock-criteria-${Date.now()}-${i}`,
        criteria_name: r.criteria_name,
        weight: r.weight,
        max_score: r.max_score,
      })),
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(success(challenge), { status: 201 });
  }),

  http.patch(`${BASE}/:challenge_id/status`, async ({ params, request }) => {
    const body = (await request.json()) as UpdateChallengeStatusRequest;
    return HttpResponse.json(
      success({
        challenge_id: String(params.challenge_id),
        status: body.status,
        updated_at: new Date().toISOString(),
      }),
      { status: 200 }
    );
  }),
];
