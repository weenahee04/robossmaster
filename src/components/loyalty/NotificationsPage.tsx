'use client';

import { ChevronLeft, Info, CheckCircle2, AlertTriangle, BellOff } from 'lucide-react';

interface NotificationsPageProps {
  onBack: () => void;
}

export default function NotificationsPage({ onBack }: NotificationsPageProps) {
  const notifications = [
    { id: '1', title: 'ยินดีต้อนรับ!', message: 'คุณได้เข้าร่วมระบบสะสมแต้ม Roboss แล้ว', time: 'เมื่อสักครู่', type: 'success' as const, unread: true },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white font-kanit">การแจ้งเตือน</h2>
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className={`p-5 rounded-[2rem] border transition-all flex gap-4 ${n.unread ? 'bg-white/10 border-roboss-red/30' : 'bg-roboss-dark border-white/5'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  n.type === 'success' ? 'bg-green-500/10 text-green-500' :
                  n.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {n.type === 'success' ? <CheckCircle2 size={24} /> :
                   n.type === 'warning' ? <AlertTriangle size={24} /> :
                   <Info size={24} />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-sm ${n.unread ? 'text-white' : 'text-gray-400'}`}>{n.title}</h4>
                    <span className="text-[10px] text-gray-500">{n.time}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{n.message}</p>
                </div>
                {n.unread && (
                  <div className="w-1.5 h-1.5 bg-roboss-red rounded-full self-center"></div>
                )}
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <BellOff size={32} className="text-gray-700" />
              </div>
              <p className="text-gray-500">ไม่มีการแจ้งเตือนในขณะนี้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
