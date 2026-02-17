'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  const [timeFilter, setTimeFilter] = useState('all');

  const [locations, setLocations] = useState([
    { id: 1, name: 'ปะปานคร นครปฐม', date: '2026-02-17', time: '14:30', type: 'forest', isFavorite: false },
    { id: 2, name: 'สวนเบญจกิติ', date: '2026-02-10', time: '17:45', type: 'forest', isFavorite: false },
    { id: 3, name: 'เกาะล้าน', date: '2026-01-15', time: '09:15', type: 'sea', isFavorite: false },
    { id: 4, name: 'หัวหิน', date: '2025-06-20', time: '11:00', type: 'sea', isFavorite: false },
    { id: 5, name: 'สวนหลวง ร.9', date: '2024-10-10', time: '16:20', type: 'forest', isFavorite: false },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }
    const tab = searchParams.get('tab');
    if (tab === 'favorites') setActiveTab('favorites');
  }, [router, searchParams]);

  const toggleFavorite = (id) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc
    ));
  };

  // --- แก้ไขจุดนี้: เปลี่ยนจาก Swal เป็นการเด้งไปหน้าใหม่ ---
  const handleViewDetail = (item) => {
    router.push(`/location/${item.id}`);
  };

  const filterByTime = (data) => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.date);
      if (timeFilter === 'today') return itemDate.toDateString() === now.toDateString();
      if (timeFilter === 'last_week') {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return itemDate >= lastWeek && itemDate < now;
      }
      if (timeFilter === 'last_month') {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return itemDate >= lastMonth && itemDate < now;
      }
      return true;
    });
  };

  if (!user) return null;

  const filteredData = filterByTime(
    locations.filter(loc => (activeTab === 'history' ? true : loc.isFavorite))
  );

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
          <div style={filterSection}>
            <label style={filterLabel}>🕒 เลือกช่วงเวลา</label>
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={selectInputStyle}>
              <option value="all">ทั้งหมด</option>
              <option value="today">วันนี้</option>
              <option value="last_week">สัปดาห์ที่แล้ว</option>
              <option value="last_month">เดือนที่แล้ว</option>
            </select>
          </div>
        </aside>

        <div style={verticalDivider}></div>

        <section style={mainContentStyle}>
          <div style={tabSwitcher}>
            <button onClick={() => setActiveTab('history')} style={activeTab === 'history' ? activeTabBtn : inactiveTabBtn}>ประวัติ</button>
            <button onClick={() => setActiveTab('favorites')} style={activeTab === 'favorites' ? activeTabBtn : inactiveTabBtn}>รายการโปรด</button>
          </div>
          <div style={historyHeader}>
            <h2 style={sectionTitle}>{activeTab === 'history' ? 'ประวัติ' : 'รายการโปรด'}</h2>
            <span style={countTag}>{filteredData.length} รายการ</span>
          </div>
          <div style={historyList}>
            {filteredData.map((item) => (
              <div key={item.id} style={historyCard}>
                <div style={cardLeft}>
                  <button onClick={() => toggleFavorite(item.id)} style={heartBtn}>{item.isFavorite ? '❤️' : '🤍'}</button>
                  <div style={cardInfo}>
                    <div style={item.type === 'forest' ? iconForest : iconSea}>{item.type === 'forest' ? '🌳' : '🌊'}</div>
                    <div>
                      <h4 style={locationName}>{item.name}</h4>
                      <p style={visitDate}>📅 {item.date}</p>
                    </div>
                  </div>
                </div>
                <button style={viewDetailBtn} onClick={() => handleViewDetail(item)}>ดูรายละเอียด ➜</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function HistoryPage() {
  return <Suspense fallback={<div>Loading...</div>}><HistoryContent /></Suspense>;
}

// --- Styles (คงเดิมจากไฟล์ที่คุณให้มา) ---
const mainWrapper = { minHeight: '100vh', backgroundColor: '#F3E8FF', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', paddingTop: '100px' };
const contentContainer = { backgroundColor: '#fff', width: '100%', maxWidth: '1000px', borderRadius: '40px', display: 'flex', padding: '40px', boxShadow: '0 25px 80px rgba(0,0,0,0.07)', minHeight: '700px' };
const sidebarStyle = { width: '280px', display: 'flex', flexDirection: 'column', gap: '25px' };
const userCard = { backgroundColor: '#F9FAFB', borderRadius: '25px', padding: '20px', textAlign: 'center', border: '1px solid #F1F5F9' };
const sidebarAvatar = { width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const userTextInfo = { textAlign: 'center' };
const sidebarName = { margin: 0, fontSize: '1.1rem', color: '#111827', fontWeight: '800' };
const sidebarEmail = { margin: '5px 0 0 0', fontSize: '0.85rem', color: '#6B7280' };
const filterSection = { display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 5px' };
const filterLabel = { fontSize: '0.9rem', fontWeight: '700', color: '#4B5563' };
const selectInputStyle = { padding: '12px', borderRadius: '15px', border: '1.5px solid #E5E7EB', fontSize: '0.95rem', outline: 'none', color: '#4B5563', backgroundColor: '#F9FAFB', cursor: 'pointer' };
const verticalDivider = { width: '1px', backgroundColor: '#F1F5F9', margin: '0 40px' };
const mainContentStyle = { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' };
const tabSwitcher = { alignSelf: 'center', display: 'flex', backgroundColor: '#F3F4F6', borderRadius: '18px', padding: '6px', marginBottom: '10px' };
const activeTabBtn = { border: 'none', padding: '10px 30px', borderRadius: '14px', backgroundColor: '#FCA5A5', color: '#fff', fontWeight: '700', cursor: 'pointer' };
const inactiveTabBtn = { border: 'none', padding: '10px 30px', borderRadius: '14px', backgroundColor: 'transparent', color: '#9CA3AF', fontWeight: '700', cursor: 'pointer' };
const historyHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '15px' };
const sectionTitle = { fontSize: '1.6rem', fontWeight: '800', color: '#1E1B4B', margin: 0 };
const countTag = { backgroundColor: '#F3F4F6', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', color: '#6B7280' };
const historyList = { display: 'flex', flexDirection: 'column', gap: '15px' };
const historyCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#fff', border: '1px solid #F3F4F6', borderRadius: '25px' };
const cardLeft = { display: 'flex', alignItems: 'center', gap: '15px' };
const heartBtn = { background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', padding: '5px' };
const cardInfo = { display: 'flex', alignItems: 'center', gap: '18px' };
const iconForest = { width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const iconSea = { width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const locationName = { margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1F2937' };
const visitDate = { margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6B7280' };
const viewDetailBtn = { background: 'none', border: 'none', color: '#4B5563', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', padding: '10px' };