'use client';

interface HomePageProps {
  user: any;
  banners: any[];
  config: any;
  branchName?: string;
  onOpenQR: () => void;
  onOpenRewards: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenBranches: () => void;
  onOpenHistory: () => void;
}

export default function HomePage({ user, banners, config, branchName, onOpenQR, onOpenRewards, onOpenNotifications, onOpenSettings, onOpenBranches, onOpenHistory }: HomePageProps) {
  const goldThreshold = config?.config?.goldThreshold || 100;
  const platinumThreshold = config?.config?.platinumThreshold || 500;
  const targetPoints = user.memberTier === 'SILVER' ? goldThreshold : user.memberTier === 'GOLD' ? platinumThreshold : platinumThreshold;
  const progressPercent = Math.min(100, (user.points / targetPoints) * 100);
  const tierLabel = user.memberTier === 'SILVER' ? 'Silver' : user.memberTier === 'GOLD' ? 'Gold' : 'Platinum';
  const tierThaiLabel = user.memberTier === 'SILVER' ? 'สมาชิกระดับเงิน' : user.memberTier === 'GOLD' ? 'สมาชิกระดับทอง' : 'สมาชิกระดับแพลทินัม';

  const strokeDasharray = 175.93;
  const strokeDashoffset = strokeDasharray * (1 - progressPercent / 100);

  const tierGradient = user.memberTier === 'GOLD'
    ? 'from-[#dcb162] to-[#b88a3b]'
    : user.memberTier === 'PLATINUM'
      ? 'from-[#e5e5e5] to-[#a0a0a0]'
      : 'from-[#c0c0c0] to-[#808080]';

  const services = [
    { icon: 'local_car_wash', label: 'ล้างด่วน' },
    { icon: 'shutter_speed', label: 'เคลือบแก้ว' },
    { icon: 'vacuum', label: 'ดูดฝุ่น' },
    { icon: 'auto_fix', label: 'ขัดสี' },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-glow-red pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 pt-12 px-6 pb-6 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-medium">ยินดีต้อนรับ,</span>
          <h1 className="text-2xl font-bold text-white mt-1">{user.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={`bg-gradient-to-r ${tierGradient} text-black text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider`}>
              {tierLabel} Tier
            </span>
            <span className="text-xs text-gray-500">{tierThaiLabel}</span>
          </div>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle className="text-[#1a1a1a]" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4" />
            <circle className="text-[#f20d0d]" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="4" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
            <span className="text-white font-bold">{Math.round(progressPercent)}%</span>
            <span className="text-[8px] text-gray-400 uppercase">Next</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-6 pb-24 overflow-y-auto scrollbar-hide">
        {/* Points Card */}
        <div className="w-full rounded-2xl p-6 relative overflow-hidden mb-8 border border-white/5 shadow-xl" style={{ background: '#1a1a1a', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10" style={{ background: 'rgba(242,13,13,0.1)' }}></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">คะแนนสะสม (Points)</p>
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {user.points.toLocaleString()} <span className="text-lg font-normal" style={{ color: '#f20d0d' }}>pts</span>
                </h2>
              </div>
              <button
                onClick={onOpenQR}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
              >
                <span className="material-symbols-outlined text-gray-300">qr_code_scanner</span>
              </button>
            </div>
            <div className="h-px w-full bg-white/10 mb-4"></div>
            <div className="flex justify-between items-end">
              <div className="text-xs text-gray-500">
                {branchName && <>สาขา: <span className="text-gray-300">{branchName}</span></>}
              </div>
              <button onClick={onOpenHistory} className="text-xs font-semibold flex items-center gap-1 transition-colors hover:text-white" style={{ color: '#f20d0d' }}>
                ประวัติคะแนน <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">บริการของเรา</h3>
            <button onClick={onOpenBranches} className="text-xs text-gray-400 hover:text-[#f20d0d] transition-colors">ดูทั้งหมด</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {services.map((svc) => (
              <button key={svc.icon} onClick={onOpenBranches} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center group-hover:border-[#f20d0d]/50 group-active:scale-95 transition-all shadow-lg" style={{ background: '#1a1a1a' }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: '#f20d0d' }}>{svc.icon}</span>
                </div>
                <span className="text-xs text-gray-300 font-medium">{svc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promotions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">โปรโมชั่นแนะนำ</h3>
          </div>
          <div className="space-y-4">
            {banners.length > 0 ? banners.map((banner: any) => (
              <div key={banner.id} className="rounded-xl border border-white/5 overflow-hidden group shadow-lg active:scale-[0.99] transition-transform" style={{ background: '#0f0f0f' }}>
                <div className="h-32 relative">
                  <img alt={banner.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src={banner.imageUrl} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  <div className="absolute bottom-3 left-4">
                    {banner.tag && (
                      <span className="px-2 py-0.5 text-white text-[10px] font-bold rounded uppercase mb-1 inline-block" style={{ background: '#f20d0d' }}>{banner.tag}</span>
                    )}
                    <h4 className="text-white font-bold text-lg">{banner.title}</h4>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center" style={{ background: '#1a1a1a' }}>
                  <div>
                    {banner.subtitle && <p className="text-gray-400 text-xs mb-1">{banner.subtitle}</p>}
                  </div>
                  <button onClick={onOpenRewards} className="px-4 py-2 bg-white/5 hover:bg-[#f20d0d] text-white text-xs font-bold rounded-lg transition-colors border border-white/10 hover:border-transparent">
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            )) : (
              <>
                <div className="rounded-xl border border-white/5 overflow-hidden shadow-lg" style={{ background: '#0f0f0f' }}>
                  <div className="p-4 flex justify-between items-center" style={{ background: '#1a1a1a' }}>
                    <div>
                      <p className="text-white font-bold text-sm">สะสมแต้มล้างฟรี</p>
                      <p className="text-gray-400 text-xs mt-1">อีก {Math.max(0, user.totalStamps - user.currentStamps)} ครั้ง ได้ล้างฟรี!</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{user.currentStamps}/{user.totalStamps}</span>
                      <span className="material-symbols-outlined text-[#f20d0d]">stars</span>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(user.currentStamps / user.totalStamps) * 100}%`, background: '#f20d0d' }}></div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 overflow-hidden shadow-lg flex h-24" style={{ background: '#0f0f0f' }}>
                  <button onClick={onOpenRewards} className="flex-1 p-3 flex flex-col justify-center relative">
                    <h4 className="text-white font-bold text-sm mb-1">แลกคะแนนรับสิทธิ์</h4>
                    <p className="text-gray-400 text-xs mb-2">ใช้คะแนนแลกคูปองส่วนลดได้เลย</p>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#f20d0d' }}>
                      ดูรางวัล <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
