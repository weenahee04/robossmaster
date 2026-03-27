'use client';

import { useCallback } from 'react';

interface GeoMapPageProps {
  branch?: any;
  onBack: () => void;
}

export default function GeoMapPage({ branch, onBack }: GeoMapPageProps) {
  const b = branch || {
    name: 'Roboss สาขาพระราม 9',
    address: 'ถนนพระราม 9 แขวงห้วยขวาง',
    distance: '1.2 กม.',
    isActive: true,
    imageUrl: '',
    phone: '',
  };

  const openGoogleMaps = useCallback(() => {
    const query = encodeURIComponent(b.address || b.name || 'Roboss');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }, [b.address, b.name]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="absolute inset-0 z-0 map-bg">
        <div className="absolute top-[20%] left-[30%] w-32 h-1 bg-gray-800/40 rotate-45"></div>
        <div className="absolute top-[45%] left-[10%] w-64 h-1 bg-gray-800/40 -rotate-12"></div>
        <div className="absolute top-[60%] right-[10%] w-48 h-1 bg-gray-800/40 rotate-90"></div>

        <div className="absolute top-[52%] left-[45%] flex flex-col items-center">
          <div className="w-10 h-10 bg-primary rounded-full marker-glow flex items-center justify-center border-2 border-white/20">
            <span className="material-symbols-outlined text-white text-xl fill-1">local_car_wash</span>
          </div>
          <div className="w-1 h-3 bg-primary"></div>
        </div>

        <div className="absolute top-[35%] right-[25%] opacity-60">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white/10">
            <span className="material-symbols-outlined text-white text-sm fill-1">local_car_wash</span>
          </div>
        </div>

        <div className="absolute top-[70%] left-[20%] opacity-60">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white/10">
            <span className="material-symbols-outlined text-white text-sm fill-1">local_car_wash</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 px-4 pt-14">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-white">chevron_left</span>
          </button>
          <div className="flex-1 glass-morphism rounded-2xl p-1 flex items-center gap-3 pr-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-400">search</span>
            </div>
            <input className="bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 w-full placeholder:text-gray-500" placeholder="ค้นหาสาขา Roboss..." type="text" readOnly />
          </div>
        </div>
      </div>

      <div className="absolute right-4 bottom-72 z-20 flex flex-col gap-3">
        <button
          onClick={openGoogleMaps}
          className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-4 z-30">
        <div className="glass-morphism rounded-3xl p-5 border-t border-white/20 shadow-2xl">
          <div className="w-12 h-1.5 bg-gray-600/50 rounded-full mx-auto mb-4"></div>
          <div className="flex gap-4">
            {b.imageUrl ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                <img alt="Branch" className="w-full h-full object-cover" src={b.imageUrl} />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 bg-surface-dark flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-gray-600">local_car_wash</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-white leading-tight">{b.name}</h2>
                {b.isActive && (
                  <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">เปิดอยู่</span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-1">{b.address}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">near_me</span>
                  <span className="text-xs text-white font-medium">{b.distance || '–'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            {b.phone ? (
              <a href={`tel:${b.phone}`} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-gray-300">call</span>
                <span className="text-sm font-semibold text-gray-200">โทร</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 opacity-50">
                <span className="material-symbols-outlined text-gray-300">call</span>
                <span className="text-sm font-semibold text-gray-200">โทร</span>
              </div>
            )}
            <button
              onClick={openGoogleMaps}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-white">directions</span>
              <span className="text-sm font-bold text-white">นำทาง</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
