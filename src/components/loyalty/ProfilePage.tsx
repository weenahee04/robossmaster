'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/loyalty-api';

interface ProfilePageProps {
  user: any;
  customerId: string;
  onLogout: () => void;
  onOpenCoupons?: () => void;
  onOpenSettings?: () => void;
}

export default function ProfilePage({ user, customerId, onLogout, onOpenCoupons, onOpenSettings }: ProfilePageProps) {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    api.getVehicles(customerId).then(setVehicles).catch(() => {});
  }, [customerId]);

  const tierLabel = user.memberTier === 'SILVER' ? 'Silver' : user.memberTier === 'GOLD' ? 'Gold' : 'Platinum';

  const tierGradient = user.memberTier === 'GOLD'
    ? 'from-[#dcb162] to-[#b88a3b]'
    : user.memberTier === 'PLATINUM'
      ? 'from-[#e5e5e5] to-[#a0a0a0]'
      : 'from-[#c0c0c0] to-[#808080]';

  const menuGeneral = [
    { icon: 'person', label: 'ข้อมูลส่วนตัว' },
    { icon: 'directions_car', label: 'รถของฉัน', badge: vehicles.length > 0 ? `${vehicles.length} คัน` : undefined },
    { icon: 'favorite', label: 'ที่อยู่สาขาโปรด' },
  ];

  const menuSettings = [
    { icon: 'settings', label: 'ตั้งค่าแอป', action: onOpenSettings },
    { icon: 'help', label: 'ความช่วยเหลือ' },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-glow-red pointer-events-none z-0"></div>

      {/* Profile Header */}
      <header className="relative z-10 pt-16 px-6 pb-8 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full border-2 p-1 shadow-2xl" style={{ borderColor: 'rgba(242,13,13,0.3)', background: '#1a1a1a', boxShadow: '0 25px 50px -12px rgba(242,13,13,0.2)' }}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
              {user.profileImage ? (
                <img alt="Profile" className="w-full h-full object-cover" src={user.profileImage} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ color: '#f20d0d' }}>
                  {(user.name || 'U').charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full border-4 flex items-center justify-center cursor-pointer" style={{ background: '#f20d0d', borderColor: '#050505' }}>
            <span className="material-symbols-outlined text-white text-[16px]">photo_camera</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
        <div className="flex items-center gap-2">
          <span className={`bg-gradient-to-r ${tierGradient} text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
            {tierLabel} Tier
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 pb-32 overflow-y-auto scrollbar-hide">
        {/* Points Card */}
        <div className="w-full rounded-2xl p-4 mb-8 border border-white/5 flex items-center justify-between" style={{ background: '#1a1a1a' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(242,13,13,0.1)' }}>
              <span className="material-symbols-outlined" style={{ color: '#f20d0d' }}>stars</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">คะแนนของคุณ</p>
              <p className="text-lg font-bold text-white">{user.points.toLocaleString()} <span className="text-xs font-normal uppercase" style={{ color: '#f20d0d' }}>pts</span></p>
            </div>
          </div>
          <button onClick={onOpenCoupons} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 border border-white/10 transition-colors">
            แลกของรางวัล
          </button>
        </div>

        {/* Menu - General */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">ข้อมูลทั่วไป</h3>

          {menuGeneral.map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border border-white/5 rounded-2xl transition-all group" style={{ background: '#1a1a1a' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#f20d0d]/20 transition-colors">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-[#f20d0d]">{item.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-200">{item.label}</span>
                {item.badge && <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{item.badge}</span>}
              </div>
              <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
            </button>
          ))}

          {/* Menu - Settings */}
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mt-6 mb-2">การตั้งค่า</h3>

          {menuSettings.map((item, i) => (
            <button key={i} onClick={item.action} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border border-white/5 rounded-2xl transition-all group" style={{ background: '#1a1a1a' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#f20d0d]/20 transition-colors">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-[#f20d0d]">{item.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-200">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
            </button>
          ))}

          {/* Logout */}
          <div className="pt-6">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 hover:bg-[#f20d0d]/20 border rounded-2xl transition-all group" style={{ background: 'rgba(242,13,13,0.1)', borderColor: 'rgba(242,13,13,0.2)' }}>
              <span className="material-symbols-outlined" style={{ color: '#f20d0d' }}>logout</span>
              <span className="text-sm font-bold" style={{ color: '#f20d0d' }}>ออกจากระบบ</span>
            </button>
            <p className="text-center text-[10px] text-gray-600 mt-6 font-medium tracking-widest uppercase">Version 1.2.4 (Build 120)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
