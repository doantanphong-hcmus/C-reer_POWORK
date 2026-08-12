'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import type { UserRole } from '@/lib/types';
import { AuthBrandPanel } from './AuthBrandPanel';

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/google`;

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  return value === '/login' || value === '/register' ? null : value;
}

function getInitialRole(roleParam: string | null, redirectPath: string | null): UserRole {
  if (roleParam?.toLowerCase() === 'employer' || redirectPath?.startsWith('/employer')) {
    return 'Employer';
  }
  return 'Candidate';
}

function getDashboardForRole(role: UserRole) {
  return role === 'Employer' ? '/employer/dashboard' : '/candidate/dashboard';
}

function getRedirectForRole(redirectPath: string | null, role: UserRole) {
  if (!redirectPath) return getDashboardForRole(role);
  if (
    (redirectPath.startsWith('/employer') || redirectPath.startsWith('/talent-pool')) &&
    role !== 'Employer'
  ) {
    return getDashboardForRole(role);
  }
  if (redirectPath.startsWith('/candidate') && role !== 'Candidate') {
    return getDashboardForRole(role);
  }
  return redirectPath;
}

export default function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirect(searchParams.get('redirect'));
  const roleParam = searchParams.get('role');
  const initialRole = getInitialRole(roleParam, redirectPath);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [previousRoleParam, setPreviousRoleParam] = useState(roleParam);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    searchParams.get('error') ? 'Đăng nhập bằng Google chưa thành công. Vui lòng thử lại.' : ''
  );

  if (roleParam !== previousRoleParam) {
    setPreviousRoleParam(roleParam);
    setSelectedRole(initialRole);
  }

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-role',
      selectedRole === 'Employer' ? 'employer' : 'candidate'
    );
    return () => document.documentElement.removeAttribute('data-role');
  }, [selectedRole]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', role === 'Employer' ? 'employer' : 'candidate');
    router.replace(`/login?${params.toString()}`, { scroll: false });
  };

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    try {
      const user = await login({ ...data, role: selectedRole });
      router.replace(getRedirectForRole(redirectPath, user.role));
    } catch (requestError: unknown) {
      const responseError = requestError as { response?: { data?: { message?: string } } };
      setError(responseError.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    }
  };

  const roleSlug = selectedRole === 'Employer' ? 'employer' : 'candidate';

  return (
    <main className="min-h-screen bg-[#eef2f4] text-slate-950 lg:grid lg:grid-cols-[minmax(420px,0.9fr)_minmax(520px,1.1fr)]">
      <AuthBrandPanel mode="login" />

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-10">
          <div className="mb-8">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
              POWORK
            </Link>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight">Đăng nhập</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Chọn đúng không gian làm việc và tiếp tục phiên của bạn.
            </p>
          </div>

          <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1" aria-label="Vai trò">
            {(['Candidate', 'Employer'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => selectRole(role)}
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
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email{selectedRole === 'Employer' ? ' doanh nghiệp' : ''}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder={selectedRole === 'Employer' ? 'hr@congty.com' : 'ban@email.com'}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/15"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Mật khẩu
                </label>
                <span className="text-xs text-slate-400">Tối thiểu 8 ký tự</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="Nhập mật khẩu"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-20 text-base text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/15"
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
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {selectedRole === 'Candidate' && (
            <>
              <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                hoặc
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <a
                href={GOOGLE_AUTH_URL}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span aria-hidden="true" className="font-bold text-[#4285f4]">
                  G
                </span>
                Tiếp tục với Google
              </a>
            </>
          )}

          <p className="mt-7 text-center text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <Link
              href={`/register?role=${roleSlug}`}
              className="font-semibold text-cyan-800 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
