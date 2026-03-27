'use client';

import { useState, useMemo, useCallback } from 'react';
import { CAR_BRANDS, CAR_MODELS, CAR_COLORS } from '@/lib/car-images';
import CarImage from '@/components/loyalty/CarImage';

interface VehicleSetupPageProps {
  onSave: (data: { make: string; model: string; color: string; year: string; licensePlate: string }) => Promise<void>;
  onSkip: () => void;
  editData?: { make: string; model?: string; color?: string; year?: string; licensePlate: string };
  title?: string;
}

type Step = 'brand' | 'model' | 'color' | 'details';

export default function VehicleSetupPage({ onSave, onSkip, editData, title }: VehicleSetupPageProps) {
  const [step, setStep] = useState<Step>(editData ? 'details' : 'brand');
  const [make, setMake] = useState(editData?.make || '');
  const [model, setModel] = useState(editData?.model || '');
  const [color, setColor] = useState(editData?.color || '');
  const [year, setYear] = useState(editData?.year || '');
  const [licensePlate, setLicensePlate] = useState(editData?.licensePlate || '');
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredBrands = useMemo(() => {
    if (!brandSearch) return CAR_BRANDS;
    const q = brandSearch.toLowerCase();
    return CAR_BRANDS.filter(b => b.name.toLowerCase().includes(q) || b.id.includes(q));
  }, [brandSearch]);

  const availableModels = useMemo(() => {
    const models = CAR_MODELS[make.toLowerCase()] || [];
    if (!modelSearch) return models;
    const q = modelSearch.toLowerCase();
    return models.filter(m => m.toLowerCase().includes(q));
  }, [make, modelSearch]);

  const handleSelectBrand = useCallback((brandId: string, brandName: string) => {
    setMake(brandName);
    setModel('');
    setModelSearch('');
    if (brandId === 'other') {
      setStep('details');
    } else {
      setStep('model');
    }
  }, []);

  const handleSelectModel = useCallback((m: string) => {
    setModel(m);
    setStep('color');
  }, []);

  const handleSelectColor = useCallback((colorId: string) => {
    setColor(colorId);
    setStep('details');
  }, []);

  const handleSave = useCallback(async () => {
    if (!make || !licensePlate.trim()) return;
    setSaving(true);
    try {
      await onSave({ make, model, color, year, licensePlate: licensePlate.trim() });
    } finally {
      setSaving(false);
    }
  }, [make, model, color, year, licensePlate, onSave]);

  const stepTitles: Record<Step, string> = {
    brand: 'เลือกยี่ห้อรถ',
    model: 'เลือกรุ่นรถ',
    color: 'เลือกสีรถ',
    details: 'ข้อมูลรถ',
  };

  const canGoBack = step !== 'brand' || editData;

  const goBack = () => {
    if (step === 'details' && color) { setStep('color'); return; }
    if (step === 'color') { setStep('model'); return; }
    if (step === 'model') { setStep('brand'); return; }
    if (step === 'brand' && editData) onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
      <header className="flex items-center gap-3 px-4 pt-14 pb-4">
        {canGoBack && (
          <button onClick={goBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">{title || stepTitles[step]}</h1>
          <p className="text-xs text-gray-500">
            {step === 'brand' && 'เลือกยี่ห้อรถของคุณ'}
            {step === 'model' && `${make} — เลือกรุ่น`}
            {step === 'color' && `${make} ${model} — เลือกสี`}
            {step === 'details' && 'กรอกทะเบียนรถ'}
          </p>
        </div>
        {!editData && (
          <button onClick={onSkip} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 font-medium border border-white/10">
            ข้ามไปก่อน
          </button>
        )}
      </header>

      {/* Progress bar */}
      <div className="px-4 pb-4">
        <div className="flex gap-1.5">
          {(['brand', 'model', 'color', 'details'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                i <= ['brand', 'model', 'color', 'details'].indexOf(step) ? 'bg-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Car preview when make is set */}
      {make && step !== 'brand' && (
        <div className="px-4 mb-4">
          <div className="relative w-full h-40 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 overflow-hidden flex items-center justify-center">
            <CarImage make={make} model={model || undefined} color={color || undefined} className="h-32 w-full" />
            <div className="absolute bottom-2 left-3 text-xs text-gray-400 font-medium">
              {make} {model} {color && `• ${CAR_COLORS.find(c => c.id === color)?.name || color}`}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-32 scrollbar-hide">
        {/* Step: Brand */}
        {step === 'brand' && (
          <>
            <div className="mb-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">search</span>
                <input
                  type="text"
                  placeholder="ค้นหายี่ห้อ..."
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-gray-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {filteredBrands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => handleSelectBrand(brand.id, brand.name)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-primary/30 active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                    {brand.id !== 'other' ? (
                      <img
                        src={`https://carimagesapi.com/brand-logo?make=${encodeURIComponent(brand.name)}`}
                        alt={brand.name}
                        className="w-9 h-9 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-sm font-bold text-primary">${brand.icon}</span>`; }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-primary">{brand.icon}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">{brand.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step: Model */}
        {step === 'model' && (
          <>
            <div className="mb-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">search</span>
                <input
                  type="text"
                  placeholder="ค้นหารุ่น..."
                  value={modelSearch}
                  onChange={e => setModelSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-gray-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              {availableModels.map(m => (
                <button
                  key={m}
                  onClick={() => handleSelectModel(m)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                    model === m
                      ? 'border-primary/50 bg-primary/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-medium">{m}</span>
                </button>
              ))}
              {availableModels.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-3">ไม่พบรุ่นรถ</p>
                  <button
                    onClick={() => { setModel(modelSearch || 'อื่นๆ'); setStep('color'); }}
                    className="px-4 py-2 bg-primary/20 text-primary text-sm font-bold rounded-xl"
                  >
                    พิมพ์รุ่นเอง
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step: Color */}
        {step === 'color' && (
          <div className="grid grid-cols-5 gap-3">
            {CAR_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectColor(c.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${
                  color === c.id
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    color === c.id ? 'border-primary scale-110 shadow-lg' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[10px] text-gray-400 font-medium">{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step: Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">ทะเบียนรถ *</label>
              <input
                type="text"
                placeholder="กข 1234"
                value={licensePlate}
                onChange={e => setLicensePlate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white text-base font-medium focus:outline-none focus:border-primary/50 placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">ปีรถ (ไม่จำเป็น)</label>
              <input
                type="text"
                placeholder="2024"
                value={year}
                onChange={e => setYear(e.target.value)}
                maxLength={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white text-base font-medium focus:outline-none focus:border-primary/50 placeholder:text-gray-600"
              />
            </div>

            {make && (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                <span className="material-symbols-outlined text-primary">directions_car</span>
                <div className="text-sm text-gray-300">
                  <span className="font-bold text-white">{make}</span> {model && `${model}`} {color && `• ${CAR_COLORS.find(c => c.id === color)?.name || color}`}
                </div>
                <button onClick={() => setStep('brand')} className="ml-auto text-xs text-primary font-bold">เปลี่ยน</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom action */}
      {step === 'details' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-8">
          <button
            onClick={handleSave}
            disabled={!make || !licensePlate.trim() || saving}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-primary/25"
          >
            {saving ? 'กำลังบันทึก...' : editData ? 'บันทึกการแก้ไข' : 'เพิ่มรถของฉัน'}
          </button>
        </div>
      )}
    </div>
  );
}
