"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface PayrollItem {
  id: string;
  month: number;
  year: number;
  baseSalary: number;
  overtimePay: number;
  deductions: number;
  totalPay: number;
  status: string;
  paidAt: string | null;
  employee: { name: string; position: string | null };
}

interface EmployeeOption {
  id: string;
  name: string;
  position: string | null;
  salary: number;
}

export default function BranchPayrollPage() {
  const { data: session } = useSession();
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [marking, setMarking] = useState("");

  const now = new Date();
  const [form, setForm] = useState({
    employeeId: "",
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    baseSalary: "",
    overtimePay: "0",
    deductions: "0",
  });

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/payroll?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then((data) => {
        setPayrolls(data.payrolls || []);
        setEmployees(data.employees || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleSelectEmployee = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    setForm({ ...form, employeeId: empId, baseSalary: emp ? String(emp.salary) : "" });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/branch/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId: session?.user?.branchId, ...form }),
      });
      setShowCreate(false);
      setForm({ employeeId: "", month: String(now.getMonth() + 1), year: String(now.getFullYear()), baseSalary: "", overtimePay: "0", deductions: "0" });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleMarkPaid = async (id: string) => {
    setMarking(id);
    try {
      await fetch("/api/branch/payroll", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "PAID" }),
      });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setMarking(""); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  const monthNames = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const totalCalc = (parseFloat(form.baseSalary || "0") + parseFloat(form.overtimePay || "0") - parseFloat(form.deductions || "0"));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">เงินเดือน</h1>
          <p className="text-sm text-slate-500 mt-1">ประวัติการจ่ายเงินเดือน</p>
        </div>
        <Button icon="add" onClick={() => setShowCreate(true)}>สร้างรายการเงินเดือน</Button>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เดือน/ปี</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">พนักงาน</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เงินเดือน</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">OT</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">หัก</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">รวม</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600">{monthNames[item.month]} {item.year + 543}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{item.employee.name}</td>
                  <td className="py-3 px-4 text-right text-slate-600">฿{item.baseSalary.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-600">+฿{item.overtimePay.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-600">-฿{item.deductions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-800">฿{item.totalPay.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Badge variant={item.status === "PAID" ? "success" : "warning"} hasDot>
                      {item.status === "PAID" ? "จ่ายแล้ว" : "รอจ่าย"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {item.status === "PENDING" && (
                      <Button size="sm" variant="success" icon="check" isLoading={marking === item.id} onClick={() => handleMarkPaid(item.id)}>
                        จ่ายแล้ว
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-slate-400">ยังไม่มีข้อมูลเงินเดือน</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Payroll Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="สร้างรายการเงินเดือน" maxWidth="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">พนักงาน</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={form.employeeId}
              onChange={(e) => handleSelectEmployee(e.target.value)}
              required
            >
              <option value="">-- เลือกพนักงาน --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name} {emp.position ? `(${emp.position})` : ""}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">เดือน</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
              >
                {monthNames.slice(1).map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <Input label="ปี (ค.ศ.)" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="เงินเดือน" type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} required />
            <Input label="ค่าล่วงเวลา" type="number" value={form.overtimePay} onChange={(e) => setForm({ ...form, overtimePay: e.target.value })} />
            <Input label="หักเงิน" type="number" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-right">
            <span className="text-sm text-slate-500">รวมสุทธิ: </span>
            <span className="text-lg font-bold text-slate-800">฿{totalCalc.toLocaleString()}</span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>ยกเลิก</Button>
            <Button type="submit" icon="save" isLoading={saving}>บันทึก</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
