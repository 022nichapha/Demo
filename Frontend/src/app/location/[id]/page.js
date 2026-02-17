'use client';
import { useParams, useRouter } from 'next/navigation';

export default function LocationDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // ในการใช้งานจริง คุณจะใช้ id นี้เพื่อไป fetch ข้อมูลจาก API หรือ Database
  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', cursor: 'pointer' }}>← กลับ</button>
      
      <div style={{ backgroundColor: '#fff', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
        <div style={{ padding: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>ชื่อสถานที่ (ID: {id})</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
            นี่คือหน้ารายละเอียดแบบเต็มของสถานที่ที่คุณเลือก คุณสามารถเพิ่มข้อมูล รีวิว แผนที่ หรือรูปภาพเพิ่มเติมได้ที่นี่
          </p>
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
            <span style={{ background: '#f0f0f0', padding: '10px 20px', borderRadius: '15px' }}>📍 ระยะทาง 5.5 กม.</span>
            <span style={{ background: '#fffbeb', color: '#b45309', padding: '10px 20px', borderRadius: '15px' }}>⭐ เรตติ้ง 4.7</span>
          </div>
        </div>
      </div>
    </main>
  );
}