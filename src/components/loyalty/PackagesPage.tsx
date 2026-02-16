'use client';

import { useState } from 'react';
import { Check, TrendingUp, Sparkles } from 'lucide-react';

interface PackagesPageProps {
  packages: any[];
}

export default function PackagesPage({ packages }: PackagesPageProps) {
  const [selectedType, setSelectedType] = useState<'monthly' | 'one-time'>('one-time');

  const displayPackages = packages.length > 0 ? packages : [
    { id: 'p1', name: 'Basic Wash', description: 'สะอาด รวดเร็ว ทันใจ', price: 100, features: '["High Pressure Rinse","Foam Shampoo","Wheel Cleaning","Automatic Drying"]' },
    { id: 'p2', name: 'Premium Shine', description: 'เงางามเหมือนใหม่ ปกป้องสีรถ', price: 250, features: '["All Basic Wash","Triple Foam Polish","Underbody Wash","Ceramic Wax Coating","Tire Dressing"]', recommended: true },
    { id: 'p3', name: 'Ultimate Protect', description: 'ที่สุดแห่งความสะอาดและการปกป้อง', price: 490, features: '["All Premium Shine","Graphene Protection","Insect & Tar Removal","Microfiber Dry Finish","Air Freshener"]' },
  ];

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">เลือกแพ็กเกจที่ใช่</h2>
        <p className="text-gray-400 text-sm">เลือกการดูแลที่ดีที่สุดสำหรับรถที่คุณรัก</p>
      </div>

      <div className="flex bg-roboss-dark p-1 rounded-2xl border border-white/5">
        <button onClick={() => setSelectedType('one-time')} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${selectedType === 'one-time' ? 'bg-white text-black' : 'text-gray-400'}`}>
          รายครั้ง
        </button>
        <button onClick={() => setSelectedType('monthly')} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${selectedType === 'monthly' ? 'bg-white text-black' : 'text-gray-400'}`}>
          รายเดือน (สุดคุ้ม)
        </button>
      </div>

      <div className="space-y-6">
        {displayPackages.map((pkg: any, idx: number) => {
          const isUltimate = idx === displayPackages.length - 1 && displayPackages.length > 1;
          const isRecommended = pkg.recommended || idx === 1;
          const features = typeof pkg.features === 'string' ? JSON.parse(pkg.features || '[]') : (pkg.features || []);

          return (
            <div key={pkg.id} className={`relative group bg-roboss-dark rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${isRecommended ? 'border-roboss-red ring-1 ring-roboss-red/20' : isUltimate ? 'border-yellow-500/30 shadow-xl shadow-yellow-900/10' : 'border-white/5'}`}>
              {isRecommended && !isUltimate && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="gradient-red text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter flex items-center gap-1">
                    <TrendingUp size={12} /> คุ้มค่าที่สุด
                  </div>
                </div>
              )}
              {isUltimate && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="gradient-premium-gold text-black text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter flex items-center gap-1">
                    <Sparkles size={12} /> ระดับพรีเมียม
                  </div>
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                    <p className="text-gray-400 text-xs">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isUltimate ? 'text-yellow-500' : 'text-white'}`}>{pkg.price} <span className="text-xs font-normal text-gray-400">บาท</span></div>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">รวม VAT แล้ว</p>
                  </div>
                </div>
                <div className="h-px bg-white/5 w-full"></div>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">สิ่งที่จะได้รับ</p>
                  <div className="grid grid-cols-1 gap-2">
                    {features.map((feat: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isUltimate ? 'bg-yellow-500/10' : 'bg-roboss-red/10'}`}>
                          <Check size={12} className={isUltimate ? 'text-yellow-500' : 'text-roboss-red'} />
                        </div>
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
                <button className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-[0.98] transition-all ${isUltimate ? 'gradient-premium-gold text-black shadow-yellow-950/20' : 'gradient-red shadow-red-950/20'}`}>
                  เลือกแพ็กเกจนี้
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
