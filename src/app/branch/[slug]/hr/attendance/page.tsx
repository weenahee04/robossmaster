"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface AttendanceItem {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  hoursWorked: number | null;
  overtimeHours: number | null;
  employee: { name: string; position: string | null };
}

interface EmployeeOption {
  id: string;
  name: string;
  position: string | null;
}

export default function BranchAttendancePage() {
  const { data: session } = useSession();
  const [attendances, setAttendances] = useState<AttendanceItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employeeId: "", date: new Date().toISOString().split("T")[0], checkIn: "09:00", checkOut: "18:00", status: "PRESENT" });

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/attendance?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then((data) => { setAttendances(data.attendances); setEmployees(data.employees); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/branch/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branchId: session?.user?.branchId }),
      });
      setShowAdd(false);
      setForm({ employeeId: "", date: new Date().toISOString().split("T")[0], checkIn: "09:00", checkOut: "18:00", status: "PRESENT" });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
    PRESENT: { label: "มาทำงาน", variant: "success" },
    LATE: { label: "สาย", variant: "warning" },
    ABSENT: { label: "ขาดงาน", variant: "danger" },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">ลงเวลา</h1>
          <p className="text-sm text-slate-500 mt-1">บันทึกเข้า-ออกงาน</p>
        </div>
        <Button icon="schedule" onClick={() => setShowAdd(true)}>บันทึกเวลา</Button>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">พนักงาน</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เข้างาน</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ออกงาน</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ชั่วโมง</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600">{new Date(item.date).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{item.employee.name}</td>
                  <td className="py-3 px-4 text-slate-600">{item.checkIn ? new Date(item.checkIn).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                  <td className="py-3 px-4 text-slate-600">{item.checkOut ? new Date(item.checkOut).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                  <td className="py-3 px-4 text-slate-600">{item.hoursWorked ? `${item.hoursWorked} ชม.` : "-"}</td>
                  <td className="py-3 px-4"><Badge variant={statusMap[item.status]?.variant || "neutral"} hasDot>{statusMap[item.status]?.label || item.status}</Badge></td>
                </tr>
              ))}
              {attendances.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-400">ยังไม่มีข้อมูลลงเวลา</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="บันทึกเวลา">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">พนักงาน</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
              <option value="">เลือกพนักงาน</option>
              {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>)}
            </select>
          </div>
          <Input label="วันที่" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="เวลาเข้างาน" type="time" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
            <Input label="เวลาออกงาน" type="time" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
          </div>
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">สถานะ</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PRESENT">มาทำงาน</option>
              <option value="LATE">สาย</option>
              <option value="ABSENT">ขาดงาน</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
            <Button type="submit" icon="schedule" isLoading={saving}>บันทึก</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
