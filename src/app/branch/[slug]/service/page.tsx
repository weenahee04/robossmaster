"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface TicketComment {
  id: string;
  message: string;
  createdAt: string;
  user: { name: string };
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  machineModel: string | null;
  createdAt: string;
  comments: TicketComment[];
}

const statusMap: Record<string, { label: string; variant: "warning" | "info" | "success" | "neutral" }> = {
  NEW: { label: "ใหม่", variant: "warning" },
  IN_PROGRESS: { label: "กำลังดำเนินการ", variant: "info" },
  FIXED: { label: "แก้ไขแล้ว", variant: "success" },
  CLOSED: { label: "ปิด", variant: "neutral" },
};
const categoryMap: Record<string, string> = {
  MACHINE_ERROR: "เครื่องไม่ทำงาน",
  WATER_ISSUE: "น้ำไม่ออก",
  ELECTRICAL: "ไฟ error",
  NOISE: "เสียงผิดปกติ",
  OTHER: "อื่นๆ",
};
const priorityMap: Record<string, { label: string; variant: "danger" | "warning" | "info" | "neutral" }> = {
  URGENT: { label: "ด่วนมาก", variant: "danger" },
  HIGH: { label: "สูง", variant: "warning" },
  MEDIUM: { label: "ปานกลาง", variant: "info" },
  LOW: { label: "ต่ำ", variant: "neutral" },
};

export default function BranchServicePage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "MACHINE_ERROR", priority: "MEDIUM", machineModel: "" });

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/service?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/branch/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branchId: session?.user?.branchId }),
      });
      setShowAdd(false);
      setForm({ title: "", description: "", category: "MACHINE_ERROR", priority: "MEDIUM", machineModel: "" });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">แจ้งซ่อม</h1>
          <p className="text-sm text-slate-500 mt-1">แจ้งปัญหาเครื่องจักรและอุปกรณ์</p>
        </div>
        <Button icon="build" onClick={() => setShowAdd(true)}>แจ้งปัญหา</Button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">{ticket.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{ticket.description}</p>
                </div>
                <Badge variant={statusMap[ticket.status]?.variant || "neutral"} hasDot>
                  {statusMap[ticket.status]?.label || ticket.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant={priorityMap[ticket.priority]?.variant || "neutral"}>
                  {priorityMap[ticket.priority]?.label || ticket.priority}
                </Badge>
                <Badge variant="info">{categoryMap[ticket.category] || ticket.category}</Badge>
                {ticket.machineModel && <Badge variant="neutral">{ticket.machineModel}</Badge>}
              </div>
              <p className="text-xs text-slate-400">
                {new Date(ticket.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
              {ticket.comments.length > 0 && (
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {ticket.comments.map((c) => (
                    <div key={c.id} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-600">{c.user.name}</p>
                      <p className="text-sm text-slate-700 mt-0.5">{c.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(c.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
        {tickets.length === 0 && (
          <Card><div className="text-center py-8 text-slate-400"><span className="material-symbols-outlined text-[48px] mb-2">build</span><p>ยังไม่มีรายการแจ้งซ่อม</p></div></Card>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="แจ้งปัญหา" maxWidth="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="หัวข้อ" icon="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">รายละเอียด</label>
            <textarea className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ประเภท</label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.entries(categoryMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ความเร่งด่วน</label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {Object.entries(priorityMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <Input label="รุ่นเครื่อง" value={form.machineModel} onChange={(e) => setForm({ ...form, machineModel: e.target.value })} placeholder="เช่น Karcher HD 5/15" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
            <Button type="submit" icon="send" isLoading={saving}>ส่งแจ้งปัญหา</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
