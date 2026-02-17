'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LocationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // ข้อมูลจำลองที่รองรับ 3 รูป
    const mockDetails = {
      name: id === '1' ? 'ปะปานคร นครปฐม' : 'สวนเบญจกิติ',
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80',
        'https://images.unsplash.com/photo-1511497584788-876760111969?q=80',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80'
      ],
      dist: '2.5 กม.',
      rating: '4.8',
      openTime: '06:00 - 20:00 น.',
      fullDetail: 'สถานที่นี้เป็นหนึ่งในจุดพักใจยอดฮิตที่คุณเคยมาเยี่ยมชม บรรยากาศเงียบสงบมีพื้นที่สีเขียวให้เดินเล่นและถ่ายรูปสวยๆ ได้ทุกมุม เหมาะแก่การมาพักผ่อนในวันหยุด',
      tags: ['แนะนำ', 'เงียบสงบ', 'ธรรมชาติ']
    };
    setLocation(mockDetails);
  }, [id]);

  if (!location) return <div style={loadingStyle}>กำลังโหลดข้อมูล...</div>;

  return (
    <main style={containerStyle}>
      <div style={contentCenterer}>
        <button onClick={() => router.back()} style={backBtnStyle}>← ย้อนกลับ</button>

        <div style={detailCardStyle}>
          {/* --- รูปภาพแบบ Collage 3 รูป --- */}
          <div style={imageCollageGrid}>
            <div style={mainImageWrapper}>
              <img src={location.images[0]} style={collageImg} alt="main" />
            </div>
            <div style={sideImagesWrapper}>
              <img src={location.images[1]} style={collageImg} alt="side1" />
              <img src={location.images[2]} style={collageImg} alt="side2" />
            </div>
            <div style={badgeOverlayStyle}><span style={ratingBadgeStyle}>⭐ {location.rating}</span></div>
          </div>

          {/* --- เนื้อหาข้อมูล --- */}
          <div style={contentBodyStyle}>
            <div style={headerSectionStyle}>
              <h1 style={titleStyle}>{location.name}</h1>
              <div style={tagGroupStyle}>
                {location.tags.map(tag => <span key={tag} style={tagStyle}>#{tag}</span>)}
              </div>
            </div>

            <div style={quickInfoGridStyle}>
              <div style={infoBoxStyle}>
                <span style={infoLabelStyle}>📍 ระยะทาง</span>
                <span style={infoValueStyle}>{location.dist}</span>
              </div>
              <div style={infoBoxStyle}>
                <span style={infoLabelStyle}>🕒 เวลาเปิด-ปิด</span>
                <span style={infoValueStyle}>{location.openTime}</span>
              </div>
            </div>

            <div style={descriptionSectionStyle}>
              <h3 style={subTitleStyle}>เกี่ยวกับสถานที่</h3>
              <p style={descriptionTextStyle}>{location.fullDetail}</p>
            </div>

            <button 
              style={mapBtnStyle}
              onClick={() => window.open(`http://maps.google.com/?q=${encodeURIComponent(location.name)}`)}
            >
              เปิดนำทางใน Google Maps ➜
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Styles สำหรับหน้ารายละเอียด ---
const containerStyle = { minHeight: '100vh', backgroundColor: '#F8F9FF', display: 'flex', justifyContent: 'center', padding: '60px 20px', fontFamily: "'Anuphan', sans-serif" };
const contentCenterer = { width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column' };
const loadingStyle = { textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', color: '#6B7280' };
const backBtnStyle = { alignSelf: 'flex-start', background: 'white', border: '1px solid #E5E7EB', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer', fontWeight: '700', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const detailCardStyle = { backgroundColor: 'white', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(30,27,75,0.08)' };
const imageCollageGrid = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', height: '400px', padding: '15px', position: 'relative' };
const mainImageWrapper = { width: '100%', height: '100%', borderRadius: '25px 10px 10px 25px', overflow: 'hidden' };
const sideImagesWrapper = { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px', height: '100%' };
const collageImg = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' };
const badgeOverlayStyle = { position: 'absolute', bottom: '30px', right: '30px' };
const ratingBadgeStyle = { backgroundColor: 'white', padding: '8px 16px', borderRadius: '100px', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
const contentBodyStyle = { padding: '40px' };
const headerSectionStyle = { marginBottom: '30px' };
const titleStyle = { fontSize: '2.5rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 10px 0' };
const tagGroupStyle = { display: 'flex', gap: '10px' };
const tagStyle = { color: '#6366F1', fontSize: '0.9rem', fontWeight: '600' };
const quickInfoGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' };
const infoBoxStyle = { backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '25px', display: 'flex', flexDirection: 'column', gap: '5px' };
const infoLabelStyle = { fontSize: '0.85rem', color: '#6B7280', fontWeight: '600' };
const infoValueStyle = { fontSize: '1.1rem', color: '#1E1B4B', fontWeight: '700' };
const subTitleStyle = { fontSize: '1.4rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '15px' };
const descriptionSectionStyle = { marginBottom: '30px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' };
const descriptionTextStyle = { color: '#4B5563', lineHeight: '1.8', fontSize: '1.05rem' };
const mapBtnStyle = { width: '100%', marginTop: '10px', backgroundColor: '#1E1B4B', color: 'white', border: 'none', padding: '20px', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' };