"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface SopDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  videoUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

const categoryMap: Record<string, string> = {
  STAFF: "พนักงานหน้าร้าน",
  WASH_CAR: "ล้างรถยนต์",
  WASH_BIKE: "ล้างมอเตอร์ไซค์",
  OPEN_CLOSE: "เปิด-ปิดร้าน",
  SAFETY: "ความปลอดภัย",
  TROUBLESHOOT: "แก้ปัญหาเบื้องต้น",
};

const emptyForm = { title: "", category: "STAFF", content: "", videoUrl: "", sortOrder: 0, isPublished: true };

export default function AdminSopPage() {
  const { data: session } = useSession();
  const [sops, setSops] = useState<SopDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSop, setEditSop] = useState<SopDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [form, setForm] = useState(emptyForm);

  const fetchData = () => {
    fetch("/api/sop?all=true")
      .then((res) => res.json())
      .then(setSops)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditSop(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (sop: SopDoc) => {
    setEditSop(sop);
    setForm({ title: sop.title, category: sop.category, content: sop.content, videoUrl: sop.videoUrl || "", sortOrder: sop.sortOrder, isPublished: sop.isPublished });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editSop) {
        await fetch("/api/sop", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editSop.id, ...form }) });
      } else {
        await fetch("/api/sop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, createdById: (session?.user as any)?.id }) });
      }
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบ SOP นี้?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/sop?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setDeleting(""); }
  };

  const togglePublish = async (sop: SopDoc) => {
    await fetch("/api/sop", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: sop.id, isPublished: !sop.isPublished, title: sop.title, category: sop.category, content: sop.content, videoUrl: sop.videoUrl, sortOrder: sop.sortOrder }) });
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">จัดการ SOP</h1>
          <p className="text-sm text-slate-500 mt-1">สร้างและจัดการคู่มือปฏิบัติงาน + แนบวิดีโอ</p>
        </div>
        <Button icon="add" onClick={openCreate}>เพิ่ม SOP</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sops.map((sop) => (
          <Card key={sop.id}>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-800">{sop.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(sop)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                  <button onClick={() => handleDelete(sop.id)} disabled={deleting === sop.id} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-50"><span className="material-symbols-outlined text-[16px]">{deleting === sop.id ? "progress_activity" : "delete"}</span></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">{categoryMap[sop.category] || sop.category}</Badge>
                <Badge variant={sop.isPublished ? "success" : "neutral"} hasDot>{sop.isPublished ? "เผยแพร่" : "ซ่อน"}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {sop.videoUrl && <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">play_circle</span>วิดีโอ</span>}
                <span>{new Date(sop.createdAt).toLocaleDateString("th-TH")}</span>
              </div>
              <button onClick={() => togglePublish(sop)} className="text-xs text-primary hover:underline mt-1">
                {sop.isPublished ? "ซ่อน" : "เผยแพร่"}
              </button>
            </div>
          </Card>
        ))}
        {sops.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2">menu_book</span>
              <p>ยังไม่มี SOP</p>
            </div>
          </Card>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editSop ? "แก้ไข SOP" : "เพิ่ม SOP"} maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="หัวข้อ" icon="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">หมวดหมู่</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {Object.entries(categoryMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <Input label="YouTube URL (ถ้ามี)" icon="play_circle" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">เนื้อหา</label>
            <textarea className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-[200px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <Input label="ลำดับ" type="number" icon="sort" value={form.sortOrder.toString()} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button type="submit" icon="save" isLoading={saving}>{editSop ? "บันทึก" : "สร้าง SOP"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
