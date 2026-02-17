'use client';

import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

// --- DATA SECTION ---
const moods = [
  { id: 'happy', name: 'สดใส', emoji: '😊' },
  { id: 'angry', name: 'หัวร้อน', emoji: '🔥' },
  { id: 'bored', name: 'เบื่อๆ', emoji: '😴' },
  { id: 'lonely', name: 'เหงา', emoji: '💜' },
  { id: 'sad', name: 'เศร้า', emoji: '😢' }
];

const allLocations = {
  introvert: {
    green: [
      { id: 'in_g1', name: 'Forest Walkway', info: 'เส้นทางศึกษาธรรมชาติ เดินเงียบๆ ฟังเสียงนก ชมไม้', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80', dist: '5.5 กม.', rating: '4.7' },
    ],
    water: [
      { id: 'in_w1', name: 'Hidden Lake Pier', info: 'ท่าเรือริมทะเลสาบลับๆ ลมเย็นสบาย ไม่มีคนรบกวน', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80', dist: '7.1 กม.', rating: '4.9' },
    ],
    cafe: [
      { id: 'in_c1', name: 'Common Room Library', info: 'ห้องสมุดคาเฟ่สุดเงียบ จิบกาแฟอ่านหนังสือได้ยาวๆ', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80', dist: '1.2 กม.', rating: '4.9' },
    ]
  },
  extrovert: {
    green: [
      { id: 'ex_g1', name: 'Zood Music Festival Park', info: 'สวนสาธารณะที่มีดนตรีสดและกิจกรรมกลุ่ม คึกคักสุดๆ', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80', dist: '4.0 กม.', rating: '4.6' },
    ],
    water: [
      { id: 'ex_w1', name: 'Splash Water Park', info: 'สวนน้ำใจกลางเมือง สนุกสุดเหวี่ยงกับแก๊งเพื่อน', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80', dist: '8.5 กม.', rating: '4.8' },
    ],
    cafe: [
      { id: 'ex_c1', name: 'Party Cafe & Bar', info: 'คาเฟ่ที่มีบอร์ดเกมและเพลงดัง เหมาะกับการนัดรวมตัว', img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80', dist: '2.1 กม.', rating: '4.5' },
    ]
  },
  ambivert: {
    green: [ { id: 'am_g1', name: 'Art in the Park', info: 'สวนศิลปะ มีคนบ้างแต่ไม่วุ่นวาย เดินดูงานอาร์ตเพลินๆ', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80', dist: '1.5 กม.', rating: '4.8' } ],
    water: [ { id: 'am_w1', name: 'Canal Walking Street', info: 'ทางเดินริมคลองที่มีร้านค้าเล็กๆ บรรยากาศกำลังดี', img: 'https://images.unsplash.com/photo-1533167649158-6d508895b980?q=80', dist: '2.8 กม.', rating: '4.4' } ],
    cafe: [ { id: 'am_c1', name: 'Workshop Cafe', info: 'คาเฟ่ที่มีกิจกรรมให้ทำร่วมกับคนอื่นแต่ก็มีมุมส่วนตัว', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80', dist: '3.0 กม.', rating: '4.7' } ]
  }
};

export default function HomePage() {
  const resultsRef = useRef(null);
  const [displayData, setDisplayData] = useState({ 
    mood: null, 
    personality: '', 
    category: '',
    show: false 
  });

  const startSearch = async (moodObj) => {
    // 1. เลือกสไตล์ (Personality)
    const { value: person } = await Swal.fire({
      title: 'สไตล์ของคุณคือ?',
      html: `
        <div class="swal-custom-options">
          <button class="mega-btn" data-value="introvert">
            <span class="mega-emoji">🌿</span>
            <span class="mega-text">Introvert (ไปคนเดียว)</span>
          </button>
          <button class="mega-btn" data-value="extrovert">
            <span class="mega-emoji">🥳</span>
            <span class="mega-text">Extrovert (ไปเจอคน)</span>
          </button>
          <button class="mega-btn" data-value="ambivert">
            <span class="mega-emoji">⚖️</span>
            <span class="mega-text">Ambivert (กึ่งกลาง)</span>
          </button>
        </div>
      `,
      showConfirmButton: false,
      width: '700px',
      padding: '3rem 2rem',
      didOpen: (popup) => {
        popup.querySelectorAll('.mega-btn').forEach(btn => {
          btn.onclick = () => {
            popup.setAttribute('data-val', btn.getAttribute('data-value'));
            Swal.clickConfirm();
          };
        });
      },
      preConfirm: () => Swal.getPopup().getAttribute('data-val'),
      customClass: { popup: 'swal-mega-popup', title: 'swal-mega-title' }
    });

    if (!person) return;

    // 2. เลือกบรรยากาศ (Category)
    const { value: category } = await Swal.fire({
      title: 'อยากไปบรรยากาศแบบไหน?',
      html: `
        <div class="swal-custom-options">
          <button class="mega-btn" data-value="green">
            <span class="mega-emoji">🌳</span>
            <span class="mega-text">พื้นที่สีเขียว (ป่า/สวน)</span>
          </button>
          <button class="mega-btn" data-value="water">
            <span class="mega-emoji">🌊</span>
            <span class="mega-text">แหล่งน้ำ (ทะเล/น้ำตก)</span>
          </button>
          <button class="mega-btn" data-value="cafe">
            <span class="mega-emoji">☕</span>
            <span class="mega-text">คาเฟ่ / ในอาคาร</span>
          </button>
        </div>
      `,
      showConfirmButton: false,
      width: '700px',
      padding: '3rem 2rem',
      didOpen: (popup) => {
        popup.querySelectorAll('.mega-btn').forEach(btn => {
          btn.onclick = () => {
            popup.setAttribute('data-val', btn.getAttribute('data-value'));
            Swal.clickConfirm();
          };
        });
      },
      preConfirm: () => Swal.getPopup().getAttribute('data-val'),
      customClass: { popup: 'swal-mega-popup', title: 'swal-mega-title' }
    });

    if (category) {
      setDisplayData({ mood: moodObj, personality: person, category: category, show: true });
    }
  };

  useEffect(() => {
    if (displayData.show) resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayData.show]);

  const locationsList = allLocations[displayData.personality]?.[displayData.category] || [];

  return (
    <main className="main-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;600;700&display=swap');
        .main-container { padding: 100px 20px 80px; font-family: 'Anuphan', sans-serif; background: #fdfbff; min-height: 100vh; }
        .hero-title { font-size: 3rem; font-weight: 700; color: #1E1B4B; text-align: center; margin-bottom: 50px; }
        
        /* Mood Grid */
        .mood-grid { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 60px; }
        .mood-card { 
          background: white; border-radius: 20px; width: 110px; height: 110px;
          cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
        }
        .mood-card:hover { transform: translateY(-8px); box-shadow: 0 12px 25px rgba(0,0,0,0.1); }
        .mood-emoji { font-size: 2rem; }
        .mood-name { font-weight: 700; font-size: 0.9rem; color: #1E1B4B; }

        /* Empty State (หน้าตาตามรูปที่คุณส่งมา) */
        .empty-container {
          max-width: 900px; height: 450px; margin: 0 auto;
          border: 2px dashed #D1D5DB; /* สีขอบประ */
          border-radius: 40px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background-color: transparent;
        }
        .compass-icon { width: 45px; height: 45px; opacity: 0.6; margin-bottom: 15px; }
        .empty-text { font-size: 1rem; color: #9CA3AF; font-weight: 500; }

        /* Swal & Results (ส่วนเดิม) */
        .swal-mega-popup { border-radius: 45px !important; }
        .mega-btn {
          background: #fff; border: 2.5px solid #F1F5F9; border-radius: 25px;
          padding: 25px; display: flex; align-items: center; gap: 20px; cursor: pointer; width: 100%; margin-bottom: 12px;
          transition: 0.2s;
        }
        .mega-btn:hover { border-color: #1E1B4B; background: #f8fafc; }
        .mega-text { font-size: 1.3rem; font-weight: 700; color: #1E1B4B; }
        .result-wrapper { max-width: 1100px; margin: 0 auto; animation: fadeIn 0.6s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .places-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .place-card { border-radius: 35px; overflow: hidden; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
        .info-tag { background: #F3F4F6; padding: 5px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; color: #4B5563; display: flex; align-items: center; gap: 5px; }
      `}</style>

      <h1 className="hero-title">วันนี้พิกัดไหนดี?</h1>
      
      <div className="mood-grid">
        {moods.map(m => (
          <div key={m.id} className="mood-card" onClick={() => startSearch(m)}>
            <span className="mood-emoji">{m.emoji}</span>
            <span className="mood-name">{m.name}</span>
          </div>
        ))}
      </div>

      {displayData.show ? (
        <section ref={resultsRef} className="result-wrapper">
          <div style={{ borderLeft: '6px solid #1E1B4B', paddingLeft: '15px', marginBottom: '35px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>พิกัดสำหรับคุณ</h2>
            <p style={{ color: '#6B7280' }}>
               สไตล์: {displayData.personality.toUpperCase()} • บรรยากาศ: {displayData.category === 'green' ? '🌳 พื้นที่สีเขียว' : displayData.category === 'water' ? '🌊 แหล่งน้ำ' : '☕ คาเฟ่'}
            </p>
          </div>

          <div className="places-grid">
            {locationsList.map(loc => (
              <div key={loc.id} className="place-card">
                <img src={loc.img} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontWeight: 800, marginBottom: '8px', fontSize: '1.2rem' }}>{loc.name}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '15px' }}>{loc.info}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="info-tag">📍 {loc.dist}</div>
                    <div className="info-tag"><span style={{ color: '#F59E0B' }}>⭐</span> {loc.rating}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* ส่วนที่ปรับตามภาพที่คุณส่งมา */
        <div className="empty-container">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png" 
            className="compass-icon" 
            alt="compass" 
          />
          <p className="empty-text">เลือกอารมณ์เพื่อเริ่มปักหมุด</p>
        </div>
      )}
    </main>
  );
}