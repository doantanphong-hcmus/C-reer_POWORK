import type {
  VerificationAnswer,
  VerificationDashboard,
  VerificationDashboardStatistics,
  VerificationDashboardTimeline,
  VerificationQuestion,
} from '@/lib/types';

const formatTime = (value: string | null) => {
  if (!value) return 'Chưa ghi nhận';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không xác định';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
};

const formatDuration = (seconds: number | null) => {
  if (seconds === null) return 'Chưa ghi nhận';
  if (seconds < 60) return `${seconds} giây`;
  return `${Math.floor(seconds / 60)} phút ${seconds % 60} giây`;
};

export function VerificationOverview({ dashboard }: { dashboard: VerificationDashboard }) {
  return (
    <section className="rounded-2xl border border-success/35 bg-success-bg p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-success">
            Bằng chứng xác minh đã mở khóa
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">
            Xác minh đã sẵn sàng để đánh giá
          </h2>
          <p className="mt-1 text-sm leading-6 text-foreground-secondary">
            Dữ liệu dưới đây thuộc đúng bài nộp và chỉ xuất hiện sau khi doanh nghiệp mở khóa.
          </p>
        </div>
        <div className="rounded-xl border border-success/30 bg-background/70 px-4 py-3 text-right">
          <p className="text-2xs uppercase text-foreground-tertiary">Mã xác minh</p>
          <p className="mt-1 break-all font-mono text-xs text-foreground">
            {dashboard.verificationId}
          </p>
        </div>
      </div>
    </section>
  );
}

export function VerificationTimelineSection({
  timeline,
}: {
  timeline: VerificationDashboardTimeline;
}) {
  const events = [
    ['Khởi tạo phiên', timeline.createdAt],
    ['Bắt đầu trình bày', timeline.oralStartedAt],
    ['Hoàn tất trình bày', timeline.oralCompletedAt],
    ['Bắt đầu tự luận', timeline.answeringStartedAt],
    ['Hoàn tất tự luận', timeline.answeringCompletedAt],
    ['Hoàn tất xác minh', timeline.completedAt],
  ];

  return (
    <section className="rounded-2xl border border-border-secondary bg-background-secondary p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Tiến trình</p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">Các mốc xác minh</h2>
      <div className="mt-5 space-y-0">
        {events.map(([label, value], index) => (
          <div key={label} className="grid grid-cols-[20px_minmax(0,1fr)] gap-3">
            <div className="flex flex-col items-center">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
              {index < events.length - 1 && <span className="min-h-11 w-px flex-1 bg-border" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="mt-1 text-xs text-foreground-tertiary">{formatTime(value)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VerificationStatisticsSection({
  statistics,
}: {
  statistics: VerificationDashboardStatistics;
}) {
  const metrics = [
    ['Câu hỏi', statistics.questionCount],
    ['Thời lượng đã chọn', formatDuration(statistics.selectedOralDurationSeconds)],
    ['Thời lượng thực tế', formatDuration(statistics.actualOralDurationSeconds)],
  ];

  return (
    <section className="rounded-2xl border border-border-secondary bg-background-secondary p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Tổng quan</p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">Thống kê phiên xác minh</h2>
      <p className="mt-1 text-xs leading-5 text-foreground-secondary">
        Tổng quan về cấu trúc và thời lượng của phiên xác minh.
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-background px-3 py-3">
            <dt className="text-2xs leading-4 text-foreground-tertiary">{label}</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function VerificationIntegritySignalsSection({
  statistics,
}: {
  statistics: VerificationDashboardStatistics;
}) {
  // Client-reported signals are supporting context, never an automatic fraud verdict.
  const signals = [
    {
      label: 'Camera gián đoạn',
      value: statistics.cameraInterruptionCount,
      explanation: 'Số lần trình duyệt báo camera ngừng cung cấp hình ảnh rồi hoạt động trở lại.',
    },
    {
      label: 'Thời gian camera gián đoạn',
      value: formatDuration(statistics.cameraInterruptionDurationSeconds),
      explanation:
        'Tổng thời gian camera bị gián đoạn do hệ thống tính từ các tín hiệu được ghi nhận.',
    },
    {
      label: 'Rời cửa sổ làm bài',
      value: statistics.focusLossCount,
      explanation:
        'Số lần cửa sổ làm bài không còn được ưu tiên hiển thị. Hộp thoại hệ thống hoặc đổi cửa sổ đều có thể tạo tín hiệu này.',
    },
    {
      label: 'Thao tác dán bị chặn',
      value: statistics.pasteBlockedCount,
      explanation: 'Số lần trình soạn thảo chặn thao tác dán trong phần trả lời tự luận.',
    },
    {
      label: 'Chọn tất cả bị chặn',
      value: statistics.selectAllBlockedCount,
      explanation: 'Số lần trình soạn thảo chặn Ctrl+A hoặc Cmd+A trong phần trả lời tự luận.',
    },
    {
      label: 'Sao chép bị chặn',
      value: statistics.copyBlockedCount,
      explanation: 'Số lần trình soạn thảo chặn thao tác sao chép trong phần trả lời tự luận.',
    },
    {
      label: 'Kéo thả bị chặn',
      value: statistics.dropBlockedCount,
      explanation: 'Số lần trình soạn thảo chặn nội dung được kéo thả vào câu trả lời.',
    },
  ];

  return (
    <section className="rounded-2xl border border-border-secondary bg-background-secondary p-5">
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Thông tin hỗ trợ
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">Tín hiệu trong phiên</h2>
        </div>
        <span className="rounded-full border border-border-secondary bg-background px-2.5 py-1 text-2xs font-medium text-foreground-secondary">
          Do trình duyệt ghi nhận
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-foreground-secondary">
        Các số liệu này do trình duyệt của ứng viên báo cáo để bổ sung ngữ cảnh. Chúng không đủ để
        tự động kết luận hành vi hay gian lận.
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {signals.map((signal) => (
          <div
            key={signal.label}
            className="rounded-xl border border-border bg-background px-3 py-3"
          >
            <dt className="flex items-start justify-between gap-2 text-2xs leading-4 text-foreground-tertiary">
              <span>{signal.label}</span>
              <span
                tabIndex={0}
                title={signal.explanation}
                aria-label={`Giải thích: ${signal.explanation}`}
                className="group relative flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full border border-border-secondary text-[10px] font-semibold text-foreground-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                i
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-7 right-0 z-20 hidden w-64 rounded-lg border border-border-secondary bg-background-secondary p-3 text-left text-xs font-normal leading-5 text-foreground-secondary shadow-xl group-hover:block group-focus:block"
                >
                  {signal.explanation}
                </span>
              </span>
            </dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">{signal.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function VerificationQuestionAnswersSection({
  questions,
  answers,
}: {
  questions: VerificationQuestion[];
  answers: VerificationAnswer[];
}) {
  const answerByQuestion = new Map(answers.map((answer) => [answer.questionId, answer.answer]));

  return (
    <section className="rounded-2xl border border-border-secondary bg-background-secondary p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Phần tự luận
        </p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">Câu trả lời phần tự luận</h2>
        <p className="mt-2 text-sm leading-6 text-foreground-secondary">
          Nội dung ứng viên tự nhập ngay sau phần trình bày qua camera.
        </p>
      </div>
      <div className="mt-5 space-y-4">
        {questions.map((question, index) => (
          <article
            key={question.questionId}
            className="rounded-xl border border-border bg-background p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-bg text-xs font-semibold text-accent">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  {question.question}
                </h3>
                <p className="mt-1 text-2xs text-foreground-tertiary">
                  Yêu cầu {question.minimumLength}–{question.maximumLength} ký tự
                </p>
              </div>
            </div>
            <div className="mt-4 whitespace-pre-wrap rounded-xl border border-border-secondary bg-background-secondary p-4 text-sm leading-7 text-foreground-secondary">
              {answerByQuestion.get(question.questionId) ?? 'Không có câu trả lời.'}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
