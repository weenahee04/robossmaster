"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface ReportData {
  monthlyData: Array<{ month: string; income: number; expense: number; profit: number }>;
  categoryIncome: Array<{ name: string; total: number }>;
  categoryExpense: Array<{ name: string; total: number }>;
  totalIncome: number;
  totalExpense: number;
}

const COLORS = ["#CC0000", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function BranchReportsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/reports?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  const profit = (data?.totalIncome || 0) - (data?.totalExpense || 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">รายงาน</h1>
        <p className="text-sm text-slate-500 mt-1">สรุปรายรับรายจ่าย กำไร/ขาดทุน</p>
      </div>

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
          <p className={`text-2xl font-black mt-1 ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>฿{profit.toLocaleString()}</p>
        </div>
      </div>

      <Card title="รายรับ-รายจ่ายรายเดือน">
        <div className="h-56 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
              <Bar dataKey="income" fill="#CC0000" name="รายรับ" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f59e0b" name="รายจ่าย" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="สัดส่วนรายรับตามหมวดหมู่">
          <div className="h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.categoryIncome || []} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {data?.categoryIncome?.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="สัดส่วนรายจ่ายตามหมวดหมู่">
          <div className="h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.categoryExpense || []} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {data?.categoryExpense?.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
