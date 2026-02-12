"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface ROIData {
  initialInvestment: number;
  openDate: string;
  cumulativeIncome: number;
  cumulativeExpense: number;
  cumulativeProfit: number;
  adminFee: number;
  payrollCost: number;
  depreciation: number;
  monthsSinceOpen: number;
  avgMonthlyProfit: number;
  paybackMonth: number | null;
  roiPerYear: number;
  paybackProgress: number;
  monthlyTrend: Array<{ month: string; income: number; expense: number; profit: number }>;
  config: {
    depreciationRate: number;
    adminFeePercent: number;
    targetRoiPercent: number;
    targetPaybackMonths: number;
    includePayrollInCost: boolean;
  };
}

export default function BranchROIPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ROIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/roi?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">ROI & คืนทุน</h1>
        <p className="text-sm text-slate-500 mt-1">วิเคราะห์ผลตอบแทนการลงทุน</p>
      </div>

      {/* Main ROI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border-l-4 border-l-primary bg-primary-50 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">เงินลงทุนเริ่มต้น</p>
          <p className="text-2xl font-black text-slate-900 mt-1">฿{data.initialInvestment.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-success bg-success-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">รายได้สะสม</p>
          <p className="text-2xl font-black text-slate-900 mt-1">฿{data.cumulativeIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-info bg-info-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">เดือนที่คืนทุน</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{data.paybackMonth ? `${data.paybackMonth} เดือน` : "N/A"}</p>
        </div>
        <div className="rounded-2xl border-l-4 border-l-warning bg-warning-light p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ROI ต่อปี</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{data.roiPerYear}%</p>
        </div>
      </div>

      {/* Payback Progress */}
      <Card title="ความคืบหน้าคืนทุน">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">กำไรสะสม: ฿{data.cumulativeProfit.toLocaleString()}</span>
            <span className="font-bold text-primary">{data.paybackProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, data.paybackProgress)}%`,
                background: data.paybackProgress >= 100
                  ? "linear-gradient(90deg, #10b981, #059669)"
                  : "linear-gradient(90deg, #CC0000, #ef4444)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>฿0</span>
            <span>฿{data.initialInvestment.toLocaleString()}</span>
          </div>
          {data.paybackProgress >= 100 && (
            <div className="bg-success-light rounded-lg p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-success text-[20px]">celebration</span>
              <span className="text-sm font-medium text-emerald-800">คืนทุนแล้ว!</span>
            </div>
          )}
        </div>
      </Card>

      {/* Target vs Actual */}
      {data.config && (
        <Card title="เป้าหมาย vs ผลจริง (กำหนดโดยสาขาใหญ่)">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-xl bg-slate-50 p-3 sm:p-4 text-center">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">เป้า ROI/ปี</p>
              <p className="text-lg sm:text-xl font-black text-slate-400 mt-1">{data.config.targetRoiPercent}%</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 sm:p-4 text-center">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">ROI จริง/ปี</p>
              <p className={`text-lg sm:text-xl font-black mt-1 ${data.roiPerYear >= data.config.targetRoiPercent ? "text-emerald-600" : "text-red-600"}`}>{data.roiPerYear}%</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 sm:p-4 text-center">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">เป้าคืนทุน</p>
              <p className="text-lg sm:text-xl font-black text-slate-400 mt-1">{data.config.targetPaybackMonths} เดือน</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 sm:p-4 text-center">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">คืนทุนจริง</p>
              <p className={`text-lg sm:text-xl font-black mt-1 ${data.paybackMonth && data.paybackMonth <= data.config.targetPaybackMonths ? "text-emerald-600" : "text-amber-600"}`}>{data.paybackMonth ? `${data.paybackMonth} เดือน` : "N/A"}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">ค่าเสื่อม {data.config.depreciationRate}%/ปี | ค่าบริหาร {data.config.adminFeePercent}% | {data.config.includePayrollInCost ? "รวม" : "ไม่รวม"}เงินเดือน</p>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="สรุปตัวเลข">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">เปิดสาขามาแล้ว</span>
              <span className="font-semibold text-slate-800">{data.monthsSinceOpen} เดือน</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">รายได้สะสม</span>
              <span className="font-semibold text-emerald-600">฿{data.cumulativeIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">ค่าใช้จ่ายสะสม</span>
              <span className="font-semibold text-red-600">฿{data.cumulativeExpense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">ค่าบริหาร ({data.config?.adminFeePercent || 0}%)</span>
              <span className="font-semibold text-orange-600">฿{Math.round(data.adminFee).toLocaleString()}</span>
            </div>
            {data.config?.includePayrollInCost && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">เงินเดือนพนักงาน</span>
                <span className="font-semibold text-orange-600">฿{Math.round(data.payrollCost).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">กำไรสุทธิสะสม</span>
              <span className={`font-semibold ${data.cumulativeProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>฿{Math.round(data.cumulativeProfit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-slate-600">กำไรเฉลี่ย/เดือน</span>
              <span className="font-bold text-primary">฿{Math.round(data.avgMonthlyProfit).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card title="กำไรรายเดือน">
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
                <Bar dataKey="profit" fill="#CC0000" name="กำไร" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
