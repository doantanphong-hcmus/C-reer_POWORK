/**
 * @description File Unit Test cho module Submission Service (Core Logic)
 * 
 * ==========================================
 * QUY TRÌNH KIỂM THỬ 
 * ==========================================
 * 1. KHỞI TẠO: Mock toàn bộ Database, Email, và Background Jobs.
 * 2. THỰC THI: Kiểm thử 3 nhóm tính năng: Nộp bài, Lấy danh sách, Mở khóa danh tính.
 * 3. KẾT QUẢ MONG ĐỢI: 
 *    - Logic Versioning chạy đúng, không tạo HashID mới nếu đã nộp.
 *    - Tuyệt đối KHÔNG LỌT userId ra ngoài (Blind Audition).
 *    - Chặn đứng mọi hành vi Race Condition khi Unlock danh tính.
 * 4. Ý NGHĨA CÁC LOG/KẾT QUẢ:
 *    - PASS: Hệ thống Ẩn danh hoạt động 100% bảo mật. Luồng dữ liệu chạy hoàn hảo.
 *    - FAIL: Có lỗ hổng rò rỉ dữ liệu hoặc sai lệch thuật toán điểm số.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitSolution, getSubmissionsByChallenge, unlockCandidate } from '../../../src/assessment/services/submission.service.js';
import * as submissionRepository from '../../../src/assessment/repositories/submission.repository.js';
import * as userLookupService from '../../../src/iam/services/user-lookup.service.js';
import { queueScanJob } from '../../../src/assessment/jobs/scan.job.js';
import { sendSubmissionConfirmationEmail } from '../../../src/assessment/services/notification.service.js';
import prisma from '../../../src/shared/config/prisma.js';

vi.mock('../../../src/assessment/repositories/submission.repository.js', () => ({
  findIdentityMapping: vi.fn(),
  createIdentityMapping: vi.fn(),
  getLatestVersion: vi.fn(),
  createSubmission: vi.fn(),
  findSubmissionsByChallengeGroupedByHash: vi.fn(),
  updateSubmissionStatus: vi.fn()
}));
vi.mock('../../../src/iam/services/user-lookup.service.js', () => ({
  getUserById: vi.fn()
}));
vi.mock('../../../src/assessment/jobs/scan.job.js', () => ({
  queueScanJob: vi.fn()
}));
vi.mock('../../../src/assessment/services/notification.service.js', () => ({
  sendSubmissionConfirmationEmail: vi.fn()
}));
vi.mock('../../../src/shared/config/prisma.js', () => ({
  default: {
    $transaction: vi.fn(),
  }
}));

describe('Submission Service Core Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  describe('Group 1: submitSolution (Blind Audition & Versioning)', () => {
    it('TC1: [Happy Path] Nộp bài lần đầu - Tạo mới HashID và Version 1', async () => {
      // 1. CHUẨN BỊ
      submissionRepository.findIdentityMapping.mockResolvedValue(null); // Chưa từng nộp
      submissionRepository.createIdentityMapping.mockResolvedValue({ hashId: 'NEW_HASH' });
      submissionRepository.getLatestVersion.mockResolvedValue(0);
      submissionRepository.createSubmission.mockResolvedValue({
        id: 'SUB_1', hashId: 'NEW_HASH', version: 1, status: 'PENDING', submittedAt: new Date()
      });
      userLookupService.getUserById.mockResolvedValue({ email: 'test@email.com' });

      // 2. THỰC THI
      const result = await submitSolution({ userId: 'U1', challengeId: 'C1', solutionUrl: 'url' });

      // 3. KIỂM TRA
      expect(submissionRepository.createIdentityMapping).toHaveBeenCalled();
      expect(result.version).toBe(1);
      expect(queueScanJob).toHaveBeenCalledWith('SUB_1'); // Chắc chắn đã gọi quét virus
    });

    it('TC2: [Edge Case] Nộp bài lần 2 - Tăng version, giữ nguyên HashID', async () => {
      // 1. CHUẨN BỊ
      submissionRepository.findIdentityMapping.mockResolvedValue({ hashId: 'OLD_HASH' }); // Đã nộp
      submissionRepository.getLatestVersion.mockResolvedValue(2);
      submissionRepository.createSubmission.mockResolvedValue({
        id: 'SUB_3', hashId: 'OLD_HASH', version: 3, status: 'PENDING', submittedAt: new Date()
      });
      userLookupService.getUserById.mockResolvedValue({ email: 'test@email.com' });

      // 2. THỰC THI
      const result = await submitSolution({ userId: 'U1', challengeId: 'C1', solutionUrl: 'url' });

      // 3. KIỂM TRA
      expect(submissionRepository.createIdentityMapping).not.toHaveBeenCalled(); // Không tạo mới Hash
      expect(result.version).toBe(3);
    });

    it('TC3: [Security] Tuyệt đối không lọt userId ra output để bảo vệ Ẩn danh', async () => {
      submissionRepository.findIdentityMapping.mockResolvedValue({ hashId: 'SECURE_HASH' });
      submissionRepository.getLatestVersion.mockResolvedValue(1);
      submissionRepository.createSubmission.mockResolvedValue({
        id: 'SUB_2', hashId: 'SECURE_HASH', version: 2, status: 'PENDING', submittedAt: new Date()
      });
      userLookupService.getUserById.mockResolvedValue({ email: 'test@email.com' });

      const result = await submitSolution({ userId: 'REAL_USER_ID_123', challengeId: 'C1', solutionUrl: 'url' });

      expect(result).not.toHaveProperty('userId');
      expect(result.hashId).toBe('SECURE_HASH');
    });
  });

  describe('Group 2: getSubmissionsByChallenge (Security View)', () => {
    it('TC4: [Security] Dữ liệu trả về cho Employer không được chứa danh tính thật', async () => {
      submissionRepository.findSubmissionsByChallengeGroupedByHash.mockResolvedValue([
        {
          hashId: 'HASH_A',
          isUnlocked: false,
          submissions: [{ id: 'S1', version: 1, status: 'PENDING', solutionUrl: 'link', submittedAt: new Date() }]
        }
      ]);

      const result = await getSubmissionsByChallenge('C1');

      expect(result[0].hashId).toBe('HASH_A');
      expect(result[0]).not.toHaveProperty('userId'); // Che giấu 100%
      expect(result[0].submissions[0].submissionId).toBe('S1');
    });
  });

  describe('Group 3: unlockCandidate (Snapshot & Race Conditions)', () => {
    it('TC5: [Edge Case] Hành động REJECT không gọi Transaction', async () => {
      submissionRepository.updateSubmissionStatus.mockResolvedValue({ id: 'SUB_1' });
      const result = await unlockCandidate('SUB_1', 'REJECT');
      expect(result.message).toContain('rejected');
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('TC6: [Edge Case] Chặn Spam Click (Race Condition) khi hồ sơ ĐÃ Unlocked', async () => {
      prisma.$transaction.mockImplementation(async (cb) => {
        return await cb({
          submission: {
            findUnique: vi.fn().mockResolvedValue({
              id: 'SUB_1', identityMapping: { hashId: 'H1', isUnlocked: true } // ĐÃ MỞ KHÓA TỪ TRƯỚC
            })
          }
        });
      });

      await expect(unlockCandidate('SUB_1', 'APPROVE')).rejects.toThrow('đã được mở khóa từ trước');
    });

    it('TC7: [Happy Path] Mở khóa thành công & Tính đúng điểm trọng số', async () => {
      const mockCreateEvidence = vi.fn();

      prisma.$transaction.mockImplementation(async (cb) => {
        return await cb({
          submission: {
            findUnique: vi.fn().mockResolvedValue({
              id: 'SUB_1',
              identityMapping: { hashId: 'H1', isUnlocked: false, userId: 'U1', challengeId: 'C1' },
              evaluationResults: [
                { score: 8, criteria: { maxScore: 10, weight: 60 } }, // 8/10 * 60 = 48
                { score: 9, criteria: { maxScore: 10, weight: 40 } }  // 9/10 * 40 = 36 -> Total = 84
              ]
            }),
            update: vi.fn()
          },
          identityMapping: { update: vi.fn() },
          challenge: { findUnique: vi.fn().mockResolvedValue({ title: 'T', companyName: 'C', industry: 'I' }) },
          verifiedEvidence: { create: mockCreateEvidence }
        });
      });

      userLookupService.getUserById.mockResolvedValue({ email: 'real@email.com', full_name: 'John Doe' });

      const result = await unlockCandidate('SUB_1', 'APPROVE');

      expect(result.unlockedCandidateProfile.email).toBe('real@email.com');

      // Kiểm tra xem lúc tạo Snapshot điểm số có tính ra đúng 84 điểm không
      expect(mockCreateEvidence).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ totalScore: 84 })
      }));
    });
  });
});
