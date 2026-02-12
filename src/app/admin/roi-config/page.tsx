"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface RoiConfigData {
  depreciationRate: number;
  adminFeePercent: number;
  targetRoiPercent: number;
  targetPaybackMonths: number;
  includePayrollInCost: boolean;
}

export default function AdminRoiConfigPage() {
  const [config, setConfig] = useState<RoiConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/roi-config")
      .then((res) => res.json())
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/roi-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">ตั้งค่าสูตร ROI</h1>
        <p className="text-sm text-slate-500 mt-1">กำหนดค่าคงที่สำหรับคำนวณ ROI ทุกสาขา</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="ค่าคงที่ในการคำนวณ">
          <div className="space-y-4">
            <Input
              label="ค่าเสื่อมราคา (%/ปี)"
              type="number"
              icon="trending_down"
              value={config.depreciationRate.toString()}
              onChange={(e) => setConfig({ ...config, depreciationRate: parseFloat(e.target.value) || 0 })}
              helperText="หักค่าเสื่อมจากเงินลงทุนเริ่มต้นต่อปี"
            />
            <Input
              label="ค่าบริหาร (%)"
              type="number"
              icon="account_balance"
              value={config.adminFeePercent.toString()}
              onChange={(e) => setConfig({ ...config, adminFeePercent: parseFloat(e.target.value) || 0 })}
              helperText="หักค่าบริหารจากรายได้รวม"
            />
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="includePayroll"
                checked={config.includePayrollInCost}
                onChange={(e) => setConfig({ ...config, includePayrollInCost: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="includePayroll" className="text-sm text-slate-700">
                รวมเงินเดือนพนักงานในต้นทุน
              </label>
            </div>
          </div>
        </Card>

        <Card title="เป้าหมาย">
          <div className="space-y-4">
            <Input
              label="เป้า ROI (%/ปี)"
              type="number"
              icon="flag"
              value={config.targetRoiPercent.toString()}
              onChange={(e) => setConfig({ ...config, targetRoiPercent: parseFloat(e.target.value) || 0 })}
              helperText="เป้าหมายผลตอบแทนต่อปี"
            />
            <Input
              label="เป้าคืนทุน (เดือน)"
              type="number"
              icon="schedule"
              value={config.targetPaybackMonths.toString()}
              onChange={(e) => setConfig({ ...config, targetPaybackMonths: parseInt(e.target.value) || 0 })}
              helperText="เป้าหมายจำนวนเดือนที่คืนทุน"
            />
          </div>
        </Card>
      </div>

      <Card title="ตัวอย่างสูตรคำนวณ">
        <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-slate-700 space-y-2 font-mono break-all sm:break-normal">
          <p>กำไรสุทธิ = รายได้ - รายจ่าย - ค่าบริหาร({config.adminFeePercent}% ของรายได้){config.includePayrollInCost ? " - เงินเดือน" : ""}</p>
          <p>ค่าเสื่อม/ปี = เงินลงทุน × {config.depreciationRate}%</p>
          <p>ROI = (กำไรสุทธิ × 12 / เงินลงทุน) × 100</p>
          <p>เป้า ROI: {config.targetRoiPercent}%/ปี | เป้าคืนทุน: {config.targetPaybackMonths} เดือน</p>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <Button icon="save" isLoading={saving} onClick={handleSave}>บันทึกการตั้งค่า</Button>
        {saved && (
          <span className="text-sm text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            บันทึกแล้ว
          </span>
        )}
      </div>
    </div>
  );
}
