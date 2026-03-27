'use client';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onScan: () => void;
}

export default function BottomNav({ activeTab, setActiveTab, onScan }: BottomNavProps) {
  const tabs = [
    { key: 'home', icon: 'home', label: 'หน้าหลัก' },
    { key: 'coupons', icon: 'confirmation_number', label: 'คูปอง' },
    { key: 'scan', icon: '', label: '' },
    { key: 'history', icon: 'history', label: 'ประวัติ' },
    { key: 'profile', icon: 'person', label: 'บัญชี' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-dark/95 backdrop-blur-lg border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-50">
      {tabs.map((tab) =>
        tab.key === 'scan' ? (
          <div key="scan" className="relative -top-6" data-tour-id="tour-nav-scan">
            <button
              onClick={onScan}
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(242,13,13,0.5)] hover:scale-105 active:scale-95 transition-all border-4 border-surface-dark"
            >
              <span className="material-symbols-outlined text-3xl">qr_code_2</span>
            </button>
          </div>
        ) : (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            data-tour-id={`tour-nav-${tab.key}`}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === tab.key ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === tab.key ? 'fill-1' : ''}`}>{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        )
      )}
    </nav>
  );
}
