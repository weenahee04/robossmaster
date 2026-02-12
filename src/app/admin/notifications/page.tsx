"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  branch: { name: string };
}

interface BranchOption {
  id: string;
  name: string;
}

const typeMap: Record<string, { label: string; variant: "danger" | "warning" | "info" | "primary" }> = {
  INCOME_DROP: { label: "รายได้ลด", variant: "danger" },
  MACHINE_DOWN: { label: "เครื่องเสีย", variant: "danger" },
  EXPENSE_HIGH: { label: "ค่าใช้จ่ายสูง", variant: "warning" },
  ABSENT_FREQUENT: { label: "ขาดงานบ่อย", variant: "warning" },
  GENERAL: { label: "ทั่วไป", variant: "info" },
  ANNOUNCEMENT: { label: "ประกาศ", variant: "primary" },
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSend, setShowSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ branchId: "ALL", type: "ANNOUNCEMENT", title: "", message: "" });

  const fetchData = () => {
    fetch("/api/admin/notifications")
      .then((res) => res.json())
      .then((data) => { setNotifications(data.notifications); setBranches(data.branches); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setShowSend(false);
        setForm({ branchId: "ALL", type: "ANNOUNCEMENT", title: "", message: "" });
        fetchData();
        setTimeout(() => setSent(false), 3000);
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">แจ้งเตือน</h1>
          <p className="text-sm text-slate-500 mt-1">ส่งแจ้งเตือนถึงสาขาย่อย</p>
        </div>
        <div className="flex items-center gap-3">
          {sent && (
            <span className="text-sm text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>ส่งแล้ว
            </span>
          )}
          <Button icon="send" onClick={() => setShowSend(true)}>ส่งแจ้งเตือน</Button>
        </div>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขา</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ประเภท</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">หัวข้อ</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ข้อความ</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{n.branch.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant={typeMap[n.type]?.variant || "info"}>{typeMap[n.type]?.label || n.type}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{n.title}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{n.message}</td>
                  <td className="py-3 px-4">
                    <Badge variant={n.isRead ? "neutral" : "warning"} hasDot>{n.isRead ? "อ่านแล้ว" : "ยังไม่อ่าน"}</Badge>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">ไม่มีแจ้งเตือน</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showSend} onClose={() => setShowSend(false)} title="ส่งแจ้งเตือน" maxWidth="md">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ส่งถึง</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
              <option value="ALL">ทุกสาขา</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ประเภท</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.entries(typeMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <Input label="หัวข้อ" icon="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ข้อความ</label>
            <textarea className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowSend(false)}>ยกเลิก</Button>
            <Button type="submit" icon="send" isLoading={sending}>ส่งแจ้งเตือน</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
