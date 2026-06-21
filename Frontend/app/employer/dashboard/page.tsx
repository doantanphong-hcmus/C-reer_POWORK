
'use client';

import Link from 'next/link';
import { useChallenges } from '@/lib/hooks/useChallenges';

export default function EmployerDashboardPage() {
  const { data: challenges, isLoading, isError, error } = useChallenges();

  return (
    <div className="body" style={{ padding: '24px 24px 32px', flex: 1, overflowY: 'auto' }}>
      {/* Stat cards row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            padding: '16px',
            background: 'var(--bg3)',
            border: '0.5px solid var(--border2)',
            borderRadius: '10px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text3)',
              marginBottom: '8px',
              fontWeight: '500',
            }}
          >
            Challenge đang mở
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--green)',
              lineHeight: '1',
              marginBottom: '4px',
            }}
          >
            {challenges?.length || 0}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text3)' }}></p>
        </div>

        <div
          style={{
            padding: '16px',
            background: 'var(--bg3)',
            border: '0.5px solid var(--border2)',
            borderRadius: '10px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text3)',
              marginBottom: '8px',
              fontWeight: '500',
            }}
          >
            Bài nộp chờ chấm
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--amber)',
              lineHeight: '1',
              marginBottom: '4px',
            }}
          >
            0
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text3)' }}></p>
        </div>

        <div
          style={{
            padding: '16px',
            background: 'var(--bg3)',
            border: '0.5px solid var(--border2)',
            borderRadius: '10px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text3)',
              marginBottom: '8px',
              fontWeight: '500',
            }}
          >
            Hồ sơ đã unlock
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--blue)',
              lineHeight: '1',
              marginBottom: '4px',
            }}
          >
            0
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text3)' }}></p>
        </div>

        <div
          style={{
            padding: '16px',
            background: 'var(--bg3)',
            border: '0.5px solid var(--border2)',
            borderRadius: '10px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text3)',
              marginBottom: '8px',
              fontWeight: '500',
            }}
          >
            Lời mời PV đã gửi
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--accent)',
              lineHeight: '1',
              marginBottom: '4px',
            }}
          >
            0
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text3)' }}></p>
        </div>
      </div>

      {/* Main content: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Left: Active challenges */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <p
              className="sec-label"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text3)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '0',
              }}
            >
              Challenge đang hoạt động
            </p>
            <Link
              href="/employer/challenges/create"
              className="btn"
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                borderRadius: '4px',
                background: 'var(--bg3)',
                border: '0.5px solid var(--border2)',
                }
              }
            >
              + Tạo mới
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isLoading && <p style={{ color: 'var(--text2)' }}>Đang tải thử thách...</p>}
            {isError && (
              <p style={{ color: 'var(--red)' }}>
                {error?.message || 'Không thể tải danh sách thử thách.'}
              </p>
            )}
            {!isLoading && !isError && challenges?.length === 0 && (
              <p style={{ color: 'var(--text2)' }}>Chưa có thử thách nào được tạo.</p>
            )}
            {challenges?.map((challenge) => (
              <div
                key={challenge.challenge_id}
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg3)',
                  border: '0.5px solid var(--border2)',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>
                      {challenge.title}
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--text3)' }}>
                      {challenge.industry} · {challenge.company_name} · Hạn chót:{' '}
                      {new Date(challenge.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Status is not in ChallengeSummary, so using a generic badge */}
                  <span
                    className="badge open"
                    style={{
                      flexShrink: 0,
                      marginLeft: '8px',
                      display: 'inline-block',
                      fontSize: '10px',
                      fontWeight: '500',
                      padding: '2px 9px',
                      borderRadius: '20px',
                      background: 'var(--green-bg)',
                      color: 'var(--green)',
                      border: '0.5px solid rgba(34,197,94,0.3)',
                    }}
                  >
                    Đang mở
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* created_at is not in ChallengeSummary, so omitting for now */}
                  <span style={{ fontSize: '10px', color: 'var(--text3)' }}>
                    ID: {challenge.challenge_id.substring(0, 8)}...
                  </span>
                  <Link
                    href={`/employer/challenges/${challenge.challenge_id}`}
                    className="btn"
                    style={{ fontSize: '10px', padding: '3px 10px' }}
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent activity feed */}
        <div>
          <p
            className="sec-label"
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '14px',
            }}
          >
            Hoạt động gần đây
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <p style={{ fontSize: '11px', color: 'var(--text3)' }}>
              Chưa có hoạt động gần đây.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
