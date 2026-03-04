'use client';

import { useState } from 'react';

interface CouponsPageProps {
  user: any;
  templates: any[];
  myCoupons: any[];
  branchSlug: string;
  customerId: string;
  onRefresh: () => void;
}

export default function CouponsPage({ user, templates, myCoupons, branchSlug, customerId, onRefresh }: CouponsPageProps) {
  const [tab, setTab] = useState<'available' | 'used'>('available');

  const availableCoupons = myCoupons.filter((c: any) => c.status === 'ACTIVE');
  const usedCoupons = myCoupons.filter((c: any) => c.status !== 'ACTIVE');

  const displayCoupons = tab === 'available' ? availableCoupons : usedCoupons;

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-glow-red pointer-events-none z-0"></div>

      <header className="relative z-10 pt-14 px-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">คูปองของฉัน</h1>
        </div>

        {/* Points Bar */}
        <div className="border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg" style={{ background: '#121212' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(242,13,13,0.1)' }}>
              <span className="material-symbols-outlined" style={{ color: '#f20d0d' }}>database</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-medium">คะแนนคงเหลือ</p>
              <p className="text-lg font-bold text-white">{user.points.toLocaleString()} <span className="text-xs font-normal ml-1" style={{ color: '#f20d0d' }}>pts</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="relative z-10 px-6 mt-2">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setTab('available')}
            className={`flex-1 pb-3 text-sm font-bold ${tab === 'available' ? 'border-b-2' : 'text-gray-500'}`}
            style={tab === 'available' ? { color: '#f20d0d', borderColor: '#f20d0d' } : {}}
          >
            คูปองที่ใช้ได้ ({availableCoupons.length})
          </button>
          <button
            onClick={() => setTab('used')}
            className={`flex-1 pb-3 text-sm font-medium ${tab === 'used' ? 'border-b-2' : 'text-gray-500'}`}
            style={tab === 'used' ? { color: '#f20d0d', borderColor: '#f20d0d' } : {}}
          >
            คูปองที่ใช้แล้ว
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-6 pt-6 pb-28 overflow-y-auto scrollbar-hide space-y-4">
        {displayCoupons.length > 0 ? displayCoupons.map((coupon: any) => (
          <div key={coupon.id} className="flex h-32 border rounded-xl overflow-hidden relative group" style={{ background: '#0f0f0f', borderColor: coupon.status === 'ACTIVE' ? 'rgba(242,13,13,0.3)' : 'rgba(255,255,255,0.1)' }}>
            <div className="flex-[1.5] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: coupon.status === 'ACTIVE' ? '#f20d0d' : '#6b7280' }}>
                  {coupon.template?.category || 'Reward'}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{coupon.template?.name || coupon.name || 'คูปอง'}</h3>
                <p className="text-[11px] text-gray-500 mt-1">{coupon.template?.description || ''}</p>
              </div>
              <div className="text-[10px] text-gray-500">
                {coupon.expiresAt ? `หมดอายุ: ${new Date(coupon.expiresAt).toLocaleDateString('th-TH')}` : ''}
              </div>
            </div>
            <div className="w-px border-r border-dashed my-3" style={{ borderColor: coupon.status === 'ACTIVE' ? 'rgba(242,13,13,0.4)' : 'rgba(255,255,255,0.2)' }}></div>
            <div className="flex-1 flex flex-col items-center justify-center p-4" style={{ background: coupon.status === 'ACTIVE' ? 'rgba(242,13,13,0.05)' : 'rgba(255,255,255,0.05)' }}>
              {coupon.status === 'ACTIVE' ? (
                <button className="w-full py-2 text-white rounded-lg text-xs font-bold transition-all shadow-lg" style={{ background: '#f20d0d', boxShadow: '0 10px 15px -3px rgba(242,13,13,0.2)' }}>
                  ใช้คูปอง
                </button>
              ) : (
                <span className="text-xs text-gray-500 font-bold">ใช้แล้ว</span>
              )}
            </div>
            <div className="absolute -top-3 left-[58.5%] w-6 h-6 rounded-full border" style={{ background: '#050505', borderColor: coupon.status === 'ACTIVE' ? 'rgba(242,13,13,0.3)' : 'rgba(255,255,255,0.1)' }}></div>
            <div className="absolute -bottom-3 left-[58.5%] w-6 h-6 rounded-full border" style={{ background: '#050505', borderColor: coupon.status === 'ACTIVE' ? 'rgba(242,13,13,0.3)' : 'rgba(255,255,255,0.1)' }}></div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-gray-600">confirmation_number</span>
            </div>
            <p className="text-gray-500">{tab === 'available' ? 'ยังไม่มีคูปองที่ใช้ได้' : 'ยังไม่มีคูปองที่ใช้แล้ว'}</p>
          </div>
        )}

        {/* Redeemable templates */}
        {tab === 'available' && templates.length > 0 && (
          <>
            <h3 className="text-sm font-bold text-gray-400 pt-4">แลกคะแนนรับคูปอง</h3>
            {templates.map((tpl: any) => (
              <div key={tpl.id} className="flex h-32 border border-white/10 rounded-xl overflow-hidden relative group opacity-70" style={{ background: '#0f0f0f' }}>
                <div className="flex-[1.5] p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Point Exchange</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{tpl.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-1">{tpl.description || ''}</p>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    แลก {tpl.pointsCost} คะแนน
                  </div>
                </div>
                <div className="w-px border-r border-dashed border-white/20 my-3"></div>
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white/5">
                  <button
                    disabled={user.points < tpl.pointsCost}
                    className={`w-full py-2 rounded-lg text-xs font-bold ${user.points >= tpl.pointsCost ? 'text-white' : 'text-gray-400 cursor-not-allowed bg-gray-800'}`}
                    style={user.points >= tpl.pointsCost ? { background: '#f20d0d' } : {}}
                  >
                    แลกรับ
                  </button>
                </div>
                <div className="absolute -top-3 left-[58.5%] w-6 h-6 rounded-full border border-white/10" style={{ background: '#050505' }}></div>
                <div className="absolute -bottom-3 left-[58.5%] w-6 h-6 rounded-full border border-white/10" style={{ background: '#050505' }}></div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
