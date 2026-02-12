"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function InvestorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
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
    setLoading(true);
    formRef.current?.submit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-float" />
      <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-blue-400/30 rounded-full animate-float-delay" />
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-float-slow" />

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative z-10">
        {/* Left: Chart illustration (hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-center flex-1">
          <div className="w-full max-w-xs animate-float-slow">
            <img src="/roboss-logo.png" alt="Roboss" className="w-full h-auto drop-shadow-2xl rounded-full" />
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">ติดตามผลตอบแทนการลงทุนแบบ Real-time</p>
        </div>

        {/* Right: Login Form */}
        <div className="w-full max-w-md flex-1">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-600/30 shadow-lg shadow-black/20">
              <span className="material-symbols-outlined text-primary text-[32px]">trending_up</span>
            </div>
            <h1 className="text-2xl font-black text-white">ROBOSS</h1>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Investor Portal</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-6">เข้าสู่ระบบนักลงทุน</h2>
            <form ref={formRef} method="POST" action="/api/auth/callback/credentials" onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <input type="hidden" name="callbackUrl" value="/investor/dashboard" />
              <Input label="อีเมล" type="email" icon="mail" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="รหัสผ่าน" type="password" icon="lock" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <span className="material-symbols-outlined text-red-400 text-[18px]">error</span>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" isLoading={loading}>เข้าสู่ระบบ</Button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            © 2025 Roboss Franchise System
          </p>
        </div>
      </div>
    </div>
  );
}
