"use client";

import { useEffect, useState, useRef } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface SiteConfigData {
  id: string;
  logoUrl: string | null;
  brandName: string;
}

export default function AdminSiteConfigPage() {
  const [config, setConfig] = useState<SiteConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setBrandName(data.brandName || "Roboss");
        setLogoPreview(data.logoUrl || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("ไฟล์ใหญ่เกินไป (สูงสุด 500KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setLogoFile(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile("__REMOVE__");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload: Record<string, string | null> = { brandName };
      if (logoFile === "__REMOVE__") {
        payload.logoUrl = null;
      } else if (logoFile) {
        payload.logoUrl = logoFile;
      }

      const res = await fetch("/api/admin/site-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        setLogoFile(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingCar />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">ตั้งค่าเว็บไซต์</h1>
          <p className="text-sm text-slate-500 mt-1">เปลี่ยน Logo และชื่อแบรนด์ที่แสดงทั่วทั้งระบบ</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>บันทึกแล้ว
            </span>
          )}
          <Button icon="save" onClick={handleSave} isLoading={saving}>บันทึก</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logo */}
        <Card title="Logo">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              {/* Preview */}
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-slate-300 text-[40px]">image</span>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">อัพโหลดรูป Logo (PNG, JPG, SVG)</p>
                <p className="text-xs text-slate-400">ขนาดแนะนำ 200x200px, สูงสุด 500KB</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" icon="upload" onClick={() => fileRef.current?.click()}>
                    เลือกไฟล์
                  </Button>
                  {logoPreview && (
                    <Button variant="outline" size="sm" icon="delete" onClick={handleRemoveLogo}>
                      ลบ
                    </Button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          </div>
        </Card>

        {/* Brand Name */}
        <Card title="ชื่อแบรนด์">
          <div className="space-y-4">
            <Input
              label="ชื่อแบรนด์"
              icon="badge"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Roboss"
            />
            <p className="text-xs text-slate-400">ชื่อนี้จะแสดงใน Sidebar, หน้า Login และทั่วทั้งระบบ</p>

            {/* Live Preview */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">ตัวอย่าง Sidebar</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden bg-primary shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <img src="/roboss-logo.png" alt="Roboss" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{brandName || "Roboss"}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Admin Panel</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
