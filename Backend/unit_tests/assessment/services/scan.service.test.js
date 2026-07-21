/**
 * @file scan.service.test.js
 * @description File Unit Test cho module Scan Service
 * 
 * ==========================================
 * QUY TRÌNH KIỂM THỬ (TESTING PROCESS)
 * ==========================================
 * 1. KHỞI TẠO (SETUP): Mock MinIO (để không tải file thật) và ClamAV (không quét thật), Mock DB (submissionRepository).
 * 2. THỰC THI (EXECUTE): Truyền ID của bài nộp giả lập vào hàm scanSubmission.
 * 3. KẾT QUẢ MONG ĐỢI (EXPECTED RESULTS): 
 *    - Nếu ClamAV phát hiện virus -> Đánh rớt bài (REJECTED) trong Database.
 *    - Nếu file an toàn -> Bỏ qua, không gọi hàm update DB.
 * 4. Ý NGHĨA CÁC LOG/KẾT QUẢ:
 *    - PASS: Hệ thống chặn virus tự động hoạt động hoàn hảo.
 *    - FAIL: Logic gọi DB cập nhật bị sai, hoặc đọc kết quả ClamAV bị sai.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scanSubmission } from '../../../src/assessment/services/scan.service.js';
import * as submissionRepository from '../../../src/assessment/repositories/submission.repository.js';
import minioClient from '../../../src/shared/config/minio.js';
import { getClamScan } from '../../../src/shared/config/clamav.js';

// MOCK các dependencies
vi.mock('../../../src/assessment/repositories/submission.repository.js');
vi.mock('../../../src/shared/config/minio.js', () => ({
    default: {
        getObject: vi.fn()
    }
}));
vi.mock('../../../src/shared/config/clamav.js', () => ({
    getClamScan: vi.fn()
}));
vi.mock('../../../src/shared/config/index.js', () => ({
    config: { minio: { bucket: 'test-bucket' } }
}));

describe('Scan Service - scanSubmission', () => {
    let mockClamscan;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });

        // Giả lập đối tượng clamscan
        mockClamscan = { scanStream: vi.fn() };
        getClamScan.mockResolvedValue(mockClamscan);

        // Giả lập stream MinIO trả về
        minioClient.getObject.mockResolvedValue('mock_stream_data');
    });

    it('should reject submission if virus is detected (Edge Case: Virus found)', async () => {
        // 1. CHUẨN BỊ
        submissionRepository.findSubmissionById.mockResolvedValue({ id: 'SUB_1', solutionUrl: 'test.zip' });

        // Giả lập quét ra virus
        mockClamscan.scanStream.mockResolvedValue({ isInfected: true, viruses: ['Trojan.Malware'] });

        // 2. THỰC THI
        await scanSubmission('SUB_1');

        // 3. KIỂM TRA
        expect(submissionRepository.updateSubmissionStatus).toHaveBeenCalledWith(
            'SUB_1',
            'REJECTED',
            expect.stringContaining('Trojan.Malware')
        );
    });

    it('should do nothing to DB if file is clean (Happy Path: Clean file)', async () => {
        // 1. CHUẨN BỊ
        submissionRepository.findSubmissionById.mockResolvedValue({ id: 'SUB_2', solutionUrl: 'clean.pdf' });

        // Giả lập quét an toàn
        mockClamscan.scanStream.mockResolvedValue({ isInfected: false, viruses: [] });

        // 2. THỰC THI
        await scanSubmission('SUB_2');

        // 3. KIỂM TRA: Không gọi hàm cập nhật trạng thái REJECTED nào vào Database
        expect(submissionRepository.updateSubmissionStatus).not.toHaveBeenCalled();
    });
});
