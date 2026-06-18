'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [error, setError] = useState('');
  const role = searchParams.get('role');

  // Vai trò bắt buộc và phải hợp lệ — nếu không, quay lại trang chọn vai trò.
  useEffect(() => {
    if (role !== 'employer' && role !== 'candidate') {
      router.push('/?error=invalid_role');
    }
  }, [role, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    if (!role) {
      setError('Vui lòng chọn một vai trò trước khi đăng nhập.');
      return;
    }
    try {
      await login(data);
      // Ưu tiên param ?redirect (do middleware gắn khi chặn route bảo vệ),
      // sau đó mới điều hướng theo vai trò.
      const redirect = searchParams.get('redirect');
      if (redirect && redirect.startsWith('/')) {
        router.push(redirect);
      } else if (role === 'employer') {
        router.push('/employer/dashboard');
      } else if (role === 'candidate') {
        // Luồng candidate chưa triển khai — tạm đưa về trang chủ kèm thông báo.
        router.push('/?message=candidate_flow_not_implemented');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    }
  };

  const loginSubtitle =
    role === 'employer'
      ? 'Quản lý Challenge và tìm kiếm nhân tài'
      : 'Đăng nhập để tiếp tục hành trình của bạn';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🚀 POWORK</h1>
          <p className="text-foreground-secondary text-sm">{loginSubtitle}</p>
        </div>

        {role === 'candidate' && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm rounded-lg px-4 py-3 mb-4">
            Chức năng Candidate hiện chưa được triển khai. Vui lòng thử lại với vai trò Employer.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email {role === 'employer' && 'doanh nghiệp'}
            </label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              {...registerField('email')}
              placeholder={role === 'employer' ? 'hr@company.com' : 'you@example.com'}
              className="input-base"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...registerField('password')}
              placeholder="••••••••"
              className="input-base"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-foreground-secondary text-sm mt-6">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-accent hover:underline font-medium">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground-secondary">
          Đang tải...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
