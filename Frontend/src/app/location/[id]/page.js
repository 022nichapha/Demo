'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Clock, Star, ArrowLeft, Navigation2, Heart } from 'lucide-react';

export default function LocationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const mockDetails = {
      name: id === '1' ? 'ปะปานคร นครปฐม' : 'Common Room Library',
      images: [
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80',
        'https://images.unsplash.com/photo-1511497584788-876760111969?q=80',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80'
      ],
      dist: '1.2 กม.',
      rating: '4.9',
      openTime: '09:00 - 18:00 น.',
      fullDetail: 'สถานที่พักผ่อนที่ออกแบบมาเพื่อความผ่อนคลายโดยเฉพาะ บรรยากาศเงียบสงบพร้อมวิวธรรมชาติที่สวยงาม เหมาะสำหรับการมาเติมพลังในวันหยุดหรือหามุมสงบเพื่อใช้ความคิด',
      tags: ['เงียบสงบ', 'ธรรมชาติ', 'ยอดนิยม']
    };
    setLocation(mockDetails);
  }, [id]);

  if (!location) return <div style={loadingStyle}>กำลังโหลดข้อมูล...</div>;

  return (
    <main style={mainWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;600;700&display=swap');
        .collage-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 10px; height: 320px; padding: 12px; position: relative; }
        .action-btn { transition: all 0.2s ease; cursor: pointer; border: none; outline: none; }
        .action-btn:active { transform: scale(0.92); }
        @media (max-width: 950px) {
          .layout-container { flex-direction: column !important; align-items: center !important; }
          .side-nav { position: static !important; width: 100% !important; max-width: 600px !important; margin-bottom: 20px !important; padding: 0 10px !important; justify-content: flex-start !important; }
          .right-spacer { display: none; }
        }
      `}</style>

      <div className="layout-container" style={layoutContainer}>
        
        {/* Navbar ด้านข้าง */}
        <aside className="side-nav" style={sideNavStyle}>
          <button onClick={() => router.back()} style={backBtnSide} className="action-btn">
            <ArrowLeft size={22} />
            <span style={{ fontWeight: '700' }}>ย้อนกลับ</span>
          </button>
        </aside>

        {/* ตัวการ์ดที่เว้นระยะจาก Navbar */}
        <div style={detailCardStyle}>
          <div className="collage-grid">
            <button 
              style={{...favBtnInside, color: isFavorite ? "#EF4444" : "#1E1B4B"}} 
              onClick={() => setIsFavorite(!isFavorite)} 
              className="action-btn"
            >
              <Heart size={20} fill={isFavorite ? "#EF4444" : "none"} />
            </button>

            <div style={mainImgBox}>
              <img src={location.images[0]} style={imgCover} alt="main" />
            </div>
            <div className="side-images" style={sideImgBox}>
              <img src={location.images[1]} style={imgCover} alt="sub1" />
              <img src={location.images[2]} style={imgCover} alt="sub2" />
            </div>
          </div>

          <div style={contentBody}>
            <div style={headerSection}>
              <div style={ratingRow}>
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontWeight: '800', color: '#1E1B4B' }}>{location.rating}</span>
                <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>• พิกัดแนะนำ</span>
              </div>
              <h1 style={titleStyle}>{location.name}</h1>
              <div style={tagRow}>
                {location.tags.map(tag => <span key={tag} style={tagStyle}>#{tag}</span>)}
              </div>
            </div>

            <div style={infoGrid}>
              <div style={infoItem}>
                <div style={iconCircle}><MapPin size={18} color="#6366F1" /></div>
                <div>
                  <div style={infoLabel}>ระยะทาง</div>
                  <div style={infoValue}>{location.dist}</div>
                </div>
              </div>
              <div style={infoItem}>
                <div style={iconCircle}><Clock size={18} color="#6366F1" /></div>
                <div>
                  <div style={infoLabel}>เวลาทำการ</div>
                  <div style={infoValue}>{location.openTime}</div>
                </div>
              </div>
            </div>

            <div style={descBox}>
              <h3 style={descTitle}>รายละเอียดพิกัด</h3>
              <p style={descText}>{location.fullDetail}</p>
            </div>

            <button 
              style={mapBtnStyle}
              className="action-btn"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`)}
            >
              <Navigation2 size={18} fill="white" /> นำทางพิกัดนี้
            </button>
          </div>
        </div>

        {/* Spacer เพื่อสมดุลกึ่งกลาง */}
        <div className="right-spacer" style={rightSpacer}></div>
      </div>
    </main>
  );
}

// --- Styles ปรับแก้ระยะห่าง ---

const mainWrapper = { 
  minHeight: '100vh', 
  backgroundColor: '#F1F5F9', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: '60px 20px', 
  fontFamily: "'Anuphan', sans-serif" 
};

const layoutContainer = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '1000px', /* เพิ่มความกว้างเพื่อให้มีช่องว่างหายใจมากขึ้น */
  justifyContent: 'center'
};

const sideNavStyle = {
  width: '140px', 
  display: 'flex',
  justifyContent: 'flex-end',
  paddingRight: '30px', /* ระยะห่างแนวนอนระหว่างปุ่มย้อนกลับกับการ์ด */
  paddingTop: '20px'  /* ปรับระนาบปุ่มย้อนกลับให้ตรงกับขอบบนการ์ดพอดี */
};

const backBtnSide = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'transparent',
  color: '#64748B',
  fontSize: '1rem',
  whiteSpace: 'nowrap'
};

const detailCardStyle = { 
  width: '100%',
  maxWidth: '600px', 
  backgroundColor: 'white', 
  borderRadius: '32px', 
  overflow: 'hidden', 
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
  position: 'relative',
  /* ถ้าต้องการเว้นระยะห่างด้านบนจากการ์ดกับสิ่งรอบข้างมากขึ้น */
  marginTop: '0px' 
};

const rightSpacer = {
  width: '140px' /* ต้องเท่ากับ sideNavStyle เพื่อรักษาความเป็นกึ่งกลาง */
};

const favBtnInside = { 
  position: 'absolute',
  top: '25px',
  right: '25px',
  zIndex: 10,
  width: '42px', 
  height: '42px', 
  borderRadius: '50%', 
  background: 'white', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

// ... (Styles อื่นๆ คงเดิมตามโครงสร้างการ์ดที่คุณชอบ) ...
const mainImgBox = { width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden' };
const sideImgBox = { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px' };
const imgCover = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' };
const contentBody = { padding: '30px 35px' };
const headerSection = { marginBottom: '20px' };
const ratingRow = { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' };
const titleStyle = { fontSize: '1.8rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 10px 0' };
const tagRow = { display: 'flex', gap: '8px' };
const tagStyle = { color: '#6366F1', fontSize: '0.8rem', fontWeight: '700', background: '#EEF2FF', padding: '4px 12px', borderRadius: '100px' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '25px 0' };
const infoItem = { display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '15px', borderRadius: '20px', border: '1px solid #F1F5F9' };
const iconCircle = { width: '38px', height: '38px', borderRadius: '12px', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' };
const infoLabel = { fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' };
const infoValue = { fontSize: '0.95rem', color: '#1E1B4B', fontWeight: '700' };
const descBox = { marginBottom: '25px', padding: '20px', background: '#FDFDFF', borderRadius: '20px', border: '1px solid #F1F5F9' };
const descTitle = { fontSize: '1.1rem', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' };
const descText = { color: '#64748B', lineHeight: '1.7', fontSize: '0.95rem' };
const mapBtnStyle = { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: '#1E1B4B', color: 'white', border: 'none', padding: '18px', borderRadius: '20px', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px rgba(30,27,75,0.15)' };
const loadingStyle = { textAlign: 'center', padding: '100px', fontFamily: "'Anuphan', sans-serif", color: '#64748B' };