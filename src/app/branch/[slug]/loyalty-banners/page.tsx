"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

export default function LoyaltyBannersPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const branchId = session?.user?.branchId;

  const [banners, setBanners] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", imageUrl: "", linkUrl: "", tag: "" });

  const fetchBanners = () => {
    if (!branchId) return;
    fetch(`/api/branch/loyalty-banners?branchId=${branchId}`).then(r => r.json()).then(data => {
      setBanners(Array.isArray(data) ? data : []);
    }).catch(console.error);
  };

  useEffect(() => { fetchBanners(); }, [branchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PATCH" : "POST";
    const body = editId ? { id: editId, ...form } : { branchId, ...form };
    await fetch("/api/branch/loyalty-banners", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false);
    setEditId(null);
    setForm({ title: "", subtitle: "", imageUrl: "", linkUrl: "", tag: "" });
    fetchBanners();
  };

  const handleEdit = (b: any) => {
    setEditId(b.id);
    setForm({ title: b.title, subtitle: b.subtitle || "", imageUrl: b.imageUrl, linkUrl: b.linkUrl || "", tag: b.tag || "" });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบแบนเนอร์นี้?")) return;
    await fetch(`/api/branch/loyalty-banners?id=${id}`, { method: "DELETE" });
    fetchBanners();
  };

  const toggleActive = async (b: any) => {
    await fetch("/api/branch/loyalty-banners", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, isActive: !b.isActive }),
    });
    fetchBanners();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">แบนเนอร์ Loyalty</h1>
          <p className="text-sm text-slate-500">จัดการแบนเนอร์โปรโมชั่นสำหรับแอป Loyalty ของสาขา</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ title: "", subtitle: "", imageUrl: "", linkUrl: "", tag: "" }); setShowModal(true); }}>
          <span className="material-symbols-outlined text-[18px] mr-1">add</span>
          เพิ่มแบนเนอร์
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((b: any) => (
          <Card key={b.id} className="p-0 overflow-hidden">
            <div className="h-40 bg-slate-100 relative">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              {b.tag && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{b.tag}</span>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={b.isActive ? "success" : "neutral"}>
                  {b.isActive ? "แสดง" : "ซ่อน"}
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900">{b.title}</h3>
                {b.subtitle && <p className="text-xs text-slate-500">{b.subtitle}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(b)}>แก้ไข</Button>
                <Button size="sm" variant="outline" onClick={() => toggleActive(b)}>{b.isActive ? "ซ่อน" : "แสดง"}</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(b.id)}>ลบ</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card className="p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-slate-300">image</span>
          <p className="text-slate-500 mt-2">ยังไม่มีแบนเนอร์ กดปุ่ม "เพิ่มแบนเนอร์" เพื่อเริ่มต้น</p>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? "แก้ไขแบนเนอร์" : "เพิ่มแบนเนอร์ใหม่"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="หัวข้อ" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Input label="ข้อความรอง" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
          <Input label="URL รูปภาพ" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://..." />
          {form.imageUrl && (
            <div className="h-32 rounded-lg overflow-hidden bg-slate-100">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <Input label="ลิงก์ (ถ้ามี)" value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} />
          <Input label="แท็ก (เช่น NEW, HOT)" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>ยกเลิก</Button>
            <Button type="submit">{editId ? "บันทึก" : "เพิ่มแบนเนอร์"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
