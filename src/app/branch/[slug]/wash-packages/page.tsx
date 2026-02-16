"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface WashPkg {
  id: string;
  name: string;
  type: string;
  price: number;
  isActive: boolean;
}

const typeMap: Record<string, { label: string; icon: string; color: string }> = {
  CAR: { label: "รถยนต์", icon: "directions_car", color: "bg-blue-50 text-blue-600" },
  BIKE: { label: "มอเตอร์ไซค์", icon: "two_wheeler", color: "bg-emerald-50 text-emerald-600" },
  HELMET: { label: "หมวกกันน็อค", icon: "sports_motorsports", color: "bg-amber-50 text-amber-600" },
};

const emptyForm = { name: "", type: "CAR", price: "" };

export default function BranchWashPackagesPage() {
  const { data: session } = useSession();
  const branchId = session?.user?.branchId;

  const [branchPkgs, setBranchPkgs] = useState<WashPkg[]>([]);
  const [globalPkgs, setGlobalPkgs] = useState<WashPkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState<WashPkg | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    if (!branchId) return;
    Promise.all([
      fetch(`/api/branch/wash-packages?branchId=${branchId}`).then((r) => r.json()),
      fetch(`/api/branch/wash?branchId=${branchId}`).then((r) => r.json()),
    ])
      .then(([branchData, washData]) => {
        setBranchPkgs(Array.isArray(branchData) ? branchData : []);
        setGlobalPkgs(Array.isArray(washData.packages) ? washData.packages : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [branchId]);

  const openCreate = () => { setEditPkg(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: WashPkg) => { setEditPkg(p); setForm({ name: p.name, type: p.type, price: p.price.toString() }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPkg) {
        await fetch("/api/branch/wash-packages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editPkg.id, ...form }) });
      } else {
        await fetch("/api/branch/wash-packages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ branchId, ...form }) });
      }
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบแพ็คเกจนี้?")) return;
    try { await fetch(`/api/branch/wash-packages?id=${id}`, { method: "DELETE" }); fetchData(); }
    catch (err) { console.error(err); }
  };

  const toggleActive = async (p: WashPkg) => {
    await fetch("/api/branch/wash-packages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, isActive: !p.isActive }) });
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  const grouped = { CAR: branchPkgs.filter((p) => p.type === "CAR"), BIKE: branchPkgs.filter((p) => p.type === "BIKE"), HELMET: branchPkgs.filter((p) => p.type === "HELMET") };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">แพ็คเกจสาขา</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการแพ็คเกจเฉพาะสาขา (นอกเหนือจากแพ็คเกจกลาง)</p>
        </div>
        <Button icon="add" onClick={openCreate}>เพิ่มแพ็คเกจสาขา</Button>
      </div>

      {/* Global Packages Info */}
      <Card className="bg-blue-50/50 border-blue-100">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-500 text-[24px]">public</span>
          <div>
            <p className="text-sm font-bold text-slate-800">แพ็คเกจกลาง ({globalPkgs.length} รายการ)</p>
            <p className="text-xs text-slate-500 mt-0.5">แพ็คเกจที่ Admin กำหนดมา ใช้ได้ทุกสาขา — ไม่สามารถแก้ไขได้</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {globalPkgs.map((g: any) => (
                <span key={g.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs border border-blue-100">
                  <span className="material-symbols-outlined text-[14px] text-blue-500">{typeMap[g.type]?.icon || "local_car_wash"}</span>
                  {g.name} — ฿{g.price}
                </span>
              ))}
              {globalPkgs.length === 0 && <span className="text-xs text-slate-400">ยังไม่มีแพ็คเกจกลาง</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Branch-specific Packages */}
      <div>
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-[20px]">store</span>
          แพ็คเกจเฉพาะสาขา ({branchPkgs.length} รายการ)
        </h2>

        {(["CAR", "BIKE", "HELMET"] as const).map((type) => (
          grouped[type].length > 0 && (
            <div key={type} className="mb-4">
              <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-[18px] ${typeMap[type].color} p-1 rounded-lg`}>{typeMap[type].icon}</span>
                {typeMap[type].label}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[type].map((pkg) => (
                  <Card key={pkg.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800">{pkg.name}</h3>
                        <p className="text-lg font-black text-primary mt-1">฿{pkg.price.toLocaleString()}</p>
                        <Badge variant={pkg.isActive ? "success" : "neutral"} hasDot className="mt-1">{pkg.isActive ? "เปิดใช้" : "ปิด"}</Badge>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => openEdit(pkg)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                        <button onClick={() => toggleActive(pkg)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-600"><span className="material-symbols-outlined text-[16px]">{pkg.isActive ? "visibility_off" : "visibility"}</span></button>
                        <button onClick={() => handleDelete(pkg.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        ))}

        {branchPkgs.length === 0 && (
          <Card className="p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-slate-300">local_car_wash</span>
            <p className="text-slate-500 mt-2">ยังไม่มีแพ็คเกจเฉพาะสาขา</p>
            <p className="text-slate-400 text-xs mt-1">กดปุ่ม &quot;เพิ่มแพ็คเกจสาขา&quot; เพื่อสร้างแพ็คเกจราคาหรือชื่อเฉพาะสาขา</p>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editPkg ? "แก้ไขแพ็คเกจ" : "เพิ่มแพ็คเกจสาขา"} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ชื่อแพ็คเกจ" icon="local_car_wash" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="เช่น ล้างรถยนต์พิเศษ" />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ประเภท</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="CAR">รถยนต์</option>
              <option value="BIKE">มอเตอร์ไซค์</option>
              <option value="HELMET">หมวกกันน็อค</option>
            </select>
          </div>
          <Input label="ราคา (บาท)" type="number" icon="payments" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button type="submit" icon="save" isLoading={saving}>{editPkg ? "บันทึก" : "สร้างแพ็คเกจ"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
