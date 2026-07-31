import { http, HttpResponse } from 'msw';
import type { ApiSuccess } from '@/lib/types';
import type { TalentPoolEntry, TalentPoolStatus } from '@/lib/types/talent-pool';
import { MOCK_TALENT_POOL } from '@/lib/data/mockTalentPool';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/v1/talent-pool`;
const mockTalentPool = MOCK_TALENT_POOL.map((entry) => ({
  ...entry,
  candidate: { ...entry.candidate },
  challenges_taken: [...entry.challenges_taken],
}));

const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
  status: 'success',
  data,
  ...(message ? { message } : {}),
});

export const talentPoolHandlers = [
  // GET /api/v1/talent-pool
  http.get(BASE, () => {
    return HttpResponse.json(success(mockTalentPool));
  }),

  // PATCH /api/v1/talent-pool/:poolId/status
  http.patch(`${BASE}/:poolId/status`, async ({ request, params }) => {
    const { poolId } = params;
    const { status } = (await request.json()) as { status: TalentPoolStatus }; // Use request.json()

    const entryIndex = mockTalentPool.findIndex((entry) => entry.pool_id === poolId); // Use pool_id
    if (entryIndex > -1) {
      mockTalentPool[entryIndex].status = status;
      return HttpResponse.json(success(null, 'Cập nhật trạng thái thành công'));
    }
    return HttpResponse.json(
      { status: 'error', message: 'Không tìm thấy ứng viên trong Talent Pool' },
      { status: 404 }
    );
  }),

  // POST /api/v1/talent-pool
  http.post(BASE, async ({ request }) => {
    const { user_id } = (await request.json()) as { user_id: string };

    if (!user_id) {
      return HttpResponse.json({ status: 'error', message: 'Thiếu mã ứng viên' }, { status: 400 });
    }

    // Check if user already in talent pool
    if (mockTalentPool.some((entry) => entry.candidate.user_id === user_id)) {
      // Use candidate.user_id
      return HttpResponse.json(
        { status: 'error', message: 'Ứng viên đã có trong Talent Pool' },
        { status: 409 }
      );
    }

    const newEntry: TalentPoolEntry = {
      pool_id: `demo-pool-${mockTalentPool.length + 1}`,
      candidate: {
        user_id: user_id,
        full_name: 'Nguyễn Minh Anh',
        email: 'minhanh.nguyen@hcmus.edu.vn',
        university: 'Đại học Khoa học Tự nhiên, ĐHQG-HCM',
        year: 'Sinh viên năm 4',
        primary_skills: ['React', 'Thiết kế hệ thống', 'Giải quyết vấn đề'],
        location: 'TP. Hồ Chí Minh, Việt Nam',
        bio: 'Ứng viên nổi bật với tư duy sản phẩm và nhiều bằng chứng năng lực đã xác thực.',
      },
      highest_score: 94,
      challenges_taken: ['Thiết kế hệ thống giao hàng thông minh'],
      status: 'IN_POOL',
      added_at: new Date().toISOString(),
    };
    mockTalentPool.push(newEntry);
    return HttpResponse.json(success(newEntry, 'Đã lưu ứng viên vào Talent Pool'), {
      status: 201,
    });
  }),
];
