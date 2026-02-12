"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string | null;
  salary: number;
  status: string;
  branch: { name: string };
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  employee: { name: string };
  branch: { name: string };
}

interface PayrollRecord {
  id: string;
  month: number;
  year: number;
  totalPay: number;
  status: string;
  employee: { name: string };
  branch: { name: string };
}

interface HRData {
  employees: Employee[];
  totalActive: number;
  totalResigned: number;
  attendance: AttendanceRecord[];
  presentCount: number;
  lateCount: number;
  absentCount: number;
  payroll: PayrollRecord[];
  totalPayrollThisMonth: number;
  branches: { id: string; name: string }[];
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  PRESENT: { label: "มาทำงาน", variant: "success" },
  LATE: { label: "สาย", variant: "warning" },
  ABSENT: { label: "ขาด", variant: "danger" },
};

export default function AdminHRPage() {
  const [data, setData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState("");
  const [tab, setTab] = useState<"employees" | "attendance" | "payroll">("employees");

  const fetchData = (branchId?: string) => {
    setLoading(true);
    const params = branchId ? `?branchId=${branchId}` : "";
    fetch(`/api/admin/hr${params}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(branchFilter || undefined);
  }, [branchFilter]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">ภาพรวม HR</h1>
        <p className="text-sm text-slate-500 mt-1">ข้อมูลพนักงาน ลงเวลา เงินเดือน ทุกสาขา</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border-l-4 border-l-success bg-success-light p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">พนักงานทำงาน</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{data?.totalActive || 0}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-danger bg-danger-light p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ลาออก</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{data?.totalResigned || 0}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-warning bg-warning-light p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">สาย (เดือนนี้)</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{data?.lateCount || 0}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-info bg-info-light p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">เงินเดือนรวม</p>
          <p className="text-2xl font-black text-slate-900 mt-1">฿{(data?.totalPayrollThisMonth || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Filter + Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(["employees", "attendance", "payroll"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${tab === t ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
            >
              {t === "employees" ? "พนักงาน" : t === "attendance" ? "ลงเวลา" : "เงินเดือน"}
            </button>
          ))}
        </div>
        <select
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">ทุกสาขา</option>
          {data?.branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Employees Tab */}
      {tab === "employees" && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ชื่อ</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ตำแหน่ง</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขา</th>
                  <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เงินเดือน</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {data?.employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{emp.name}</td>
                    <td className="py-3 px-4 text-slate-600">{emp.position}</td>
                    <td className="py-3 px-4 text-slate-600">{emp.branch.name}</td>
                    <td className="py-3 px-4 text-right text-slate-800">฿{emp.salary.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant={emp.status === "ACTIVE" ? "success" : "danger"} hasDot>
                        {emp.status === "ACTIVE" ? "ทำงาน" : "ลาออก"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!data?.employees || data.employees.length === 0) && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">ไม่มีข้อมูล</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Attendance Tab */}
      {tab === "attendance" && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">พนักงาน</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขา</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เข้างาน</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ออกงาน</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {data?.attendance.map((att) => (
                  <tr key={att.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(att.date).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{att.employee.name}</td>
                    <td className="py-3 px-4 text-slate-600">{att.branch.name}</td>
                    <td className="py-3 px-4 text-slate-600">{att.checkIn || "-"}</td>
                    <td className="py-3 px-4 text-slate-600">{att.checkOut || "-"}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusMap[att.status]?.variant || "neutral"} hasDot>
                        {statusMap[att.status]?.label || att.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!data?.attendance || data.attendance.length === 0) && (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-400">ไม่มีข้อมูล</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Payroll Tab */}
      {tab === "payroll" && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เดือน/ปี</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">พนักงาน</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขา</th>
                  <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ยอดจ่าย</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {data?.payroll.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-600">{p.month}/{p.year}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{p.employee.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.branch.name}</td>
                    <td className="py-3 px-4 text-right text-slate-800">฿{p.totalPay.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant={p.status === "PAID" ? "success" : "warning"}>
                        {p.status === "PAID" ? "จ่ายแล้ว" : "รอจ่าย"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!data?.payroll || data.payroll.length === 0) && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">ไม่มีข้อมูล</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
