'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import StampCard from '@/components/loyalty/StampCard';
import CarImage from '@/components/loyalty/CarImage';
import { CAR_COLORS } from '@/lib/car-images';

interface ActiveWash {
  packageName: string;
  remainingSeconds: number;
}

interface HomePageProps {
  user: any;
  banners: any[];
  config: any;
  branchName?: string;
  vehicles?: any[];
  onAddVehicle?: () => void;
  onOpenQR: () => void;
  onOpenRewards: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenBranches: () => void;
  onOpenHistory: () => void;
  onOpenPromo?: (id: string) => void;
  onStartWash?: () => void;
  activeWash?: ActiveWash | null;
  onResumeWash?: () => void;
}

interface SlideItem {
  id: string;
  imageUrl: string;
  alt: string;
  bannerId?: string;
}

const AUTO_SLIDE_MS = 4000;
const SWIPE_THRESHOLD = 50;

export default function HomePage({ user, banners, config, branchName, vehicles, onAddVehicle, onOpenQR, onOpenRewards, onOpenNotifications, onOpenSettings, onOpenBranches, onOpenHistory, onOpenPromo, onStartWash, activeWash, onResumeWash }: HomePageProps) {
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

  const slides = useMemo<SlideItem[]>(() => {
    const items: SlideItem[] = [
      { id: 'static-promo', imageUrl: '/banners/roboss-promo.png', alt: 'Roboss ล้างรถยนต์อัตโนมัติ เริ่มต้น 99 บาท' },
    ];
    banners.forEach((b: any) => {
      if (b.imageUrl) {
        items.push({ id: b.id, imageUrl: b.imageUrl, alt: b.title || 'โปรโมชั่น', bannerId: b.id });
      }
    });
    return items;
  }, [banners]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(idx);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    autoPlayRef.current = setInterval(nextSlide, AUTO_SLIDE_MS);
    return () => clearInterval(autoPlayRef.current);
  }, [slides.length, nextSlide, currentSlide]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    clearInterval(autoPlayRef.current);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    } else if (touchDeltaX.current > SWIPE_THRESHOLD) {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  }, [slides.length]);

  const services = [
    { icon: 'local_car_wash', label: 'ล้างด่วน' },
    { icon: 'shutter_speed', label: 'เคลือบแก้ว' },
    { icon: 'vacuum', label: 'ดูดฝุ่น' },
    { icon: 'auto_fix', label: 'ขัดสี' },
  ];

  const stampsTotal = user.totalStamps || 10;
  const stampsCurrent = user.currentStamps || 0;

  const [heroVehicleIdx, setHeroVehicleIdx] = useState(0);
  const heroVehicle = vehicles && vehicles.length > 0 ? vehicles[heroVehicleIdx % vehicles.length] : null;

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-glow-red pointer-events-none z-0"></div>

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
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          >
            <span className="material-symbols-outlined text-gray-300 text-xl">notifications</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          >
            <span className="material-symbols-outlined text-gray-300 text-xl">settings</span>
          </button>
        </div>
      </header>

      {/* Hero vehicle card — Mercedes-style */}
      {vehicles && vehicles.length > 0 && heroVehicle ? (
        <div className="relative z-10 mx-6 mb-5 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#0d0d0d] shadow-2xl shadow-black/50">
          <div className="relative h-44 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <CarImage
              make={heroVehicle.make}
              model={heroVehicle.model}
              color={heroVehicle.color}
              className="h-36 w-full z-10 drop-shadow-[0_10px_30px_rgba(200,0,0,0.15)]"
            />
          </div>
          <div className="px-4 pb-4 flex items-end justify-between">
            <div>
              <p className="text-white font-bold text-base">{heroVehicle.make} {heroVehicle.model || ''}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded">{heroVehicle.licensePlate}</span>
                {heroVehicle.color && (
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: CAR_COLORS.find(c => c.id === heroVehicle.color)?.hex || '#666' }}
                  />
                )}
                {heroVehicle.isPrimary && (
                  <span className="text-[9px] text-primary font-bold uppercase tracking-wider">Primary</span>
                )}
              </div>
            </div>
            {vehicles.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHeroVehicleIdx(p => (p - 1 + vehicles.length) % vehicles.length)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10"
                >
                  <span className="material-symbols-outlined text-gray-400 text-[16px]">chevron_left</span>
                </button>
                <span className="text-[10px] text-gray-500 font-medium">{(heroVehicleIdx % vehicles.length) + 1}/{vehicles.length}</span>
                <button
                  onClick={() => setHeroVehicleIdx(p => (p + 1) % vehicles.length)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10"
                >
                  <span className="material-symbols-outlined text-gray-400 text-[16px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : vehicles && vehicles.length === 0 && onAddVehicle ? (
        <button
          onClick={onAddVehicle}
          className="relative z-10 mx-6 mb-5 p-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">add_circle</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">เพิ่มรถของคุณ</p>
            <p className="text-gray-500 text-xs mt-1">กรอกข้อมูลรถเพื่อแสดงรูปรถบนหน้าหลัก</p>
          </div>
        </button>
      ) : null}

      <main className="relative z-10 flex-1 px-6 pb-24 overflow-y-auto scrollbar-hide">
        {slides.length > 0 && (
          <div className="w-full mb-6 relative">
            <div
              ref={sliderRef}
              className="w-full overflow-hidden rounded-2xl shadow-xl shadow-black/50 border border-white/5 touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="w-full flex-shrink-0 cursor-pointer"
                    onClick={() => slide.bannerId && onOpenPromo?.(slide.bannerId)}
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.alt}
                      className="w-full h-auto object-cover"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {slides.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? 'w-6 bg-primary'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div data-tour-id="tour-points-card" className="w-full rounded-2xl p-6 relative overflow-hidden mb-6 border border-white/5 shadow-xl shadow-black/50 bg-surface-dark group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">คะแนนสะสม (Points)</p>
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {user.points.toLocaleString()} <span className="text-lg text-primary font-normal">pts</span>
                </h2>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-dark" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4" />
                  <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="4" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
                  <span className="text-white font-bold">{Math.round(progressPercent)}%</span>
                  <span className="text-[8px] text-gray-400 uppercase">Next</span>
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-white/10 mb-4"></div>
            <div className="flex justify-between items-end">
              <div className="text-xs text-gray-500">
                {branchName && <>สาขา: <span className="text-gray-300">{branchName}</span></>}
              </div>
              <button onClick={onOpenHistory} className="text-xs font-semibold text-primary hover:text-white transition-colors flex items-center gap-1">
                ประวัติคะแนน <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {activeWash && (
          <button
            onClick={onResumeWash}
            className="w-full mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary animate-spin">sync</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm">กำลังล้าง... {activeWash.packageName}</p>
              <p className="text-primary text-xs">เหลือ {Math.floor(activeWash.remainingSeconds / 60)}:{(activeWash.remainingSeconds % 60).toString().padStart(2, '0')} นาที</p>
            </div>
            <span className="material-symbols-outlined text-primary">chevron_right</span>
          </button>
        )}

        {onStartWash && !activeWash && (
          <button
            data-tour-id="tour-start-wash"
            onClick={onStartWash}
            className="w-full mb-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-[#c20808] text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
            เริ่มล้างรถ
          </button>
        )}

        {/* Stamp Card */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">สะสมแต้มล้างฟรี</h3>
            <span className="text-xs text-gray-400">{stampsCurrent}/{stampsTotal} ครั้ง</span>
          </div>
          <StampCard current={stampsCurrent} total={stampsTotal} />
          {stampsCurrent < stampsTotal && (
            <p className="text-xs text-gray-500 mt-2 text-center">อีก {stampsTotal - stampsCurrent} ครั้ง ได้ล้างฟรี!</p>
          )}
          {stampsCurrent >= stampsTotal && (
            <p className="text-xs text-primary mt-2 text-center font-bold">🎉 ล้างฟรี 1 ครั้ง!</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">บริการของเรา</h3>
            <button onClick={onOpenBranches} className="text-xs text-gray-400 hover:text-primary transition-colors">ดูทั้งหมด</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {services.map((svc) => (
              <button key={svc.icon} onClick={onOpenBranches} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl bg-surface-dark border border-white/5 flex items-center justify-center group-hover:border-primary/50 group-active:scale-95 transition-all shadow-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">{svc.icon}</span>
                </div>
                <span className="text-xs text-gray-300 font-medium">{svc.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">โปรโมชั่นแนะนำ</h3>
          </div>
          <div className="space-y-4">
            {banners.length > 0 ? banners.map((banner: any) => (
              <div
                key={banner.id}
                onClick={() => onOpenPromo?.(banner.id)}
                className="rounded-xl bg-card-dark border border-white/5 overflow-hidden group shadow-lg active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="h-32 relative">
                  <img alt={banner.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src={banner.imageUrl} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  <div className="absolute bottom-3 left-4">
                    {banner.tag && (
                      <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase mb-1 inline-block">{banner.tag}</span>
                    )}
                    <h4 className="text-white font-bold text-lg">{banner.title}</h4>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center bg-surface-dark">
                  <div>
                    {banner.subtitle && <p className="text-gray-400 text-xs mb-1">{banner.subtitle}</p>}
                  </div>
                  <span className="px-4 py-2 bg-white/5 text-white text-xs font-bold rounded-lg border border-white/10">
                    ดูรายละเอียด
                  </span>
                </div>
              </div>
            )) : (
              <div className="rounded-xl bg-card-dark border border-white/5 overflow-hidden shadow-lg flex h-24">
                <button onClick={onOpenRewards} className="flex-1 p-3 flex flex-col justify-center relative">
                  <h4 className="text-white font-bold text-sm mb-1">แลกคะแนนรับสิทธิ์</h4>
                  <p className="text-gray-400 text-xs mb-2">ใช้คะแนนแลกคูปองส่วนลดได้เลย</p>
                  <div className="flex items-center gap-1 text-primary text-xs font-bold">
                    ดูรางวัล <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
