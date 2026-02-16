'use client';

import { Home, Package, History, User as UserIcon, MapPin } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'packages' | 'branches' | 'history' | 'profile';
  setActiveTab: (tab: any) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: <Home size={22} />, label: 'หน้าแรก' },
    { id: 'packages', icon: <Package size={22} />, label: 'แพ็กเกจ' },
    { id: 'branches', icon: <MapPin size={22} />, label: 'สาขา' },
    { id: 'history', icon: <History size={22} />, label: 'ประวัติ' },
    { id: 'profile', icon: <UserIcon size={22} />, label: 'โปรไฟล์' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/80 backdrop-blur-xl border-t border-white/10 px-4 py-4 z-40">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === tab.id ? 'text-roboss-red' : 'text-gray-500 hover:text-gray-400'}`}
          >
            <div className={`p-1 rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] font-medium transition-opacity duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
