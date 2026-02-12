"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface WashPackage {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface WashRecord {
  id: string;
  vehicleType: string;
  amount: number;
  note: string | null;
  date: string;
  package: { name: string; type: string; price: number };
}

interface PackageRevenue {
  name: string;
  count: number;
  revenue: number;
}

interface WashData {
  records: WashRecord[];
  packages: WashPackage[];
  todayCount: { CAR: number; BIKE: number; HELMET: number; total: number };
  monthCount: { CAR: number; BIKE: number; HELMET: number; total: number };
  todayRevenue: number;
  monthRevenue: number;
  packageRevenue: PackageRevenue[];
}

const typeLabel: Record<string, string> = { CAR: "รถยนต์", BIKE: "มอเตอร์ไซค์", HELMET: "หมวกกันน็อค" };
const typeIcon: Record<string, string> = { CAR: "directions_car", BIKE: "two_wheeler", HELMET: "sports_motorsports" };

export default function BranchWashPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<WashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<WashPackage | null>(null);

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/wash?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [session]);

  const handleQuickWash = async (pkg: WashPackage) => {
    setSaving(true);
    try {
      await fetch("/api/branch/wash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: session?.user?.branchId,
          packageId: pkg.id,
          vehicleType: pkg.type,
          amount: pkg.price,
          packageName: pkg.name,
          createdById: session?.user?.id,
        }),
      });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); setShowAdd(false); setSelectedPkg(null); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">บันทึก Wash</h1>
          <p className="text-sm text-slate-500 mt-1">บันทึกการล้างรถ / มอเตอร์ไซค์ / หมวกกันน็อค</p>
        </div>
        <Button icon="add" onClick={() => setShowAdd(true)}>บันทึก Wash</Button>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["CAR", "BIKE", "HELMET"] as const).map((type) => (
          <div key={type} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <span className="material-symbols-outlined text-[32px] text-primary">{typeIcon[type]}</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{data?.todayCount[type] || 0}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{typeLabel[type]} วันนี้</p>
          </div>
        ))}
        <div className="rounded-2xl border-l-4 border-l-success bg-success-light p-4 text-center">
          <span className="material-symbols-outlined text-[32px] text-success">payments</span>
          <p className="text-2xl font-black text-slate-900 mt-1">฿{(data?.todayRevenue || 0).toLocaleString()}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">รายได้วันนี้</p>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="สรุปเดือนนี้">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Wash ทั้งหมด</span>
              <span className="font-bold text-slate-900">{data?.monthCount.total || 0} คัน</span>
            </div>
            {(["CAR", "BIKE", "HELMET"] as const).map((type) => (
              <div key={type} className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">{typeIcon[type]}</span>
                  {typeLabel[type]}
                </span>
                <span className="font-semibold text-slate-800">{data?.monthCount[type] || 0}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-800">รายได้รวม</span>
              <span className="text-lg font-black text-primary">฿{(data?.monthRevenue || 0).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card title="รายได้แยกแพ็กเกจ">
          <div className="space-y-3">
            {data?.packageRevenue.map((pkg) => (
              <div key={pkg.name} className="flex justify-between items-center py-2 border-b border-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{pkg.name}</p>
                  <p className="text-xs text-slate-400">{pkg.count} ครั้ง</p>
                </div>
                <span className="font-semibold text-emerald-600">฿{pkg.revenue.toLocaleString()}</span>
              </div>
            ))}
            {(!data?.packageRevenue || data.packageRevenue.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Records */}
      <Card title="ประวัติ Wash ล่าสุด" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ประเภท</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">แพ็กเกจ</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ราคา</th>
              </tr>
            </thead>
            <tbody>
              {data?.records.slice(0, 50).map((r) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600">{new Date(r.date).toLocaleDateString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="py-3 px-4">
                    <Badge variant={r.vehicleType === "CAR" ? "primary" : r.vehicleType === "BIKE" ? "info" : "warning"}>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">{typeIcon[r.vehicleType]}</span>{typeLabel[r.vehicleType]}</span>
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-800">{r.package.name}</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-600">฿{r.amount.toLocaleString()}</td>
                </tr>
              ))}
              {(!data?.records || data.records.length === 0) && <tr><td colSpan={4} className="py-8 text-center text-slate-400">ยังไม่มีข้อมูล</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Wash Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setSelectedPkg(null); }} title="บันทึก Wash" maxWidth="md">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">เลือกแพ็กเกจเพื่อบันทึก</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data?.packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPkg?.id === pkg.id ? "border-primary bg-primary-50" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-primary">{typeIcon[pkg.type]}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{pkg.name}</p>
                    <p className="text-xs text-slate-500">{typeLabel[pkg.type]}</p>
                  </div>
                </div>
                <p className="text-lg font-black text-primary mt-2">฿{pkg.price}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); setSelectedPkg(null); }}>ยกเลิก</Button>
            <Button icon="local_car_wash" isLoading={saving} disabled={!selectedPkg} onClick={() => selectedPkg && handleQuickWash(selectedPkg)}>บันทึก</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
