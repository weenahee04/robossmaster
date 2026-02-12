"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

interface ExpenseItem {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  category: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

export default function BranchExpensePage() {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ amount: "", categoryId: "", description: "", date: new Date().toISOString().split("T")[0] });

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/expense?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then((data) => { setExpenses(data.expenses); setCategories(data.categories); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/branch/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branchId: session?.user?.branchId, createdById: session?.user?.id }),
      });
      setShowAdd(false);
      setForm({ amount: "", categoryId: "", description: "", date: new Date().toISOString().split("T")[0] });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">รายจ่าย</h1>
          <p className="text-sm text-slate-500 mt-1">บันทึกและดูประวัติรายจ่าย</p>
        </div>
        <Button icon="add" onClick={() => setShowAdd(true)}>เพิ่มรายจ่าย</Button>
      </div>

      <div className="rounded-2xl border-l-4 border-l-danger bg-danger-light p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">รายจ่ายทั้งหมด</p>
        <p className="text-2xl font-black text-slate-900 mt-1">฿{total.toLocaleString()}</p>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">หมวดหมู่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">รายละเอียด</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600">{new Date(item.date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="py-3 px-4"><Badge variant="warning">{item.category?.name || "-"}</Badge></td>
                  <td className="py-3 px-4 text-slate-600">{item.description || "-"}</td>
                  <td className="py-3 px-4 text-right font-semibold text-red-600">-฿{item.amount.toLocaleString()}</td>
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400">ยังไม่มีรายจ่าย</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="เพิ่มรายจ่าย">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="จำนวนเงิน (บาท)" type="number" icon="payments" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">หมวดหมู่</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="รายละเอียด" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="วันที่" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
            <Button type="submit" icon="add" isLoading={saving}>บันทึก</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
