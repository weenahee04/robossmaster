'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, ChevronRight, Car } from 'lucide-react';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/branches`)
      .then(r => r.json())
      .then(data => setBranches(Array.isArray(data) ? data : data.branches || []))
      .catch(() => {});
  }, []);

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">สาขาใกล้เคียง</h2>
        <p className="text-gray-400 text-sm">ค้นหาสาขา Roboss ที่สะดวกที่สุดสำหรับคุณ</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input type="text" placeholder="ค้นหาสาขา หรือ ถนน..." className="w-full bg-roboss-dark border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-roboss-red/50 transition-all" />
      </div>
      <div className="relative h-48 rounded-[2.5rem] overflow-hidden border border-white/5 bg-roboss-dark flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin size={32} className="text-roboss-red mx-auto" />
          <p className="text-gray-500 text-sm">แผนที่สาขา</p>
        </div>
      </div>
      <div className="space-y-4">
        {branches.map((branch: any) => (
          <div key={branch.id} className="bg-roboss-dark p-5 rounded-[2rem] border border-white/5 space-y-4 transition-all hover:border-roboss-red/20 active:scale-[0.98]">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-roboss-red">
                <Car size={28} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold text-sm leading-tight">{branch.name}</h4>
                </div>
                <p className="text-gray-500 text-[10px] line-clamp-1">{branch.address || 'ไม่ระบุที่อยู่'}</p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${branch.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] text-gray-400">{branch.isActive ? 'พร้อมให้บริการ' : 'ปิดให้บริการ'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-roboss-red/10 text-roboss-red py-3 rounded-xl text-xs font-bold hover:bg-roboss-red/20 transition-colors">
                <Navigation size={14} /> นำทาง
              </button>
              <button className="flex items-center justify-center bg-white/5 text-gray-400 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
        {branches.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <MapPin size={32} className="mx-auto mb-2 text-gray-600" />
            <p>กำลังโหลดสาขา...</p>
          </div>
        )}
      </div>
    </div>
  );
}
