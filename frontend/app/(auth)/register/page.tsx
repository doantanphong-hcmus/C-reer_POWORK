'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import type { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ email, password, full_name: fullName, role });
      router.push('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🚀 POWORK</h1>
          <p className="text-foreground-secondary text-sm">Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="input-base"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-base"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bạn là
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('Candidate')}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'Candidate'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-secondary bg-background-secondary text-foreground-secondary hover:border-accent/50'
                }`}
              >
                👨‍💻 Ứng viên
              </button>
              <button
                type="button"
                onClick={() => setRole('Employer')}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'Employer'
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
            disabled={loading}
            className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
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
