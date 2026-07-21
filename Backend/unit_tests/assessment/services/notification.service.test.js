/**
 * @description File unit test cho module Notification Service
 * 
 * =======================================
 * QUY TRÌNH KIỂM THỬ
 * =======================================
 * 1. Khởi tạo: Mock thư viện transporter (Nodemailer) để không gửi email thật gây rác hộp thư
 * 2. Thực thi: Gọi hàm gửi email xác nhận
 * 3. Kết quả mong đợi: Hàm sendEmail phải gới đúng địa chỉ người nhận. 
 * 4. Ý nghĩa LOG: 
 *  - PASS: Cơ chế gửi mail "fire-and-forget" an toàn, không rủi ro sập app. 
 *  - FAIL: Xử lý try/catch trong hàm gửi mail có vấn đề
 */
import{describe, it, expect, vi, beforeEach} from 'vitest'; 
import{sendSubmissionConfirmationEmail} from '../../../src/assessment/services/notification.service.js';
import transporter from '../../../src/shared/config/mailer.js'; 

// MOCK: giả lập thư viện gửi mail 
vi.mock('../../../src/shared/config/mailer.js', () => ({
    default: {sendMail: vi.fn() }
})); 

describe('Notification Service - sendSubmissionConfirmationEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ẩn console.log và console.error trong lúc chạy test 
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

   it('should call transporter.sendMail with correct parameters (Happy Path)', async () => {
    // 1. CHUẨN BỊ
    transporter.sendMail.mockResolvedValue(true);
    // 2. THỰC THI
    await sendSubmissionConfirmationEmail({
      toEmail: 'candidate@test.com',
      hashId: 'HASH_123',
      version: 2,
      challengeTitle: 'IT Challenge'
    });
    // 3. KIỂM TRA: Đảm bảo đã gọi tới hàm gửi mail với nội dung chứa mã HASH ẩn danh thay vì tên thật
    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'candidate@test.com',
        subject: 'POWORK — Bài làm đã được ghi nhận',
        html: expect.stringContaining('HASH_123')
      })
    );
  });
  it('should not throw error if transporter fails (Edge Case: Fire and Forget)', async () => {
    // 1. CHUẨN BỊ: Ép hàm gửi mail bắn lỗi (giả lập mất kết nối mạng)
    transporter.sendMail.mockRejectedValue(new Error('Network error'));
    // 2. THỰC THI & 3. KIỂM TRA
    // Hàm này chạy mà không ném lỗi ra ngoài (không bị crash) là PASSED.
    await expect(
      sendSubmissionConfirmationEmail({
        toEmail: 'candidate@test.com',
        hashId: 'HASH_123',
        version: 1,
        challengeTitle: 'Test'
      })
    ).resolves.not.toThrow();
    
    // Kiểm tra xem console.error có được gọi để log lỗi lại cho dev không
    expect(console.error).toHaveBeenCalled();
  });
});