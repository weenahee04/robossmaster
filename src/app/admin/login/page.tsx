"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    // Fetch CSRF token
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(console.error);
  }, []);

  // Check URL for error param (NextAuth redirects back with ?error=)
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
    // Submit as native form POST — browser handles cookies + redirect
    formRef.current?.submit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50/30 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/4 left-10 w-3 h-3 bg-primary/20 rounded-full animate-float" />
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-blue-400/20 rounded-full animate-float-delay" />
      <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-primary/10 rounded-full animate-float-slow" />

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative z-10">
        {/* Left: Illustration (hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-center flex-1">
          <div className="w-full max-w-xs animate-float-slow">
            <img src="/roboss-logo.png" alt="Roboss" className="w-full h-auto drop-shadow-2xl rounded-full" />
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">จัดการทุกสาขาจากที่เดียว</p>
        </div>

        {/* Right: Login Form */}
        <div className="w-full max-w-md flex-1">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-lg shadow-primary/20 animate-pulse-glow">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <img src="/roboss-logo.png" alt="Roboss" className="w-full h-full object-cover" />
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900">{brandName}</h1>
            <p className="text-sm text-slate-500 mt-1">ระบบจัดการสำนักงานใหญ่</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6">เข้าสู่ระบบ Admin</h2>

          <form
            ref={formRef}
            method="POST"
            action="/api/auth/callback/credentials"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value="/admin/dashboard" />
            <Input
              label="อีเมล"
              type="email"
              icon="mail"
              placeholder="admin@roboss.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              required
            />
            <Input
              label="รหัสผ่าน"
              type="password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
            />

            {error && (
              <div className="flex items-center gap-2 p-3 bg-danger-light rounded-lg">
                <span className="material-symbols-outlined text-danger text-[18px]">
                  error
                </span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              icon="login"
            >
              เข้าสู่ระบบ
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2025 {brandName} Franchise System
        </p>
        </div>
      </div>
    </div>
  );
}
