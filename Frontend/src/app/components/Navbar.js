'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const dropdownRef = useRef(null);

  const checkUser = () => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
      
      const savedFavs = localStorage.getItem('favorites');
      setHasFavorites(savedFavs ? JSON.parse(savedFavs).length > 0 : false);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('userLogin', checkUser);
    window.addEventListener('storage', checkUser);
    window.addEventListener('favoriteUpdate', checkUser);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('userLogin', checkUser);
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('favoriteUpdate', checkUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'ยืนยันการออกจากระบบ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#10B981',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      customClass: { popup: 'swal-rounded' }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        setUser(null);
        setIsProfileOpen(false);
        router.push('/login');
      }
    });
  };

  return (
    <div style={wrapperStyle}>
      <style>{`
        .swal-rounded { border-radius: 30px !important; }
        .nav-btn:hover { background-color: #F3F4F6; transform: translateY(-1px); }
        .signup-purple-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(109, 40, 217, 0.3); }
        .heart-icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; transition: transform 0.2s; }
        .heart-icon-btn:hover { transform: scale(1.15); }
      `}</style>

      <nav style={navContainerStyle}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={logoImgStyle} />
        </Link>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/guide" style={navButtonStyle} className="nav-btn">คู่มือใช้งาน</Link>
          <Link href="/contact" style={navButtonStyle} className="nav-btn">ติดต่อ</Link>
          <div style={dividerVerticalStyle}></div>

          {user ? (
            <div ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
              
              {/* เเก้ไขตรงนี้: คลิกเเล้วเด้งไปหน้ารายการโปรดโดยตรง */}
              <button 
                onClick={() => router.push('/history?tab=favorites')} 
                className="heart-icon-btn"
                title="รายการโปรด"
              >
                <svg 
                  width="24" height="24" viewBox="0 0 24 24" 
                  fill={hasFavorites ? "#EF4444" : "none"} 
                  stroke={hasFavorites ? "#EF4444" : "#1F2937"} 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>

              <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={{...profileTriggerStyle, backgroundColor: isProfileOpen ? '#EDE9FE' : '#F3F4F6'}}>
                <img src={user.profileImage || "/avatar-placeholder.png"} alt="Profile" style={avatarLargeStyle} />
                <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#4B5563'}}>Menu</span>
              </div>

              {isProfileOpen && (
                <div style={dropdownMenuStyle}>
                  <div style={dropdownHeaderStyle}>
                    <img src={user.profileImage || '/avatar-placeholder.png'} alt="Profile" style={avatarLargeStyle} />
                    <div style={{ fontWeight: '700', marginTop: '8px' }}>{user.firstName}</div>
                  </div>
                  <hr style={dropdownDividerStyle} />
                  <Link href="/profile" onClick={() => setIsProfileOpen(false)} style={dropdownItemStyle}>โปรไฟล์</Link>
                  <Link href="/history" onClick={() => setIsProfileOpen(false)} style={dropdownItemStyle}>ประวัติการท่องเที่ยว</Link>
                  <hr style={dropdownDividerStyle} />
                  <div onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#EF4444' }}>ออกจากระบบ</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link href="/login" style={loginLinkStyle}>Login</Link>
              <Link href="/signup" className="signup-purple-btn" style={signupBtnStyle}>Get Started</Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

// --- Styles (คงเดิม) ---
const wrapperStyle = { position: 'fixed', top: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1000, padding: '0 20px' };
const navContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 25px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '60px', border: '1px solid rgba(109, 40, 217, 0.15)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.06)', width: '100%', maxWidth: '1100px' };
const logoImgStyle = { height: '40px', cursor: 'pointer' };
const navButtonStyle = { textDecoration: 'none', color: '#4B5563', fontSize: '0.9rem', fontWeight: '600', padding: '10px 18px', borderRadius: '25px', backgroundColor: 'transparent' };
const dividerVerticalStyle = { height: '20px', width: '1px', backgroundColor: '#E5E7EB', margin: '0 5px' };
const profileTriggerStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 15px', borderRadius: '30px', cursor: 'pointer', border: '1px solid #E5E7EB' };
const avatarLargeStyle = { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6D28D9' };
const loginLinkStyle = { textDecoration: 'none', color: '#4B5563', fontSize: '0.95rem', fontWeight: '700' };
const signupBtnStyle = { color: 'white', backgroundColor: '#6D28D9', padding: '12px 28px', borderRadius: '35px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '700', boxShadow: '0 4px 15px rgba(109, 40, 217, 0.2)' };
const dropdownMenuStyle = { position: 'absolute', top: '60px', right: '0', width: '220px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', padding: '12px', border: '1px solid #F1F5F9' };
const dropdownHeaderStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' };
const dropdownItemStyle = { padding: '10px', textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '600', borderRadius: '10px', textAlign: 'center', display: 'block', cursor: 'pointer' };
const dropdownDividerStyle = { border: 'none', borderTop: '1px solid #F1F5F9', margin: '8px 0' };