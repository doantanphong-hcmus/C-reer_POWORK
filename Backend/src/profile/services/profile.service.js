/**
 * PROFILE MODULE — Profile Service
 * Lấy lịch sử thực chiến và thông tin ứng viên
 */

import prisma from '../../shared/config/prisma.js'
import * as userLookupService from '../../iam/services/user-lookup.service.js' // Sử dụng User Lookup Service

export const getProfileByUserId = async (userId) => {
  // Bước 1: Lấy thông tin cơ bản từ IAM Module (Không được JOIN trực tiếp ở DB)
  // Nếu user không tồn tại, userLookupService.getUserContactById sẽ tự động ném AppError(404)
  const userContact = await userLookupService.getUserContactById(userId)

  // Bước 2: Truy vấn danh sách Snapshot Evidence (các thử thách đã vượt qua và được nhà tuyển dụng duyệt)
  const evidences = await prisma.verifiedEvidence.findMany({
    where: { userId },
    orderBy: { unlockedAt: 'desc' }, // Bài nộp mới nhất lên trên
  })

  // Bước 3: Đóng gói và trả về Object thuần
  return {
    userId: userContact.userId,
    fullName: userContact.fullName,
    email: userContact.email,
    university: userContact.university,
    year: userContact.year,
    primarySkills: userContact.primarySkills || [],
    verifiedEvidences: evidences,
  }
}
