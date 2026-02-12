"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface Employee {
  id: string;
  name: string;
  position: string | null;
  phone: string | null;
  email: string | null;
  salary: number;
  startDate: string | null;
  status: string;
}

export default function BranchEmployeesPage() {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", position: "", phone: "", email: "", salary: "", startDate: "" });

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/employees?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then(setEmployees)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/branch/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branchId: session?.user?.branchId }),
      });
      setShowAdd(false);
      setForm({ name: "", position: "", phone: "", email: "", salary: "", startDate: "" });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  const active = employees.filter((e) => e.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">พนักงาน</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการพนักงานในสาขา ({active} คนที่ทำงานอยู่)</p>
        </div>
        <Button icon="person_add" onClick={() => setShowAdd(true)}>เพิ่มพนักงาน</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((emp) => (
          <Card key={emp.id}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 text-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold">{emp.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 truncate">{emp.name}</h3>
                  <Badge variant={emp.status === "ACTIVE" ? "success" : "neutral"} hasDot>
                    {emp.status === "ACTIVE" ? "ทำงาน" : "ลาออก"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{emp.position || "-"}</p>
                {emp.phone && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">phone</span>{emp.phone}
                  </p>
                )}
                <p className="text-sm font-semibold text-primary mt-2">฿{emp.salary.toLocaleString()}/เดือน</p>
              </div>
            </div>
          </Card>
        ))}
        {employees.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2">group</span>
              <p>ยังไม่มีพนักงาน</p>
            </div>
          </Card>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="เพิ่มพนักงาน">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="ชื่อ-นามสกุล" icon="person" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="ตำแหน่ง" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="เบอร์โทร" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="อีเมล" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="เงินเดือน (บาท)" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            <Input label="วันเริ่มงาน" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
            <Button type="submit" icon="person_add" isLoading={saving}>บันทึก</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
