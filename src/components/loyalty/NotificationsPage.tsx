'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/loyalty-auth-context';

interface NotificationsPageProps {
  onBack: () => void;
}

export default function NotificationsPage({ onBack }: NotificationsPageProps) {
  const { branchSlug } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!branchSlug) return;
    fetch(`/api/loyalty/notifications?branch=${branchSlug}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [branchSlug]);

  const getIcon = (type: string) => {
    if (type === 'PROMO') return 'local_offer';
    if (type === 'SERVICE') return 'build';
    return 'notifications';
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'เมื่อสักครู่';
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} วันที่แล้ว`;
    return new Date(dateStr).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <header className="relative z-10 pt-14 px-6 pb-4 flex items-center justify-between sticky top-0 border-b border-white/5 ios-blur bg-background-dark/80">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold text-white">การแจ้งเตือน</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 overflow-y-auto scrollbar-hide flex flex-col gap-4 pb-32">
        {loading ? (
          <div className="py-20 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-3xl text-gray-600">notifications</span>
            </div>
            <p className="text-gray-500">กำลังโหลด...</p>
          </div>
        ) : notifications.length > 0 ? notifications.map((n) => (
          <div key={n.id} className="border border-white/5 rounded-2xl p-4 shadow-xl bg-surface-dark">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/10">
                <span className="material-symbols-outlined text-gray-200">{getIcon(n.type)}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">{n.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{n.message}</p>
                <p className="text-gray-500 text-[10px] mt-2">{formatTime(n.createdAt)}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-gray-600">notifications_off</span>
            </div>
            <p className="text-gray-500">ไม่มีการแจ้งเตือนในขณะนี้</p>
          </div>
        )}
      </main>
    </div>
  );
}
