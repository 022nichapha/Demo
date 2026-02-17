'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

// สร้าง Component ย่อยเพื่อรองรับ useSearchParams ใน Next.js 13+ (App Router)
function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('history');

  const [locations, setLocations] = useState([
    { id: 1, name: 'ปะปานคร นครปฐม', date: '2026-01-11', type: 'forest', isFavorite: false },
    { id: 2, name: 'สวนเบญจกิติ', date: '2025-12-12', type: 'forest', isFavorite: false },
    { id: 3, name: 'เกาะล้าน', date: '2025-12-10', type: 'sea', isFavorite: false },
    { id: 4, name: 'หัวหิน', date: '2025-11-20', type: 'sea', isFavorite: false },
    { id: 5, name: 'สวนหลวง ร.9', date: '2025-10-10', type: 'forest', isFavorite: false },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }

    // ตรวจสอบ Tab จาก URL (?tab=favorites)
    const tab = searchParams.get('tab');
    if (tab === 'favorites') {
      setActiveTab('favorites');
    }
  }, [router, searchParams]);

  const toggleFavorite = (id) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc
    ));
    
    const target = locations.find(l => l.id === id);
    if (!target.isFavorite) {
      Swal.fire({
        title: 'เพิ่มในรายการโปรดแล้ว!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        iconColor: '#F87171'
      });
    }
  };

  if (!user) return null;

  const displayData = activeTab === 'history' 
    ? locations 
    : locations.filter(loc => loc.isFavorite);

  return (
    <main style={mainWrapper}>
      <div style={contentContainer}>
        <aside style={sidebarStyle}>
          <div style={userCard}>
            <img src={user.profileImage || '/avatar-placeholder.png'} style={sidebarAvatar} alt="User" />
            <div style={userTextInfo}>
              <h3 style={sidebarName}>{user.firstName} {user.lastName || ''}</h3>
              <p style={sidebarEmail}>{user.email}</p>
            </div>
          </div>
          <div style={filterGroup}>
            <button style={{...filterBtn, color: '#10B981', backgroundColor: '#ECFDF5'}}><span>🌳</span> ป่าไม้</button>
            <button style={{...filterBtn, color: '#3B82F6', backgroundColor: '#EFF6FF'}}><span>🌊</span> ทะเล</button>
          </div>
        </aside>

        <div style={verticalDivider}></div>

        <section style={mainContentStyle}>
          <div style={tabSwitcher}>
            <button 
              onClick={() => setActiveTab('history')}
              style={activeTab === 'history' ? activeTabBtn : inactiveTabBtn}
            >
              ประวัติ
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              style={activeTab === 'favorites' ? activeTabBtn : inactiveTabBtn}
            >
              รายการโปรด
            </button>
          </div>

          <div style={historyHeader}>
            <h2 style={sectionTitle}>{activeTab === 'history' ? 'ประวัติ' : 'รายการโปรด'}</h2>
          </div>

          <div style={historyList}>
            {displayData.length > 0 ? (
              displayData.map((item) => (
                <div key={item.id} style={historyCard}>
                  <div style={cardLeft}>
                    <button onClick={() => toggleFavorite(item.id)} style={heartBtn}>
                      {item.isFavorite ? '❤️' : '🤍'}
                    </button>
                    <div style={cardInfo}>
                      <div style={item.type === 'forest' ? iconForest : iconSea}>
                        {item.type === 'forest' ? '🌳' : '🌊'}
                      </div>
                      <div>
                        <h4 style={locationName}>{item.name}</h4>
                        <p style={visitDate}>ไปล่าสุดเมื่อ {item.date}</p>
                      </div>
                    </div>
                  </div>
                  <button style={viewDetailBtn}>ดูรายละเอียด ➜</button>
                </div>
              ))
            ) : (
              <div style={emptyState}>ยังไม่มีรายการที่ถูกใจ</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// Export ตัวหลักที่ครอบด้วย Suspense (จำเป็นสำหรับ useSearchParams)
export default function HistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryContent />
    </Suspense>
  );
}

// --- Styles (CSS-in-JS) ---
const mainWrapper = { minHeight: '100vh', backgroundColor: '#F3E8FF', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', paddingTop: '100px' };
const contentContainer = { backgroundColor: '#fff', width: '100%', maxWidth: '1000px', borderRadius: '30px', display: 'flex', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', minHeight: '700px' };
const sidebarStyle = { width: '280px', display: 'flex', flexDirection: 'column', gap: '30px' };
const userCard = { backgroundColor: '#F9FAFB', borderRadius: '20px', padding: '20px', textAlign: 'center' };
const sidebarAvatar = { width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const userTextInfo = { textAlign: 'left' };
const sidebarName = { margin: 0, fontSize: '1.1rem', color: '#111827', fontWeight: '800' };
const sidebarEmail = { margin: 0, fontSize: '0.85rem', color: '#6B7280' };
const filterGroup = { display: 'flex', flexDirection: 'column', gap: '12px' };
const filterBtn = { border: 'none', padding: '12px 20px', borderRadius: '15px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '10px' };
const verticalDivider = { width: '1px', backgroundColor: '#F1F5F9', margin: '0 40px' };
const mainContentStyle = { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' };
const tabSwitcher = { alignSelf: 'center', display: 'flex', backgroundColor: '#F3F4F6', borderRadius: '15px', padding: '5px', marginBottom: '10px' };
const activeTabBtn = { border: 'none', padding: '8px 25px', borderRadius: '12px', backgroundColor: '#FCA5A5', color: '#fff', fontWeight: '700', cursor: 'pointer', transition: '0.3s' };
const inactiveTabBtn = { border: 'none', padding: '8px 25px', borderRadius: '12px', backgroundColor: 'transparent', color: '#6B7280', fontWeight: '700', cursor: 'pointer' };
const historyHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '15px' };
const sectionTitle = { fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: 0 };
const historyList = { display: 'flex', flexDirection: 'column', gap: '15px' };
const historyCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#fff', border: '1px solid #F3F4F6', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' };
const cardLeft = { display: 'flex', alignItems: 'center', gap: '15px' };
const heartBtn = { background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', padding: '5px' };
const cardInfo = { display: 'flex', alignItems: 'center', gap: '20px' };
const iconForest = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const iconSea = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const locationName = { margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#1F2937' };
const visitDate = { margin: 0, fontSize: '0.85rem', color: '#9CA3AF' };
const viewDetailBtn = { background: 'none', border: 'none', color: '#1F2937', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' };
const emptyState = { textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: '1.1rem' };