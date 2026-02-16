"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface ThemeData {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
  portalPrimary: string;
  portalBg: string;
  fontFamily: string;
  logoUrl: string | null;
  brandName: string | null;
  tagline: string | null;
  presetId: string | null;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
  portalPrimary: string;
  portalBg: string;
  fontFamily: string;
}

interface FontOption {
  value: string;
  label: string;
  url: string;
}

const defaultTheme: ThemeData = {
  primaryColor: "#FF4B5C",
  secondaryColor: "#D62D42",
  backgroundColor: "#000000",
  surfaceColor: "#111111",
  textColor: "#FFFFFF",
  accentColor: "#F9D423",
  portalPrimary: "#CC0000",
  portalBg: "#FFFFFF",
  fontFamily: "Kanit",
  logoUrl: null,
  brandName: null,
  tagline: null,
  presetId: "roboss-classic",
};

const colorFields = [
  { key: "primaryColor", label: "สีหลัก", desc: "ปุ่ม, ลิงก์, accent" },
  { key: "secondaryColor", label: "สีรอง", desc: "gradient, hover" },
  { key: "backgroundColor", label: "พื้นหลัง", desc: "พื้นหลังหน้าจอ" },
  { key: "surfaceColor", label: "พื้นหลังการ์ด", desc: "card, panel" },
  { key: "textColor", label: "สีตัวอักษร", desc: "ข้อความหลัก" },
  { key: "accentColor", label: "สี Accent", desc: "ไฮไลท์, badge" },
  { key: "portalPrimary", label: "สี Portal หลัก", desc: "sidebar Branch Portal" },
];

export default function BranchThemePage() {
  const { data: session } = useSession();
  const branchId = session?.user?.branchId;

  const [theme, setTheme] = useState<ThemeData>(defaultTheme);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [fonts, setFonts] = useState<FontOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!branchId) return;
    Promise.all([
      fetch(`/api/branch/theme?branchId=${branchId}`).then((r) => r.json()),
      fetch("/api/branch/theme/presets").then((r) => r.json()),
    ])
      .then(([themeData, presetsData]) => {
        if (themeData && themeData.id) {
          setTheme({ ...defaultTheme, ...themeData });
        }
        setPresets(presetsData.presets || []);
        setFonts(presetsData.fonts || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [branchId]);

  const handleSave = async () => {
    if (!branchId) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/branch/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId, ...theme }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!branchId) return;
    await fetch(`/api/branch/theme?branchId=${branchId}`, { method: "DELETE" });
    setTheme(defaultTheme);
    setShowReset(false);
  };

  const applyPreset = (preset: Preset) => {
    setTheme((prev) => ({
      ...prev,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      backgroundColor: preset.backgroundColor,
      surfaceColor: preset.surfaceColor,
      textColor: preset.textColor,
      accentColor: preset.accentColor,
      portalPrimary: preset.portalPrimary,
      portalBg: preset.portalBg,
      fontFamily: preset.fontFamily,
      presetId: preset.id,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) { alert("ไฟล์ใหญ่เกินไป (สูงสุด 500KB)"); return; }
    const reader = new FileReader();
    reader.onload = () => setTheme((prev) => ({ ...prev, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">ตั้งค่า Theme</h1>
          <p className="text-sm text-slate-500 mt-1">ปรับแต่งสี โลโก้ และฟอนต์ของสาขา — มีผลทั้ง Branch Portal และ Loyalty App</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>บันทึกแล้ว
            </span>
          )}
          <Button variant="outline" icon="restart_alt" onClick={() => setShowReset(true)}>รีเซ็ต</Button>
          <Button icon="save" onClick={handleSave} isLoading={saving}>บันทึก Theme</Button>
        </div>
      </div>

      {/* Preset Gallery */}
      <Card title="ธีมสำเร็จรูป" subtitle="เลือก preset แล้วปรับแต่งเพิ่มเติมได้">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`relative rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02] ${
                theme.presetId === preset.id ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {theme.presetId === preset.id && (
                <span className="absolute top-2 right-2 material-symbols-outlined text-primary text-[16px] filled">check_circle</span>
              )}
              {/* Mini preview */}
              <div className="w-full h-16 rounded-lg overflow-hidden mb-2 flex" style={{ background: preset.backgroundColor }}>
                <div className="w-1/3 h-full flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full" style={{ background: preset.primaryColor }} />
                </div>
                <div className="w-1/3 h-full flex items-center justify-center">
                  <div className="w-4 h-4 rounded" style={{ background: preset.accentColor }} />
                </div>
                <div className="w-1/3 h-full flex flex-col items-center justify-center gap-1">
                  <div className="w-8 h-1 rounded" style={{ background: preset.textColor, opacity: 0.8 }} />
                  <div className="w-6 h-1 rounded" style={{ background: preset.textColor, opacity: 0.4 }} />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800">{preset.name}</p>
              <p className="text-[10px] text-slate-500">{preset.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Colors */}
        <Card title="สี" subtitle="ปรับสีแต่ละส่วน">
          <div className="space-y-3">
            {colorFields.map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={(theme as any)[field.key]}
                  onChange={(e) => setTheme((prev) => ({ ...prev, [field.key]: e.target.value, presetId: null }))}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{field.label}</p>
                  <p className="text-[10px] text-slate-400">{field.desc}</p>
                </div>
                <code className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                  {(theme as any)[field.key]}
                </code>
              </div>
            ))}
          </div>
        </Card>

        {/* Branding + Font */}
        <div className="space-y-6">
          <Card title="โลโก้สาขา">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                {theme.logoUrl ? (
                  <img src={theme.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-slate-300 text-[36px]">image</span>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400">PNG, JPG, SVG — สูงสุด 500KB</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" icon="upload" onClick={() => fileRef.current?.click()}>เลือกไฟล์</Button>
                  {theme.logoUrl && (
                    <Button variant="outline" size="sm" icon="delete" onClick={() => setTheme((prev) => ({ ...prev, logoUrl: null }))}>ลบ</Button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          </Card>

          <Card title="ข้อมูลแบรนด์">
            <div className="space-y-3">
              <Input label="ชื่อสาขา (แสดงใน Loyalty App)" icon="badge" value={theme.brandName || ""} onChange={(e) => setTheme((prev) => ({ ...prev, brandName: e.target.value || null }))} placeholder="เช่น ROBOSS Rama9" />
              <Input label="Tagline" icon="format_quote" value={theme.tagline || ""} onChange={(e) => setTheme((prev) => ({ ...prev, tagline: e.target.value || null }))} placeholder="เช่น AUTOMATIC CAR WASH" />
            </div>
          </Card>

          <Card title="ฟอนต์">
            <div className="space-y-3">
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                value={theme.fontFamily}
                onChange={(e) => setTheme((prev) => ({ ...prev, fontFamily: e.target.value }))}
              >
                {fonts.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400">ฟอนต์จะมีผลกับ Loyalty App ของสาขา</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Live Preview */}
      <Card title="ตัวอย่าง Loyalty App" subtitle="แสดงผลตาม theme ที่ตั้งค่า">
        <div className="flex justify-center">
          <div
            className="w-[320px] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl"
            style={{ background: theme.backgroundColor, color: theme.textColor, fontFamily: `'${theme.fontFamily}', sans-serif` }}
          >
            {/* Status bar mock */}
            <div className="h-6 flex items-center justify-between px-4 text-[10px] opacity-50">
              <span>9:41</span>
              <span>●●●</span>
            </div>

            {/* Header */}
            <div className="px-5 pt-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}>
                    {theme.logoUrl ? (
                      <img src={theme.logoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : "R"}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{theme.brandName || "ROBOSS"}</p>
                    <p className="text-[10px] opacity-50">{theme.tagline || "AUTOMATIC CAR WASH"}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: theme.surfaceColor }}>
                  <span className="text-xs">🔔</span>
                </div>
              </div>
            </div>

            {/* Points Card */}
            <div className="mx-5 rounded-2xl p-4 mb-4"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}>
              <p className="text-[10px] opacity-80">แต้มสะสม</p>
              <p className="text-2xl font-bold">1,250</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white/80 w-3/5" />
              </div>
              <p className="text-[9px] mt-1 opacity-70">อีก 250 แต้มถึง Gold</p>
            </div>

            {/* Stamp Card */}
            <div className="mx-5 rounded-xl p-3 mb-4" style={{ background: theme.surfaceColor }}>
              <p className="text-[10px] font-bold mb-2">Stamp Card</p>
              <div className="flex gap-1.5">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px]"
                    style={{ background: i <= 5 ? theme.primaryColor : `${theme.textColor}10`, color: i <= 5 ? "#fff" : theme.textColor }}>
                    {i <= 5 ? "✓" : i}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mx-5 grid grid-cols-3 gap-2 mb-4">
              {["🎁 รางวัล", "📦 แพ็คเกจ", "📍 สาขา"].map((item) => (
                <div key={item} className="rounded-xl p-2 text-center text-[10px]" style={{ background: theme.surfaceColor }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Bottom Nav */}
            <div className="flex justify-around py-3 border-t" style={{ borderColor: `${theme.textColor}10`, background: theme.surfaceColor }}>
              {["🏠", "📦", "📍", "📜", "👤"].map((icon, i) => (
                <span key={i} className="text-sm" style={{ opacity: i === 0 ? 1 : 0.4 }}>{icon}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Reset Modal */}
      <Modal isOpen={showReset} onClose={() => setShowReset(false)} title="รีเซ็ต Theme" maxWidth="sm">
        <p className="text-sm text-slate-600 mb-4">ต้องการรีเซ็ต theme กลับเป็นค่าเริ่มต้น (Roboss Classic)?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowReset(false)}>ยกเลิก</Button>
          <Button icon="restart_alt" onClick={handleReset}>รีเซ็ต</Button>
        </div>
      </Modal>
    </div>
  );
}
