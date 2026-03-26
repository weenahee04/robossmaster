"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  totalBranches: number;
  activeBranches: number;
  totalIncome: number;
  totalExpense: number;
  totalEmployees: number;
  recentBranches: Array<{
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    _count: { incomes: number; employees: number };
  }>;
  monthlyData: Array<{ month: string; income: number; expense: number }>;
}

const fmt = (n: number) => `฿${n.toLocaleString()}`;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center animate-pulse">
            <span className="text-xl font-black text-white italic">R</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "สาขาทั้งหมด",
      value: data?.totalBranches || 0,
      icon: "store",
    },
    {
      label: "สาขาที่เปิดใช้งาน",
      value: data?.activeBranches || 0,
      icon: "check_circle",
    },
    {
      label: "รายรับรวม (เดือนนี้)",
      value: fmt(data?.totalIncome || 0),
      icon: "trending_up",
    },
    {
      label: "รายจ่ายรวม (เดือนนี้)",
      value: fmt(data?.totalExpense || 0),
      icon: "trending_down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border border-white/[0.06]" style={{ background: "linear-gradient(135deg, #1a0000 0%, #0a0a0a 50%, #0a0505 100%)" }}>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/[0.08] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">แดชบอร์ด</h1>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase">Live</span>
          </div>
          <p className="text-sm text-gray-500">ภาพรวมระบบทั้งหมด</p>
        </div>
        <img src="/roboss-logo.png" alt="Roboss" className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-10" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 sm:p-5 border border-white/[0.06] bg-[#111111] hover:bg-[#141414] transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-[18px]">{stat.icon}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <Card title="รายรับ-รายจ่ายรายเดือน" variant="dark">
        <div className="h-56 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                formatter={(value: any) => [fmt(Number(value)), ""]}
              />
              <Bar dataKey="income" fill="#dc2626" name="รายรับ" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f59e0b" name="รายจ่าย" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Branches */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#111111] overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">สาขาล่าสุด</h3>
            <p className="text-xs text-gray-500 mt-0.5">{data?.recentBranches?.length || 0} สาขา</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">ชื่อสาขา</th>
                <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">สถานะ</th>
                <th className="text-right py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">พนักงาน</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentBranches?.map((branch) => (
                <tr
                  key={branch.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 px-5 font-medium text-gray-200">{branch.name}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      branch.isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border border-red-500/20"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${branch.isActive ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                      {branch.isActive ? "เปิดใช้งาน" : "ปิด"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-gray-400">{branch._count.employees} คน</td>
                </tr>
              ))}
              {(!data?.recentBranches || data.recentBranches.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-500">ยังไม่มีสาขา</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
