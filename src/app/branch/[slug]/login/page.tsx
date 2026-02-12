"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function BranchLoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [siteBrandName, setSiteBrandName] = useState("Roboss");

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
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();

      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          callbackUrl: `/branch/${slug}/dashboard`,
        }),
        redirect: "manual",
      });

      if (res.type === "opaqueredirect" || res.status === 302 || res.status === 200) {
        window.location.href = `/branch/${slug}/dashboard`;
        return;
      }

      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
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
            <p className="text-sm text-slate-500 mt-1">{branchName}</p>
          )}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">เข้าสู่ระบบสาขา</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="อีเมล"
              type="email"
              icon="mail"
              placeholder="branch@roboss.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="รหัสผ่าน"
              type="password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
