'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/loyalty-api';

interface CouponsPageProps {
  user: any;
  templates: any[];
  myCoupons: any[];
  branchSlug: string;
  customerId: string;
  onRefresh: () => void;
}

type ModalType =
  | { kind: 'confirm-redeem'; templateId: string; name: string; pointsCost: number }
  | { kind: 'success'; message: string; code?: string }
  | { kind: 'error'; message: string }
  | { kind: 'use-coupon'; coupon: any }
  | null;

export default function CouponsPage({ user, templates, myCoupons, branchSlug, customerId, onRefresh }: CouponsPageProps) {
  const [tab, setTab] = useState<'available' | 'used'>('available');
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  const handleRedeem = useCallback(async (templateId: string, pointsCost: number, name: string) => {
    if (user.points < pointsCost) return;
    setModal({ kind: 'confirm-redeem', templateId, name, pointsCost });
  }, [user.points]);

  const confirmRedeem = useCallback(async () => {
    if (modal?.kind !== 'confirm-redeem') return;
    const { templateId, name } = modal;
    setModal(null);
    setRedeeming(templateId);
    try {
      const res = await api.redeemCoupon({ customerId, couponTemplateId: templateId, branchSlug });
      if (res.error) {
        setModal({ kind: 'error', message: res.error });
      } else {
        setModal({ kind: 'success', message: `แลกคูปอง "${name}" สำเร็จ!`, code: res.code });
        onRefresh();
      }
    } catch {
      setModal({ kind: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
    }
    setRedeeming(null);
  }, [modal, customerId, branchSlug, onRefresh]);

  const handleUseCoupon = useCallback((coupon: any) => {
    setModal({ kind: 'use-coupon', coupon });
  }, []);

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

        <div className="border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg bg-card-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
              <span className="material-symbols-outlined text-primary">database</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-medium">คะแนนคงเหลือ</p>
              <p className="text-lg font-bold text-white">{user.points.toLocaleString()} <span className="text-xs font-normal ml-1 text-primary">pts</span></p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 px-6 mt-2">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setTab('available')}
            className={`flex-1 pb-3 text-sm font-bold ${tab === 'available' ? 'border-b-2 text-primary border-primary' : 'text-gray-500'}`}
          >
            คูปองที่ใช้ได้ ({availableCoupons.length})
          </button>
          <button
            onClick={() => setTab('used')}
            className={`flex-1 pb-3 text-sm font-medium ${tab === 'used' ? 'border-b-2 text-primary border-primary' : 'text-gray-500'}`}
          >
            คูปองที่ใช้แล้ว
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-6 pt-6 pb-28 overflow-y-auto scrollbar-hide space-y-4">
        {displayCoupons.length > 0 ? displayCoupons.map((coupon: any) => (
          <div key={coupon.id} className={`flex h-32 border rounded-xl overflow-hidden relative group bg-card-dark ${coupon.status === 'ACTIVE' ? 'border-primary/30' : 'border-white/10'}`}>
            <div className="flex-[1.5] p-4 flex flex-col justify-between">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${coupon.status === 'ACTIVE' ? 'text-primary' : 'text-gray-500'}`}>
                  {coupon.template?.category || 'Reward'}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{coupon.template?.name || coupon.name || 'คูปอง'}</h3>
                <p className="text-[11px] text-gray-500 mt-1">{coupon.template?.description || ''}</p>
              </div>
              <div className="text-[10px] text-gray-500">
                {coupon.expiresAt ? `หมดอายุ: ${new Date(coupon.expiresAt).toLocaleDateString('th-TH')}` : ''}
              </div>
            </div>
            <div className={`w-px border-r border-dashed my-3 ${coupon.status === 'ACTIVE' ? 'border-primary/40' : 'border-white/20'}`}></div>
            <div className={`flex-1 flex flex-col items-center justify-center p-4 ${coupon.status === 'ACTIVE' ? 'bg-primary/5' : 'bg-white/5'}`}>
              {coupon.status === 'ACTIVE' ? (
                <button
                  onClick={() => handleUseCoupon(coupon)}
                  className="w-full py-2 text-white rounded-lg text-xs font-bold transition-all shadow-lg bg-primary shadow-primary/20 active:scale-95"
                >
                  ใช้คูปอง
                </button>
              ) : (
                <span className="text-xs text-gray-500 font-bold">ใช้แล้ว</span>
              )}
            </div>
            <div className={`absolute -top-3 left-[58.5%] w-6 h-6 rounded-full border bg-background-dark ${coupon.status === 'ACTIVE' ? 'border-primary/30' : 'border-white/10'}`}></div>
            <div className={`absolute -bottom-3 left-[58.5%] w-6 h-6 rounded-full border bg-background-dark ${coupon.status === 'ACTIVE' ? 'border-primary/30' : 'border-white/10'}`}></div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-gray-600">confirmation_number</span>
            </div>
            <p className="text-gray-500">{tab === 'available' ? 'ยังไม่มีคูปองที่ใช้ได้' : 'ยังไม่มีคูปองที่ใช้แล้ว'}</p>
          </div>
        )}

        {tab === 'available' && templates.length > 0 && (
          <>
            <h3 className="text-sm font-bold text-gray-400 pt-4">แลกคะแนนรับคูปอง</h3>
            {templates.map((tpl: any) => (
              <div key={tpl.id} className="flex h-32 border border-white/10 rounded-xl overflow-hidden relative group opacity-70 bg-card-dark">
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
                    disabled={user.points < tpl.pointsCost || redeeming === tpl.id}
                    onClick={() => handleRedeem(tpl.id, tpl.pointsCost, tpl.name)}
                    className={`w-full py-2 rounded-lg text-xs font-bold ${user.points >= tpl.pointsCost ? 'text-white bg-primary active:scale-95 transition-transform' : 'text-gray-400 cursor-not-allowed bg-gray-800'}`}
                  >
                    {redeeming === tpl.id ? 'กำลังแลก...' : 'แลกรับ'}
                  </button>
                </div>
                <div className="absolute -top-3 left-[58.5%] w-6 h-6 rounded-full border border-white/10 bg-background-dark"></div>
                <div className="absolute -bottom-3 left-[58.5%] w-6 h-6 rounded-full border border-white/10 bg-background-dark"></div>
              </div>
            ))}
          </>
        )}
      </main>

      {/* Custom Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)}></div>
          <div className="relative bg-surface-dark border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
            {modal.kind === 'confirm-redeem' && (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">redeem</span>
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-2">ยืนยันแลกคูปอง</h3>
                <p className="text-sm text-gray-400 text-center mb-6">
                  แลก &quot;{modal.name}&quot; ด้วย <span className="text-primary font-bold">{modal.pointsCost}</span> คะแนน?
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm active:scale-95 transition-transform">
                    ยกเลิก
                  </button>
                  <button onClick={confirmRedeem} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                    ยืนยัน
                  </button>
                </div>
              </>
            )}

            {modal.kind === 'success' && (
              <>
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-2">สำเร็จ!</h3>
                <p className="text-sm text-gray-400 text-center mb-2">{modal.message}</p>
                {modal.code && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center mb-4">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">รหัสคูปอง</p>
                    <p className="text-lg font-bold text-primary tracking-widest">{modal.code}</p>
                  </div>
                )}
                <button onClick={() => setModal(null)} className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm active:scale-95 transition-transform">
                  ตกลง
                </button>
              </>
            )}

            {modal.kind === 'error' && (
              <>
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-2">เกิดข้อผิดพลาด</h3>
                <p className="text-sm text-gray-400 text-center mb-6">{modal.message}</p>
                <button onClick={() => setModal(null)} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm active:scale-95 transition-transform">
                  ปิด
                </button>
              </>
            )}

            {modal.kind === 'use-coupon' && (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-1">
                  {modal.coupon.template?.name || modal.coupon.name || 'คูปอง'}
                </h3>
                <p className="text-xs text-gray-500 text-center mb-4">
                  {modal.coupon.template?.description || ''}
                </p>
                <div className="bg-white/5 border border-primary/20 rounded-2xl p-5 text-center mb-4">
                  <p className="text-[10px] text-gray-500 uppercase mb-2">รหัสคูปอง</p>
                  <p className="text-2xl font-bold text-primary tracking-[0.3em]">{modal.coupon.code || '—'}</p>
                  <div className="mt-3 flex justify-center">
                    <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-black text-6xl">qr_code_2</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 text-center mb-4">แสดงรหัสหรือ QR Code ให้พนักงานเพื่อใช้คูปอง</p>
                <button onClick={() => setModal(null)} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-sm active:scale-95 transition-transform">
                  ปิด
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
