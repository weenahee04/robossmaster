'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type WashStep = 'scan' | 'machine-found' | 'package' | 'payment' | 'confirm' | 'starting' | 'running' | 'done';
type PaymentMethod = 'points' | 'coupon' | 'qr';

interface MachineInfo {
  id: string;
  name: string;
  type: 'car' | 'bike';
  branchSlug: string;
}

interface WashPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  points: number;
  icon: string;
}

interface WashMode {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  stars: number;
  icon: string;
  recommended?: boolean;
  sizes: { label: string; price: number }[];
  duration: number;
}

interface WashFlowProps {
  user: { id: string; name: string; points: number; memberTier: string };
  branchSlug: string;
  branchName?: string;
  availableCoupons: any[];
  onClose: () => void;
  onComplete: (earnedPoints: number) => void;
}

const MOCK_QR_RESULT: MachineInfo = {
  id: 'bay-3',
  name: 'Bay 3',
  type: 'car',
  branchSlug: 'rama9',
};

const CAR_MODES: WashMode[] = [
  {
    id: 'quick', name: 'Quick & Clean', nameEn: 'QUICK & CLEAN MODE',
    desc: 'ล้างอัตโนมัติ+เป่าแห้ง+แว็กซ์',
    stars: 4, icon: 'local_car_wash',
    sizes: [{ label: 'S', price: 99 }, { label: 'M', price: 109 }, { label: 'L', price: 129 }],
    duration: 8,
  },
  {
    id: 'shine', name: 'Shine', nameEn: 'SHINE MODE',
    desc: 'ล้างอัตโนมัติ+เก็บรายละเอียด+เป่าแห้ง+แว็กซ์+ยางดำ',
    stars: 5, icon: 'auto_awesome',
    sizes: [{ label: 'S', price: 139 }, { label: 'M', price: 149 }, { label: 'L', price: 169 }],
    duration: 15,
  },
  {
    id: 'special', name: 'Special', nameEn: 'SPECIAL MODE', recommended: true,
    desc: 'ล้าง+เคลือบกราฟีน เงางาม ปกป้องสีได้แบบ "เร่งด่วน"',
    stars: 7, icon: 'shield_with_heart',
    sizes: [{ label: 'S', price: 339 }, { label: 'M', price: 399 }, { label: 'L', price: 469 }],
    duration: 25,
  },
  {
    id: 'vacuum', name: 'ดูดฝุ่นภายใน', nameEn: 'VACUUM',
    desc: 'ดูดฝุ่นทำความสะอาดภายในรถ',
    stars: 0, icon: 'vacuum',
    sizes: [{ label: 'S', price: 70 }, { label: 'M', price: 90 }, { label: 'L', price: 120 }],
    duration: 10,
  },
  {
    id: 'graphene', name: 'Graphene Shield', nameEn: 'GRAPHENE SHIELD',
    desc: 'น้ำยากราฟีน เงางาม ปกป้องสีได้แบบ "เร่งด่วน"',
    stars: 0, icon: 'shield',
    sizes: [{ label: 'ทุกไซส์', price: 777 }],
    duration: 30,
  },
];

const BIKE_MODES: WashMode[] = [
  {
    id: 'quick', name: 'Quick & Clean', nameEn: 'QUICK & CLEAN MODE',
    desc: 'ล้างอัตโนมัติ+เป่าแห้ง+แว็กซ์',
    stars: 4, icon: 'two_wheeler',
    sizes: [{ label: 'Motorcycle', price: 49 }, { label: 'Big Bike', price: 69 }],
    duration: 5,
  },
  {
    id: 'shine', name: 'Shine', nameEn: 'SHINE MODE', recommended: true,
    desc: 'ล้างอัตโนมัติ+เก็บรายละเอียด+เป่าแห้ง+แว็กซ์+ยางดำ และ ชิ้นพลาสติก',
    stars: 5, icon: 'auto_awesome',
    sizes: [{ label: 'Motorcycle', price: 89 }, { label: 'Big Bike', price: 109 }],
    duration: 10,
  },
  {
    id: 'special', name: 'Special', nameEn: 'SPECIAL MODE',
    desc: 'ล้าง+เคลือบกราฟีน เงางาม ปกป้องสีได้แบบ "เร่งด่วน"',
    stars: 7, icon: 'shield_with_heart',
    sizes: [{ label: 'ทุกไซส์', price: 199 }],
    duration: 15,
  },
];

const ADDON_MODES: WashMode[] = [
  { id: 'addon-wax', name: 'Quick Wax', nameEn: 'QUICK WAX', desc: 'ช่วยให้สีเงางามมากขึ้น', stars: 0, icon: 'spray', sizes: [{ label: 'เพิ่ม', price: 49 }], duration: 5 },
  { id: 'addon-hydro', name: 'Hydrophobic', nameEn: 'HYDROPHOBIC', desc: 'ป้องกันน้ำเกาะ ไม่ให้เกิดคลาบ', stars: 0, icon: 'water_drop', sizes: [{ label: 'เพิ่ม', price: 259 }], duration: 10 },
  { id: 'addon-ceramic', name: 'Ceramic Coating', nameEn: 'CERAMIC COATING', desc: 'เงางาม ปกป้องสีระยะยาวนาน สูงสุด', stars: 0, icon: 'diamond', sizes: [{ label: 'เพิ่ม', price: 799 }], duration: 20 },
];

function StarRating({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="flex gap-px">
      {Array.from({ length: Math.min(count, 7) }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-yellow-400 text-[12px] fill-1">star</span>
      ))}
    </div>
  );
}

const CARD_GRADIENTS = [
  'from-red-900/80 via-red-800/60 to-red-950/90',
  'from-amber-900/80 via-yellow-800/60 to-amber-950/90',
  'from-violet-900/80 via-purple-800/60 to-violet-950/90',
  'from-emerald-900/80 via-green-800/60 to-emerald-950/90',
  'from-cyan-900/80 via-teal-800/60 to-cyan-950/90',
];

const CARD_BORDER_COLORS = [
  'border-red-500/40',
  'border-amber-500/40',
  'border-violet-500/40',
  'border-emerald-500/40',
  'border-cyan-500/40',
];

const CARD_GLOW_COLORS = [
  'shadow-red-500/30',
  'shadow-amber-500/30',
  'shadow-violet-500/30',
  'shadow-emerald-500/30',
  'shadow-cyan-500/30',
];

export default function WashFlow({ user, branchSlug, branchName, availableCoupons, onClose, onComplete }: WashFlowProps) {
  const [step, setStep] = useState<WashStep>('scan');
  const [machine, setMachine] = useState<MachineInfo | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<WashPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [remainingSec, setRemainingSec] = useState(0);
  const [totalSec, setTotalSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [showAddons, setShowAddons] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  const touchStartXRef = useRef(0);
  const touchDeltaRef = useRef(0);

  useEffect(() => {
    if (step === 'scan') {
      const t = setTimeout(() => {
        setMachine(MOCK_QR_RESULT);
        setStep('machine-found');
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'starting') {
      const t = setTimeout(() => {
        const dur = selectedPkg!.duration * 60;
        setTotalSec(dur);
        setRemainingSec(dur);
        setStep('running');
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [step, selectedPkg]);

  useEffect(() => {
    if (step === 'running' && remainingSec > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSec((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setStep('done');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [step, remainingSec]);

  const skipTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setRemainingSec(0);
    setStep('done');
  }, []);

  const modes = machine?.type === 'car' ? CAR_MODES : BIKE_MODES;
  const machineTypeLabel = machine?.type === 'car' ? 'ล้างรถยนต์' : 'ล้างมอเตอร์ไซค์';
  const machineIcon = machine?.type === 'car' ? 'directions_car' : 'two_wheeler';
  const earnedPoints = selectedPkg?.points || 0;

  const selectedMode = modes[activeCardIdx] || null;
  const canConfirmPackage = selectedMode && selectedSizeIdx !== null;

  useEffect(() => {
    if (step === 'package') {
      setCardRevealed(false);
      const t = setTimeout(() => setCardRevealed(true), 100);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    setSelectedSizeIdx(null);
    setShowAddons(false);
  }, [activeCardIdx]);

  const goCard = useCallback((dir: 1 | -1) => {
    setActiveCardIdx(prev => {
      const next = prev + dir;
      if (next < 0 || next >= modes.length) return prev;
      return next;
    });
  }, [modes.length]);

  const handleCardTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
  }, []);

  const handleCardTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaRef.current = e.touches[0].clientX - touchStartXRef.current;
  }, []);

  const handleCardTouchEnd = useCallback(() => {
    if (touchDeltaRef.current < -50) goCard(1);
    else if (touchDeltaRef.current > 50) goCard(-1);
  }, [goCard]);

  const buildSelectedPkg = useCallback((): WashPackage | null => {
    if (!selectedMode || selectedSizeIdx === null) return null;
    const size = selectedMode.sizes[selectedSizeIdx];
    let totalPrice = size.price;
    let totalDuration = selectedMode.duration;
    const addonNames: string[] = [];
    for (const addonId of selectedAddons) {
      const addon = ADDON_MODES.find(a => a.id === addonId);
      if (addon) {
        totalPrice += addon.sizes[0].price;
        totalDuration += addon.duration;
        addonNames.push(addon.name);
      }
    }
    const sizeSuffix = selectedMode.sizes.length > 1 ? ` (${size.label})` : '';
    const addonSuffix = addonNames.length > 0 ? ` + ${addonNames.join(', ')}` : '';
    return {
      id: `${selectedMode.id}-${size.label}`,
      name: `${selectedMode.name}${sizeSuffix}${addonSuffix}`,
      price: totalPrice,
      duration: totalDuration,
      points: totalPrice,
      icon: selectedMode.icon,
    };
  }, [selectedMode, selectedSizeIdx, selectedAddons]);

  const handleConfirmPackage = useCallback(() => {
    const pkg = buildSelectedPkg();
    if (pkg) {
      setSelectedPkg(pkg);
      setStep('payment');
    }
  }, [buildSelectedPkg]);

  const toggleAddon = useCallback((addonId: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev);
      if (next.has(addonId)) next.delete(addonId);
      else next.add(addonId);
      return next;
    });
  }, []);

  const previewPrice = (() => {
    if (!selectedMode || selectedSizeIdx === null) return 0;
    let total = selectedMode.sizes[selectedSizeIdx].price;
    for (const addonId of selectedAddons) {
      const addon = ADDON_MODES.find(a => a.id === addonId);
      if (addon) total += addon.sizes[0].price;
    }
    return total;
  })();

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSec > 0 ? ((totalSec - remainingSec) / totalSec) * 100 : 0;
  const canPayWithPoints = selectedPkg ? user.points >= selectedPkg.price * 10 : false;
  const pointsCost = selectedPkg ? selectedPkg.price * 10 : 0;
  const matchingCoupons = availableCoupons.filter((c: any) => c.status === 'ACTIVE');

  return (
    <div className="fixed inset-0 max-w-md mx-auto z-[60] bg-black flex flex-col font-display text-gray-100 antialiased overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      {step !== 'starting' && step !== 'running' && step !== 'done' && (
        <header className="relative z-20 pt-14 px-6 flex items-center justify-between">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
            <span className="material-symbols-outlined">close</span>
          </button>
          {step !== 'scan' && (
            <button
              onClick={() => {
                const prev: Record<string, WashStep> = {
                  'machine-found': 'scan', 'package': 'machine-found',
                  'payment': 'package', 'confirm': 'payment',
                };
                setStep(prev[step] || 'scan');
              }}
              className="flex items-center gap-1 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              ย้อนกลับ
            </button>
          )}
        </header>
      )}

      {/* Step: Scan */}
      {step === 'scan' && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
          <div className="relative w-full aspect-square max-w-[280px]">
            <div className="qr-frame-corner top-0 left-0 rounded-tl-xl border-b-0 border-r-0"></div>
            <div className="qr-frame-corner top-0 right-0 rounded-tr-xl border-b-0 border-l-0"></div>
            <div className="qr-frame-corner bottom-0 left-0 rounded-bl-xl border-t-0 border-r-0"></div>
            <div className="qr-frame-corner bottom-0 right-0 rounded-br-xl border-t-0 border-l-0"></div>
            <div className="absolute inset-0 rounded-xl bg-primary/5 blur-[40px]"></div>
            <div className="absolute top-1/2 left-4 right-4 scanner-line animate-pulse"></div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-lg font-semibold text-white mb-2">สแกน QR ที่เครื่องล้างรถ</p>
            <p className="text-gray-400 text-sm">กำลังค้นหาเครื่อง...</p>
          </div>
        </main>
      )}

      {/* Step: Machine Found */}
      {step === 'machine-found' && machine && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-5xl">{machineIcon}</span>
          </div>
          <div className="w-4 h-4 rounded-full bg-green-500 mb-3 animate-pulse"></div>
          <h2 className="text-2xl font-bold text-white mb-1">พบเครื่อง!</h2>
          <p className="text-gray-400 text-sm mb-6">{machine.name} — {machineTypeLabel}</p>
          {branchName && <p className="text-xs text-gray-600 mb-8">สาขา {branchName}</p>}
          <button
            onClick={() => setStep('package')}
            className="w-full max-w-xs py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform"
          >
            เลือกแพ็กเกจ
          </button>
        </main>
      )}

      {/* Step: Package — GACHA CARD CAROUSEL */}
      {step === 'package' && (
        <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-lg">{machineIcon}</span>
              <span className="text-xs text-gray-500">{machine?.name} — {machineTypeLabel}</span>
            </div>
            <h2 className="text-lg font-bold text-white">เลือกแพ็กเกจ</h2>
            <p className="text-[11px] text-gray-600 mt-0.5">เลื่อนซ้าย-ขวาเพื่อดูแพ็กเกจ</p>
          </div>

          {/* Card carousel area */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onTouchStart={handleCardTouchStart}
            onTouchMove={handleCardTouchMove}
            onTouchEnd={handleCardTouchEnd}
          >
            {/* Ambient glow behind active card */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-64 h-64 rounded-full blur-[80px] opacity-30 transition-colors duration-700 ${
                activeCardIdx === 0 ? 'bg-red-500' :
                activeCardIdx === 1 ? 'bg-amber-500' :
                activeCardIdx === 2 ? 'bg-violet-500' :
                activeCardIdx === 3 ? 'bg-emerald-500' : 'bg-cyan-500'
              }`} />
            </div>

            {/* Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {modes.map((mode, idx) => {
                const offset = idx - activeCardIdx;
                const isActive = offset === 0;
                const absOff = Math.abs(offset);
                const scale = isActive ? 1 : Math.max(0.7, 1 - absOff * 0.15);
                const translateX = offset * 220;
                const opacity = isActive ? 1 : Math.max(0.3, 1 - absOff * 0.4);
                const zIndex = 10 - absOff;
                const rotate = offset * -3;
                const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                const borderColor = CARD_BORDER_COLORS[idx % CARD_BORDER_COLORS.length];
                const glowColor = CARD_GLOW_COLORS[idx % CARD_GLOW_COLORS.length];

                return (
                  <div
                    key={mode.id}
                    className={`absolute transition-all duration-500 ease-out cursor-pointer`}
                    style={{
                      transform: `translateX(${translateX}px) scale(${cardRevealed ? scale : 0.5}) rotate(${cardRevealed ? rotate : 0}deg)`,
                      opacity: cardRevealed ? opacity : 0,
                      zIndex,
                      width: '260px',
                    }}
                    onClick={() => { if (!isActive) setActiveCardIdx(idx); }}
                  >
                    <div className={`relative rounded-3xl border-2 ${isActive ? borderColor : 'border-white/10'} bg-gradient-to-br ${gradient} overflow-hidden ${isActive ? `shadow-2xl ${glowColor}` : 'shadow-lg shadow-black/50'}`}>
                      {/* Holographic shimmer overlay */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.07] to-white/0 animate-pulse pointer-events-none" />
                      )}

                      {/* Recommended badge */}
                      {mode.recommended && (
                        <div className="absolute top-0 right-0 px-3 py-1.5 bg-yellow-500/90 rounded-bl-2xl">
                          <span className="text-[9px] font-black text-black uppercase tracking-wider">แนะนำ</span>
                        </div>
                      )}

                      {/* Card content */}
                      <div className="relative z-10 p-5 pb-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isActive ? 'bg-white/15' : 'bg-white/5'}`}>
                          <span className="material-symbols-outlined text-white text-3xl">{mode.icon}</span>
                        </div>

                        {/* Name */}
                        <h3 className="text-white font-black text-base uppercase tracking-wide leading-tight">{mode.nameEn}</h3>
                        <StarRating count={mode.stars} />
                        <p className="text-white/60 text-[10px] mt-2 leading-relaxed min-h-[28px]">{mode.desc}</p>

                        {/* Duration */}
                        <div className="flex items-center gap-1.5 mt-3 mb-4">
                          <span className="material-symbols-outlined text-white/40 text-[14px]">schedule</span>
                          <span className="text-white/50 text-[10px]">~{mode.duration} นาที</span>
                        </div>

                        {/* Size price circles — only shown on active card */}
                        {isActive && (
                          <div className="flex items-center justify-center gap-3">
                            {mode.sizes.map((size, sIdx) => {
                              const isSel = selectedSizeIdx === sIdx;
                              return (
                                <button
                                  key={size.label}
                                  onClick={(e) => { e.stopPropagation(); setSelectedSizeIdx(sIdx); }}
                                  className={`relative flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
                                    mode.sizes.length === 1 ? 'w-[76px] h-[76px]' : 'w-[66px] h-[66px]'
                                  } ${
                                    isSel
                                      ? 'bg-white text-black scale-110'
                                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                  }`}
                                >
                                  {isSel && (
                                    <div className="absolute -inset-1.5 rounded-full border-2 border-white/50 animate-[ping_2s_ease-in-out_infinite]" />
                                  )}
                                  <span className={`text-xl font-black leading-none ${isSel ? 'text-black' : ''}`}>{size.price}</span>
                                  <span className={`text-[8px] mt-0.5 ${isSel ? 'text-black/60' : 'text-white/50'}`}>บาท</span>
                                  <span className={`text-[8px] font-bold mt-0.5 ${isSel ? 'text-black/70' : 'text-white/60'}`}>{size.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Inactive card: show price range */}
                        {!isActive && (
                          <div className="text-center">
                            <span className="text-white/70 text-lg font-bold">
                              {mode.sizes.length > 1
                                ? `${mode.sizes[0].price}–${mode.sizes[mode.sizes.length - 1].price}`
                                : mode.sizes[0].price
                              }
                            </span>
                            <span className="text-white/40 text-xs ml-1">บาท</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Arrow navigation */}
            {activeCardIdx > 0 && (
              <button
                onClick={() => goCard(-1)}
                className="absolute left-2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-white text-xl">chevron_left</span>
              </button>
            )}
            {activeCardIdx < modes.length - 1 && (
              <button
                onClick={() => goCard(1)}
                className="absolute right-2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-white text-xl">chevron_right</span>
              </button>
            )}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 py-2">
            {modes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCardIdx(idx)}
                className={`rounded-full transition-all duration-300 ${
                  idx === activeCardIdx ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Add-ons section (expandable) */}
          {machine?.type === 'car' && canConfirmPackage && (
            <div className="px-4 pb-1">
              <button
                onClick={() => setShowAddons(!showAddons)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">add_circle</span>
                  <span className="text-xs font-bold text-gray-300">โปรแกรมเสริม</span>
                  {selectedAddons.size > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded-full">+{selectedAddons.size}</span>
                  )}
                </div>
                <span className={`material-symbols-outlined text-gray-500 text-sm transition-transform ${showAddons ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              {showAddons && (
                <div className="mt-2 space-y-1.5 pb-1">
                  {ADDON_MODES.map((addon) => {
                    const isAdded = selectedAddons.has(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                          isAdded ? 'border-primary/50 bg-primary/10' : 'border-white/5 bg-white/[0.02]'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isAdded ? 'bg-primary/20' : 'bg-white/5'}`}>
                          <span className={`material-symbols-outlined text-sm ${isAdded ? 'text-primary' : 'text-gray-500'}`}>{addon.icon}</span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-[11px] font-bold ${isAdded ? 'text-white' : 'text-gray-300'}`}>{addon.nameEn}</p>
                        </div>
                        <span className={`text-xs font-bold ${isAdded ? 'text-primary' : 'text-gray-500'}`}>+{addon.sizes[0].price}฿</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isAdded ? 'bg-primary border-primary' : 'border-white/20'}`}>
                          {isAdded && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bottom confirm bar */}
          <div className="px-4 pb-4 pt-2">
            {canConfirmPackage && (
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-gray-400 text-xs">รวมทั้งหมด</span>
                <span className="text-2xl font-bold text-primary">{previewPrice.toLocaleString()} <span className="text-sm text-gray-400">บาท</span></span>
              </div>
            )}
            <button
              onClick={handleConfirmPackage}
              disabled={!canConfirmPackage}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform disabled:opacity-30 disabled:shadow-none"
            >
              {canConfirmPackage ? 'เลือกวิธีชำระเงิน' : 'กดที่ราคาเพื่อเลือกไซส์'}
            </button>
          </div>
        </main>
      )}

      {/* Step: Payment */}
      {step === 'payment' && selectedPkg && (
        <main className="relative z-10 flex-1 px-6 pt-8 pb-12 overflow-y-auto scrollbar-hide">
          <h2 className="text-xl font-bold text-white mb-1">เลือกวิธีชำระเงิน</h2>
          <p className="text-gray-500 text-sm mb-6">{selectedPkg.name} — {selectedPkg.price} บาท</p>

          <div className="space-y-3 mb-8">
            <button
              onClick={() => { setPaymentMethod('qr'); setSelectedCoupon(null); }}
              className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                paymentMethod === 'qr' ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface-dark'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'qr' ? 'bg-primary/20' : 'bg-white/5'}`}>
                <span className="material-symbols-outlined text-primary text-2xl">qr_code</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">QR Payment</p>
                <p className="text-gray-500 text-xs">ชำระผ่าน PromptPay / Mobile Banking</p>
              </div>
              {paymentMethod === 'qr' && <span className="material-symbols-outlined text-primary">check_circle</span>}
            </button>

            <button
              onClick={() => { if (canPayWithPoints) { setPaymentMethod('points'); setSelectedCoupon(null); } }}
              disabled={!canPayWithPoints}
              className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                paymentMethod === 'points' ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface-dark'
              } ${!canPayWithPoints ? 'opacity-40' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'points' ? 'bg-primary/20' : 'bg-white/5'}`}>
                <span className="material-symbols-outlined text-primary text-2xl">stars</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">ใช้แต้มสะสม</p>
                <p className="text-gray-500 text-xs">
                  {canPayWithPoints
                    ? `ใช้ ${pointsCost.toLocaleString()} แต้ม (คงเหลือ ${user.points.toLocaleString()})`
                    : `แต้มไม่พอ (ต้องการ ${pointsCost.toLocaleString()}, มี ${user.points.toLocaleString()})`}
                </p>
              </div>
              {paymentMethod === 'points' && <span className="material-symbols-outlined text-primary">check_circle</span>}
            </button>

            <button
              onClick={() => { if (matchingCoupons.length > 0) { setPaymentMethod('coupon'); } }}
              disabled={matchingCoupons.length === 0}
              className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                paymentMethod === 'coupon' ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface-dark'
              } ${matchingCoupons.length === 0 ? 'opacity-40' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'coupon' ? 'bg-primary/20' : 'bg-white/5'}`}>
                <span className="material-symbols-outlined text-primary text-2xl">confirmation_number</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">ใช้คูปอง</p>
                <p className="text-gray-500 text-xs">
                  {matchingCoupons.length > 0 ? `คูปองที่ใช้ได้ ${matchingCoupons.length} ใบ` : 'ไม่มีคูปองที่ใช้ได้'}
                </p>
              </div>
              {paymentMethod === 'coupon' && <span className="material-symbols-outlined text-primary">check_circle</span>}
            </button>
          </div>

          {paymentMethod === 'coupon' && matchingCoupons.length > 0 && (
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">เลือกคูปอง</p>
              <div className="space-y-2">
                {matchingCoupons.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCoupon(c)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedCoupon?.id === c.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <p className="text-white text-sm font-bold">{c.template?.name || c.code}</p>
                    <p className="text-gray-500 text-xs">{c.code}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setStep('confirm')}
            disabled={paymentMethod === 'coupon' && !selectedCoupon}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform disabled:opacity-40"
          >
            ถัดไป
          </button>
        </main>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && selectedPkg && machine && (
        <main className="relative z-10 flex-1 px-6 pt-8 pb-12 overflow-y-auto scrollbar-hide">
          <h2 className="text-xl font-bold text-white mb-6">ยืนยันการชำระเงิน</h2>

          <div className="rounded-2xl border border-white/10 bg-surface-dark p-5 space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">เครื่อง</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">{machineIcon}</span>
                <span className="text-white font-bold text-sm">{machine.name} — {machineTypeLabel}</span>
              </div>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">แพ็กเกจ</span>
              <span className="text-white font-bold text-sm text-right max-w-[60%]">{selectedPkg.name}</span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">ระยะเวลา</span>
              <span className="text-white text-sm">{selectedPkg.duration} นาที</span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">ชำระด้วย</span>
              <span className="text-white font-bold text-sm">
                {paymentMethod === 'qr' && 'QR Payment'}
                {paymentMethod === 'points' && `แต้มสะสม (${pointsCost.toLocaleString()} pts)`}
                {paymentMethod === 'coupon' && `คูปอง: ${selectedCoupon?.code || ''}`}
              </span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">ราคา</span>
              <span className="text-2xl font-bold text-primary">{selectedPkg.price} <span className="text-sm text-gray-400">บาท</span></span>
            </div>
          </div>

          {paymentMethod === 'qr' && (
            <div className="rounded-2xl bg-white p-6 flex flex-col items-center mb-8">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`ROBOSS-PAY-${selectedPkg.id}-${Date.now()}`)}`}
                alt="Payment QR"
                className="w-40 h-40 mb-3"
              />
              <p className="text-gray-800 text-xs font-medium">สแกนเพื่อชำระเงิน (Mock)</p>
            </div>
          )}

          <button
            onClick={() => setStep('starting')}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform"
          >
            ยืนยันชำระเงิน
          </button>
        </main>
      )}

      {/* Step: Starting */}
      {step === 'starting' && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl">{machineIcon}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">กำลังเริ่มเครื่อง...</h2>
          <p className="text-gray-400 text-sm">โปรดรอสักครู่</p>
        </main>
      )}

      {/* Step: Running */}
      {step === 'running' && selectedPkg && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="44" fill="none"
                stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 * (1 - progressPercent / 100)}
                className="text-primary transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white font-mono">{formatTime(remainingSec)}</span>
              <span className="text-xs text-gray-500 mt-1">เหลือ</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">กำลังล้าง...</h2>
          <p className="text-gray-400 text-sm mb-2">{selectedPkg.name}</p>
          <p className="text-gray-600 text-xs">{machine?.name} — {machineTypeLabel}</p>
          <button
            onClick={skipTimer}
            className="mt-10 px-6 py-2.5 rounded-full border border-white/10 text-gray-400 text-sm hover:text-white hover:border-white/30 transition-colors"
          >
            ข้ามไปหน้าสรุป (Demo)
          </button>
        </main>
      )}

      {/* Step: Done */}
      {step === 'done' && selectedPkg && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-green-400 text-5xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">ล้างรถเสร็จเรียบร้อย!</h2>
          <p className="text-gray-400 text-sm mb-8">{selectedPkg.name} — {machine?.name}</p>
          <div className="w-full max-w-xs rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center mb-8">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">คะแนนที่ได้รับ</p>
            <p className="text-4xl font-bold text-primary">+{earnedPoints}</p>
            <p className="text-gray-500 text-xs mt-1">แต้ม</p>
          </div>
          <button
            onClick={() => onComplete(earnedPoints)}
            className="w-full max-w-xs py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform"
          >
            กลับหน้าหลัก
          </button>
        </main>
      )}
    </div>
  );
}
