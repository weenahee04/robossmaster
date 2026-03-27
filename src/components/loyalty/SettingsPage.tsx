'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/loyalty-api';

interface SettingsPageProps {
  onBack: () => void;
  onResetTour?: () => void;
  branchSlug?: string;
  user?: any;
  customerId?: string;
  onRefreshUser?: () => void;
}

const STORAGE_KEY_PROMO = 'roboss-notif-promo';
const STORAGE_KEY_SERVICE_NOTIF = 'roboss-notif-service';

export default function SettingsPage({ onBack, onResetTour, branchSlug, user, customerId, onRefreshUser }: SettingsPageProps) {
  const [promoNotif, setPromoNotif] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEY_PROMO) !== 'false';
  });
  const [serviceNotif, setServiceNotif] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEY_SERVICE_NOTIF) !== 'false';
  });

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROMO, String(promoNotif));
  }, [promoNotif]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SERVICE_NOTIF, String(serviceNotif));
  }, [serviceNotif]);

  const handleSaveName = useCallback(async () => {
    if (!nameValue.trim() || !customerId) return;
    setSavingName(true);
    try {
      await api.updateCustomer({ id: customerId, name: nameValue.trim() });
      onRefreshUser?.();
      setEditingName(false);
    } catch {
      // silently fail
    }
    setSavingName(false);
  }, [nameValue, customerId, onRefreshUser]);

  const handleChangeServiceType = useCallback(() => {
    if (!branchSlug) return;
    localStorage.removeItem(`roboss-service-${branchSlug}`);
    window.location.reload();
  }, [branchSlug]);

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
        {/* Account Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">บัญชีผู้ใช้</h3>

          <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-lg">person</span>
                  <span className="text-sm font-medium text-gray-200">ชื่อผู้ใช้</span>
                </div>
                {!editingName ? (
                  <button onClick={() => setEditingName(true)} className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{user?.name || '—'}</span>
                    <span className="material-symbols-outlined text-gray-600 text-[18px]">edit</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:border-primary/50 w-36"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="px-3 py-1.5 bg-primary rounded-lg text-white text-xs font-bold active:scale-95 transition-transform disabled:opacity-50"
                    >
                      {savingName ? '...' : 'บันทึก'}
                    </button>
                    <button onClick={() => setEditingName(false)} className="text-gray-500">
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {branchSlug && (
            <button onClick={handleChangeServiceType} className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">swap_horiz</span>
                <div>
                  <span className="text-sm font-medium text-gray-200 block">เปลี่ยนประเภทบริการ</span>
                  <span className="text-[10px] text-gray-500">เลือกใหม่ระหว่างรถยนต์/มอเตอร์ไซค์</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
            </button>
          )}
        </div>

        {/* Notifications Section */}
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

        {/* Other Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">อื่นๆ</h3>
          {onResetTour && (
            <button onClick={onResetTour} className="w-full flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                <span className="text-sm font-medium text-gray-200">ดูวิธีใช้งานอีกครั้ง</span>
              </div>
              <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
            </button>
          )}
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
