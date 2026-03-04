'use client';

interface NotificationsPageProps {
  onBack: () => void;
}

export default function NotificationsPage({ onBack }: NotificationsPageProps) {
  const notifications = [
    { id: '1', title: 'ยินดีต้อนรับสู่ระบบ!', message: 'คุณได้เข้าร่วมระบบสะสมแต้ม Roboss แล้ว สะสมคะแนนเพื่อแลกของรางวัลมากมาย', time: 'เมื่อสักครู่', type: 'promo', icon: 'stars', iconBg: 'rgba(255,255,255,0.1)', iconColor: '#e5e7eb' },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      <header className="relative z-10 pt-14 px-6 pb-4 flex items-center justify-between sticky top-0 border-b border-white/5 ios-blur" style={{ background: 'rgba(5,5,5,0.8)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-bold text-white">การแจ้งเตือน</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 overflow-y-auto scrollbar-hide flex flex-col gap-4 pb-32">
        {notifications.length > 0 ? notifications.map((n) => (
          <div key={n.id} className="border border-white/5 rounded-2xl p-4 shadow-xl" style={{ background: '#1a1a1a' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: n.iconBg }}>
                <span className="material-symbols-outlined" style={{ color: n.iconColor }}>{n.icon}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">{n.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{n.message}</p>
                <p className="text-gray-500 text-[10px] mt-2">{n.time}</p>
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
