'use client';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onScan: () => void;
}

export default function BottomNav({ activeTab, setActiveTab, onScan }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50" style={{ background: 'rgba(26,26,26,0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'home' ? 'text-[#f20d0d]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'home' ? 'fill-1' : ''}`}>home</span>
          <span className="text-[10px] font-medium">หน้าหลัก</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'coupons' ? 'text-[#f20d0d]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'coupons' ? 'fill-1' : ''}`}>confirmation_number</span>
          <span className="text-[10px] font-medium">คูปอง</span>
        </button>

        <div className="relative -top-6">
          <button
            onClick={onScan}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all border-4"
            style={{
              background: '#f20d0d',
              boxShadow: '0 0 15px rgba(242,13,13,0.5)',
              borderColor: '#050505',
            }}
          >
            <span className="material-symbols-outlined text-3xl">qr_code_2</span>
          </button>
        </div>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'history' ? 'text-[#f20d0d]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'history' ? 'fill-1' : ''}`}>history</span>
          <span className="text-[10px] font-medium">ประวัติ</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'profile' ? 'text-[#f20d0d]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'profile' ? 'fill-1' : ''}`}>person</span>
          <span className="text-[10px] font-medium">บัญชี</span>
        </button>
      </div>
    </nav>
  );
}
