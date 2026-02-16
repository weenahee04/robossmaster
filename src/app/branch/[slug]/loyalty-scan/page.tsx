"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

export default function LoyaltyScanPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/loyalty/coupons/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">สแกนคูปอง Loyalty</h1>
        <p className="text-sm text-slate-500">ใส่รหัสคูปองจากลูกค้าเพื่อใช้สิทธิ์</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleScan} className="space-y-4">
          <Input
            label="รหัสคูปอง"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="เช่น ROBOSS-XXXXXX"
            className="text-center text-lg font-mono tracking-widest"
          />
          <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
            <span className="material-symbols-outlined text-[18px] mr-1">qr_code_scanner</span>
            {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบคูปอง"}
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500 text-[32px]">error</span>
            <div>
              <h3 className="font-bold text-red-800">ไม่สามารถใช้คูปองได้</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {result && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-green-500 text-[32px]">check_circle</span>
            <div>
              <h3 className="font-bold text-green-800">ใช้คูปองสำเร็จ!</h3>
              <p className="text-sm text-green-600">คูปองถูกใช้เรียบร้อยแล้ว</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <span className="text-slate-400 text-xs">ชื่อคูปอง</span>
              <p className="font-semibold text-slate-800">{result.coupon?.couponTemplate?.name || result.coupon?.code}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="text-slate-400 text-xs">สถานะ</span>
              <p><Badge variant="success">ใช้แล้ว</Badge></p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="text-slate-400 text-xs">ลูกค้า</span>
              <p className="font-semibold text-slate-800">{result.coupon?.customer?.name || "-"}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="text-slate-400 text-xs">เวลาใช้</span>
              <p className="font-semibold text-slate-800">{new Date(result.coupon?.usedAt).toLocaleString("th-TH")}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">info</span>
          วิธีใช้งาน
        </h3>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex gap-2"><span className="font-bold text-primary">1.</span> ขอให้ลูกค้าแสดง QR Code หรือรหัสคูปองจากแอป Loyalty</li>
          <li className="flex gap-2"><span className="font-bold text-primary">2.</span> กรอกรหัสคูปองในช่องด้านบน</li>
          <li className="flex gap-2"><span className="font-bold text-primary">3.</span> กดปุ่ม "ตรวจสอบคูปอง" เพื่อยืนยันการใช้สิทธิ์</li>
          <li className="flex gap-2"><span className="font-bold text-primary">4.</span> ระบบจะแสดงผลว่าคูปองใช้ได้หรือไม่</li>
        </ol>
      </Card>
    </div>
  );
}
