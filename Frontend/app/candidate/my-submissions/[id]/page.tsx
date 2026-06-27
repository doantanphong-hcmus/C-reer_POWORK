'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMemo } from 'react';

// Mock data (trong thực tế sẽ fetch theo id)
const SUBMISSIONS_MOCK: Record<string, any> = {
  'sub-001': {
    id: 'sub-001',
    challengeName: 'Thiết kế hệ thống caching cho API',
    submittedAt: '26/06/2026 13:20',
    status: 'Đang chấm',
    statusClass: 'blind',
    score: null,
    files: [
      { name: 'solution.zip', type: 'file' },
      { name: 'architecture_diagram.pdf', type: 'file' }
    ],
    github: {
      repo: 'https://github.com/candidate/vng-cache-api',
      commit: '7ac81b2'
    },
    feedback: null,
    challenge: {
      description: 'Thiết kế một hệ thống distributed cache cho API có high traffic (10k req/s). Yêu cầu đảm bảo tính consistency cao và latency thấp.',
      difficulty: 'Medium',
      deadline: '28/06/2026',
      tags: ['System Design', 'Redis']
    }
  },
  'sub-002': {
    id: 'sub-002',
    challengeName: 'Tối ưu hoá database query',
    submittedAt: '25/06/2026 09:15',
    status: 'Đã unlock',
    statusClass: 'done',
    score: '86/100',
    files: [
      { name: 'query_optimization.sql', type: 'file' }
    ],
    github: null,
    feedback: [
      { text: 'Thiết kế cache tốt', type: 'good' },
      { text: 'API rõ ràng', type: 'good' },
      { text: 'Thiếu cache invalidation', type: 'bad' },
      { text: 'Chưa benchmark', type: 'bad' }
    ],
    challenge: {
      description: 'Phân tích và tối ưu hoá một query phức tạp trong PostgreSQL đang gây chậm toàn bộ hệ thống e-commerce.',
      difficulty: 'Hard',
      deadline: '25/06/2026',
      tags: ['PostgreSQL', 'Performance']
    }
  }
};

export default function SubmissionDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params?.id as string;
  
  const data = useMemo(() => SUBMISSIONS_MOCK[id] || SUBMISSIONS_MOCK['sub-001'], [id]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link href="/candidate/my-submissions" className="back-link hover:underline">
          &larr; Quay lại danh sách bài nộp
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Chi tiết bài nộp</h1>
          <p className="mt-1 text-base text-foreground-secondary font-mono">
            Mã bài: <span className="text-accent bg-accent-bg px-1.5 py-0.5 rounded">{data.id}</span>
          </p>
        </div>
        <span className={`badge ${data.statusClass} px-3 py-1 text-xs`}>{data.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái (Thông tin, File nộp, Kết quả) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thông tin bài nộp */}
          <div className="card-base">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b-hairline border-border pb-2">Thông tin bài nộp</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="block text-foreground-secondary text-xs uppercase tracking-wider mb-1">Tên thử thách</span>
                <span className="font-medium text-foreground">{data.challengeName}</span>
              </div>
              <div>
                <span className="block text-foreground-secondary text-xs uppercase tracking-wider mb-1">Mã bài</span>
                <span className="font-mono text-accent">{data.id}</span>
              </div>
              <div>
                <span className="block text-foreground-secondary text-xs uppercase tracking-wider mb-1">Ngày nộp</span>
                <span className="text-foreground">{data.submittedAt}</span>
              </div>
              <div>
                <span className="block text-foreground-secondary text-xs uppercase tracking-wider mb-1">Điểm</span>
                <span className="font-semibold text-foreground">{data.score || '--'}</span>
              </div>
            </div>
          </div>

          {/* Kết quả chấm */}
          <div className="card-base">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b-hairline border-border pb-2">Kết quả chấm</h2>
            {data.feedback ? (
              <div>
                <div className="mb-4">
                  <span className="text-foreground-secondary mr-2">Điểm số đạt được:</span>
                  <span className="text-xl font-bold text-success">{data.score}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-foreground-secondary text-xs uppercase tracking-wider mb-2">Feedback từ Reviewer:</p>
                  {data.feedback.map((fb: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      {fb.type === 'good' ? (
                        <span className="text-success mt-0.5">✔</span>
                      ) : (
                        <span className="text-error mt-0.5">✘</span>
                      )}
                      <span className="text-foreground">{fb.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center placeholder">
                <p>Đang chờ reviewer chấm điểm...</p>
              </div>
            )}
          </div>

          {/* File đã nộp */}
          <div className="card-base">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b-hairline border-border pb-2">Giải pháp đã nộp</h2>
            
            <div className="space-y-4">
              {data.files && data.files.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground-secondary mb-2">Tệp đính kèm:</p>
                  <div className="flex flex-col gap-2">
                    {data.files.map((file: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-accent">📄</span>
                        <Link href="#" className="text-accent hover:underline">{file.name}</Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.github && (
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-wider text-foreground-secondary mb-2">Repository (Git):</p>
                  <div className="bg-background-tertiary p-3 rounded-md border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground-secondary text-xs">Repo:</span>
                      <a href={data.github.repo} target="_blank" rel="noreferrer" className="text-accent hover:underline text-sm truncate">{data.github.repo}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground-secondary text-xs">Commit:</span>
                      <code className="font-mono text-xs bg-background p-1 rounded text-foreground">{data.github.commit}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Cột phải (Thông tin Thử thách) */}
        <div className="space-y-6">
          <div className="card-base bg-background-tertiary">
            <h2 className="text-md font-semibold text-foreground mb-4 border-b-hairline border-border pb-2">Thông tin Thử thách</h2>
            
            <h3 className="font-medium text-foreground text-lg mb-2">{data.challengeName}</h3>
            
            <p className="text-sm text-foreground-secondary mb-4 leading-relaxed">
              {data.challenge.description}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-foreground-secondary">Độ khó</span>
                <span className={`font-medium ${data.challenge.difficulty === 'Hard' ? 'text-error' : data.challenge.difficulty === 'Medium' ? 'text-warning' : 'text-success'}`}>
                  {data.challenge.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-secondary">Thời hạn</span>
                <span className="text-foreground">{data.challenge.deadline}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t-hairline border-border">
              <span className="block text-foreground-secondary text-xs uppercase tracking-wider mb-2">Kỹ năng đánh giá</span>
              <div className="flex gap-2 flex-wrap">
                {data.challenge.tags.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 text-center">
              <Link href={`/challenges/xyz`} className="text-accent text-sm hover:underline inline-flex items-center gap-1">
                Xem lại đề bài đầy đủ &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
