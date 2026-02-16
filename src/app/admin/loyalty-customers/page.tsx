"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

export default function LoyaltyCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/loyalty-customers").then(r => r.json()).then(data => {
      setCustomers(Array.isArray(data) ? data : []);
    }).catch(console.error);
  }, []);

  const filtered = customers.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const tierColor = (tier: string) => {
    if (tier === "PLATINUM") return "primary";
    if (tier === "GOLD") return "warning";
    return "neutral";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ลูกค้า Loyalty</h1>
        <p className="text-sm text-slate-500">ดูข้อมูลสมาชิกและแต้มสะสมทั้งหมด ({customers.length} คน)</p>
      </div>

      <Input placeholder="ค้นหาชื่อ หรือ เบอร์โทร..." value={search} onChange={e => setSearch(e.target.value)} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="py-3 px-4 font-semibold text-slate-600">ชื่อ</th>
              <th className="py-3 px-4 font-semibold text-slate-600">เบอร์โทร</th>
              <th className="py-3 px-4 font-semibold text-slate-600">สาขา / แต้ม</th>
              <th className="py-3 px-4 font-semibold text-slate-600">รถ</th>
              <th className="py-3 px-4 font-semibold text-slate-600">คูปอง</th>
              <th className="py-3 px-4 font-semibold text-slate-600">สมัครเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {(c.name || "?").charAt(0)}
                    </div>
                    <span className="font-medium text-slate-900">{c.name || "-"}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 font-mono text-xs">{c.phone}</td>
                <td className="py-3 px-4">
                  {c.points && c.points.length > 0 ? (
                    <div className="space-y-1">
                      {c.points.map((p: any) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <Badge variant={tierColor(p.tier) as any}>{p.tier}</Badge>
                          <span className="text-xs font-bold text-slate-700">{p.balance} แต้ม</span>
                          <span className="text-[10px] text-slate-400">({p.branch?.name})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-600 text-xs">{c.vehicles?.length || 0} คัน</td>
                <td className="py-3 px-4 text-slate-600 text-xs">{c._count?.coupons || 0}</td>
                <td className="py-3 px-4 text-slate-500 text-xs">{new Date(c.createdAt).toLocaleDateString("th-TH")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-slate-300">people</span>
          <p className="text-slate-500 mt-2">{search ? "ไม่พบลูกค้าที่ค้นหา" : "ยังไม่มีลูกค้าในระบบ"}</p>
        </Card>
      )}
    </div>
  );
}
