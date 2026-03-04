'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/loyalty-api';

interface HistoryPageProps {
  customerId: string;
  branchSlug: string;
}

export default function HistoryPage({ customerId, branchSlug }: HistoryPageProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getPoints(customerId, branchSlug).then(data => {
      setTransactions(data.transactions || []);
    }).catch(() => {});
  }, [customerId, branchSlug]);

  const filters = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'EARN', label: 'ได้รับ' },
    { id: 'REDEEM', label: 'แลก' },
  ];

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  const getIcon = (item: any) => {
    if (item.type === 'EARN') return 'local_car_wash';
    if (item.type === 'REDEEM') return 'redeem';
    return 'receipt_long';
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-glow-red pointer-events-none z-0"></div>

      <header className="relative z-10 pt-14 px-6 pb-6 flex items-center justify-center">
        <h1 className="text-xl font-bold text-white">ประวัติการใช้งาน</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 pb-32 overflow-y-auto scrollbar-hide">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto scrollbar-hide py-1">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'text-white'
                  : 'border border-white/5 text-gray-400'
              }`}
              style={filter === f.id ? { background: '#f20d0d' } : { background: '#1a1a1a' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filtered.length > 0 ? filtered.map((item: any) => (
            <div key={item.id} className="border border-white/5 rounded-2xl p-4 shadow-xl active:scale-[0.98] transition-transform" style={{ background: '#1a1a1a' }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/5">
                    <span className="material-symbols-outlined" style={{ color: '#f20d0d' }}>{getIcon(item)}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{item.description || (item.type === 'EARN' ? 'ได้รับคะแนน' : 'แลกคะแนน')}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.branchName || branchSlug}</p>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                  item.amount > 0
                    ? 'bg-[#f20d0d]/20 text-[#f20d0d] border-[#f20d0d]/30'
                    : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                }`}>
                  {item.amount > 0 ? '+' : ''}{item.amount} pts
                </div>
              </div>
              <div className="h-px w-full bg-white/5 mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-gray-500">calendar_today</span>
                  <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString('th-TH', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">สำเร็จ</span>
              </div>
            </div>
          )) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-gray-600">history</span>
              </div>
              <p className="text-gray-500">ยังไม่มีประวัติการสะสมแต้ม</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
