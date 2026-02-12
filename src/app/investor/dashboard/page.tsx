"use client";

import { useEffect, useState, useRef } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import LoadingCar from "@/components/illustrations/LoadingCar";

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

export default function InvestorDashboardPage() {
  const [data, setData] = useState<InvestorData | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/investor/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white print:hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Investor Dashboard</h1>
            <p className="text-sm text-white/60 mt-1">ภาพรวมธุรกิจ Roboss (Read-only)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon="print" onClick={handlePrint}>PDF Report</Button>
          </div>
        </div>
        <img src="/roboss-logo.png" alt="Roboss" className="absolute right-8 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-[0.15]" />
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border-l-4 border-l-primary bg-primary-50 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขาทั้งหมด</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{data.totalBranches}</p>
          <p className="text-xs text-slate-500 mt-1">{data.activeBranches} เปิดใช้งาน</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-success bg-success-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Revenue เดือนนี้</p>
          <p className="text-3xl font-black text-slate-900 mt-1">฿{data.monthRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className={`material-symbols-outlined text-[14px] ${data.growthRate >= 0 ? "text-success" : "text-danger"}`}>
              {data.growthRate >= 0 ? "trending_up" : "trending_down"}
            </span>
            <span className={`text-xs font-bold ${data.growthRate >= 0 ? "text-success" : "text-danger"}`}>
              {data.growthRate >= 0 ? "+" : ""}{data.growthRate}% MoM
            </span>
          </div>
        </div>
        <div className="rounded-2xl border-l-4 border-l-info bg-info-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Revenue ปีนี้</p>
          <p className="text-3xl font-black text-slate-900 mt-1">฿{data.yearRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-warning bg-warning-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">เฉลี่ย / สาขา</p>
          <p className="text-3xl font-black text-slate-900 mt-1">฿{data.avgRevenuePerBranch.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">ต่อเดือน</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <Card title="Revenue รวมรายเดือน (12 เดือน)">
        <div className="h-56 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#CC0000" strokeWidth={3} dot={{ fill: "#CC0000", r: 4 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top 10 Branches */}
      <Card title="Top 10 สาขา (Revenue เดือนนี้)" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">อันดับ</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขา</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.top10Branches.map((branch, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <Badge variant={i < 3 ? "primary" : "neutral"}>{i + 1}</Badge>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{branch.name}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-800">฿{branch.revenue.toLocaleString()}</td>
                </tr>
              ))}
              {data.top10Branches.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-slate-400">ไม่มีข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Today Revenue */}
      <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
        <p className="text-sm font-medium opacity-80">Revenue วันนี้ (Real-time)</p>
        <p className="text-4xl font-black mt-2">฿{data.todayRevenue.toLocaleString()}</p>
      </div>
    </div>
  );
}
