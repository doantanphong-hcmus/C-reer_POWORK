/**
 * IAM MODULE — Validation Schemas (Zod)
 * Theo API Contracts: email/password required, password min 8 chars, role là Enum, company_name optional nhưng bắt buộc nếu role = Employer
 */
import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  full_name: z.string().min(1, 'full_name là bắt buộc'),
  role: z.enum(['Candidate', 'Employer'], { errorMap: () => ({ message: 'role phải là Candidate hoặc Employer' }) }),
  company_name: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'password là bắt buộc'),
})
