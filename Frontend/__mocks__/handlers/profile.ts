import { http, HttpResponse } from 'msw';
import type { ApiSuccess, Profile } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/v1/profiles`;

const success = <T>(data: T): ApiSuccess<T> => ({ status: 'success', data });

export const profileHandlers = [
  http.get(`${BASE}/:user_id`, ({ params }) => {
    const profile: Profile = {
      user_id: String(params.user_id),
      full_name: 'Đoàn Tấn Phong',
      verified_evidences: [
        {
          evidence_id: '7712aaeb-3a1c-4e8d-9f2b-123456789abc',
          challenge_name: 'Tối ưu Thuật toán Xử lý Bản đồ',
          company_name: 'MTech Solutions',
          industry: 'Công nghệ thông tin',
          total_score: 8.6,
          unlocked_at: '2026-06-10T02:16:45Z',
        },
      ],
    };
    return HttpResponse.json(success(profile), { status: 200 });
  }),
];
