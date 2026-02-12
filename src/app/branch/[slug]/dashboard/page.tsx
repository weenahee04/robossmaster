"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface BannerData {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
}

interface DashboardData {
  todayIncome: number;
  monthlyIncome: number;
  monthlyExpense: number;
  totalEmployees: number;
  todayWash: { CAR: number; BIKE: number; HELMET: number; total: number };
  todayWashRevenue: number;
  monthProfit: number;
  topExpenseCategories: Array<{ name: string; total: number }>;
  recentIncomes: Array<{ id: string; amount: number; date: string; category: { name: string } | null }>;
  recentExpenses: Array<{ id: string; amount: number; date: string; category: { name: string } | null }>;
  weeklyData: Array<{ day: string; income: number; expense: number }>;
}

const typeIcon: Record<string, string> = { CAR: "directions_car", BIKE: "two_wheeler", HELMET: "sports_motorsports" };
const typeLabel: Record<string, string> = { CAR: "รถยนต์", BIKE: "มอไซค์", HELMET: "หมวก" };

export default function BranchDashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/dashboard?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => {
    fetch("/api/site-config")
      .then((res) => res.json())
      .then((d) => { if (d.banners) setBanners(d.banners); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingCar />
      </div>
    );
  }

  const profit = data?.monthProfit ?? ((data?.monthlyIncome || 0) - (data?.monthlyExpense || 0));

  const stats = [
    { label: "ยอดขายวันนี้", value: `฿${(data?.todayIncome || 0).toLocaleString()}`, icon: "today", color: "border-l-primary bg-primary-50", iconColor: "text-primary" },
    { label: "รายรับเดือนนี้", value: `฿${(data?.monthlyIncome || 0).toLocaleString()}`, icon: "trending_up", color: "border-l-success bg-success-light", iconColor: "text-success" },
    { label: "รายจ่ายเดือนนี้", value: `฿${(data?.monthlyExpense || 0).toLocaleString()}`, icon: "trending_down", color: "border-l-warning bg-warning-light", iconColor: "text-warning" },
    { label: "กำไรสุทธิ", value: `฿${profit.toLocaleString()}`, icon: "account_balance_wallet", color: profit >= 0 ? "border-l-success bg-emerald-50" : "border-l-danger bg-red-50", iconColor: profit >= 0 ? "text-success" : "text-danger" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="relative z-10">
          <h1 className="text-2xl font-black">แดชบอร์ด</h1>
          <p className="text-sm text-white/70 mt-1">ภาพรวมสาขา {session?.user?.branchName}</p>
        </div>
        <img src="/roboss-logo.png" alt="Roboss" className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-20" />
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full" />
        <div className="absolute -right-8 -top-8 w-20 h-20 bg-white/5 rounded-full" />
      </div>

      {/* Banners */}
      {banners.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden bg-slate-100">
          <div className="aspect-[3/1] relative">
            {banners.map((b, i) => (
              <div key={b.id} className={`absolute inset-0 transition-opacity duration-500 ${i === bannerIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                {b.linkUrl ? (
                  <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  </a>
                ) : (
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setBannerIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === bannerIdx ? "bg-white w-6" : "bg-white/50"}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border-l-4 p-5 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
              <span className={`material-symbols-outlined text-[28px] ${stat.iconColor}`}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Wash Count Today */}
      {data?.todayWash && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(["CAR", "BIKE", "HELMET"] as const).map((type) => (
            <div key={type} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <span className="material-symbols-outlined text-[28px] text-primary">{typeIcon[type]}</span>
              <p className="text-xl font-black text-slate-900 mt-1">{data.todayWash[type]}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{typeLabel[type]} วันนี้</p>
            </div>
          ))}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <span className="material-symbols-outlined text-[28px] text-info">group</span>
            <p className="text-xl font-black text-slate-900 mt-1">{data?.totalEmployees || 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">พนักงาน</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <Card title="รายรับ-รายจ่ายรายสัปดาห์">
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.weeklyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
              <Bar dataKey="income" fill="#CC0000" name="รายรับ" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f59e0b" name="รายจ่าย" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Expenses + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="ค่าใช้จ่ายหลัก (เดือนนี้)">
          <div className="space-y-3">
            {data?.topExpenseCategories?.map((cat, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{cat.name}</span>
                <span className="text-sm font-bold text-red-600">฿{cat.total.toLocaleString()}</span>
              </div>
            ))}
            {(!data?.topExpenseCategories || data.topExpenseCategories.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </Card>

        <Card title="รายรับล่าสุด">
          <div className="space-y-3">
            {data?.recentIncomes?.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.category?.name || "อื่นๆ"}</p>
                  <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString("th-TH")}</p>
                </div>
                <p className="text-sm font-bold text-emerald-600">+฿{item.amount.toLocaleString()}</p>
              </div>
            ))}
            {(!data?.recentIncomes || data.recentIncomes.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
