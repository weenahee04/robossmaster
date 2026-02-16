"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoyaltyLinkPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [branchName, setBranchName] = useState("");
  const [loyaltyDomain, setLoyaltyDomain] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/branches/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.name) setBranchName(data.name);
      })
      .catch(() => {});

    // Loyalty domain — ใช้ env หรือ default
    const domain = process.env.NEXT_PUBLIC_LOYALTY_URL || "https://loyalty.roboss.app";
    setLoyaltyDomain(domain);
  }, [slug]);

  const loyaltyUrl = `${loyaltyDomain}/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(loyaltyUrl)}&bgcolor=ffffff&color=000000&margin=20`;

  const handleCopy = () => {
    navigator.clipboard.writeText(loyaltyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ลิงก์ Loyalty สาขา</h1>
        <p className="text-sm text-slate-500">
          QR Code และลิงก์สำหรับให้ลูกค้าเข้าแอป Loyalty ของสาขา{" "}
          <span className="font-bold text-primary">{branchName || slug}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <Card className="p-8 flex flex-col items-center space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">qr_code_2</span>
            QR Code สำหรับลูกค้า
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <img src={qrUrl} alt="Loyalty QR Code" className="w-64 h-64" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-slate-700">{branchName || slug}</p>
            <p className="text-xs text-slate-400">สแกนเพื่อเข้าแอป Loyalty</p>
          </div>
          <Button
            onClick={() => {
              const link = document.createElement("a");
              link.href = qrUrl;
              link.download = `loyalty-qr-${slug}.png`;
              link.click();
            }}
          >
            <span className="material-symbols-outlined text-[18px] mr-1">download</span>
            ดาวน์โหลด QR Code
          </Button>
        </Card>

        {/* Link Info Card */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">link</span>
              ลิงก์ Loyalty
            </h2>
            <div className="flex gap-2">
              <Input value={loyaltyUrl} readOnly className="font-mono text-sm" />
              <Button onClick={handleCopy} variant={copied ? "outline" : "primary"}>
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? "check" : "content_copy"}
                </span>
              </Button>
            </div>
            {copied && (
              <p className="text-green-600 text-xs font-medium">คัดลอกลิงก์แล้ว!</p>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-500">tips_and_updates</span>
              วิธีใช้งาน
            </h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <p><span className="font-bold text-slate-800">พิมพ์ QR Code</span> — ดาวน์โหลดและพิมพ์ QR Code ติดไว้ที่หน้าร้านหรือเคาน์เตอร์</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <p><span className="font-bold text-slate-800">แชร์ลิงก์</span> — ส่งลิงก์ให้ลูกค้าผ่าน LINE, Facebook หรือ SMS</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <p><span className="font-bold text-slate-800">ลูกค้าสแกน</span> — ลูกค้าสแกน QR Code หรือเปิดลิงก์เพื่อสมัครสมาชิกและสะสมแต้ม</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/10">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">info</span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">ลิงก์เฉพาะสาขา</p>
                <p className="text-xs text-slate-600">
                  ลิงก์นี้จะพาลูกค้าไปที่หน้า Loyalty ของสาขา <span className="font-bold">{branchName || slug}</span> โดยเฉพาะ
                  ลูกค้าจะเห็นโปรโมชั่น แบนเนอร์ และแพ็คเกจของสาขานี้
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
