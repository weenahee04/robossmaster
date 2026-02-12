"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface WashPkg {
  id: string;
  name: string;
  type: string;
  price: number;
  isActive: boolean;
  createdAt: string;
}

const typeMap: Record<string, { label: string; icon: string; color: string }> = {
  CAR: { label: "รถยนต์", icon: "directions_car", color: "bg-blue-50 text-blue-600" },
  BIKE: { label: "มอเตอร์ไซค์", icon: "two_wheeler", color: "bg-emerald-50 text-emerald-600" },
  HELMET: { label: "หมวกกันน็อค", icon: "sports_motorsports", color: "bg-amber-50 text-amber-600" },
};

const emptyForm = { name: "", type: "CAR", price: "" };

export default function AdminWashPackagesPage() {
  const [packages, setPackages] = useState<WashPkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState<WashPkg | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");

  const fetchData = () => {
    fetch("/api/admin/wash-packages")
      .then((res) => res.json())
      .then(setPackages)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditPkg(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: WashPkg) => { setEditPkg(p); setForm({ name: p.name, type: p.type, price: p.price.toString() }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPkg) {
        await fetch("/api/admin/wash-packages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editPkg.id, ...form }) });
      } else {
        await fetch("/api/admin/wash-packages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบแพ็คเกจนี้?")) return;
    setDeleting(id);
    try { await fetch(`/api/admin/wash-packages?id=${id}`, { method: "DELETE" }); fetchData(); }
    catch (err) { console.error(err); }
    finally { setDeleting(""); }
  };

  const toggleActive = async (p: WashPkg) => {
    await fetch("/api/admin/wash-packages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, isActive: !p.isActive }) });
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  const grouped = { CAR: packages.filter((p) => p.type === "CAR"), BIKE: packages.filter((p) => p.type === "BIKE"), HELMET: packages.filter((p) => p.type === "HELMET") };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">แพ็คเกจล้าง (กลาง)</h1>
          <p className="text-sm text-slate-500 mt-1">กำหนดแพ็คเกจและราคากลางสำหรับทุกสาขา</p>
        </div>
        <Button icon="add" onClick={openCreate}>เพิ่มแพ็คเกจ</Button>
      </div>

      {(["CAR", "BIKE", "HELMET"] as const).map((type) => (
        <div key={type}>
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
            <span className={`material-symbols-outlined text-[20px] ${typeMap[type].color} p-1.5 rounded-lg`}>{typeMap[type].icon}</span>
            {typeMap[type].label}
          </h2>
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
                    <button onClick={() => handleDelete(pkg.id)} disabled={deleting === pkg.id} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-50"><span className="material-symbols-outlined text-[16px]">{deleting === pkg.id ? "progress_activity" : "delete"}</span></button>
                  </div>
                </div>
              </Card>
            ))}
            {grouped[type].length === 0 && (
              <div className="text-sm text-slate-400 py-4">ยังไม่มีแพ็คเกจ</div>
            )}
          </div>
        </div>
      ))}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editPkg ? "แก้ไขแพ็คเกจ" : "เพิ่มแพ็คเกจ"} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ชื่อแพ็คเกจ" icon="local_car_wash" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="เช่น ล้างรถยนต์ทั่วไป" />
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
