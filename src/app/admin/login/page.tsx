"use client";

import { useState, useEffect, useRef } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("Roboss");
  const [csrfToken, setCsrfToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch("/api/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setLogoUrl(data.config.logoUrl || null);
          setBrandName(data.config.brandName || "Roboss");
        }
      })
      .catch(console.error);
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrfToken) return;
    setError("");
    setIsLoading(true);
    formRef.current?.submit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-20%] left-[40%] w-[600px] h-[600px] bg-red-600/[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-red-900/[0.04] rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-60" />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        {/* Left: Hero content */}
        <div className="hidden lg:flex flex-col flex-1 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mb-8 shadow-2xl shadow-red-900/40 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-3xl font-black text-white italic">R</span>
            )}
          </div>
          <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
            {brandName}<br />
            <span className="text-red-500">Admin</span> Panel
          </h2>
          <p className="text-gray-500 mt-4 text-base leading-relaxed">
            จัดการทุกสาขาจากที่เดียว ดูข้อมูลรายได้ พนักงาน และระบบ Loyalty แบบ Real-time
          </p>

          {/* Feature highlights */}
          <div className="mt-10 space-y-3">
            {[
              { icon: "store", text: "จัดการสาขาและแพ็คเกจ" },
              { icon: "account_balance", text: "ภาพรวมการเงินและ ROI" },
              { icon: "loyalty", text: "ระบบ Loyalty & คูปอง" },
              { icon: "badge", text: "จัดการ HR และเงินเดือน" },
            ].map((f) => (
              <div key={f.icon} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-[18px]">{f.icon}</span>
                </div>
                <span className="text-sm text-gray-400 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="w-full max-w-sm flex-shrink-0">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-red-900/40 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl font-black text-white italic">R</span>
              )}
            </div>
            <h1 className="text-2xl font-black text-white">{brandName}</h1>
            <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mt-1">Admin Panel</p>
          </div>

          <div className="rounded-2xl bg-[#111111] border border-white/[0.06] p-6 sm:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">เข้าสู่ระบบ</h2>
              <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลเพื่อเข้าสู่ระบบจัดการ</p>
            </div>

            <form ref={formRef} method="POST" action="/api/auth/callback/credentials" onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <input type="hidden" name="callbackUrl" value="/admin/dashboard" />

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">อีเมล</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-[18px]">mail</span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@roboss.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">รหัสผ่าน</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-[18px]">lock</span>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <span className="material-symbols-outlined text-red-400 text-[18px]">error</span>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm shadow-lg shadow-red-900/30 hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบ
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-gray-600 mt-6">
            © 2025 {brandName} Franchise System — Admin v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
