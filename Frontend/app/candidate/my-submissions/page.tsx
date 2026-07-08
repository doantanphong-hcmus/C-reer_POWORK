'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function MySubmissionsPage() {
  const { user } = useAuth();

  if (!user) return null;

  // Mock data for submissions history
  const submissions = [
    {
      id: 'sub-001',
      challengeName: 'Thiết kế hệ thống caching cho API',
      submittedAt: '2 giờ trước',
      status: 'Đang chấm',
      statusClass: 'blind',
      tags: ['System Design', 'Redis'],
    },
    {
      id: 'sub-002',
      challengeName: 'Tối ưu hoá database query',
      submittedAt: 'Hôm qua',
      status: 'Đã unlock',
      statusClass: 'done',
      tags: ['PostgreSQL', 'Performance'],
    },
    {
      id: 'sub-003',
      challengeName: 'Xây dựng Authentication Service',
      submittedAt: '3 ngày trước',
      status: 'Không đạt',
      statusClass: 'fail',
      tags: ['Security', 'JWT'],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">Bài nộp của tôi</h1>
          <p className="mt-1 text-base text-foreground-secondary">
            Lịch sử và trạng thái các thử thách bạn đã tham gia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="card-base flex flex-col gap-3 transition-colors hover:border-accent"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-semibold text-foreground line-clamp-1">
                {sub.challengeName}
              </h3>
              <span className={`badge ${sub.statusClass} whitespace-nowrap ml-3`}>
                {sub.status}
              </span>
            </div>

            <div className="flex gap-2 text-xs text-foreground-secondary items-center">
              <span>
                Mã nộp:{' '}
                <code className="font-mono text-accent bg-accent-bg px-1 py-0.5 rounded ml-1">
                  {sub.id}
                </code>
              </span>
              <span>•</span>
              <span>Nộp {sub.submittedAt}</span>
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
              {sub.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t-hairline border-border flex justify-end">
              <Link
                href={`/candidate/my-submissions/${sub.id}`}
                className="btn-base hover:bg-background-tertiary transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
