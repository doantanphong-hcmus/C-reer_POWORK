'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

function CandidateIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="m3 8 9-4 9 4-9 4-9-4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.2v4.2c2.7 2.1 7.3 2.1 10 0v-4.2M21 8v5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmployerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="M4 20V6.5A1.5 1.5 0 0 1 5.5 5h8A1.5 1.5 0 0 1 15 6.5V20M15 10h3.5a1.5 1.5 0 0 1 1.5 1.5V20M8 9h3M8 13h3M8 17h3M3 20h18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const roles = [
  {
    key: 'Candidate' as const,
    label: 'Ứng viên',
    eyebrow: 'Tìm cơ hội bằng năng lực',
    description:
      'Tham gia thử thách thực tế, được đánh giá ẩn danh và xây dựng hồ sơ năng lực từ kết quả đã xác minh.',
    features: ['Bài làm được chấm trước hồ sơ', 'Danh tính được bảo vệ', 'Tích lũy hồ sơ năng lực'],
    icon: <CandidateIcon />,
    tone: 'teal',
  },
  {
    key: 'Employer' as const,
    label: 'Nhà tuyển dụng',
    eyebrow: 'Tuyển dụng bằng bằng chứng',
    description:
      'Tạo thử thách, đánh giá theo tiêu chí nhất quán và chỉ mở khóa ứng viên sau khi đã xem năng lực thực tế.',
    features: [
      'Đánh giá ẩn danh có cấu trúc',
      'Quản lý bài nộp tập trung',
      'Xây dựng kho ứng viên phù hợp',
    ],
    icon: <EmployerIcon />,
    tone: 'amber',
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#091117] text-white">
      <header className="border-b border-white/10 bg-[#0d1820]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="text-xl font-bold tracking-[0.18em] text-white">
            POWORK
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
            Bắt đầu với POWORK
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Chọn không gian phù hợp với bạn
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400">
            Một nền tảng, hai hành trình được thiết kế riêng cho người tìm cơ hội và doanh nghiệp
            tìm kiếm năng lực thật.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
          {roles.map((role) => {
            const isCandidate = role.tone === 'teal';
            return (
              <article
                key={role.key}
                className={`group relative overflow-hidden rounded-2xl border bg-[#101c24] p-7 transition duration-200 hover:-translate-y-1 hover:bg-[#12212a] sm:p-9 ${
                  isCandidate
                    ? 'border-teal-400/25 hover:border-teal-300/60'
                    : 'border-amber-400/25 hover:border-amber-300/60'
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${isCandidate ? 'bg-teal-400' : 'bg-amber-400'}`}
                  aria-hidden="true"
                />
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                    isCandidate
                      ? 'border-teal-300/25 bg-teal-400/10 text-teal-300'
                      : 'border-amber-300/25 bg-amber-400/10 text-amber-300'
                  }`}
                >
                  {role.icon}
                </div>

                <p
                  className={`mt-7 text-xs font-semibold uppercase tracking-[0.16em] ${isCandidate ? 'text-teal-300' : 'text-amber-300'}`}
                >
                  {role.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">{role.label}</h2>
                <p className="mt-4 min-h-[84px] text-sm leading-7 text-slate-300">
                  {role.description}
                </p>

                <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isCandidate ? 'bg-teal-300' : 'bg-amber-300'}`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/login?role=${role.key === 'Candidate' ? 'candidate' : 'employer'}`
                    )
                  }
                  className={`mt-8 flex h-12 w-full items-center justify-between rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101c24] ${
                    isCandidate
                      ? 'bg-teal-400 text-[#061512] hover:bg-teal-300 focus-visible:ring-teal-300'
                      : 'bg-amber-400 text-[#1c1202] hover:bg-amber-300 focus-visible:ring-amber-300'
                  }`}
                >
                  Tiếp tục với vai trò {role.label}
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            );
          })}
        </div>

        <p className="mt-9 text-center text-sm text-slate-400">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold text-white underline underline-offset-4">
            Tạo tài khoản mới
          </Link>
        </p>
      </section>
    </main>
  );
}
