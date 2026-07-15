/**
 * IAM MODULE — User Lookup Service (Internal Service Interface)
 *
 * Talent Pool Module gọi qua đây để lấy fullName ứng viên.
 * KHÔNG được tự query bảng users trực tiếp từ talent-pool module.
 */
import prisma from '../../shared/config/prisma.js'
import { AppError } from '../../shared/utils/AppError.js'

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true },
  })
  if (!user) throw new AppError('Không tìm thấy người dùng', 404, 'AUTH_008')
  return {
    user_id: user.id,
    full_name: user.fullName,
    email: user.email,
  }
}
