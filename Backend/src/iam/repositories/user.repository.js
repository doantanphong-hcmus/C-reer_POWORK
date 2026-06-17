/**
 * IAM MODULE — User Repository
 *
 * Chỉ chứa câu lệnh Prisma thuần. KHÔNG chứa logic nghiệp vụ (hash password, validate, sign JWT...) — đó là việc của Service.
 */
import prisma from '../../shared/config/prisma.js'

export const findByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: { company: true },
  })
}

export const findById = (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { company: true },
  })
}

// Nested Write: tạo User và (nếu là Employer) tạo luôn Company trong 1 transaction
export const createUser = ({ email, passwordHash, fullName, role, companyName }) => {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role,
      ...(role === 'Employer' && companyName ? { company: { create: { companyName } } } : {}),
    },
    include: { company: true },
  })
}
