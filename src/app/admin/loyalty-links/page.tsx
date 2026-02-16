"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

interface Branch {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function LoyaltyLinksPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [loyaltyDomain, setLoyaltyDomain] = useState("https://loyalty.roboss.app");

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setLoyaltyDomain(origin + "/loyalty");

    fetch("/api/branches")
      .then((r) => r.json())
      .then((data) => {
        setBranches(Array.isArray(data) ? data : data.branches || []);
      })
      .catch(console.error);
  }, []);

  const filtered = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`${loyaltyDomain}/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDownloadQR = (slug: string, name: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(`${loyaltyDomain}/${slug}`)}&bgcolor=ffffff&color=000000&margin=20`;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `loyalty-qr-${slug}.png`;
    link.click();
  };

  const handleDownloadAll = () => {
    const activeBranches = filtered.filter((b) => b.isActive);
    activeBranches.forEach((b, i) => {
      setTimeout(() => handleDownloadQR(b.slug, b.name), i * 500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ลิงก์ Loyalty ทุกสาขา</h1>
          <p className="text-sm text-slate-500">
            รวมลิงก์และ QR Code สำหรับแอป Loyalty ของทุกสาขา ({branches.length} สาขา)
          </p>
        </div>
        <Button onClick={handleDownloadAll} variant="outline">
          <span className="material-symbols-outlined text-[18px] mr-1">download</span>
          ดาวน์โหลด QR ทั้งหมด
        </Button>
      </div>

      <Input
        placeholder="ค้นหาสาขา..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Summary Card */}
      <Card className="p-5 bg-primary/5 border-primary/10">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[24px]">info</span>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">วิธีแจกลิงก์ให้ลูกค้า</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• <span className="font-bold">พิมพ์ QR Code</span> — ดาวน์โหลด QR แล้วพิมพ์ติดหน้าร้าน / เคาน์เตอร์ / ใบเสร็จ</li>
              <li>• <span className="font-bold">แชร์ลิงก์</span> — คัดลอกลิงก์แล้วส่งผ่าน LINE OA, Facebook Page, SMS</li>
              <li>• <span className="font-bold">ใส่ในเว็บ</span> — ฝังลิงก์ในเว็บไซต์หรือ Google Maps ของสาขา</li>
              <li>• <span className="font-bold">ทำ Standee</span> — พิมพ์ QR ขนาดใหญ่ตั้งหน้าร้าน</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Branch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((branch) => {
          const url = `${loyaltyDomain}/${branch.slug}`;
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&margin=10`;

          return (
            <Card key={branch.id} className="p-0 overflow-hidden">
              <div className="flex">
                {/* QR Code */}
                <div className="w-36 h-36 bg-white flex items-center justify-center flex-shrink-0 border-r border-slate-100 p-3">
                  <img src={qrUrl} alt={`QR ${branch.name}`} className="w-full h-full" />
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{branch.name}</h3>
                      <Badge variant={branch.isActive ? "success" : "neutral"}>
                        {branch.isActive ? "เปิด" : "ปิด"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono break-all">{url}</p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleCopy(branch.slug)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        copiedSlug === branch.slug
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedSlug === branch.slug ? "check" : "content_copy"}
                      </span>
                      {copiedSlug === branch.slug ? "คัดลอกแล้ว" : "คัดลอก"}
                    </button>
                    <button
                      onClick={() => handleDownloadQR(branch.slug, branch.name)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      QR
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-slate-300">store</span>
          <p className="text-slate-500 mt-2">
            {search ? "ไม่พบสาขาที่ค้นหา" : "ยังไม่มีสาขาในระบบ"}
          </p>
        </Card>
      )}
    </div>
  );
}
