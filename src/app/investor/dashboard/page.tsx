"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface InvestorData {
  totalBranches: number;
  activeBranches: number;
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  growthRate: number;
  avgRevenuePerBranch: number;
  top10Branches: Array<{ name: string; revenue: number }>;
  monthlyTrend: Array<{ month: string; revenue: number }>;
}

const fmt = (n: number) => `฿${n.toLocaleString()}`;

export default function InvestorDashboardPage() {
  const [data, setData] = useState<InvestorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/investor/dashboard")
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

  if (!data) return null;

  const maxBranchRevenue = Math.max(...data.top10Branches.map(b => b.revenue), 1);

  const kpiCards = [
    {
      icon: "store",
      label: "สาขาทั้งหมด",
      value: data.totalBranches.toString(),
      sub: `${data.activeBranches} เปิดใช้งาน`,
      color: "red",
    },
    {
      icon: "account_balance",
      label: "Revenue เดือนนี้",
      value: fmt(data.monthRevenue),
      sub: `${data.growthRate >= 0 ? "+" : ""}${data.growthRate}% MoM`,
      subIcon: data.growthRate >= 0 ? "trending_up" : "trending_down",
      subColor: data.growthRate >= 0 ? "text-emerald-400" : "text-red-400",
      color: "emerald",
    },
    {
      icon: "savings",
      label: "Revenue ปีนี้",
      value: fmt(data.yearRevenue),
      sub: new Date().getFullYear().toString(),
      color: "blue",
    },
    {
      icon: "speed",
      label: "เฉลี่ย / สาขา",
      value: fmt(data.avgRevenuePerBranch),
      sub: "ต่อเดือน",
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border border-white/[0.06]" style={{ background: "linear-gradient(135deg, #1a0000 0%, #0a0a0a 50%, #0a0505 100%)" }}>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/[0.08] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Franchise Dashboard</h1>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase">Live</span>
            </div>
            <p className="text-sm text-gray-500">ภาพรวมรายได้ทั้งหมด อัปเดตแบบ Real-time</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-gray-300 hover:bg-white/[0.08] hover:text-white transition-all print:hidden"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            ดาวน์โหลดรายงาน
          </button>
        </div>

        {/* Today Revenue Highlight */}
        <div className="mt-6 flex flex-wrap items-end gap-3">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Revenue วันนี้</p>
            <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">{fmt(data.todayRevenue)}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl p-4 sm:p-5 border border-white/[0.06] bg-[#111111] hover:bg-[#141414] transition-colors group"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-[18px]">{kpi.icon}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</p>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {kpi.subIcon && <span className={`material-symbols-outlined text-[14px] ${kpi.subColor}`}>{kpi.subIcon}</span>}
              <p className={`text-xs font-medium ${kpi.subColor || "text-gray-500"}`}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend - Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#111111] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Revenue Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">รายได้รวม 12 เดือนล่าสุด</p>
            </div>
            <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyTrend}>
                <defs>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                  formatter={(value: any) => [fmt(Number(value)), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2.5} fill="url(#redGradient)" dot={false} activeDot={{ r: 5, fill: "#dc2626", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Branches - Bar visualization */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#111111] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Top สาขา</h3>
              <p className="text-xs text-gray-500 mt-0.5">Revenue เดือนนี้</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.top10Branches.slice(0, 6).map((branch, i) => {
              const pct = (branch.revenue / maxBranchRevenue) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${i < 3 ? "bg-red-600/20 text-red-400" : "bg-white/[0.05] text-gray-500"}`}>
                        {i + 1}
                      </span>
                      <span className="text-xs font-medium text-gray-300 truncate max-w-[120px]">{branch.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{fmt(branch.revenue)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: i < 3 ? "linear-gradient(90deg, #dc2626, #ef4444)" : "rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {data.top10Branches.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">ไม่มีข้อมูล</p>
            )}
          </div>
        </div>
      </div>

      {/* Full Branch Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#111111] overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">สาขาทั้งหมด</h3>
            <p className="text-xs text-gray-500 mt-0.5">Revenue เรียงจากมากไปน้อย</p>
          </div>
          <span className="text-[10px] font-bold text-gray-500 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
            {data.top10Branches.length} สาขา
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">#</th>
                <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">สาขา</th>
                <th className="text-right py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Revenue</th>
                <th className="text-right py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hidden sm:table-cell">สัดส่วน</th>
              </tr>
            </thead>
            <tbody>
              {data.top10Branches.map((branch, i) => {
                const pct = data.monthRevenue > 0 ? ((branch.revenue / data.monthRevenue) * 100).toFixed(1) : "0";
                return (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold ${
                        i < 3 ? "bg-red-600/15 text-red-400" : "bg-white/[0.04] text-gray-500"
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-gray-200">{branch.name}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-white">{fmt(branch.revenue)}</td>
                    <td className="py-3.5 px-5 text-right text-gray-400 hidden sm:table-cell">{pct}%</td>
                  </tr>
                );
              })}
              {data.top10Branches.length === 0 && (
                <tr><td colSpan={4} className="py-12 text-center text-gray-500">ไม่มีข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
