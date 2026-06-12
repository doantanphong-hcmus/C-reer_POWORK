export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">🚀 POWORK</h1>
        <p className="text-foreground-secondary mb-8">
          Nền tảng tuyển dụng qua thử thách thực chiến
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Đăng nhập
          </a>
          <a
            href="/auth/register"
            className="px-6 py-3 bg-background-secondary border border-border-secondary text-foreground rounded-lg hover:bg-background-tertiary transition-colors"
          >
            Đăng ký
          </a>
        </div>
      </div>
    </main>
  );
}
