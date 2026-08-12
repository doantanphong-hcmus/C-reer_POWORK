import Image from 'next/image';

export function AuthBrandPanel({ mode }: { mode: 'login' | 'register' }) {
  return (
    <aside className="relative hidden min-h-full overflow-hidden border-r border-white/10 bg-[#0b1720] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="absolute inset-y-0 right-14 w-px bg-white/[0.06]" aria-hidden="true" />
      <div className="absolute inset-y-0 right-28 w-px bg-white/[0.04]" aria-hidden="true" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/poworklogo.png"
            alt="POWORK"
            width={52}
            height={52}
            className="h-[52px] w-[52px] rounded-xl border border-white/15 bg-white object-contain p-1"
            priority
          />
          <div>
            <p className="text-xl font-semibold tracking-[0.12em]">POWORK</p>
            <p className="text-xs text-slate-400">Blind Audition Platform</p>
          </div>
        </div>

        <div className="mt-20 max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Tuyển dụng dựa trên năng lực
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight xl:text-5xl">
            Để bài làm lên tiếng trước hồ sơ cá nhân.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
            POWORK giúp doanh nghiệp đánh giá bằng chứng thực chiến và giúp ứng viên được nhìn nhận
            công bằng hơn qua năng lực thật.
          </p>
        </div>
      </div>

      <div className="relative grid gap-3 border-t border-white/10 pt-7 text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {[
          ['Ẩn danh', 'Đánh giá trước khi mở danh tính'],
          ['Có cấu trúc', 'Chấm điểm theo rubric rõ ràng'],
          ['Có bằng chứng', 'Xác minh sau khi nộp bài'],
        ].map(([title, description]) => (
          <div key={title}>
            <p className="font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
          </div>
        ))}
        <p className="col-span-full mt-3 text-xs text-slate-500">
          {mode === 'login'
            ? 'Đăng nhập để tiếp tục không gian làm việc của bạn.'
            : 'Tạo tài khoản để bắt đầu hành trình tuyển dụng công bằng hơn.'}
        </p>
      </div>
    </aside>
  );
}
