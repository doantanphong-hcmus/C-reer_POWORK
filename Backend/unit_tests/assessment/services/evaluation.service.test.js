/**
 * @description File Unit Test cho module Evaluation Service
 * 
 * ==========================================
 * QUY TRÌNH KIỂM THỬ 
 * ==========================================
 * 1. KHỞI TẠO: Mock Prisma DB (để không gọi thật) và companyService (để kiểm chứng quyền).
 * 2. THỰC THI: Kiểm tra luồng chấm điểm (Happy Path) và luồng phân quyền (Security).
 * 3. KẾT QUẢ MONG ĐỢI: 
 *    - Bài nộp/Thử thách không tồn tại -> Lỗi 404.
 *    - Công ty A chấm bài công ty B -> Lỗi 403 (Bảo vệ bảo mật).
 *    - Chấm điểm thành công -> Tính đúng tổng điểm và gọi Transaction DB.
 * 4. Ý NGHĨA CÁC LOG/KẾT QUẢ:
 *    - PASS: Logic bảo mật phân quyền hoạt động tốt, hệ thống tính toán điểm số chính xác.
 *    - FAIL: Có rủi ro gian lận điểm số giữa các công ty.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { evaluateSubmission } from '../../../src/assessment/services/evaluation.service.js';
import prisma from '../../../src/shared/config/prisma.js';
import * as companyService from '../../../src/iam/services/company.service.js';

// MOCK: Sử dụng Explicit Mock Factories (Tuân thủ Rule chống Mock Drifting)
vi.mock('../../../src/shared/config/prisma.js', () => ({
  default: {
    submission: { findUnique: vi.fn(), update: vi.fn() },
    challenge: { findUnique: vi.fn() },
    evaluationResult: { create: vi.fn() },
    $transaction: vi.fn()
  }
}));

vi.mock('../../../src/iam/services/company.service.js', () => ({
  getCompanyByUserId: vi.fn()
}));

describe('Evaluation Service Core Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Group 1: Exceptions & Error Handling', () => {
    it('TC1: [Edge Case] Bài nộp không tồn tại -> ném lỗi 404', async () => {
      prisma.submission.findUnique.mockResolvedValue(null);

      await expect(
        evaluateSubmission('SUB_RÁC', { evaluations: [], generalComment: 'Good' }, 'USER_1')
      ).rejects.toThrow('Không tìm thấy submission');
    });

    it('TC2: [Edge Case] Thử thách không tồn tại -> ném lỗi 404', async () => {
      prisma.submission.findUnique.mockResolvedValue({ id: 'SUB_1', challengeId: 'CHAL_RÁC' });
      prisma.challenge.findUnique.mockResolvedValue(null);

      await expect(
        evaluateSubmission('SUB_1', { evaluations: [], generalComment: 'Good' }, 'USER_1')
      ).rejects.toThrow('Không tìm thấy challenge tương ứng');
    });
  });

  describe('Group 2: Security Authorization', () => {
    it('TC3: [Security] Chấm bài trái phép (Hacking attempt) -> ném lỗi 403', async () => {
      // Bài nộp thuộc về COMPANY_A
      prisma.submission.findUnique.mockResolvedValue({ id: 'SUB_1', challengeId: 'CHAL_1' });
      prisma.challenge.findUnique.mockResolvedValue({ id: 'CHAL_1', companyId: 'COMPANY_A' });

      // Nhưng kẻ gửi Request lại thuộc COMPANY_B
      companyService.getCompanyByUserId.mockResolvedValue({ company_id: 'COMPANY_B' });

      await expect(
        evaluateSubmission('SUB_1', { evaluations: [], generalComment: 'Good' }, 'USER_HACKER')
      ).rejects.toThrow('Bạn không có quyền chấm điểm');
    });
  });

  describe('Group 3: Happy Path', () => {
    it('TC4: [Happy Path] Chấm điểm thành công & Tính đúng tổng điểm', async () => {
      // 1. CHUẨN BỊ: Đúng Công ty sở hữu (COMPANY_A)
      prisma.submission.findUnique.mockResolvedValue({ id: 'SUB_1', challengeId: 'CHAL_1' });
      prisma.challenge.findUnique.mockResolvedValue({ id: 'CHAL_1', companyId: 'COMPANY_A' });
      companyService.getCompanyByUserId.mockResolvedValue({ company_id: 'COMPANY_A' });

      const inputData = {
        evaluations: [
          { criteriaId: 'C1', score: 8, comment: 'Tốt' },
          { criteriaId: 'C2', score: 9, comment: 'Xuất sắc' }
        ],
        generalComment: 'Pass vòng CV nhé'
      };

      // 2. THỰC THI
      const result = await evaluateSubmission('SUB_1', inputData, 'USER_HR_A');

      // 3. KIỂM TRA
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.totalScore).toBe(17); // 8 + 9
      expect(result.generalComment).toBe('Pass vòng CV nhé');
      expect(result.submissionId).toBe('SUB_1');
    });
  });
});
