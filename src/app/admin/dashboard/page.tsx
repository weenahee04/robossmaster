"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingCar from "@/components/illustrations/LoadingCar";
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
      <div className="flex items-center justify-center h-64">
        <LoadingCar />
      </div>
    );
  }

  const stats = [
    {
      label: "สาขาทั้งหมด",
      value: data?.totalBranches || 0,
      icon: "store",
      color: "border-l-primary bg-primary-50",
      iconColor: "text-primary",
    },
    {
      label: "สาขาที่เปิดใช้งาน",
      value: data?.activeBranches || 0,
      icon: "check_circle",
      color: "border-l-success bg-success-light",
      iconColor: "text-success",
    },
    {
      label: "รายรับรวม (เดือนนี้)",
      value: `฿${(data?.totalIncome || 0).toLocaleString()}`,
      icon: "trending_up",
      color: "border-l-info bg-info-light",
      iconColor: "text-info",
    },
    {
      label: "รายจ่ายรวม (เดือนนี้)",
      value: `฿${(data?.totalExpense || 0).toLocaleString()}`,
      icon: "trending_down",
      color: "border-l-warning bg-warning-light",
      iconColor: "text-warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-800 p-6 text-white">
        <div className="relative z-10">
          <h1 className="text-2xl font-black">แดชบอร์ด</h1>
          <p className="text-sm text-white/70 mt-1">ภาพรวมระบบทั้งหมด</p>
        </div>
        <img src="/roboss-logo.png" alt="Roboss" className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-20" />
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border-l-4 p-5 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <span
                className={`material-symbols-outlined text-[28px] ${stat.iconColor}`}
              >
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <Card title="รายรับ-รายจ่ายรายเดือน">
        <div className="h-56 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `฿${Number(value).toLocaleString()}`}
              />
              <Bar dataKey="income" fill="#CC0000" name="รายรับ" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f59e0b" name="รายจ่าย" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Branches */}
      <Card title="สาขาล่าสุด">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  ชื่อสาขา
                </th>
                <th className="text-left py-3 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  สถานะ
                </th>
                <th className="text-right py-3 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  พนักงาน
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.recentBranches?.map((branch) => (
                <tr
                  key={branch.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-2 font-medium text-slate-800">
                    {branch.name}
                  </td>
                  <td className="py-3 px-2">
                    <Badge
                      variant={branch.isActive ? "success" : "danger"}
                      hasDot
                    >
                      {branch.isActive ? "เปิดใช้งาน" : "ปิด"}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right text-slate-600">
                    {branch._count.employees} คน
                  </td>
                </tr>
              ))}
              {(!data?.recentBranches || data.recentBranches.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    ยังไม่มีสาขา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
