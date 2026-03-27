'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/loyalty-api';
import CarImage from '@/components/loyalty/CarImage';
import { CAR_COLORS } from '@/lib/car-images';

interface ProfilePageProps {
  user: any;
  customerId: string;
  vehicles?: any[];
  onLogout: () => void;
  onOpenCoupons?: () => void;
  onOpenSettings?: () => void;
  onOpenBranches?: () => void;
  onAddVehicle?: () => void;
  onEditVehicle?: (vehicle: any) => void;
  onRefreshVehicles?: () => void;
}

export default function ProfilePage({ user, customerId, vehicles: vehiclesProp, onLogout, onOpenCoupons, onOpenSettings, onOpenBranches, onAddVehicle, onEditVehicle, onRefreshVehicles }: ProfilePageProps) {
  const [vehicles, setVehicles] = useState<any[]>(vehiclesProp || []);
  const [showVehicles, setShowVehicles] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);

  useEffect(() => {
    if (vehiclesProp) setVehicles(vehiclesProp);
  }, [vehiclesProp]);

  useEffect(() => {
    if (!vehiclesProp) {
      api.getVehicles(customerId).then(setVehicles).catch(() => {});
    }
  }, [customerId, vehiclesProp]);

  const handleSetPrimary = useCallback(async (vehicleId: string) => {
    setSettingPrimary(vehicleId);
    try {
      await api.setPrimaryVehicle(vehicleId);
      setVehicles(prev => prev.map(v => ({ ...v, isPrimary: v.id === vehicleId })));
      onRefreshVehicles?.();
    } catch { /* silently fail */ }
    setSettingPrimary(null);
  }, [onRefreshVehicles]);

  const handleDeleteVehicle = useCallback(async (vehicleId: string) => {
    try {
      await api.deleteVehicle(vehicleId);
      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
      onRefreshVehicles?.();
    } catch { /* silently fail */ }
  }, [onRefreshVehicles]);

  const tierLabel = user.memberTier === 'SILVER' ? 'Silver' : user.memberTier === 'GOLD' ? 'Gold' : 'Platinum';

  const tierGradient = user.memberTier === 'GOLD'
    ? 'from-[#dcb162] to-[#b88a3b]'
    : user.memberTier === 'PLATINUM'
      ? 'from-[#e5e5e5] to-[#a0a0a0]'
      : 'from-[#c0c0c0] to-[#808080]';

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-glow-red pointer-events-none z-0"></div>

      <header className="relative z-10 pt-16 px-6 pb-8 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full border-2 border-primary/30 p-1 shadow-2xl shadow-primary/20 bg-surface-dark">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
              {user.profileImage ? (
                <img alt="Profile" className="w-full h-full object-cover" src={user.profileImage} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary">
                  {(user.name || 'U').charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
        <div className="flex items-center gap-2">
          <span className={`bg-gradient-to-r ${tierGradient} text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
            {tierLabel} Tier
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 pb-32 overflow-y-auto scrollbar-hide">
        <div className="w-full rounded-2xl p-4 mb-8 border border-white/5 flex items-center justify-between bg-surface-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
              <span className="material-symbols-outlined text-primary">stars</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">คะแนนของคุณ</p>
              <p className="text-lg font-bold text-white">{user.points.toLocaleString()} <span className="text-xs font-normal uppercase text-primary">pts</span></p>
            </div>
          </div>
          <button onClick={onOpenCoupons} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 border border-white/10 transition-colors">
            แลกของรางวัล
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">ข้อมูลทั่วไป</h3>

          <button onClick={onOpenSettings} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border border-white/5 rounded-2xl transition-all group bg-surface-dark">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">person</span>
              </div>
              <span className="text-sm font-medium text-gray-200">ข้อมูลส่วนตัว</span>
            </div>
            <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
          </button>

          {/* Vehicle list — enhanced with images */}
          <div className="border border-white/5 rounded-2xl bg-surface-dark overflow-hidden">
            <button onClick={() => setShowVehicles(!showVehicles)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">directions_car</span>
                </div>
                <span className="text-sm font-medium text-gray-200">รถของฉัน</span>
                {vehicles.length > 0 && <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{vehicles.length} คัน</span>}
              </div>
              <span className={`material-symbols-outlined text-gray-600 text-[20px] transition-transform ${showVehicles ? 'rotate-90' : ''}`}>chevron_right</span>
            </button>

            {showVehicles && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                {vehicles.length > 0 ? vehicles.map((v: any) => (
                  <div key={v.id} className={`rounded-xl border p-3 transition-all ${v.isPrimary ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-white/[0.02]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <CarImage make={v.make} model={v.model} color={v.color} className="h-10 w-16" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white font-bold truncate">{v.make} {v.model || ''}</p>
                          {v.isPrimary && (
                            <span className="text-[8px] bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded uppercase">หลัก</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{v.licensePlate}</span>
                          {v.color && (
                            <div
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ backgroundColor: CAR_COLORS.find(c => c.id === v.color)?.hex || '#666' }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      {!v.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(v.id)}
                          disabled={settingPrimary === v.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          ตั้งเป็นรถหลัก
                        </button>
                      )}
                      {onEditVehicle && (
                        <button
                          onClick={() => onEditVehicle(v)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          แก้ไข
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteVehicle(v.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors ml-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        ลบ
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-gray-500 text-center py-2">ยังไม่มีรถที่บันทึกไว้</p>
                )}
                {onAddVehicle && (
                  <button
                    onClick={onAddVehicle}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-primary font-bold hover:bg-primary/5 transition-colors active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    เพิ่มรถใหม่
                  </button>
                )}
              </div>
            )}
          </div>

          <button onClick={onOpenBranches} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border border-white/5 rounded-2xl transition-all group bg-surface-dark">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">location_on</span>
              </div>
              <span className="text-sm font-medium text-gray-200">ค้นหาสาขา</span>
            </div>
            <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
          </button>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mt-6 mb-2">การตั้งค่า</h3>

          <button onClick={onOpenSettings} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border border-white/5 rounded-2xl transition-all group bg-surface-dark">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">settings</span>
              </div>
              <span className="text-sm font-medium text-gray-200">ตั้งค่าแอป</span>
            </div>
            <span className="material-symbols-outlined text-gray-600 text-[20px]">chevron_right</span>
          </button>

          <div className="pt-6">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 hover:bg-primary/20 border border-primary/20 bg-primary/10 rounded-2xl transition-all group">
              <span className="material-symbols-outlined text-primary">logout</span>
              <span className="text-sm font-bold text-primary">ออกจากระบบ</span>
            </button>
            <p className="text-center text-[10px] text-gray-600 mt-6 font-medium tracking-widest uppercase">Version 1.2.4 (Build 120)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
