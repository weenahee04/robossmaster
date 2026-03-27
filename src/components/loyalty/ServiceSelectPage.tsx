'use client';

import { useState } from 'react';

interface ServiceSelectPageProps {
  branchName?: string;
  customerName?: string;
  carImage?: string;
  bikeImage?: string;
  onSelect: (serviceType: 'car' | 'bike') => void;
}

const DEFAULT_CAR_IMAGE = '/banners/service-car.png';
const DEFAULT_BIKE_IMAGE = '/banners/service-bike.png';

export default function ServiceSelectPage({ branchName, customerName, carImage, bikeImage, onSelect }: ServiceSelectPageProps) {
  const [selected, setSelected] = useState<'car' | 'bike' | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (type: 'car' | 'bike') => {
    setSelected(type);
    setAnimating(true);
    setTimeout(() => onSelect(type), 600);
  };

  const carSrc = carImage || DEFAULT_CAR_IMAGE;
  const bikeSrc = bikeImage || DEFAULT_BIKE_IMAGE;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full blur-[120px] bg-primary/20 pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] bg-[#dcb162]/10 pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <span className="material-symbols-outlined text-primary text-2xl">local_car_wash</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">เลือกบริการ</h1>
          <p className="text-gray-400 text-sm">
            {customerName ? `สวัสดี ${customerName}! ` : ''}เลือกประเภทบริการที่ต้องการ
          </p>
          {branchName && (
            <p className="text-xs text-primary/70 mt-2 font-medium">สาขา {branchName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Car button */}
          <button
            onClick={() => handleSelect('car')}
            disabled={animating}
            className={`relative flex flex-col rounded-3xl border-2 transition-all duration-300 active:scale-95 group overflow-hidden ${
              selected === 'car'
                ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/30'
                : selected === 'bike'
                  ? 'border-white/5 bg-white/[0.02] opacity-40 scale-95'
                  : 'border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-primary/5'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-[22px]">
              <img
                src={carSrc}
                alt="รถยนต์"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  selected === 'car' ? 'scale-105 brightness-110' : 'brightness-75 group-hover:brightness-90 group-hover:scale-105'
                }`}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              {selected === 'car' && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-base">check</span>
                </div>
              )}
            </div>

            <div className="relative z-10 text-center py-4 px-2">
              <p className={`font-bold text-lg transition-colors duration-300 ${
                selected === 'car' ? 'text-white' : 'text-gray-200'
              }`}>
                รถยนต์
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Car Wash</p>
            </div>
          </button>

          {/* Bike button */}
          <button
            onClick={() => handleSelect('bike')}
            disabled={animating}
            className={`relative flex flex-col rounded-3xl border-2 transition-all duration-300 active:scale-95 group overflow-hidden ${
              selected === 'bike'
                ? 'border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/30'
                : selected === 'car'
                  ? 'border-white/5 bg-white/[0.02] opacity-40 scale-95'
                  : 'border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-primary/5'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-[22px]">
              <img
                src={bikeSrc}
                alt="มอเตอร์ไซค์"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  selected === 'bike' ? 'scale-105 brightness-110' : 'brightness-75 group-hover:brightness-90 group-hover:scale-105'
                }`}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              {selected === 'bike' && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-base">check</span>
                </div>
              )}
            </div>

            <div className="relative z-10 text-center py-4 px-2">
              <p className={`font-bold text-lg transition-colors duration-300 ${
                selected === 'bike' ? 'text-white' : 'text-gray-200'
              }`}>
                มอเตอร์ไซค์
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Bike Wash</p>
            </div>
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs">
          สามารถเปลี่ยนประเภทบริการได้ภายหลังในหน้าตั้งค่า
        </p>
      </div>
    </div>
  );
}
