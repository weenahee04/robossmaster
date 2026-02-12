"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface Manual {
  id: string;
  title: string;
  machineModel: string;
  content: string;
  videoUrl: string | null;
  checklist: string | null;
  createdAt: string;
}

const emptyForm = { title: "", machineModel: "", content: "", videoUrl: "", checklistText: "" };

export default function AdminManualsPage() {
  const { data: session } = useSession();
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Manual | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editManual, setEditManual] = useState<Manual | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");

  const fetchData = () => {
    fetch("/api/manuals")
      .then((res) => res.json())
      .then(setManuals)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditManual(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (m: Manual) => {
    setEditManual(m);
    const cl: string[] = m.checklist ? JSON.parse(m.checklist) : [];
    setForm({ title: m.title, machineModel: m.machineModel, content: m.content, videoUrl: m.videoUrl || "", checklistText: cl.join("\n") });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const checklist = form.checklistText.split("\n").map((s) => s.trim()).filter(Boolean);
    try {
      if (editManual) {
        await fetch("/api/manuals", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editManual.id, title: form.title, machineModel: form.machineModel, content: form.content, videoUrl: form.videoUrl, checklist }) });
      } else {
        await fetch("/api/manuals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.title, machineModel: form.machineModel, content: form.content, videoUrl: form.videoUrl, checklist, createdById: (session?.user as any)?.id }) });
      }
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบคู่มือนี้?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/manuals?id=${id}`, { method: "DELETE" });
      setSelected(null);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setDeleting(""); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  if (selected) {
    const checklist: string[] = selected.checklist ? JSON.parse(selected.checklist) : [];
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>กลับ
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon="edit" onClick={() => { openEdit(selected); setSelected(null); }}>แก้ไข</Button>
            <Button variant="danger" size="sm" icon="delete" isLoading={deleting === selected.id} onClick={() => handleDelete(selected.id)}>ลบ</Button>
          </div>
        </div>
        <div>
          <Badge variant="info">{selected.machineModel}</Badge>
          <h1 className="text-2xl font-black text-slate-900 mt-2">{selected.title}</h1>
        </div>
        {selected.videoUrl && (
          <Card title="วิดีโอสอน">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe src={selected.videoUrl} className="w-full h-full" allowFullScreen title={selected.title} />
            </div>
          </Card>
        )}
        <Card title="เนื้อหา">
          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">{selected.content.replace(/^# .+\n\n/, "")}</div>
        </Card>
        {checklist.length > 0 && (
          <Card title="Checklist บำรุงรักษา">
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">check_box_outline_blank</span>
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">คู่มือเครื่อง</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการ Digital Manual ทุกรุ่น</p>
        </div>
        <Button icon="add" onClick={openCreate}>เพิ่มคู่มือ</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {manuals.map((manual) => (
          <div key={manual.id} className="relative">
            <button onClick={() => setSelected(manual)} className="text-left w-full">
              <Card>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">precision_manufacturing</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{manual.title}</h3>
                    <Badge variant="neutral" className="mt-1">{manual.machineModel}</Badge>
                    <div className="flex gap-2 mt-2">
                      {manual.videoUrl && <span className="text-xs text-slate-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">play_circle</span>วิดีโอ</span>}
                      {manual.checklist && <span className="text-xs text-slate-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">checklist</span>Checklist</span>}
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          </div>
        ))}
        {manuals.length === 0 && (
          <Card className="sm:col-span-2">
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2">menu_book</span>
              <p>ยังไม่มีคู่มือ</p>
            </div>
          </Card>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editManual ? "แก้ไขคู่มือ" : "เพิ่มคู่มือ"} maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ชื่อคู่มือ" icon="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="รุ่นเครื่อง" icon="precision_manufacturing" value={form.machineModel} onChange={(e) => setForm({ ...form, machineModel: e.target.value })} required />
          <Input label="YouTube URL (ถ้ามี)" icon="play_circle" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">เนื้อหา</label>
            <textarea className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-[150px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Checklist (บรรทัดละ 1 รายการ)</label>
            <textarea className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={form.checklistText} onChange={(e) => setForm({ ...form, checklistText: e.target.value })} placeholder="ตรวจน้ำยา&#10;ตรวจแรงดัน&#10;ทำความสะอาดหัวฉีด" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button type="submit" icon="save" isLoading={saving}>{editManual ? "บันทึก" : "สร้างคู่มือ"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
