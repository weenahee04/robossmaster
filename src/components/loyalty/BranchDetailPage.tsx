'use client';

import { useCallback } from 'react';

interface BranchDetailPageProps {
  branch?: any;
  onBack: () => void;
  onOpenGeoMap?: () => void;
}

export default function BranchDetailPage({ branch, onBack, onOpenGeoMap }: BranchDetailPageProps) {
  const b = branch || {
    name: 'Roboss สาขา',
    address: 'ไม่ระบุที่อยู่',
    phone: '',
    isActive: true,
    imageUrl: '',
    openHours: 'ทุกวัน: 09:00 - 20:00 น.',
  };

  const openGoogleMaps = useCallback(() => {
    const query = encodeURIComponent(b.address || b.name || 'Roboss');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }, [b.address, b.name]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: b.name,
      text: `${b.name} — ${b.address}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${b.name}\n${b.address}\n${window.location.href}`);
      }
    } catch {
      // user cancelled share
    }
  }, [b.name, b.address]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="relative h-72 w-full shrink-0">
        {b.imageUrl ? (
          <img alt={b.name} className="w-full h-full object-cover" src={b.imageUrl} />
        ) : (
          <div className="w-full h-full bg-surface-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-gray-700">local_car_wash</span>
          </div>
        )}
        <div className="absolute inset-0 gradient-overlay"></div>
        <div className="absolute top-12 left-6 flex items-center justify-between w-[calc(100%-48px)]">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white">chevron_left</span>
          </button>
          <button onClick={handleShare} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white">share</span>
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-6 -mt-10 overflow-y-auto scrollbar-hide pb-32">
        <div className="bg-surface-dark/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{b.name}</h1>
            </div>
            {b.isActive ? (
              <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">เปิดให้บริการ</span>
              </div>
            ) : (
              <div className="bg-gray-500/10 px-3 py-1 rounded-full border border-gray-500/20">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ปิดทำการ</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">ที่อยู่</h3>
                <p className="text-sm text-gray-200 leading-relaxed">{b.address}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-primary">schedule</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">เวลาทำการ</h3>
                <p className="text-sm text-gray-200">{b.openHours || 'ทุกวัน: 09:00 - 20:00 น.'}</p>
              </div>
            </div>

            {b.phone && (
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-primary">call</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">เบอร์โทรศัพท์</h3>
                  <p className="text-sm text-gray-200">{b.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl overflow-hidden h-32 relative border border-white/5 bg-surface-dark">
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={onOpenGeoMap} className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">directions</span>
                ดูเส้นทางบนแผนที่
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {b.phone && (
            <a href={`tel:${b.phone}`} className="flex items-center justify-center gap-2 bg-transparent border-2 border-primary text-primary font-bold py-4 rounded-2xl active:scale-95 transition-transform">
              <span className="material-symbols-outlined">call</span>
              โทรออก
            </a>
          )}
          <button
            onClick={openGoogleMaps}
            className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(242,13,13,0.4)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">directions</span>
            นำทาง
          </button>
        </div>
      </main>
    </div>
  );
}
