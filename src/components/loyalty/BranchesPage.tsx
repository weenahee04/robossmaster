'use client';

import { useState, useEffect, useMemo } from 'react';

interface BranchesPageProps {
  onSelectBranch?: (branch: any) => void;
}

export default function BranchesPage({ onSelectBranch }: BranchesPageProps) {
  const [branches, setBranches] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/branches')
      .then(r => r.json())
      .then(data => setBranches(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const filters = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'open', label: 'เปิดอยู่ตอนนี้' },
  ];

  const filtered = useMemo(() => {
    let list = filter === 'open' ? branches.filter(b => b.isActive) : branches;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [branches, filter, searchQuery]);

  const openGoogleMaps = (branch: any) => {
    const query = encodeURIComponent(branch.address || branch.name || 'Roboss');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-glow-red pointer-events-none z-0"></div>

      <header className="relative z-20 pt-14 px-6 pb-4 sticky top-0 border-b border-white/5 ios-blur bg-background-dark/80">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">ค้นหาสาขา</h1>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-white">{searchOpen ? 'close' : 'search'}</span>
          </button>
        </div>
        {searchOpen && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="ค้นหาชื่อสาขา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 placeholder:text-gray-500 transition-all"
            />
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 overflow-y-auto scrollbar-hide flex flex-col gap-4 pb-32">
        <div className="flex gap-2 mb-2 px-2 overflow-x-auto scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-xs font-bold rounded-full whitespace-nowrap ${
                filter === f.id ? 'bg-primary text-white' : 'bg-surface-dark text-gray-400 border border-white/5'
              } px-4 py-2`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-xs text-gray-600 self-center ml-auto">{filtered.length} สาขา</span>
        </div>

        {filtered.map((branch: any) => (
          <div
            key={branch.id}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-branch active:scale-[0.99] transition-transform"
            onClick={() => onSelectBranch?.(branch)}
          >
            <div className="h-44 relative bg-surface-dark cursor-pointer">
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
                  <a
                    href={`tel:${branch.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                    <span className="text-xs font-bold">โทรออก</span>
                  </a>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); if (branch.isActive) openGoogleMaps(branch); }}
                  disabled={!branch.isActive}
                  className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg bg-primary shadow-primary/20 ${branch.isActive ? '' : 'opacity-50 cursor-not-allowed'}`}
                >
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

        {branches.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <span className="material-symbols-outlined text-4xl text-gray-600 block mb-2">search_off</span>
            <p>ไม่พบสาขาที่ค้นหา</p>
          </div>
        )}
      </main>
    </div>
  );
}
