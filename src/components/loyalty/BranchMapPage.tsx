'use client';

interface BranchMapPageProps {
  onBack: () => void;
  onOpenBranchDetail?: (id: string) => void;
  onOpenGeoMap?: () => void;
}

export default function BranchMapPage({ onBack, onOpenBranchDetail, onOpenGeoMap }: BranchMapPageProps) {
  const branches = [
    { id: '1', name: 'สาขาพระราม 9', distance: '2.4 กม.', status: 'เปิดบริการ' },
    { id: '2', name: 'สาขาบางนา', distance: '5.8 กม.', status: 'เปิดบริการ' },
    { id: '3', name: 'สาขาลาดพร้าว', distance: '8.1 กม.', status: 'เปิดบริการ' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-20 pt-12 px-6">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-gray-400">search</span>
          <input
            className="w-full bg-surface-dark/90 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all shadow-2xl placeholder:text-gray-500"
            placeholder="ค้นหาสาขาใกล้คุณ"
            type="text"
          />
          <button className="absolute right-3 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-xl">tune</span>
          </button>
        </div>
      </div>

      <div className="flex-1 relative map-bg">
        <div className="absolute top-[35%] left-[60%]">
          <div className="marker-pulse w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_rgba(242,13,13,0.8)]"></div>
        </div>
        <div className="absolute top-[50%] left-[25%]">
          <div className="marker-pulse w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_rgba(242,13,13,0.8)]"></div>
        </div>
        <div className="absolute top-[20%] left-[30%] opacity-50">
          <div className="w-3 h-3 bg-gray-600 rounded-full border border-white/20"></div>
        </div>
        <div className="absolute top-[65%] left-[70%]">
          <div className="marker-pulse w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_rgba(242,13,13,0.8)]"></div>
        </div>
        <div className="absolute top-[45%] left-[45%]">
          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 left-0 w-full z-20">
        <div className="flex overflow-x-auto gap-4 px-6 pb-6 scrollbar-hide snap-x">
          {branches.map((b) => (
            <div key={b.id} className="min-w-[280px] snap-center bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{b.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary text-xs font-medium flex items-center">
                      <span className="material-symbols-outlined text-sm mr-1">near_me</span> {b.distance}
                    </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-green-500 text-xs font-medium">{b.status}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">local_car_wash</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={onOpenGeoMap} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-lg">directions</span>
                  นำทาง
                </button>
                <button className="w-12 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined">call</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="absolute bottom-0 w-full bg-surface-dark/95 backdrop-blur-lg border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-50">
        <button onClick={onBack} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-gray-300 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-[10px] font-medium">กลับ</span>
        </button>
      </nav>
    </div>
  );
}
