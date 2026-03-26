'use client';

import { useState } from 'react';

interface SettingsPageProps {
  onBack: () => void;
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const [promoNotif, setPromoNotif] = useState(true);
  const [serviceNotif, setServiceNotif] = useState(true);

  return (
    <div className="flex flex-col overflow-hidden">
      <header className="relative z-10 pt-14 px-6 pb-4 flex items-center justify-between bg-background-dark/80 ios-blur sticky top-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold text-white">การตั้งค่า</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto scrollbar-hide flex flex-col gap-6 pb-32">
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">บัญชีผู้ใช้</h3>
          <div className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-200">แก้ไขข้อมูลส่วนตัว</span>
            </div>
            <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
          </div>
          <div className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-200">เปลี่ยนรหัสผ่าน</span>
            </div>
            <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">การแจ้งเตือน</h3>
          <div className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-200">แจ้งเตือนโปรโมชั่น</span>
            </div>
            <button
              onClick={() => setPromoNotif(!promoNotif)}
              className={`w-10 h-6 rounded-full relative transition-colors ${promoNotif ? 'bg-primary' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${promoNotif ? 'right-0.5' : 'left-0.5'}`}></div>
            </button>
          </div>
          <div className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-200">แจ้งเตือนสถานะบริการ</span>
            </div>
            <button
              onClick={() => setServiceNotif(!serviceNotif)}
              className={`w-10 h-6 rounded-full relative transition-colors ${serviceNotif ? 'bg-primary' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${serviceNotif ? 'right-0.5' : 'left-0.5'}`}></div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">อื่นๆ</h3>
          <div className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-200">เงื่อนไขการให้บริการ</span>
            </div>
            <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
          </div>
          <div className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-200">นโยบายความเป็นส่วนตัว</span>
            </div>
            <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
          </div>
        </div>
      </main>
    </div>
  );
}
