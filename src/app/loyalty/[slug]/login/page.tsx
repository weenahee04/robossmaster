'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Smartphone, ChevronRight } from 'lucide-react';
import { api } from '@/lib/loyalty-api';
import { useAuth } from '@/lib/loyalty-auth-context';

const useThemeColors = () => {
  const { themeData } = useAuth();
  return {
    primary: themeData?.primaryColor || '#FF4B5C',
    secondary: themeData?.secondaryColor || '#D62D42',
    bg: themeData?.backgroundColor || '#000000',
    accent: themeData?.accentColor || '#F9D423',
    text: themeData?.textColor || '#FFFFFF',
    brandName: themeData?.brandName || 'ROBOSS',
    tagline: themeData?.tagline || 'AUTOMATIC CAR WASH',
    logoUrl: themeData?.logoUrl,
  };
};

export default function LoyaltyLoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { setCustomer, branchInfo } = useAuth();
  const tc = useThemeColors();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempPhone, setTempPhone] = useState('');

  const handleSendOTP = async () => {
    if (!phone || phone.length < 9) {
      setError('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }
    setError('');
    setIsLoading(true);
    setTempPhone(phone);
    setTimeout(() => {
      setStep('otp');
      setIsLoading(false);
    }, 500);
  };

  const handleVerifyOTP = async () => {
    if (otp !== '1234') {
      setError('รหัส OTP ไม่ถูกต้อง (ใช้ 1234)');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const data = await api.getCustomer(tempPhone, slug);
      if (data.error === 'Customer not found') {
        setStep('register');
        setIsLoading(false);
        return;
      }
      setCustomer(data);
      router.push(`/loyalty/${slug}`);
    } catch {
      setStep('register');
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('กรุณากรอกชื่อ');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const data = await api.registerCustomer({ phone: tempPhone, name });
      if (data.error === 'Phone already registered') {
        setCustomer(data.customer);
      } else {
        setCustomer(data);
      }
      router.push(`/loyalty/${slug}`);
    } catch (e) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full blur-[100px]" style={{ background: `${tc.primary}33` }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full blur-[100px]" style={{ background: `${tc.accent}1A` }}></div>

      <div className="flex-1 flex flex-col justify-center px-10 space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl" style={{ background: tc.primary }}>
            {tc.logoUrl ? (
              <img src={tc.logoUrl} alt="Logo" className="w-full h-full rounded-[2rem] object-cover" />
            ) : (
              <span className="text-4xl font-black text-white italic">R</span>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{tc.brandName}</h1>
            <p className="text-gray-400 text-lg">{tc.tagline}</p>
            {branchInfo?.name && (
              <p className="text-sm font-bold px-3 py-1 rounded-full w-fit" style={{ color: tc.primary, background: `${tc.primary}1A` }}>
                สาขา {branchInfo.name}
              </p>
            )}
          </div>
        </div>

        {step === 'phone' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">เบอร์โทรศัพท์</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-roboss-red transition-colors" size={20} />
                <input
                  type="tel"
                  placeholder="0XX-XXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white text-lg focus:outline-none focus:border-roboss-red focus:ring-1 focus:ring-roboss-red/50 transition-all font-mono"
                />
              </div>
            </div>
            {error && <p className="text-sm" style={{ color: tc.primary }}>{error}</p>}
            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${tc.primary}, ${tc.secondary})` }}
            >
              {isLoading ? 'กำลังส่ง...' : <>ขอรหัส OTP <ChevronRight size={20} /></>}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">รหัส OTP (ส่งไปที่ {tempPhone})</label>
              <input
                type="text"
                placeholder="กรอกรหัส 4 หลัก"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-2xl text-center focus:outline-none focus:border-roboss-red focus:ring-1 focus:ring-roboss-red/50 transition-all font-mono tracking-[1em]"
              />
              <p className="text-gray-600 text-xs text-center mt-2">Mock OTP: ใช้รหัส <span className="font-bold" style={{ color: tc.primary }}>1234</span></p>
            </div>
            {error && <p className="text-sm" style={{ color: tc.primary }}>{error}</p>}
            <button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${tc.primary}, ${tc.secondary})` }}
            >
              {isLoading ? 'กำลังตรวจสอบ...' : <>ยืนยัน <ChevronRight size={20} /></>}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="w-full text-gray-500 text-sm py-2">
              เปลี่ยนเบอร์โทร
            </button>
          </div>
        )}

        {step === 'register' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold ml-1">ชื่อของคุณ</label>
              <input
                type="text"
                placeholder="กรอกชื่อ-นามสกุล"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-lg focus:outline-none focus:border-roboss-red focus:ring-1 focus:ring-roboss-red/50 transition-all"
              />
            </div>
            <p className="text-gray-500 text-xs">เบอร์: {tempPhone} — สมัครสมาชิกใหม่</p>
            {error && <p className="text-sm" style={{ color: tc.primary }}>{error}</p>}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${tc.primary}, ${tc.secondary})` }}
            >
              {isLoading ? 'กำลังสมัคร...' : <>สมัครสมาชิก <ChevronRight size={20} /></>}
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">หรือเข้าสู่ระบบด้วย</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <div className="flex gap-4 w-full">
            <button className="flex-1 bg-[#06C755] border border-[#06C755]/30 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#06C755]/90 transition-colors text-white font-bold text-sm">
              LINE Login
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 text-center text-gray-600 text-xs">
        การเข้าสู่ระบบแสดงว่าคุณยอมรับ <span className="text-gray-400 underline">เงื่อนไขการใช้บริการ</span> และ <span className="text-gray-400 underline">นโยบายความเป็นส่วนตัว</span>
      </div>
    </div>
  );
}
