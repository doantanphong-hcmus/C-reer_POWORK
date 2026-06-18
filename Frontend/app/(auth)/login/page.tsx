'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  useEffect(() => {
    if (role !== "employer" && role !== "candidate") {
      // Invalid or missing role, redirect to role selection
      router.push("/?error=invalid_role");
    }
  }, [role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!role) {
      setError("Vui lòng chọn một vai trò trước khi đăng nhập.");
      setLoading(false);
      return;
    }

    try {
      await login({ email, password });
      if (role === "employer") {
        router.push("/employer/dashboard");
      } else if (role === "candidate") {
        // For now, redirect candidates back to home with a message
        router.push("/?message=candidate_flow_not_implemented");
      } else {
        router.push("/"); // Fallback to home
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const loginTitle = role === "employer" ? "Đăng nhập doanh nghiệp" : "Chào mừng trở lại";
  const loginSubtitle = role === "employer" ? "Quản lý Challenge và tìm kiếm nhân tài" : "Đăng nhập để tiếp tục hành trình của bạn";
  const dynamicInputProps = { type: showPassword ? "text" : "password" };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full flex-1 flex flex-col">
        {/* Topbar: Đã đồng bộ hoàn toàn style, padding và kích thước logo giống hệt trang chính */}
        <div className="topbar" style={{ background: 'var(--bg3)', borderBottom: '0.5px solid var(--border)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexShrink: 0 }}>
          <a href="/" className="text-foreground-secondary text-lg no-underline hover:text-foreground transition-colors">
            ← Chọn vai trò
          </a>
          <span className="logo" style={{ fontSize: '28px', letterSpacing: '1.5px', fontWeight: '700', color: 'var(--text)' }}>POWORK</span>
          <span
            className={`inline-block text-base font-bold px-4 py-1.5 rounded-pill border hairline ${role === "candidate"
                ? "bg-success-bg text-success border-success/40"
                : "bg-warning-bg text-warning border-warning/40"}`}
          >
            {role === "candidate" ? "Candidate" : "Employer"}
          </span>
        </div>

        {/* Body */}
        <div className="bg-background-secondary border-b border-border-secondary p-12 md:p-20 flex-1 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 items-start h-full w-full max-w-[1600px] mx-auto">
            {/* Left Column: Login form */}
            <div className="space-y-2">
              <p className="text-4xl font-extrabold tracking-tight mb-2">{loginTitle}</p>
              <p className="text-base text-foreground-tertiary mb-8">{loginSubtitle}</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-base font-semibold text-foreground-secondary mb-3">
                    Email {role === "employer" && "doanh nghiệp"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "employer" ? "hr@company.com" : "you@email.com"}
                    className="input-base !text-base !py-4.5 !px-5 w-full rounded-xl border-2 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-base font-semibold text-foreground-secondary mb-3">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-base !text-base !py-4.5 !px-5 pr-14 w-full rounded-xl border-2 font-medium"
                      {...dynamicInputProps}
                    />
                    <span 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ userSelect: 'none' }}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-foreground-tertiary cursor-pointer"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="bg-error-bg border-2 border-red-500/30 text-red-400 text-base rounded-xl px-5 py-4">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-base w-full py-4.5 mt-4 text-center text-base font-bold rounded-xl transition-all ${role === "candidate"
                      ? "bg-success text-black border-none"
                      : "bg-warning text-black border-none"}
                      disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-0.5 bg-border-secondary"></div>
                <span className="text-base text-foreground-tertiary font-medium">hoặc</span>
                <div className="flex-1 h-0.5 bg-border-secondary"></div>
              </div>

              {role === "candidate" ? (
                <button className="btn-secondary w-full py-4 text-center text-base font-semibold mb-6 rounded-xl border-2">
                  🔗 Tiếp tục với Google
                </button>
              ) : (
                <button className="btn-secondary w-full py-4 text-center text-base font-semibold mb-6 rounded-xl border-2">
                  🏢 Đăng nhập qua SSO
                </button>
              )}

              <div className="flex justify-between text-base font-medium pt-2">
                <p>
                  <a href="#" className="text-accent cursor-pointer no-underline hover:underline">
                    Quên mật khẩu?
                  </a>
                </p>
                <p className="text-foreground-tertiary">
                  Chưa có tài khoản?{' '}
                  <a href="/register" className="text-accent cursor-pointer no-underline hover:underline font-bold">
                    Đăng ký
                  </a>
                </p>
              </div>
            </div>

            {/* Right Column: Role-specific content */}
            <div>
              {role === "candidate" ? (
                /* Candidate: Join by invite code */
                <div className="p-8 bg-background-tertiary border-2 border-success/25 rounded-2xl space-y-6">
                  <div>
                    <p className="text-xl font-bold text-success mb-2">🔑 Có mã Challenge?</p>
                    <p className="text-base text-foreground-tertiary leading-relaxed">
                      Employer có thể gửi mã riêng để mời bạn tham gia Challenge nội bộ của họ
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-foreground-secondary mb-3">Mã Challenge</p>
                    <div className="flex gap-3">
                      <input
                        className="input-base !text-base !py-4 !px-5 font-mono tracking-wider flex-1 rounded-xl border-2"
                        placeholder="VD: VNG-2026-CACHE"
                      />
                      <button className="btn-secondary !text-base px-6 py-4 whitespace-nowrap rounded-xl font-bold border-2">Tham gia</button>
                    </div>
                  </div>

                  <div className="p-5 bg-background border-2 border-border rounded-xl">
                    <p className="text-sm text-foreground-tertiary leading-relaxed">
                      Mã Challenge có dạng{' '}
                      <code className="font-mono font-black text-success bg-success/10 px-2 py-0.5 rounded-md">
                        ABC-YYYY-XXXX
                      </code>{' '}
                      — thường được gửi qua email hoặc Slack nội bộ của công ty
                    </p>
                  </div>
                </div>
              ) : (
                /* Employer: Company info panel */
                <div className="p-8 bg-background-tertiary border-2 border-warning/25 rounded-2xl space-y-2">
                  <p className="text-xl font-bold text-warning mb-6">🏅 Sau khi đăng nhập, bạn có thể</p>

                  <div className="flex flex-col gap-6 mb-6">
                    {/* Đã bỏ khung đen quanh icon và xích chữ ra qua gap-6 */}
                    <div className="flex gap-6 items-start">
                      <span className="text-2xl flex-shrink-0">📝</span>
                      <div>
                        <p className="text-base font-bold mb-1.5">Tạo Challenge + sinh mã invite</p>
                        <p className="text-sm text-foreground-tertiary leading-relaxed">Mỗi Challenge có mã riêng để share nội bộ hoặc công khai</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start">
                      <span className="text-2xl flex-shrink-0">🎯</span>
                      <div>
                        <p className="text-base font-bold mb-1.5">Chấm điểm Blind Audition</p>
                        <p className="text-sm text-foreground-tertiary leading-relaxed">Đánh giá khách quan — không nhìn thấy CV</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start">
                      <span className="text-2xl flex-shrink-0">👥</span>
                      <div>
                        <p className="text-base font-bold mb-1.5">Xây dựng Talent Pool</p>
                        <p className="text-sm text-foreground-tertiary leading-relaxed">Lưu hồ sơ ứng viên đã xác thực năng lực</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-background border-2 border-border rounded-xl">
                    <p className="text-sm text-foreground-tertiary leading-relaxed">
                      🔒 Dùng email công ty để được xác minh tự động — tăng độ tin cậy với Candidate
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}