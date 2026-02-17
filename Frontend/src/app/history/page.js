'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  const [timeFilter, setTimeFilter] = useState('all');

  // เพิ่มข้อมูลรายละเอียด (details) และรูปภาพ (image) ในแต่ละสถานที่
  const [locations, setLocations] = useState([
    { 
      id: 1, name: 'ปะปานคร นครปฐม', date: '2026-02-17', time: '14:30', type: 'forest', isFavorite: false,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80',
      details: 'พื้นที่สีเขียวใจกลางนครปฐม เหมาะสำหรับการเดินเล่นสูดอากาศบริสุทธิ์และพักผ่อนหย่อนใจ มีเส้นทางเดินชมธรรมชาติที่สวยงาม',
      rating: '4.8', dist: '2.5 กม.'
    },
    { 
      id: 2, name: 'สวนเบญจกิติ', date: '2026-02-10', time: '17:45', type: 'forest', isFavorite: false,
      image: 'https://images.unsplash.com/photo-1500628550463-c8881a54d4d4?q=80',
      details: 'สวนสาธารณะขนาดใหญ่ที่มี Skywalk ทอดยาวข้ามพื้นที่ชุ่มน้ำ บรรยากาศช่วงเย็นพระอาทิตย์ตกสวยงามมาก',
      rating: '4.9', dist: '5.0 กม.'
    },
    { 
      id: 3, name: 'เกาะล้าน', date: '2026-01-15', time: '09:15', type: 'sea', isFavorite: false,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80',
      details: 'ทะเลน้ำใสใกล้กรุงเทพฯ มีหาดทรายขาวละเอียดและกิจกรรมทางน้ำมากมาย เหมาะสำหรับการหนีร้อนมาพักผ่อน',
      rating: '4.7', dist: '120 กม.'
    },
    { 
      id: 4, name: 'หัวหิน', date: '2025-06-20', time: '11:00', type: 'sea', isFavorite: false,
      image: 'https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?q=80',
      details: 'เมืองตากอากาศคลาสสิก มีคาเฟ่ริมหาดเก๋ๆ และตลาดนัดโต้รุ่งที่มีอาหารทะเลสดใหม่',
      rating: '4.6', dist: '180 กม.'
    },
    { 
      id: 5, name: 'สวนหลวง ร.9', date: '2024-10-10', time: '16:20', type: 'forest', isFavorite: false,
      image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80',
      details: 'สวนพฤกษศาสตร์ที่ใหญ่ที่สุดในกรุงเทพฯ มีการจัดแสดงพรรณไม้จากหลายประเทศและหอรัชมงคลที่สวยเด่น',
      rating: '4.8', dist: '10 กม.'
    },
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

  // ฟังก์ชันสำหรับแสดงรายละเอียดสถานที่
  const handleViewDetail = (item) => {
    Swal.fire({
      title: `<span style="font-weight: 800; color: #1E1B4B;">${item.name}</span>`,
      html: `
        <div style="text-align: left; padding: 5px;">
          <img src="${item.image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 20px; margin-bottom: 15px;" />
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
             <span style="background: #E0E7FF; color: #4338CA; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">📍 ${item.dist}</span>
             <span style="background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">⭐ ${item.rating}</span>
             <span style="background: #ECFDF5; color: #065F46; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">🕒 ${item.time} น.</span>
          </div>
          <p style="color: #4B5563; line-height: 1.6; font-size: 0.95rem;">${item.details}</p>
          <p style="font-size: 0.85rem; color: #9CA3AF; margin-top: 10px;">วันที่มาล่าสุด: ${item.date}</p>
        </div>
      `,
      confirmButtonText: 'ปิดหน้าต่าง',
      confirmButtonColor: '#1E1B4B',
      customClass: { popup: 'detail-modal-rounded' },
      showCloseButton: true,
    });
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
      if (timeFilter === 'last_year') return itemDate.getFullYear() === now.getFullYear() - 1;
      if (timeFilter === 'two_years_ago') return itemDate.getFullYear() === now.getFullYear() - 2;
      return true;
    });
  };

  if (!user) return null;

  const filteredData = filterByTime(
    locations.filter(loc => (activeTab === 'history' ? true : loc.isFavorite))
  );

  return (
    <main style={mainWrapper}>
      <style>{`.detail-modal-rounded { border-radius: 30px !important; }`}</style>
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
              <option value="last_year">ปีที่แล้ว (2025)</option>
              <option value="two_years_ago">2 ปีที่แล้ว (2024)</option>
            </select>
          </div>

          <div style={filterGroup}>
            <button style={{...filterBtn, color: '#10B981', backgroundColor: '#ECFDF5'}}><span>🌳</span> ป่าไม้</button>
            <button style={{...filterBtn, color: '#3B82F6', backgroundColor: '#EFF6FF'}}><span>🌊</span> ทะเล</button>
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
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
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
                        <p style={visitDate}>📅 {item.date} | 🕒 {item.time} น.</p>
                      </div>
                    </div>
                  </div>
                  {/* ปุ่มดูรายละเอียดที่สามารถกดได้แล้ว */}
                  <button 
                    style={viewDetailBtn} 
                    onClick={() => handleViewDetail(item)}
                  >
                    ดูรายละเอียด ➜
                  </button>
                </div>
              ))
            ) : (
              <div style={emptyState}>ไม่พบข้อมูลในช่วงเวลานี้</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryContent />
    </Suspense>
  );
}

// --- Styles ---
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
const filterGroup = { display: 'flex', flexDirection: 'column', gap: '12px' };
const filterBtn = { border: 'none', padding: '14px 20px', borderRadius: '18px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '10px' };
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
const emptyState = { textAlign: 'center', padding: '60px', color: '#9CA3AF', fontSize: '1.1rem' };