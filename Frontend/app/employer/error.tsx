'use client';

import { useEffect } from 'react';

export default function EmployerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Employer workspace]', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6">
      <section className="w-full rounded-2xl border border-border-secondary bg-background-secondary p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-warning">
          Không gian tuyển dụng
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Chưa thể hiển thị trang này</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-foreground-secondary">
          Dữ liệu của bạn vẫn được giữ nguyên. Hãy tải lại khu vực này; nếu sự cố tiếp tục, vui lòng
          quay lại Dashboard và thử lại sau.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Thử tải lại
          </button>
          <a
            href="/employer/dashboard"
            className="rounded-lg border border-border-secondary px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            Về Dashboard
          </a>
        </div>
      </section>
    </div>
  );
}
