"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface LeaveItem {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: string;
  employee: { name: string; position: string | null };
}

interface EmployeeOption {
  id: string;
  name: string;
}

export default function BranchLeavePage() {
  const { data: session } = useSession();
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employeeId: "", type: "SICK", startDate: "", endDate: "", reason: "" });

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/leave?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then((data) => { setLeaves(data.leaveRequests); setEmployees(data.employees); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/branch/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branchId: session?.user?.branchId }),
      });
      setShowAdd(false);
      setForm({ employeeId: "", type: "SICK", startDate: "", endDate: "", reason: "" });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleApprove = async (id: string, status: string) => {
    try {
      await fetch("/api/branch/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, approvedById: session?.user?.id }),
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const typeMap: Record<string, string> = { SICK: "ลาป่วย", PERSONAL: "ลากิจ", VACATION: "ลาพักร้อน" };
  const statusMap: Record<string, { label: string; variant: "warning" | "success" | "danger" }> = {
    PENDING: { label: "รออนุมัติ", variant: "warning" },
    APPROVED: { label: "อนุมัติ", variant: "success" },
    REJECTED: { label: "ปฏิเสธ", variant: "danger" },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">ลางาน</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการคำขอลางาน</p>
        </div>
        <Button icon="event_busy" onClick={() => setShowAdd(true)}>ขอลางาน</Button>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">พนักงาน</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ประเภท</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เหตุผล</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">{item.employee.name}</td>
                  <td className="py-3 px-4"><Badge variant="info">{typeMap[item.type] || item.type}</Badge></td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(item.startDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                    {" - "}
                    {new Date(item.endDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{item.reason || "-"}</td>
                  <td className="py-3 px-4">
                    <Badge variant={statusMap[item.status]?.variant || "neutral"} hasDot>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.status === "PENDING" && (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleApprove(item.id, "APPROVED")} className="p-1.5 rounded-lg text-success hover:bg-success-light transition-all" title="อนุมัติ">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        </button>
                        <button onClick={() => handleApprove(item.id, "REJECTED")} className="p-1.5 rounded-lg text-danger hover:bg-danger-light transition-all" title="ปฏิเสธ">
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-400">ยังไม่มีคำขอลางาน</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="ขอลางาน">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">พนักงาน</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
              <option value="">เลือกพนักงาน</option>
              {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ประเภทการลา</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="SICK">ลาป่วย</option>
              <option value="PERSONAL">ลากิจ</option>
              <option value="VACATION">ลาพักร้อน</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="วันที่เริ่ม" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <Input label="วันที่สิ้นสุด" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <Input label="เหตุผล" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
            <Button type="submit" icon="event_busy" isLoading={saving}>ส่งคำขอ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
