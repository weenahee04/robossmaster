'use client';

import { useState, useEffect } from 'react';
import { Calendar, CreditCard, Star, History } from 'lucide-react';
import { api } from '@/lib/loyalty-api';

interface HistoryPageProps {
  customerId: string;
  branchSlug: string;
}

export default function HistoryPage({ customerId, branchSlug }: HistoryPageProps) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    api.getPoints(customerId, branchSlug).then(data => {
      setTransactions(data.transactions || []);
    }).catch(() => {});
  }, [customerId, branchSlug]);

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">ประวัติการใช้บริการ</h2>
        <p className="text-gray-400 text-sm">รวมประวัติแต้มสะสมของคุณทั้งหมด</p>
      </div>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((item: any) => (
            <div key={item.id} className="bg-roboss-dark p-5 rounded-3xl border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Calendar size={20} className={item.type === 'EARN' ? 'text-green-500' : 'text-roboss-red'} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-white font-semibold text-sm">{item.description || item.type}</p>
                    <p className="text-gray-500 text-xs">{new Date(item.createdAt).toLocaleString('th-TH')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 text-sm font-bold ${item.amount > 0 ? 'text-green-500' : 'text-roboss-red'}`}>
                    <Star size={12} fill="currentColor" />
                    {item.amount > 0 ? '+' : ''}{item.amount} แต้ม
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <History size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500">ยังไม่มีประวัติการสะสมแต้ม</p>
          </div>
        )}
      </div>
    </div>
  );
}
