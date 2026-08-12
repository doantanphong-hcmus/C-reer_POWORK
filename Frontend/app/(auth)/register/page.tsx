'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel';
import { useAuth } from '@/lib/hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register: createAccount } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      role: 'Candidate',
      company_name: '',
      accepted_terms: false,
    },
  });
  const selectedRole = useWatch({ control, name: 'role' });

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    try {
      const user = await createAccount(data);
      router.replace(user.role === 'Employer' ? '/employer/dashboard' : '/candidate/dashboard');
    } catch (requestError: unknown) {
      const responseError = requestError as { response?: { data?: { message?: string } } };
      setError(
        responseError.response?.data?.message || 'Đăng ký chưa thành công. Vui lòng thử lại.'
      );
    }
  };

  const fieldClass =
    'h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/15';

  return (
    <main className="min-h-screen bg-[#eef2f4] text-slate-950 lg:grid lg:grid-cols-[minmax(420px,0.9fr)_minmax(560px,1.1fr)]">
      <AuthBrandPanel mode="register" />

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-[620px] rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-10">
          <div className="mb-8">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
              POWORK
            </Link>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight">Tạo tài khoản</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Thiết lập không gian phù hợp với vai trò của bạn trên POWORK.
            </p>
          </div>

          <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1" aria-label="Vai trò">
            {(['Candidate', 'Employer'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role, { shouldValidate: true })}
                aria-pressed={selectedRole === role}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  selectedRole === role
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role === 'Candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  autoComplete="name"
                  {...register('full_name')}
                  className={fieldClass}
                />
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={fieldClass}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {selectedRole === 'Employer' && (
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tên doanh nghiệp
                </label>
                <input
                  id="companyName"
                  autoComplete="organization"
                  {...register('company_name')}
                  placeholder="Công ty TNHH ABC"
                  className={fieldClass}
                />
                {errors.company_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.company_name.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  placeholder="Tối thiểu 8 ký tự"
                  className={`${fieldClass} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                <input
                  type="checkbox"
                  {...register('accepted_terms')}
                  className="mt-1 h-4 w-4 shrink-0 accent-cyan-800"
                />
                <span>
                  Tôi đã đọc và đồng ý với{' '}
                  <Link
                    href="/public-page/terms"
                    target="_blank"
                    className="font-semibold text-cyan-800 hover:underline"
                  >
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link
                    href="/public-page/security"
                    target="_blank"
                    className="font-semibold text-cyan-800 hover:underline"
                  >
                    Chính sách bảo mật
                  </Link>
                  .
                </span>
              </label>
              {errors.accepted_terms && (
                <p className="mt-2 text-sm text-red-600">{errors.accepted_terms.message}</p>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[#0b6674] px-5 text-sm font-semibold text-white transition hover:bg-[#095461] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-semibold text-cyan-800 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
