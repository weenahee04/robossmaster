'use client';

import { useState, useEffect } from 'react';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/branches`)
      .then(r => r.json())
      .then(data => setBranches(Array.isArray(data) ? data : data.branches || []))
      .catch(() => {});
  }, []);

  const filters = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'open', label: 'เปิดอยู่ตอนนี้' },
  ];

  const filtered = filter === 'open' ? branches.filter(b => b.isActive) : branches;

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-glow-red pointer-events-none z-0"></div>

      <header className="relative z-20 pt-14 px-6 pb-4 flex items-center justify-between sticky top-0 border-b border-white/5 ios-blur" style={{ background: 'rgba(5,5,5,0.8)' }}>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">ค้นหาสาขา</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-white">search</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 overflow-y-auto scrollbar-hide flex flex-col gap-4 pb-32">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-2 px-2 overflow-x-auto scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap ${
                filter === f.id ? 'text-white' : 'text-gray-400 border border-white/5'
              }`}
              style={filter === f.id ? { background: '#f20d0d' } : { background: '#1a1a1a' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Branch Cards */}
        {filtered.map((branch: any) => (
          <div key={branch.id} className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-branch">
            <div className="h-44 relative" style={{ background: '#1a1a1a' }}>
              {branch.imageUrl ? (
                <img alt={branch.name} className="w-full h-full object-cover" src={branch.imageUrl} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-gray-700">local_car_wash</span>
                </div>
              )}
              {!branch.isActive && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-black/80 px-4 py-1.5 rounded-lg text-white font-bold text-sm border border-white/20">ปิดทำการชั่วคราว</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                  <p className="text-xs text-gray-400">{branch.address || 'ไม่ระบุที่อยู่'}</p>
                </div>
                {branch.isActive && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 text-[10px] font-bold rounded flex items-center gap-1 border border-green-500/30 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> เปิดบริการ
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                {branch.phone && (
                  <a href={`tel:${branch.phone}`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#f20d0d' }}>call</span>
                    <span className="text-xs font-bold">โทรออก</span>
                  </a>
                )}
                <button className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${branch.isActive ? '' : 'opacity-50 cursor-not-allowed'}`} style={{ background: '#f20d0d', boxShadow: '0 10px 15px -3px rgba(242,13,13,0.2)' }} disabled={!branch.isActive}>
                  <span className="material-symbols-outlined text-[18px] text-white">directions</span>
                  <span className="text-xs font-bold text-white">นำทาง</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {branches.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <span className="material-symbols-outlined text-4xl text-gray-600 block mb-2">location_on</span>
            <p>กำลังโหลดสาขา...</p>
          </div>
        )}
      </main>
    </div>
  );
}
