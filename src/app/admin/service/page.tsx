"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
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
  branch: { name: string };
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

export default function AdminServicePage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    fetch("/api/admin/service")
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setSaving(true);
    await fetch("/api/admin/service", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setSaving(false);
    fetchData();
  };

  const handleComment = async () => {
    if (!comment.trim() || !selected) return;
    setSaving(true);
    await fetch("/api/admin/service", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, comment, userId: (session?.user as any)?.id }),
    });
    setComment("");
    setSaving(false);
    setSelected(null);
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">แจ้งซ่อม (ทุกสาขา)</h1>
        <p className="text-sm text-slate-500 mt-1">จัดการ Service Tickets จากทุกสาขา</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["NEW", "IN_PROGRESS", "FIXED", "CLOSED"] as const).map((s) => (
          <div key={s} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-black text-slate-900">{tickets.filter((t) => t.status === s).length}</p>
            <Badge variant={statusMap[s].variant}>{statusMap[s].label}</Badge>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">{ticket.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">สาขา: {ticket.branch.name}</p>
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
              <div className="flex items-center gap-2 pt-1">
                {ticket.status === "NEW" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(ticket.id, "IN_PROGRESS")} isLoading={saving}>รับเรื่อง</Button>
                )}
                {ticket.status === "IN_PROGRESS" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(ticket.id, "FIXED")} isLoading={saving}>แก้ไขแล้ว</Button>
                )}
                {ticket.status === "FIXED" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(ticket.id, "CLOSED")} isLoading={saving}>ปิด Ticket</Button>
                )}
                <Button size="sm" variant="outline" icon="comment" onClick={() => setSelected(ticket)}>ตอบกลับ</Button>
              </div>
              {ticket.comments.length > 0 && (
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {ticket.comments.map((c) => (
                    <div key={c.id} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-600">{c.user.name}</p>
                      <p className="text-sm text-slate-700 mt-0.5">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
        {tickets.length === 0 && (
          <Card><div className="text-center py-8 text-slate-400"><span className="material-symbols-outlined text-[48px] mb-2">build</span><p>ไม่มี Ticket</p></div></Card>
        )}
      </div>

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setComment(""); }} title={`ตอบกลับ: ${selected?.title || ""}`}>
        <div className="space-y-4">
          <textarea
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="พิมพ์ข้อความ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setSelected(null); setComment(""); }}>ยกเลิก</Button>
            <Button icon="send" isLoading={saving} onClick={handleComment}>ส่ง</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
