import { http, HttpResponse } from 'msw';
import type {
  ApiSuccess,
  Challenge,
  ChallengeSummary,
  CreateChallengeRequest,
  UpdateChallengeStatusRequest,
} from '@/lib/types';
import { MOCK_CHALLENGES } from '@/lib/data/mockChallenges';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/v1/challenges`;

const toDetail = (summary: ChallengeSummary): Challenge => ({
  ...summary,
  description:
    'Doanh nghiệp cung cấp bối cảnh và dữ liệu mô phỏng từ một vấn đề đang gặp trong thực tế. ' +
    'Ứng viên cần phân tích yêu cầu, đề xuất giải pháp khả thi và trình bày rõ các quyết định, rủi ro cùng kế hoạch triển khai.',
  status: 'Open',
  rubrics: [
    {
      criteria_id: `${summary.challenge_id}-01`,
      criteria_name: 'Mức độ thấu hiểu bài toán',
      weight: 25,
      max_score: 10,
    },
    {
      criteria_id: `${summary.challenge_id}-02`,
      criteria_name: 'Tính khả thi và sáng tạo của giải pháp',
      weight: 35,
      max_score: 10,
    },
    {
      criteria_id: `${summary.challenge_id}-03`,
      criteria_name: 'Chất lượng sản phẩm minh họa',
      weight: 25,
      max_score: 10,
    },
    {
      criteria_id: `${summary.challenge_id}-04`,
      criteria_name: 'Khả năng trình bày và phản biện',
      weight: 15,
      max_score: 10,
    },
  ],
  created_at: '2026-07-20T08:00:00.000Z',
});

const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
  status: 'success',
  data,
  ...(message ? { message } : {}),
});

export const challengeHandlers = [
  http.get(BASE, ({ request }) => {
    const url = new URL(request.url);
    const industry = url.searchParams.get('industry');
    const filtered = industry
      ? MOCK_CHALLENGES.filter((challenge) => challenge.industry === industry)
      : MOCK_CHALLENGES;
    return HttpResponse.json(success(filtered), { status: 200 });
  }),

  http.get(`${BASE}/:challenge_id`, ({ params }) => {
    const summary =
      MOCK_CHALLENGES.find((item) => item.challenge_id === String(params.challenge_id)) ??
      MOCK_CHALLENGES[0];
    return HttpResponse.json(
      success(toDetail({ ...summary, challenge_id: String(params.challenge_id) })),
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
      company_name: 'VietMove Logistics',
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
