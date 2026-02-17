'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // เพิ่มการใช้ Router
import Swal from 'sweetalert2';

// --- DATA SECTION (เหมือนเดิม) ---
const moods = [
  { id: 'happy', name: 'สดใส', emoji: '😊', keywords: ['ดีใจ', 'แฮปปี้', 'ถูกหวย', 'ชนะ', 'สนุก'] },
  { id: 'angry', name: 'หัวร้อน', emoji: '🔥', keywords: ['โมโห', 'หงุดหงิด', 'รถติด', 'ร้อน', 'โกรธ'] },
  { id: 'bored', name: 'เบื่อๆ', emoji: '😴', keywords: ['เซ็ง', 'ขี้เกียจ', 'ว่าง', 'ไม่มีไรทำ'] },
  { id: 'lonely', name: 'เหงา', emoji: '💜', keywords: ['คนเดียว', 'คิดถึง', 'โสด', 'ไม่มีใครคุย'] },
  { id: 'sad', name: 'เครียด/เศร้า', emoji: '😢', keywords: ['ปวดท้อง', 'งานเยอะ', 'สอบตก', 'ร้องไห้', 'นอยด์', 'ปวดหัว'] }
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
  const router = useRouter(); // เรียกใช้ router
  const resultsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayData, setDisplayData] = useState({ mood: null, personality: '', category: '', show: false });

  const handleProcessSearch = async () => {
    const input = searchTerm.trim().toLowerCase();
    if (!input) return;

    const detectedMood = moods.find(m => 
      m.keywords.some(kw => input.includes(kw)) || input.includes(m.name.toLowerCase())
    );

    if (detectedMood) {
      const { isConfirmed } = await Swal.fire({
        title: `ดูเหมือนคุณจะรู้สึก "${detectedMood.name}"`,
        text: `เพราะคุณบอกว่า "${searchTerm}" ให้เราช่วยหาที่พักใจให้ไหม?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'ลุยเลย!',
        cancelButtonText: 'พิมพ์ใหม่',
        confirmButtonColor: '#1E1B4B'
      });
      if (isConfirmed) startSearch(detectedMood);
    } else {
      Swal.fire('ไม่แน่ใจเลย...', 'ลองพิมพ์คำว่า ปวดท้อง, เหงา, หรือ ดีใจ ดูนะ', 'question');
    }
  };

  const startSearch = async (moodObj) => {
    setSearchTerm('');
    const { value: person } = await Swal.fire({
      title: 'สไตล์ของคุณคือ?',
      html: `
        <div class="swal-custom-options">
          <button class="mega-btn" data-value="introvert"><span class="mega-emoji">🌿</span> Introvert</button>
          <button class="mega-btn" data-value="extrovert"><span class="mega-emoji">🥳</span> Extrovert</button>
          <button class="mega-btn" data-value="ambivert"><span class="mega-emoji">⚖️</span> Ambivert</button>
        </div>
      `,
      showConfirmButton: false,
      width: '600px',
      didOpen: (popup) => {
        popup.querySelectorAll('.mega-btn').forEach(btn => {
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
      title: 'อยากไปบรรยากาศแบบไหน?',
      html: `
        <div class="swal-custom-options">
          <button class="mega-btn" data-value="green">🌳 พื้นที่สีเขียว</button>
          <button class="mega-btn" data-value="water">🌊 แหล่งน้ำ</button>
          <button class="mega-btn" data-value="cafe">☕ คาเฟ่</button>
        </div>
      `,
      showConfirmButton: false,
      width: '600px',
      didOpen: (popup) => {
        popup.querySelectorAll('.mega-btn').forEach(btn => {
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

  // --- ฟังก์ชันนำทางไปยังหน้ารายละเอียด ---
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
        .main-container { padding: 80px 20px; font-family: 'Anuphan', sans-serif; background: #fdfbff; min-height: 100vh; }
        .hero-title { font-size: 3rem; font-weight: 700; color: #1E1B4B; text-align: center; margin-bottom: 40px; }
        
        .search-wrapper { max-width: 600px; margin: 0 auto 40px; display: flex; gap: 10px; background: white; padding: 10px; border-radius: 100px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .search-input { flex: 1; border: none; padding: 10px 20px; outline: none; font-size: 1.1rem; border-radius: 100px; }
        .search-btn { background: #1E1B4B; color: white; border: none; padding: 0 30px; border-radius: 100px; cursor: pointer; font-weight: 700; }

        .mood-grid { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 60px; }
        .mood-card { background: white; border-radius: 20px; width: 110px; height: 110px; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
        .mood-card:hover { transform: translateY(-8px); box-shadow: 0 12px 25px rgba(0,0,0,0.1); }
        .mood-emoji { font-size: 2rem; }
        .mood-name { font-weight: 700; font-size: 0.9rem; color: #1E1B4B; }

        .empty-container { max-width: 900px; height: 400px; margin: 0 auto; border: 2px dashed #D1D5DB; border-radius: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .compass-icon { width: 45px; height: 45px; opacity: 0.6; margin-bottom: 15px; }
        .empty-text { font-size: 1rem; color: #9CA3AF; font-weight: 500; text-align: center; }

        .result-wrapper { max-width: 1100px; margin: 0 auto; text-align: left; }
        .places-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; justify-content: start; } 
        .place-card { border-radius: 35px; overflow: hidden; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; text-align: left; transition: 0.3s; cursor: pointer; } 
        .place-card:hover { transform: scale(1.02); }
        
        .info-tag { background: #F3F4F6; padding: 5px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; color: #4B5563; display: inline-flex; align-items: center; gap: 5px; }
        
        .mega-btn { background: #fff; border: 2px solid #F1F5F9; border-radius: 15px; padding: 20px; width: 100%; margin-bottom: 10px; cursor: pointer; font-weight: 700; text-align: left; font-size: 1.1rem; }
      `}</style>

      <h1 className="hero-title">วันนี้พิกัดไหนดี?</h1>

      <div className="search-wrapper">
        <input 
          type="text" 
          className="search-input" 
          placeholder="พิมพ์ความรู้สึกตอนนี้ (เช่น ปวดท้อง, ถูกหวย...)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleProcessSearch()}
        />
        <button className="search-btn" onClick={handleProcessSearch}>ประมวลผล</button>
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
          <div style={{ borderLeft: '6px solid #1E1B4B', paddingLeft: '15px', marginBottom: '35px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>พิกัดแนะนำสำหรับคุณ</h2>
            <p style={{ color: '#6B7280' }}>
               อารมณ์: {displayData.mood.name} • สไตล์: {displayData.personality.toUpperCase()} • บรรยากาศ: {displayData.category}
            </p>
          </div>

          <div className="places-grid">
            {locationsList.map(loc => (
              <div key={loc.id} className="place-card" onClick={() => handleGoToDetail(loc.id)}>
                <img src={loc.img} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div style={{ padding: '25px' }}>
                  <h3 style={{ fontWeight: 800, marginBottom: '8px', fontSize: '1.3rem' }}>{loc.name}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>{loc.info}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="info-tag">📍 {loc.dist}</div>
                    <div className="info-tag">⭐ {loc.rating}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-container">
          <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" className="compass-icon" alt="compass" />
          <p className="empty-text">เลือกอารมณ์หรือพิมพ์ความรู้สึกเพื่อเริ่มปักหมุด</p>
        </div>
      )}
    </main>
  );
}