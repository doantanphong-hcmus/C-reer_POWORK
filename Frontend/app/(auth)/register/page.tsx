'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const {
    register: registerField,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: '', email: '', password: '', role: 'Candidate' },
  });

  const selectedRole = useWatch({ control, name: 'role' });

  const [error, setError] = useState('');

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    try {
      const user = await register(data);
      // Redirect theo role, giống logic bên login
      if (user.role === 'Employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🚀 POWORK</h1>
          <p className="text-foreground-secondary text-sm">Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              {...registerField('full_name')}
              placeholder="Nguyễn Văn A"
              className="input-base"
            />
            {errors.full_name && (
              <p className="text-red-400 text-sm mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              {...registerField('email')}
              placeholder="you@example.com"
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
              autoComplete="new-password"
              {...registerField('password')}
              placeholder="Tối thiểu 6 ký tự"
              className="input-base"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bạn là</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('role', 'Candidate', { shouldValidate: true })}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  selectedRole === 'Candidate'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-secondary bg-background-secondary text-foreground-secondary hover:border-accent/50'
                }`}
              >
                👨‍💻 Ứng viên
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'Employer', { shouldValidate: true })}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  selectedRole === 'Employer'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-secondary bg-background-secondary text-foreground-secondary hover:border-accent/50'
                }`}
              >
                🏢 Nhà tuyển dụng
              </button>
            </div>
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
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>

        <p className="text-center text-foreground-secondary text-sm mt-6">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-accent hover:underline font-medium">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
