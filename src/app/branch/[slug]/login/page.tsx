"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function BranchLoginPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [siteBrandName, setSiteBrandName] = useState("Roboss");
  const [csrfToken, setCsrfToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch(`/api/branches/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setBranchName(data.name);
      })
      .catch(() => {});
    fetch("/api/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setLogoUrl(data.config.logoUrl || null);
          setSiteBrandName(data.config.brandName || "Roboss");
        }
      })
      .catch(console.error);
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(console.error);
  }, [slug]);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-4 relative overflow-hidden">
      {/* Background bubbles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {[
          { cx: "10%", cy: "20%", r: 40, dur: "6s", op: 0.06 },
          { cx: "85%", cy: "15%", r: 30, dur: "7s", op: 0.05 },
          { cx: "70%", cy: "75%", r: 50, dur: "8s", op: 0.04 },
          { cx: "20%", cy: "80%", r: 35, dur: "5s", op: 0.06 },
          { cx: "50%", cy: "50%", r: 25, dur: "9s", op: 0.03 },
        ].map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#3b82f6" opacity={b.op}>
            <animate attributeName="r" values={`${b.r};${b.r + 8};${b.r}`} dur={b.dur} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Decorative corner waves */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-lg shadow-primary/20 animate-pulse-glow">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-white text-[32px]">
                local_car_wash
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900">{siteBrandName}</h1>
          {branchName && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-primary-50 rounded-full">
              <span className="material-symbols-outlined text-primary text-[14px]">store</span>
              <p className="text-sm font-semibold text-primary">{branchName}</p>
            </div>
          )}
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">เข้าสู่ระบบสาขา</h2>

          <form
            ref={formRef}
            method="POST"
            action="/api/auth/callback/credentials"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value={`/branch/${slug}/dashboard`} />
            <Input
              label="อีเมล"
              type="email"
              icon="mail"
              placeholder="branch@roboss.com"
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
          © 2025 {siteBrandName} Franchise System
        </p>
      </div>
    </div>
  );
}
