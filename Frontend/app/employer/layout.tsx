'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn'; // Assuming cn is available

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hệ thống style đã scale-up kích thước chữ và padding phù hợp với font nền lớn của Dashboard
  const styles = {
    // ... (Keep the relevant styles for topbar, logo, nav, btnPrimary, btnSecondary, etc.)
    // However, I will try to use Tailwind classes where possible to avoid inline styles and make it more reusable.
    // For now, I'll extract the inline styles for the topbar elements.

    topbar: {
      background: 'var(--bg3)',
      borderBottom: '0.5px solid var(--border)',
      padding: '18px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexShrink: 0,
    },
    logo: {
      fontSize: '18px',
      letterSpacing: '0.4px',
      fontWeight: '600',
      color: 'var(--text)',
    },
    navLink: {
      fontSize: '15px',
      color: 'var(--text2)',
      textDecoration: 'none',
      cursor: 'pointer', // Changed to pointer for interaction
      fontWeight: '500',
    },
    navLinkActive: {
      color: 'var(--text)',
    },
    btnPrimary: {
      display: 'inline-block',
      fontSize: '14px',
      fontWeight: '500',
      padding: '10px 20px',
      borderRadius: '8px',
      border: '0.5px solid var(--border2)',
      color: 'var(--bg)',
      background: 'var(--text)',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      borderColor: 'transparent',
    },
    btnSecondary: {
      display: 'inline-block',
      fontSize: '15px',
      fontWeight: '500',
      padding: '10px 20px',
      borderRadius: '8px',
      background: 'var(--bg3)',
      color: 'var(--text)',
      border: '0.5px solid var(--border2)',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      textAlign: 'center',
    },
    notificationIcon: {
      padding: '10px 14px',
      fontSize: '16px',
      display: 'inline-block',
      fontWeight: '500',
      borderRadius: '8px',
      border: '0.5px solid var(--border2)',
      color: 'var(--text)',
      background: 'var(--bg3)',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    },
    notificationBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      background: '#e05c5c',
      fontSize: '11px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
    },
    companyNameBtn: {
      display: 'inline-block',
      fontWeight: '500',
      padding: '10px 20px',
      borderRadius: '8px',
      border: '0.5px solid var(--border2)',
      color: 'var(--text)',
      background: 'var(--bg3)',
      whiteSpace: 'nowrap',
      cursor: 'default',
      fontSize: '14px',
    },
  } as const;

  return (
    <div
      style={{
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font)',
        fontSize: '15px',
        lineHeight: '1.6',
        padding: '0',
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        className="screen-block"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="screen"
          style={{
            background: 'var(--bg2)',
            border: 'none',
            borderRadius: '0',
            overflow: 'hidden',
            cursor: 'default',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Topbar */}
          <div className="topbar" style={styles.topbar}>
            <span className="logo" style={styles.logo}>
              POWORK
            </span>
            <nav className="nav" style={{ display: 'flex', gap: '32px' }}>
              <Link
                href="/employer/dashboard"
                className={cn(
                  'nav-link',
                  pathname === '/employer/dashboard' ? 'active' : '',
                  'hover:text-[var(--text)]'
                )}
                style={{
                  ...styles.navLink,
                  ...(pathname === '/employer/dashboard' ? styles.navLinkActive : {}),
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/employer/challenges/create"
                className={cn(
                  'nav-link',
                  pathname.startsWith('/employer/challenges/create') ? 'active' : '',
                  'hover:text-[var(--text)]'
                )}
                style={{
                  ...styles.navLink,
                  ...(pathname.startsWith('/employer/challenges/create')
                    ? styles.navLinkActive
                    : {}),
                }}
              >
                Challenges
              </Link>
              <Link
                href="/employer/talent-pool"
                className={cn(
                  'nav-link',
                  pathname === '/employer/talent-pool' ? 'active' : '',
                  'hover:text-[var(--text)]'
                )}
                style={{
                  ...styles.navLink,
                  ...(pathname === '/employer/talent-pool' ? styles.navLinkActive : {}),
                }}
              >
                Talent Pool
              </Link>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                href="/employer/challenges/create"
                className="btn primary"
                style={styles.btnPrimary}
              >
                + Tạo Challenge
              </Link>

              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <span className="btn" style={styles.notificationIcon}>
                  🔔
                </span>
                <span style={styles.notificationBadge}>0</span>
              </div>

              <span className="btn" style={styles.companyNameBtn}>
                VNG Cloud
              </span>
            </div>
          </div>

          {/* Body content */}
          {children}
        </div>
      </div>
    </div>
  );
}
