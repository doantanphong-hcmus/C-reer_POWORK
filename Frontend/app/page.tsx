"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleRoleSelection = (role: 'Candidate' | 'Employer') => {
    if (role === 'Candidate') {
      router.push('/login?role=candidate');
    } else {
      router.push('/login?role=employer');
    }
  };

  return (
    <div style={{
      background: 'var(--bg2)', 
      color: 'var(--text)',
      fontFamily: 'var(--font)',
      fontSize: '15px', // Tăng kích thước font cơ bản
      lineHeight: '1.6',
      height: '100vh', 
      width: '100vw',  
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden' 
    }}>
      {/* Topbar */}
      <div className="topbar" style={{ 
        background: 'var(--bg3)', 
        borderBottom: '0.5px solid var(--border)', 
        padding: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span className="logo" style={{ fontSize: '28px', letterSpacing: '1.5px', fontWeight: '700', color: 'var(--text)' }}>POWORK</span>
      </div>

      {/* Vùng Body */}
      <div className="body" style={{ 
        flex: 1,
        padding: '20px 40px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center', // Cập nhật thành center để khối box tập trung ở giữa trang
        gap: '24px'
      }}>
        
        {/* Phần tiêu đề */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text)' }}>Bạn là ai?</p>
          <p style={{ fontSize: '15px', color: 'var(--text3)' }}>Chọn vai trò để tiếp tục — bạn có thể đổi sau</p>
        </div>

        {/* Khối Grid - Đã được thu nhỏ gọn lại (nhỏ lại) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '24px', 
          width: '100%', 
          maxWidth: '720px', // Thu nhỏ chiều rộng tối đa (từ 1400px/800px xuống 720px)
          height: '48vh', // Giảm chiều cao của box xuống (từ 60vh xuống 48vh)
        }}>

          {/* Candidate Card */}
          <div style={{ 
            padding: '24px 28px', // Thu gọn padding để box gọn gàng hơn
            background: 'var(--bg3)', 
            border: '1.5px solid rgba(34,197,94,0.4)', 
            borderRadius: '16px', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '48px' }}>🎓</div> 
              <p style={{ fontSize: '22px', fontWeight: '700', color: 'var(--green)' }}>Candidate</p> {/* Chữ to lên */}
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.5' }}> {/* Chữ to lên */}
                Tham gia Challenge thực chiến<br />để chứng minh năng lực
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', marginTop: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>✓ Tham gia nhiều Challenge cùng lúc</span> {/* Chữ to lên */}
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>✓ Danh tính ẩn khi chấm điểm</span>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>✓ Tích luỹ Dynamic Profile</span>
              </div>
            </div>
            
            <div style={{ width: '100%' }}>
              <button
                onClick={() => handleRoleSelection('Candidate')}
                className="btn"
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  padding: '12px 0', 
                  fontSize: '15px', // Chữ nút to lên
                  fontWeight: '600',
                  textAlign: 'center', 
                  borderColor: 'rgba(34,197,94,0.4)', 
                  color: 'var(--green)',
                  borderRadius: '10px'
                }}
              >
                Tôi là Candidate →
              </button>
            </div>
          </div>

          {/* Employer Card */}
          <div style={{ 
            padding: '24px 28px', 
            background: 'var(--bg3)', 
            border: '1px solid rgba(245,158,11,0.4)', 
            borderRadius: '16px', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '48px' }}>🏢</div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: 'var(--amber)' }}>Employer</p> {/* Chữ to lên */}
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.5' }}> {/* Chữ to lên */}
                Tạo Challenge để tuyển dụng<br />dựa trên năng lực thực tế
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', marginTop: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>✓ Chấm điểm Blind — không bias CV</span> {/* Chữ to lên */}
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>✓ Invite riêng qua mã Challenge</span>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>✓ Xây dựng Talent Pool</span>
              </div>
            </div>
            
            <div style={{ width: '100%' }}>
              <button
                onClick={() => handleRoleSelection('Employer')}
                className="btn"
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  padding: '12px 0', 
                  fontSize: '15px', // Chữ nút to lên
                  fontWeight: '600',
                  textAlign: 'center', 
                  borderColor: 'rgba(245,158,11,0.4)', 
                  color: 'var(--amber)',
                  borderRadius: '10px'
                }}
              >
                Tôi là Employer →
              </button>
            </div>
          </div>

        </div>

        {/* Footer Link */}
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginTop: '40px' }}>
          Đã có tài khoản?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}