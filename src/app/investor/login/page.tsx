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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary">ROBOSS</h1>
          <p className="text-slate-500 mt-2">Investor Portal</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">เข้าสู่ระบบนักลงทุน</h2>
          <form ref={formRef} method="POST" action="/api/auth/callback/credentials" onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value="/investor/dashboard" />
            <Input label="อีเมล" type="email" icon="mail" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="รหัสผ่าน" type="password" icon="lock" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" isLoading={loading}>เข้าสู่ระบบ</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
