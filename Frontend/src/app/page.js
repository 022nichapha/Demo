'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

// --- DATA SECTION ---
const moods = [
  { id: 'happy', name: 'สดใส', emoji: '😊', color: '#FEF3C7', keywords: ['ดีใจ', 'แฮปปี้', 'ถูกหวย', 'ชนะ', 'สนุก'] },
  { id: 'angry', name: 'หัวร้อน', emoji: '🔥', color: '#FEE2E2', keywords: ['โมโห', 'หงุดหงิด', 'รถติด', 'ร้อน', 'โกรธ'] },
  { id: 'bored', name: 'เบื่อๆ', emoji: '😴', color: '#F3F4F6', keywords: ['เซ็ง', 'ขี้เกียจ', 'ว่าง', 'ไม่มีไรทำ'] },
  { id: 'lonely', name: 'เหงา', emoji: '💜', color: '#F5F3FF', keywords: ['คนเดียว', 'คิดถึง', 'โสด', 'ไม่มีใครคุย'] },
  { id: 'sad', name: 'เศร้า', emoji: '😢', color: '#DBEAFE', keywords: ['ปวดท้อง', 'งานเยอะ', 'สอบตก', 'ร้องไห้', 'นอยด์', 'ปวดหัว'] }
];

const allLocations = {
  introvert: {
    green: [ { id: 'in_g1', name: 'Forest Walkway', info: 'เส้นทางศึกษาธรรมชาติ เดินเงียบๆ ฟังเสียงนก ชมไม้', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80', dist: '5.5 กม.', rating: '4.7' } ],
    water: [ { id: 'in_w1', name: 'Hidden Lake Pier', info: 'ท่าเรือริมทะเลสาบลับๆ ลมเย็นสบาย ไม่มีคนรบกวน', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80', dist: '7.1 กม.', rating: '4.9' } ],
    cafe: [ { id: 'in_c1', name: 'Common Room Library', info: 'ห้องสมุดคาเฟ่สุดเงียบ จิบกาแฟอ่านหนังสือได้ยาวๆ', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80', dist: '1.2 กม.', rating: '4.9' } ]
  },
  extrovert: {
    green: [ { id: 'ex_g1', name: 'Zood Music Festival Park', info: 'สวนสาธารณะที่มีดนตรีสดและกิจกรรมกลุ่ม คึกคักสุดๆ', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80', dist: '4.0 กม.', rating: '4.6' } ],
    water: [ { id: 'ex_w1', name: 'Splash Water Park', info: 'สวนน้ำใจกลางเมือง สนุกสุดเหวี่ยงกับแก๊งเพื่อน', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80', dist: '8.5 กม.', rating: '4.8' } ],
    cafe: [ { id: 'ex_c1', name: 'Party Cafe & Bar', info: 'คาเฟ่ที่มีบอร์ดเกมและเพลงดัง เหมาะกับการนัดรวมตัว', img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80', dist: '2.1 กม.', rating: '4.5' } ]
  },
  ambivert: {
    green: [ { id: 'am_g1', name: 'Art in the Park', info: 'สวนศิลปะ มีคนบ้างแต่ไม่วุ่นวาย เดินดูงานอาร์ตเพลินๆ', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80', dist: '1.5 กม.', rating: '4.8' } ],
    water: [ { id: 'am_w1', name: 'Canal Walking Street', info: 'ทางเดินริมคลองที่มีร้านค้าเล็กๆ บรรยากาศกำลังดี', img: 'https://images.unsplash.com/photo-1533167649158-6d508895b980?q=80', dist: '2.8 กม.', rating: '4.4' } ],
    cafe: [ { id: 'am_c1', name: 'Workshop Cafe', info: 'คาเฟ่ที่มีกิจกรรมให้ทำร่วมกับคนอื่นแต่ก็มีมุมส่วนตัว', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80', dist: '3.0 กม.', rating: '4.7' } ]
  }
};

export default function HomePage() {
  const router = useRouter();
  const resultsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayData, setDisplayData] = useState({ mood: null, personality: '', category: '', show: false });

  // ปรับปรุงการแจ้งเตือนให้น่าใช้งานขึ้น (HCI: Aesthetic and Consistency)
  const handleProcessSearch = async () => {
    const input = searchTerm.trim().toLowerCase();
    if (!input) return;

    const detectedMood = moods.find(m => 
      m.keywords.some(kw => input.includes(kw)) || input.includes(m.name.toLowerCase())
    );

    if (detectedMood) {
      const { isConfirmed } = await Swal.fire({
        title: `ดูเหมือนคุณจะรู้สึก <span style="color:#6366F1">${detectedMood.name}</span>`,
        html: `ให้ <b>พิกัดไหนดี</b> ช่วยหาที่พักใจให้คุณนะ?`,
        iconHtml: `<span style="font-size: 3rem">${detectedMood.emoji}</span>`,
        showCancelButton: true,
        confirmButtonText: 'หาพิกัดให้เลย!',
        cancelButtonText: 'พิมพ์ใหม่',
        confirmButtonColor: '#1E1B4B',
        borderRadius: '25px'
      });
      if (isConfirmed) startSearch(detectedMood);
    } else {
      Swal.fire({
        title: 'ลองใหม่อีกครั้ง?',
        text: 'ลองบอกความรู้สึก เช่น "เครียดจัง" หรือ "มีความสุข"',
        icon: 'question',
        confirmButtonColor: '#1E1B4B',
        borderRadius: '25px'
      });
    }
  };

  const startSearch = async (moodObj) => {
    setSearchTerm('');
    // HCI: Step-by-step Selection (Reducing Cognitive Load)
    const { value: person } = await Swal.fire({
      title: 'บุคลิกของคุณเป็นแบบไหน?',
      html: `
        <div class="swal-custom-options">
          <button class="mega-option" data-value="introvert">
            <div class="option-icon">🌿</div>
            <div class="option-text"><b>Introvert</b><br><small>ชอบความเงียบ สงบ</small></div>
          </button>
          <button class="mega-option" data-value="extrovert">
            <div class="option-icon">🥳</div>
            <div class="option-text"><b>Extrovert</b><br><small>ชอบความสนุก คึกคัก</small></div>
          </button>
          <button class="mega-option" data-value="ambivert">
            <div class="option-icon">⚖️</div>
            <div class="option-text"><b>Ambivert</b><br><small>ชอบบรรยากาศกลางๆ</small></div>
          </button>
        </div>
      `,
      showConfirmButton: false,
      width: '500px',
      borderRadius: '30px',
      didOpen: (popup) => {
        popup.querySelectorAll('.mega-option').forEach(btn => {
          btn.onclick = () => {
            popup.setAttribute('data-val', btn.getAttribute('data-value'));
            Swal.clickConfirm();
          };
        });
      },
      preConfirm: () => Swal.getPopup().getAttribute('data-val')
    });

    if (!person) return;

    const { value: category } = await Swal.fire({
      title: 'อยากไปที่ไหนดี?',
      html: `
        <div class="swal-custom-options">
          <button class="mega-option" data-value="green">🌳 พื้นที่สีเขียว</button>
          <button class="mega-option" data-value="water">🌊 แหล่งน้ำ</button>
          <button class="mega-option" data-value="cafe">☕ คาเฟ่</button>
        </div>
      `,
      showConfirmButton: false,
      width: '500px',
      borderRadius: '30px',
      didOpen: (popup) => {
        popup.querySelectorAll('.mega-option').forEach(btn => {
          btn.onclick = () => {
            popup.setAttribute('data-val', btn.getAttribute('data-value'));
            Swal.clickConfirm();
          };
        });
      },
      preConfirm: () => Swal.getPopup().getAttribute('data-val')
    });

    if (category) {
      setDisplayData({ mood: moodObj, personality: person, category: category, show: true });
    }
  };

  const handleGoToDetail = (id) => {
    router.push(`/location/${id}`);
  };

  useEffect(() => {
    if (displayData.show) resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayData.show]);

  const locationsList = allLocations[displayData.personality]?.[displayData.category] || [];

  return (
    <main className="main-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;600;700&display=swap');
        
        /* Global & Layout */
        .main-container { padding: 100px 20px; font-family: 'Anuphan', sans-serif; background: #F8F9FF; min-height: 100vh; }
        .hero-section { text-align: center; margin-bottom: 60px; }
        .hero-title { font-size: 3.5rem; font-weight: 800; color: #1E1B4B; margin-bottom: 15px; letter-spacing: -1px; }
        .hero-subtitle { color: #6B7280; font-size: 1.1rem; }

        /* Search Bar (HCI: Prominence & Clarity) */
        .search-wrapper { max-width: 650px; margin: 40px auto; display: flex; gap: 10px; background: white; padding: 12px; border-radius: 100px; box-shadow: 0 20px 40px rgba(30,27,75,0.05); border: 2px solid #EEF2FF; transition: 0.3s; }
        .search-wrapper:focus-within { border-color: #6366F1; box-shadow: 0 20px 40px rgba(99,102,241,0.1); }
        .search-input { flex: 1; border: none; padding: 10px 25px; outline: none; font-size: 1.1rem; border-radius: 100px; font-family: 'Anuphan'; }
        .search-btn { background: #1E1B4B; color: white; border: none; padding: 0 35px; border-radius: 100px; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .search-btn:hover { background: #312E81; transform: scale(1.05); }

        /* Mood Chips (HCI: Recognition) */
        .mood-grid { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 80px; }
        .mood-card { background: white; border-radius: 25px; padding: 15px 25px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); border: 1.5px solid #F1F5F9; }
        .mood-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); border-color: #6366F1; }
        .mood-emoji { font-size: 1.5rem; }
        .mood-name { font-weight: 700; color: #1E1B4B; }

        /* Results Card (HCI: Information Architecture) */
        .result-wrapper { max-width: 1000px; margin: 0 auto; animation: fadeIn 0.6s ease-out; }
        .result-header { background: #1E1B4B; color: white; padding: 30px; border-radius: 30px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
        .places-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
        .place-card { border-radius: 30px; overflow: hidden; background: white; border: 1.5px solid #F1F5F9; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; position: relative; }
        .place-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(30,27,75,0.1); }
        .place-img { width: '100%'; height: 240px; object-fit: cover; }
        
        .info-tag { background: #F3F4F6; padding: 6px 14px; border-radius: 100px; font-size: 0.85rem; font-weight: 700; color: #4B5563; }
        
        /* Swal Custom Style */
        .mega-option { background: #fff; border: 2px solid #F1F5F9; border-radius: 20px; padding: 18px; width: 100%; margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: 0.2s; text-align: left; }
        .mega-option:hover { border-color: #6366F1; background: #F8FAFF; }
        .option-icon { font-size: 1.8rem; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="hero-section">
        <h1 className="hero-title">วันนี้พิกัดไหนดี?</h1>
        <p className="hero-subtitle">ระบายความรู้สึกของคุณออกมา แล้วเราจะพาคุณไปหาที่พักใจ</p>
      </div>

      <div className="search-wrapper">
        <input 
          type="text" 
          className="search-input" 
          placeholder="บอกเล่าเรื่องราวของคุณที่นี่..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleProcessSearch()}
        />
        <button className="search-btn" onClick={handleProcessSearch}>ค้นหา</button>
      </div>
      
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
          <div className="result-header">
            <div>
              <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '5px' }}>ผลลัพธ์พิกัดสำหรับคุณ</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {displayData.mood.emoji} {displayData.mood.name} + {displayData.personality.charAt(0).toUpperCase() + displayData.personality.slice(1)}
              </h2>
            </div>
            <div className="info-tag" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              {displayData.category === 'green' ? '🌳 ธรรมชาติ' : displayData.category === 'water' ? '🌊 สายน้ำ' : '☕ คาเฟ่'}
            </div>
          </div>

          <div className="places-grid">
            {locationsList.map(loc => (
              <div key={loc.id} className="place-card" onClick={() => handleGoToDetail(loc.id)}>
                <img src={loc.img} className="place-img" alt={loc.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                <div style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>{loc.name}</h3>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>⭐ {loc.rating}</span>
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>{loc.info}</p>
                  <div className="info-tag">📍 ห่างจากคุณ {loc.dist}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-container" style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>
          <p>ลองพิมพ์ว่า "วันนี้เหนื่อยจัง" ในช่องค้นหาด้านบนสิ</p>
        </div>
      )}
    </main>
  );
}
