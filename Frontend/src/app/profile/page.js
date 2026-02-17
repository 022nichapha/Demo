'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import Swal from 'sweetalert2';
import { 
  User, Mail, VenusAndMars, Camera, Trash2, 
  ChevronLeft, Save, XCircle, ShieldCheck, Edit3, Loader2
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: '', email: '', profileImage: ''
  });

  // HCI: ดึงข้อมูลจาก LocalStorage เพื่อให้ซิงค์กับหน้าหลักเสมอ
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('user_profile');
      const defaultUser = {
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        gender: 'male',
        email: 'somchai.j@nextmail.com',
        profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop'
      };
      
      const data = savedUser ? JSON.parse(savedUser) : defaultUser;
      setUser(data);
      setFormData(data);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันจัดการอัปโหลดรูปภาพ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return Swal.fire('ไฟล์ใหญ่เกินไป', 'กรุณาเลือกรูปขนาดไม่เกิน 2MB', 'error');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('user_profile', JSON.stringify(formData));
    setUser(formData);
    setIsEditing(false);
    Swal.fire({
      icon: 'success',
      title: 'บันทึกเรียบร้อย',
      text: 'ข้อมูลโปรไฟล์ของคุณถูกอัปเดตแล้ว',
      timer: 1500,
      showConfirmButton: false,
      borderRadius: '20px'
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F1F5F9]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <main className="page-container">
      <style>{`
        .page-container { 
          min-height: 100vh; 
          display: flex; align-items: center; justify-content: center; 
          background: #F1F5F9; padding: 20px; font-family: 'Anuphan', sans-serif;
        }
        .profile-card { 
          background: white; width: 100%; max-width: 500px; /* ขนาดพอดีๆ (Compact) */
          border-radius: 30px; padding: 35px; box-shadow: 0 15px 35px rgba(0,0,0,0.05);
        }
        .avatar-section {
          display: flex; flex-direction: column; align-items: center; margin-bottom: 25px;
        }
        .avatar-wrapper {
          position: relative; width: 110px; height: 110px; border-radius: 35px;
          overflow: hidden; margin-bottom: 15px; border: 4px solid #fff; 
          box-shadow: 0 8px 20px rgba(0,0,0,0.1); cursor: ${isEditing ? 'pointer' : 'default'};
        }
        .upload-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
          display: flex; align-items: center; justify-content: center; color: white;
          opacity: 0; transition: 0.3s;
        }
        .avatar-wrapper:hover .upload-overlay { opacity: ${isEditing ? '1' : '0'}; }
        
        .field { margin-bottom: 16px; }
        .field-label { font-size: 0.8rem; font-weight: 700; color: #64748B; margin-bottom: 6px; margin-left: 4px; display: block; }
        
        .input-box {
          display: flex; align-items: center; gap: 12px; padding: 13px 16px;
          border-radius: 15px; border: 1.5px solid #E2E8F0; background: #F8FAFC; transition: 0.2s;
        }
        .input-box.editing { border-color: #6366F1; background: white; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08); }
        .input-box input, .input-box select { border: none; outline: none; width: 100%; background: transparent; font-size: 1rem; color: #1E293B; }
        
        .btn-group { display: flex; gap: 12px; margin-top: 30px; }
        .btn { 
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; 
          padding: 14px; border-radius: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; border: none; 
        }
        .btn-primary { background: #1E1B4B; color: white; }
        .btn-secondary { background: #F1F5F9; color: #475569; }
        .btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
      `}</style>

      <div className="profile-card">
        {/* หัวข้อและรูปโปรไฟล์ */}
        <div className="avatar-section">
          <div className="avatar-wrapper" onClick={() => isEditing && fileInputRef.current.click()}>
            <Image src={formData.profileImage} alt="Profile Picture" fill className="object-cover" priority />
            {isEditing && (
              <div className="upload-overlay">
                <Camera size={24} />
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            {user.firstName} {user.lastName}
          </h2>
          <div style={{ color: '#6366F1', fontSize: '0.85rem', fontWeight: 600, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={16} /> Verified Account
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="field">
            <span className="field-label">ชื่อจริง</span>
            <div className={`input-box ${isEditing ? 'editing' : ''}`}>
              <User size={18} color="#94A3B8" />
              <input value={formData.firstName} readOnly={!isEditing} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
          </div>
          <div className="field">
            <span className="field-label">นามสกุล</span>
            <div className={`input-box ${isEditing ? 'editing' : ''}`}>
              <User size={18} color="#94A3B8" />
              <input value={formData.lastName} readOnly={!isEditing} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="field">
          <span className="field-label">ระบุเพศ</span>
          <div className={`input-box ${isEditing ? 'editing' : ''}`}>
            <VenusAndMars size={18} color="#94A3B8" />
            <select value={formData.gender} disabled={!isEditing} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
        </div>

        <div className="field">
          <span className="field-label">อีเมลติดต่อ (แก้ไขไม่ได้)</span>
          <div className="input-box" style={{ opacity: 0.6 }}>
            <Mail size={18} color="#94A3B8" />
            <input value={formData.email} readOnly />
          </div>
        </div>

        {/* ปุ่มควบคุมตามสถานะ */}
        {!isEditing ? (
          <div className="btn-group">
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
              <Edit3 size={18} /> แก้ไขโปรไฟล์
            </button>
            <button onClick={() => router.push('/')} className="btn btn-secondary">กลับหน้าหลัก</button>
          </div>
        ) : (
          <div className="btn-group">
            <button onClick={handleSave} className="btn btn-primary">
              <Save size={18} /> บันทึกข้อมูล
            </button>
            <button onClick={() => { setIsEditing(false); setFormData(user); }} className="btn btn-secondary" style={{ color: '#E11D48' }}>
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    </main>
  );
}