'use client';

import { useState } from 'react';
import { ChevronLeft, Star, Gift } from 'lucide-react';
import { api } from '@/lib/loyalty-api';

interface RewardsPageProps {
  user: any;
  templates: any[];
  myCoupons: any[];
  branchSlug: string;
  customerId: string;
  onBack: () => void;
  onRefresh: () => void;
}

export default function RewardsPage({ user, templates, myCoupons, branchSlug, customerId, onBack, onRefresh }: RewardsPageProps) {
  const [tab, setTab] = useState<'rewards' | 'mycoupons'>('rewards');
  const [redeeming, setRedeeming] = useState('');

  const handleRedeem = async (templateId: string) => {
    setRedeeming(templateId);
    try {
      const result = await api.redeemCoupon({ customerId, couponTemplateId: templateId, branchSlug });
      if (result.error) {
        alert(result.error);
      } else {
        alert('แลกคูปองสำเร็จ!');
        onRefresh();
      }
    } catch {
      alert('เกิดข้อผิดพลาด');
    }
    setRedeeming('');
  };

  return (
    <div className="min-h-screen bg-black pb-10">
      <div className="px-6 py-6 space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white font-kanit">แลกของรางวัล</h2>
        </div>

        <div className="gradient-premium-gold p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-yellow-950/30">
          <div>
            <p className="text-black/60 text-xs font-bold uppercase tracking-widest">แต้มของคุณ</p>
            <p className="text-4xl font-black text-black">{user.points.toLocaleString()}</p>
          </div>
          <div className="bg-black/10 p-4 rounded-3xl">
            <Star className="text-black" size={32} fill="black" />
          </div>
        </div>

        <div className="flex bg-roboss-dark p-1 rounded-2xl border border-white/5">
          <button onClick={() => setTab('rewards')} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${tab === 'rewards' ? 'bg-white text-black' : 'text-gray-400'}`}>
            แลกรางวัล ({templates.length})
          </button>
          <button onClick={() => setTab('mycoupons')} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${tab === 'mycoupons' ? 'bg-white text-black' : 'text-gray-400'}`}>
            คูปองของฉัน ({myCoupons.length})
          </button>
        </div>

        {tab === 'rewards' && (
          <div className="grid grid-cols-2 gap-4">
            {templates.map((reward: any) => (
              <div key={reward.id} className="bg-roboss-dark rounded-3xl border border-white/5 overflow-hidden flex flex-col group">
                <div className="h-32 relative overflow-hidden bg-white/5 flex items-center justify-center">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Gift size={32} className="text-gray-600" />
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star size={10} className="text-yellow-500" fill="currentColor" />
                    <span className="text-[10px] text-white font-bold">{reward.pointsCost}</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{reward.name}</h4>
                  <button
                    disabled={user.points < reward.pointsCost || redeeming === reward.id}
                    onClick={() => handleRedeem(reward.id)}
                    className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${user.points >= reward.pointsCost ? 'gradient-premium-gold text-black shadow-lg shadow-yellow-950/20' : 'bg-white/5 text-gray-600 grayscale cursor-not-allowed'}`}
                  >
                    {redeeming === reward.id ? 'กำลังแลก...' : user.points >= reward.pointsCost ? 'แลกแต้มเลย' : 'แต้มไม่พอ'}
                  </button>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="col-span-2 bg-roboss-dark p-8 rounded-[2.5rem] border border-dashed border-white/10 text-center space-y-2">
                <Gift className="mx-auto text-gray-700" size={40} />
                <p className="text-gray-500 text-sm">ยังไม่มีรางวัลให้แลก</p>
              </div>
            )}
          </div>
        )}

        {tab === 'mycoupons' && (
          <div className="space-y-4">
            {myCoupons.map((coupon: any) => (
              <div key={coupon.id} className={`bg-roboss-dark p-5 rounded-3xl border space-y-3 ${coupon.status === 'AVAILABLE' ? 'border-roboss-red/30' : 'border-white/5 opacity-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold text-sm">{coupon.couponTemplate?.name}</h4>
                    <p className="text-gray-500 text-xs">{coupon.couponTemplate?.description || ''}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${coupon.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500' : coupon.status === 'USED' ? 'bg-gray-500/10 text-gray-500' : 'bg-red-500/10 text-red-500'}`}>
                    {coupon.status === 'AVAILABLE' ? 'ใช้ได้' : coupon.status === 'USED' ? 'ใช้แล้ว' : 'หมดอายุ'}
                  </span>
                </div>
                {coupon.status === 'AVAILABLE' && (
                  <div className="bg-white p-4 rounded-2xl text-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${coupon.code}`} alt="QR" className="w-32 h-32 mx-auto" />
                    <p className="text-black font-mono text-sm mt-2 font-bold">{coupon.code}</p>
                  </div>
                )}
                <p className="text-gray-600 text-[10px]">หมดอายุ: {new Date(coupon.expiresAt).toLocaleDateString('th-TH')}</p>
              </div>
            ))}
            {myCoupons.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <Gift size={32} className="mx-auto mb-2 text-gray-600" />
                <p>ยังไม่มีคูปอง</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
