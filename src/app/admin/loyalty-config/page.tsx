"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoyaltyConfigPage() {
  const [config, setConfig] = useState({
    pointsPerBaht: "10", pointsExpireDays: "365", goldThreshold: "100",
    platinumThreshold: "500", goldMultiplier: "1.5", platinumMultiplier: "2",
    stampsForFreeWash: "10",
  });
  const [appConfig, setAppConfig] = useState({
    heroImageUrl: "", heroTitle: "", heroSubtitle: "", heroButtonText: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/loyalty-config").then(r => r.json()).then(data => {
      if (data.config) {
        setConfig({
          pointsPerBaht: String(data.config.pointsPerBaht || 10),
          pointsExpireDays: String(data.config.pointsExpireDays || 365),
          goldThreshold: String(data.config.goldThreshold || 100),
          platinumThreshold: String(data.config.platinumThreshold || 500),
          goldMultiplier: String(data.config.goldMultiplier || 1.5),
          platinumMultiplier: String(data.config.platinumMultiplier || 2),
          stampsForFreeWash: String(data.config.stampsForFreeWash || 10),
        });
      }
      if (data.appConfig) {
        setAppConfig({
          heroImageUrl: data.appConfig.heroImageUrl || "",
          heroTitle: data.appConfig.heroTitle || "",
          heroSubtitle: data.appConfig.heroSubtitle || "",
          heroButtonText: data.appConfig.heroButtonText || "",
        });
      }
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await fetch("/api/admin/loyalty-config", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, ...appConfig }),
      });
      setMsg("บันทึกสำเร็จ!");
    } catch { setMsg("เกิดข้อผิดพลาด"); }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ตั้งค่า Loyalty</h1>
        <p className="text-sm text-slate-500">กำหนดกฎการสะสมแต้ม, ระดับสมาชิก, และรูปภาพแอป</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">loyalty</span>
            กฎการสะสมแต้ม
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="ทุกกี่บาทได้ 1 แต้ม" type="number" value={config.pointsPerBaht} onChange={e => setConfig({ ...config, pointsPerBaht: e.target.value })} />
            <Input label="แต้มหมดอายุ (วัน)" type="number" value={config.pointsExpireDays} onChange={e => setConfig({ ...config, pointsExpireDays: e.target.value })} />
            <Input label="Stamp ล้างฟรี (ครั้ง)" type="number" value={config.stampsForFreeWash} onChange={e => setConfig({ ...config, stampsForFreeWash: e.target.value })} />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500">workspace_premium</span>
            ระดับสมาชิก (Tier)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="แต้มถึง Gold" type="number" value={config.goldThreshold} onChange={e => setConfig({ ...config, goldThreshold: e.target.value })} />
            <Input label="แต้มถึง Platinum" type="number" value={config.platinumThreshold} onChange={e => setConfig({ ...config, platinumThreshold: e.target.value })} />
            <Input label="ตัวคูณแต้ม Gold (เท่า)" type="number" step="0.1" value={config.goldMultiplier} onChange={e => setConfig({ ...config, goldMultiplier: e.target.value })} />
            <Input label="ตัวคูณแต้ม Platinum (เท่า)" type="number" step="0.1" value={config.platinumMultiplier} onChange={e => setConfig({ ...config, platinumMultiplier: e.target.value })} />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">image</span>
            รูปภาพ & ข้อความหน้าแอป
          </h2>
          <Input label="URL รูป Hero (หน้า Home)" value={appConfig.heroImageUrl} onChange={e => setAppConfig({ ...appConfig, heroImageUrl: e.target.value })} placeholder="https://..." />
          {appConfig.heroImageUrl && (
            <div className="h-32 rounded-lg overflow-hidden bg-slate-100">
              <img src={appConfig.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="หัวข้อ Hero" value={appConfig.heroTitle} onChange={e => setAppConfig({ ...appConfig, heroTitle: e.target.value })} />
            <Input label="ข้อความรอง" value={appConfig.heroSubtitle} onChange={e => setAppConfig({ ...appConfig, heroSubtitle: e.target.value })} />
          </div>
          <Input label="ข้อความปุ่ม" value={appConfig.heroButtonText} onChange={e => setAppConfig({ ...appConfig, heroButtonText: e.target.value })} />
        </Card>

        {msg && <p className={`text-sm font-medium ${msg.includes("สำเร็จ") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}</Button>
        </div>
      </form>
    </div>
  );
}
