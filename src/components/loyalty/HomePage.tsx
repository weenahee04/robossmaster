'use client';

import { ChevronRight, Gift, Zap, Star, ShieldCheck, Bell, Settings } from 'lucide-react';
import StampCard from './StampCard';

interface HomePageProps {
  user: any;
  banners: any[];
  config: any;
  branchName?: string;
  onOpenQR: () => void;
  onOpenRewards: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export default function HomePage({ user, banners, config, branchName, onOpenQR, onOpenRewards, onOpenNotifications, onOpenSettings }: HomePageProps) {
  const nextTier = user.memberTier === 'SILVER' ? 'Gold' : user.memberTier === 'GOLD' ? 'Platinum' : 'Maximum';
  const goldThreshold = config?.config?.goldThreshold || 100;
  const platinumThreshold = config?.config?.platinumThreshold || 500;
  const targetPoints = user.memberTier === 'SILVER' ? goldThreshold : user.memberTier === 'GOLD' ? platinumThreshold : platinumThreshold;
  const progressPercent = Math.min(100, (user.points / targetPoints) * 100);
  const remaining = Math.max(0, targetPoints - user.points);

  const tierLabel = user.memberTier === 'SILVER' ? 'Silver' : user.memberTier === 'GOLD' ? 'Gold' : 'Platinum';

  const appConfig = config?.appConfig;

  return (
    <div className="pb-10">
      {/* Profile Header */}
      <div className="px-6 pt-10 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={onOpenSettings}>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 p-0.5 group-active:scale-95 transition-transform">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-roboss-red/20 flex items-center justify-center text-roboss-red font-bold text-xl">
                    {(user.name || 'U').charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-roboss-red w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                <ShieldCheck size={10} color="white" fill="white" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-white font-kanit tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-1.5">
                <p className="text-gray-500 text-xs font-medium bg-white/5 px-2 py-0.5 rounded-full w-fit">
                  {tierLabel} Member
                </p>
                {branchName && (
                  <p className="text-roboss-red text-[10px] font-bold bg-roboss-red/10 px-2 py-0.5 rounded-full w-fit">
                    {branchName}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onOpenNotifications} className="p-2.5 bg-white/5 rounded-full text-gray-400 relative active:scale-90 transition-transform">
              <Bell size={22} />
            </button>
            <button onClick={onOpenSettings} className="p-2.5 bg-white/5 rounded-full text-gray-400 active:scale-90 transition-transform">
              <Settings size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Membership Progress Banner */}
        {user.memberTier !== 'PLATINUM' && (
          <div className="bg-roboss-dark border border-white/5 rounded-[2rem] p-4 flex items-center gap-4 relative overflow-hidden group active:scale-[0.98] transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={80} />
            </div>
            <div className="w-12 h-12 rounded-2xl gradient-premium-gold flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-900/20">
              <Star className="text-white" size={24} fill="currentColor" />
            </div>
            <div className="flex-1 space-y-2 relative z-10">
              <div className="flex justify-between items-end">
                <p className="text-xs font-bold text-white">อีกนิดเดียวจะถึงระดับ {nextTier}!</p>
                <p className="text-[10px] text-gray-500 font-medium">สะสมอีก {remaining} แต้ม</p>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-200 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-600" />
          </div>
        )}

        {/* Points Summary */}
        <div className="bg-roboss-dark rounded-3xl p-6 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-widest">แต้มสะสมทั้งหมด</p>
              <p className="text-4xl font-bold text-white tracking-tight">{user.points.toLocaleString()}</p>
            </div>
            <button
              onClick={onOpenRewards}
              className="text-black text-sm font-bold flex items-center gap-1 gradient-premium-gold px-4 py-2 rounded-xl active:scale-95 transition-transform shadow-lg shadow-yellow-950/40"
            >
              แลกรางวัล <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Redemption Banner */}
        <div className="gradient-red rounded-3xl p-5 flex items-center justify-between relative overflow-hidden shadow-lg shadow-red-950/20">
          <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4 transform rotate-12">
            <Gift size={100} />
          </div>
          <div className="relative z-10 space-y-1">
            <h4 className="text-white font-bold text-sm">สิทธิพิเศษวันนี้!</h4>
            <p className="text-white/80 text-xs">ใช้แต้มแลกคูปองส่วนลดได้เลย</p>
            <button onClick={onOpenRewards} className="mt-2 bg-white text-roboss-red px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md active:scale-95 transition-transform uppercase tracking-wider">
              แลกสิทธิ์เลย
            </button>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <Zap className="text-white" size={24} fill="white" />
          </div>
        </div>

        {/* Stamp Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white font-kanit">สะสมแต้มล้างฟรี</h3>
            <p className="text-roboss-red text-sm font-medium">อีก {user.totalStamps - user.currentStamps} ครั้ง ฟรี!</p>
          </div>
          <StampCard current={user.currentStamps} total={user.totalStamps} />
        </div>

        {/* Banners */}
        {banners.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white font-kanit">โปรโมชั่นและข่าวสาร</h3>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 snap-x">
              {banners.map((banner: any) => (
                <div key={banner.id} className="flex-shrink-0 w-[85%] snap-center rounded-[2rem] overflow-hidden relative aspect-[16/9] border border-white/5">
                  <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" />
                  {banner.tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-roboss-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{banner.tag}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h4 className="text-xl font-bold text-white mb-1 font-kanit">{banner.title}</h4>
                    {banner.subtitle && <p className="text-gray-300 text-sm line-clamp-1">{banner.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Feature */}
        {appConfig?.heroImageUrl && (
          <div className="rounded-[2.5rem] overflow-hidden relative group border border-white/5">
            <img src={appConfig.heroImageUrl} alt="Feature" className="w-full h-56 object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-8 flex flex-col justify-end">
              <h4 className="text-2xl font-bold text-white mb-2 leading-tight font-kanit">{appConfig.heroTitle || 'Roboss Car Wash'}</h4>
              {appConfig.heroSubtitle && <p className="text-gray-300 text-sm mb-6">{appConfig.heroSubtitle}</p>}
              {appConfig.heroButtonText && (
                <button className="bg-white text-black font-bold py-3 px-8 rounded-2xl w-fit active:scale-95 transition-transform shadow-lg">
                  {appConfig.heroButtonText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
