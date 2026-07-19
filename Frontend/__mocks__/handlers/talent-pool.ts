import { http, HttpResponse } from 'msw';
import type { ApiSuccess } from '@/lib/types/api';
import type { TalentPoolEntry, TalentPoolStatus, AddToTalentPoolRequest } from '@/lib/types/talent-pool';

declare const process: any;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/v1/talent-pool`;

const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
  status: 'success',
  data,
  ...(message ? { message } : {}),
});

const MOCK_TALENT_POOL: TalentPoolEntry[] = [
  {
    pool_id: 'pool-1234-5678',
    candidate: {
      user_id: 'user-001',
      full_name: 'Nguyen Van A',
      university: 'Dai hoc Bach Khoa',
      year: 'Nam 3',
      primary_skills: ['React', 'TypeScript', 'Node.js'],
    },
    highest_score: 95,
    challenges_taken: ['challenge-1', 'challenge-2'],
    status: 'IN_POOL',
    added_at: new Date().toISOString(),
  },
];

export const talentPoolHandlers = [
  http.get(`${BASE}`, () => {
    return HttpResponse.json(success(MOCK_TALENT_POOL), { status: 200 });
  }),

  http.patch(`${BASE}/:poolId/status`, async ({ request }: any) => {
    const body = (await request.json()) as { status: TalentPoolStatus };
    
    if (!body.status) {
      return HttpResponse.json(
        { status: 'error', error_code: 'TP_001', message: 'status la bat buoc' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      success(undefined, 'Cap nhat trang thai thanh cong'), 
      { status: 200 }
    );
  }),

  http.post(`${BASE}`, async ({ request }: any) => {
    const body = (await request.json()) as AddToTalentPoolRequest;
    
    if (!body.user_id) {
      return HttpResponse.json(
        { status: 'error', error_code: 'TP_002', message: 'user_id la bat buoc' },
        { status: 400 }
      );
    }

    const response = {
      message: 'Da them vao Talent Pool thanh cong',
      user_id: body.user_id
    };

    return HttpResponse.json(success(response), { status: 201 });
  }),
];