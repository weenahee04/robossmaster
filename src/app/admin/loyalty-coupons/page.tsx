"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface CouponTemplate {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  type: string;
  value: number;
  pointsCost: number;
  maxRedemptions: number | null;
  currentRedemptions: number;
  validDays: number;
  isActive: boolean;
  expiresAt: string | null;
  branch: { name: string; slug: string } | null;
}

export default function LoyaltyCouponsPage() {
  const [templates, setTemplates] = useState<CouponTemplate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", imageUrl: "", type: "DISCOUNT_AMOUNT",
    value: "", pointsCost: "", maxRedemptions: "", validDays: "30",
  });

  const fetchData = () => {
    fetch("/api/admin/loyalty-coupons").then(r => r.json()).then(setTemplates).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PATCH" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/admin/loyalty-coupons", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false);
    setEditId(null);
    setForm({ name: "", description: "", imageUrl: "", type: "DISCOUNT_AMOUNT", value: "", pointsCost: "", maxRedemptions: "", validDays: "30" });
    fetchData();
  };

  const handleEdit = (t: CouponTemplate) => {
    setEditId(t.id);
    setForm({
      name: t.name, description: t.description || "", imageUrl: t.imageUrl || "",
      type: t.type, value: String(t.value), pointsCost: String(t.pointsCost),
      maxRedemptions: t.maxRedemptions ? String(t.maxRedemptions) : "", validDays: String(t.validDays),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบคูปองนี้?")) return;
    await fetch(`/api/admin/loyalty-coupons?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const toggleActive = async (t: CouponTemplate) => {
    await fetch("/api/admin/loyalty-coupons", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, isActive: !t.isActive }),
    });
    fetchData();
  };

  const typeLabels: Record<string, string> = {
    DISCOUNT_AMOUNT: "ส่วนลด (บาท)", DISCOUNT_PERCENT: "ส่วนลด (%)", FREE_WASH: "ล้างฟรี",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">คูปอง Loyalty</h1>
          <p className="text-sm text-slate-500">จัดการคูปองสำหรับระบบสะสมแต้ม</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ name: "", description: "", imageUrl: "", type: "DISCOUNT_AMOUNT", value: "", pointsCost: "", maxRedemptions: "", validDays: "30" }); setShowModal(true); }}>
          <span className="material-symbols-outlined text-[18px] mr-1">add</span>
          สร้างคูปอง
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <Card key={t.id} className="p-0 overflow-hidden">
            {t.imageUrl && (
              <div className="h-32 bg-slate-100">
                <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  {t.description && <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>}
                </div>
                <Badge variant={t.isActive ? "success" : "neutral"}>
                  {t.isActive ? "เปิดใช้" : "ปิด"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400">ประเภท</span>
                  <p className="font-semibold text-slate-700">{typeLabels[t.type] || t.type}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400">มูลค่า</span>
                  <p className="font-semibold text-slate-700">{t.value} {t.type === "DISCOUNT_PERCENT" ? "%" : t.type === "FREE_WASH" ? "ครั้ง" : "บาท"}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400">แต้มที่ใช้แลก</span>
                  <p className="font-semibold text-primary">{t.pointsCost} แต้ม</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-400">แลกแล้ว</span>
                  <p className="font-semibold text-slate-700">{t.currentRedemptions}{t.maxRedemptions ? `/${t.maxRedemptions}` : ""}</p>
                </div>
              </div>
              {t.branch && <p className="text-[10px] text-slate-400">สาขา: {t.branch.name}</p>}
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => handleEdit(t)}>แก้ไข</Button>
                <Button size="sm" variant="outline" onClick={() => toggleActive(t)}>{t.isActive ? "ปิด" : "เปิด"}</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>ลบ</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-slate-300">confirmation_number</span>
          <p className="text-slate-500 mt-2">ยังไม่มีคูปอง กดปุ่ม "สร้างคูปอง" เพื่อเริ่มต้น</p>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? "แก้ไขคูปอง" : "สร้างคูปองใหม่"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ชื่อคูปอง" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="คำอธิบาย" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="URL รูปภาพ" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ประเภท</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="DISCOUNT_AMOUNT">ส่วนลด (บาท)</option>
              <option value="DISCOUNT_PERCENT">ส่วนลด (%)</option>
              <option value="FREE_WASH">ล้างฟรี</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="มูลค่า" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            <Input label="แต้มที่ใช้แลก" type="number" value={form.pointsCost} onChange={(e) => setForm({ ...form, pointsCost: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="จำกัดจำนวน (ว่าง=ไม่จำกัด)" type="number" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })} />
            <Input label="อายุคูปอง (วัน)" type="number" value={form.validDays} onChange={(e) => setForm({ ...form, validDays: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>ยกเลิก</Button>
            <Button type="submit">{editId ? "บันทึก" : "สร้างคูปอง"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
