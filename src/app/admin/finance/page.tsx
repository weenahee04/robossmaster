"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface FinanceItem {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  branch: { name: string };
  category: { name: string } | null;
}

interface FinanceData {
  incomes: FinanceItem[];
  expenses: FinanceItem[];
  branches: { id: string; name: string }[];
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export default function AdminFinancePage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState("");
  const [tab, setTab] = useState<"income" | "expense">("income");

  const fetchData = (branchId?: string) => {
    setLoading(true);
    const params = branchId ? `?branchId=${branchId}` : "";
    fetch(`/api/admin/finance${params}`)
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
        <LoadingCar />
      </div>
    );
  }

  const items = tab === "income" ? data?.incomes : data?.expenses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">การเงิน</h1>
        <p className="text-sm text-slate-500 mt-1">ดูรายรับรายจ่ายทุกสาขา</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border-l-4 border-l-success bg-success-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">รายรับรวม</p>
          <p className="text-2xl font-black text-slate-900 mt-1">฿{(data?.totalIncome || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-danger bg-danger-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">รายจ่ายรวม</p>
          <p className="text-2xl font-black text-slate-900 mt-1">฿{(data?.totalExpense || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-info bg-info-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">กำไร/ขาดทุน</p>
          <p className={`text-2xl font-black mt-1 ${(data?.profit || 0) >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            ฿{(data?.profit || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter + Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setTab("income")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${tab === "income" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
          >
            รายรับ
          </button>
          <button
            onClick={() => setTab("expense")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${tab === "expense" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
          >
            รายจ่าย
          </button>
        </div>
        <select
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">ทุกสาขา</option>
          {data?.branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขา</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">หมวดหมู่</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">รายละเอียด</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(item.date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{item.branch.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant={tab === "income" ? "success" : "warning"}>{item.category?.name || "-"}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{item.description || "-"}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">฿{item.amount.toLocaleString()}</td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">ไม่มีข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
