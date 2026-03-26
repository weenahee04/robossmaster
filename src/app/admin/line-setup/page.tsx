"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

interface Branch {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  lineChannelId: string | null;
  lineChannelSecret: string | null;
  lineOaId: string | null;
}

const STEPS = [
  { title: "เลือกสาขา", icon: "store" },
  { title: "สร้าง LINE Login Channel", icon: "open_in_new" },
  { title: "ตั้ง Callback URL", icon: "link" },
  { title: "กรอก Credentials", icon: "key" },
  { title: "ตั้งค่า Rich Menu", icon: "menu" },
  { title: "ทดสอบ", icon: "check_circle" },
];

export default function LineSetupPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ lineChannelId: "", lineChannelSecret: "", lineOaId: "" });
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const callbackUrl = `${baseUrl}/api/loyalty/line/callback`;
  const richMenuUrl = selectedBranch ? `${baseUrl}/api/loyalty/line/login?branch=${selectedBranch.slug}` : "";
  const testLoginUrl = selectedBranch ? `${baseUrl}/loyalty/${selectedBranch.slug}/login` : "";

  useEffect(() => {
    fetch("/api/admin/branches")
      .then((r) => r.json())
      .then((data) => setBranches(data.filter((b: Branch) => b.isActive)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setForm({
      lineChannelId: branch.lineChannelId || "",
      lineChannelSecret: branch.lineChannelSecret || "",
      lineOaId: branch.lineOaId || "",
    });
    setSaved(!!branch.lineChannelId);
    setVerifyResult(null);
    setStep(1);
  };

  const handleSave = async () => {
    if (!selectedBranch) return;
    setSaving(true);
    try {
      await fetch("/api/admin/branches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedBranch.id, ...form }),
      });
      setSaved(true);
      // Update local branch data
      setBranches((prev) =>
        prev.map((b) => (b.id === selectedBranch.id ? { ...b, ...form } : b))
      );
      setSelectedBranch({ ...selectedBranch, ...form });
      setStep(4);
    } catch {
      console.error("Save error");
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch("/api/loyalty/line/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: form.lineChannelId, channelSecret: form.lineChannelSecret }),
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      setVerifyResult({ valid: false, error: "ไม่สามารถเชื่อมต่อได้" });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="material-symbols-outlined text-[28px] text-[#06C755]">chat</span>
          ตั้งค่า LINE Login
        </h1>
        <p className="text-sm text-slate-500 mt-1">ระบบช่วยตั้งค่า LINE Login ให้ลูกค้าเข้าสู่ระบบ Loyalty ผ่าน LINE ได้ง่ายๆ</p>
      </div>

      {/* Branch Status Overview */}
      <Card>
        <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">checklist</span>
          สถานะสาขา
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => selectBranch(b)}
              className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                selectedBranch?.id === b.id
                  ? "border-primary bg-primary-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">store</span>
                <span className="text-sm font-medium text-slate-800">{b.name}</span>
              </div>
              {b.lineChannelId ? (
                <Badge variant="success">ตั้งค่าแล้ว</Badge>
              ) : (
                <Badge variant="warning">ยังไม่ตั้งค่า</Badge>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Stepper */}
      {selectedBranch && (
        <>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  step === i
                    ? "bg-primary text-white"
                    : i < step || (i === 5 && saved)
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                {s.title}
              </button>
            ))}
          </div>

          {/* Step Content */}
          <Card>
            {/* Step 0: เลือกสาขา */}
            {step === 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">store</span>
                  เลือกสาขาที่ต้องการตั้งค่า
                </h3>
                <p className="text-sm text-slate-500">กดเลือกสาขาจากรายการด้านบน</p>
              </div>
            )}

            {/* Step 1: สร้าง LINE Login Channel */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">open_in_new</span>
                  สร้าง LINE Login Channel
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">สำหรับสาขา <strong>{selectedBranch.name}</strong></p>
                </div>

                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <p className="font-medium">เปิด LINE Developers Console</p>
                      <a href="https://developers.line.biz/console/" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 px-3 py-1.5 bg-[#06C755] text-white rounded-lg text-xs font-bold hover:bg-[#06C755]/90 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        เปิด LINE Developers Console
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <p className="font-medium">สร้าง Provider (ถ้ายังไม่มี)</p>
                      <p className="text-slate-500 text-xs mt-0.5">กดปุ่ม &quot;Create&quot; → กรอกชื่อ เช่น &quot;{selectedBranch.name}&quot; → Create</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <p className="font-medium">สร้าง LINE Login Channel</p>
                      <p className="text-slate-500 text-xs mt-0.5">กด &quot;Create a LINE Login channel&quot;</p>
                      <div className="mt-2 bg-slate-50 rounded-lg p-3 space-y-1.5">
                        <p className="text-xs"><strong>Channel type:</strong> LINE Login</p>
                        <p className="text-xs"><strong>Provider:</strong> เลือก Provider ที่สร้าง</p>
                        <p className="text-xs"><strong>Channel name:</strong> {selectedBranch.name} Loyalty</p>
                        <p className="text-xs"><strong>Channel description:</strong> Loyalty App สำหรับ {selectedBranch.name}</p>
                        <p className="text-xs"><strong>App types:</strong> ✅ Web app</p>
                      </div>
                    </div>
                  </li>
                </ol>

                <div className="flex justify-end">
                  <Button icon="arrow_forward" onClick={() => setStep(2)}>ถัดไป</Button>
                </div>
              </div>
            )}

            {/* Step 2: ตั้ง Callback URL */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">link</span>
                  ตั้ง Callback URL
                </h3>

                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <p>ไปที่แท็บ <strong>&quot;LINE Login&quot;</strong> ใน Channel ที่สร้าง</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div className="flex-1">
                      <p>คัดลอก URL นี้ใส่ในช่อง <strong>&quot;Callback URL&quot;</strong></p>
                      <div className="mt-2 bg-slate-50 rounded-lg p-3 flex items-center gap-2">
                        <code className="text-xs text-primary font-mono flex-1 break-all">{callbackUrl}</code>
                        <button onClick={() => copyToClipboard(callbackUrl)} className="p-1.5 rounded-lg hover:bg-slate-200 transition-all flex-shrink-0">
                          <span className="material-symbols-outlined text-[16px] text-slate-500">content_copy</span>
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <p>กด <strong>&quot;Update&quot;</strong> เพื่อบันทึก</p>
                  </li>
                </ol>

                <div className="flex justify-between">
                  <Button variant="outline" icon="arrow_back" onClick={() => setStep(1)}>ย้อนกลับ</Button>
                  <Button icon="arrow_forward" onClick={() => setStep(3)}>ถัดไป</Button>
                </div>
              </div>
            )}

            {/* Step 3: กรอก Credentials */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">key</span>
                  กรอก Channel Credentials
                </h3>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    ไปที่แท็บ <strong>&quot;Basic settings&quot;</strong> ใน Channel ที่สร้าง → คัดลอก <strong>Channel ID</strong> และ <strong>Channel secret</strong> มาวางด้านล่าง
                  </p>
                </div>

                <Input
                  label="Channel ID"
                  value={form.lineChannelId}
                  onChange={(e) => setForm({ ...form, lineChannelId: e.target.value })}
                  placeholder="เช่น 2001234567"
                />
                <Input
                  label="Channel Secret"
                  value={form.lineChannelSecret}
                  onChange={(e) => setForm({ ...form, lineChannelSecret: e.target.value })}
                  placeholder="เช่น abcdef1234567890abcdef1234567890"
                />
                <Input
                  label="LINE OA ID (optional)"
                  value={form.lineOaId}
                  onChange={(e) => setForm({ ...form, lineOaId: e.target.value })}
                  placeholder="เช่น @roboss-rama9"
                />

                {/* Verify */}
                {form.lineChannelId && form.lineChannelSecret && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="verified"
                      isLoading={verifying}
                      onClick={handleVerify}
                    >
                      ทดสอบ Credentials
                    </Button>
                    {verifyResult && (
                      <span className={`text-sm font-medium flex items-center gap-1 ${verifyResult.valid ? "text-emerald-600" : "text-red-600"}`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {verifyResult.valid ? "check_circle" : "error"}
                        </span>
                        {verifyResult.valid ? "ถูกต้อง!" : verifyResult.error}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" icon="arrow_back" onClick={() => setStep(2)}>ย้อนกลับ</Button>
                  <Button
                    icon="save"
                    isLoading={saving}
                    onClick={handleSave}
                    disabled={!form.lineChannelId || !form.lineChannelSecret}
                  >
                    บันทึกและถัดไป
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: ตั้งค่า Rich Menu */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">menu</span>
                  ตั้งค่า Rich Menu
                </h3>

                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    บันทึก credentials สำเร็จ! ขั้นตอนสุดท้ายคือตั้ง Rich Menu
                  </p>
                </div>

                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <p className="font-medium">เปิด LINE Official Account Manager</p>
                      <a href="https://manager.line.biz/" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 px-3 py-1.5 bg-[#06C755] text-white rounded-lg text-xs font-bold hover:bg-[#06C755]/90 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        เปิด LINE OA Manager
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <p>ไปที่ <strong>Rich Menu</strong> → สร้าง Rich Menu ใหม่</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div className="flex-1">
                      <p>ตั้ง Action ของปุ่ม &quot;สะสมแต้ม&quot; เป็น <strong>&quot;Link&quot;</strong> แล้ววาง URL นี้:</p>
                      <div className="mt-2 bg-slate-50 rounded-lg p-3 flex items-center gap-2">
                        <code className="text-xs text-primary font-mono flex-1 break-all">{richMenuUrl}</code>
                        <button onClick={() => copyToClipboard(richMenuUrl)} className="p-1.5 rounded-lg hover:bg-slate-200 transition-all flex-shrink-0">
                          <span className="material-symbols-outlined text-[16px] text-slate-500">content_copy</span>
                        </button>
                      </div>
                    </div>
                  </li>
                </ol>

                <div className="flex justify-between">
                  <Button variant="outline" icon="arrow_back" onClick={() => setStep(3)}>ย้อนกลับ</Button>
                  <Button icon="arrow_forward" onClick={() => setStep(5)}>ถัดไป</Button>
                </div>
              </div>
            )}

            {/* Step 5: ทดสอบ */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                  ทดสอบ LINE Login
                </h3>

                {saved ? (
                  <>
                    <div className="bg-emerald-50 rounded-lg p-4 text-center space-y-3">
                      <span className="material-symbols-outlined text-[48px] text-emerald-500">verified</span>
                      <p className="text-sm font-bold text-emerald-800">ตั้งค่าสาขา {selectedBranch.name} เสร็จสมบูรณ์!</p>
                      <p className="text-xs text-emerald-600">กดปุ่มด้านล่างเพื่อทดสอบ LINE Login</p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <a
                        href={testLoginUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#06C755] text-white rounded-xl font-bold text-sm hover:bg-[#06C755]/90 transition-colors shadow-lg"
                      >
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        เปิดหน้า Login เพื่อทดสอบ
                      </a>
                      <p className="text-xs text-slate-400">หรือสแกน QR Code ด้านล่างจากมือถือ</p>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(testLoginUrl)}`}
                          alt="QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                      <p className="text-xs text-slate-500 text-center max-w-sm">
                        สแกน QR Code นี้จากมือถือ → กด LINE Login → ถ้าเข้าสู่ระบบสำเร็จ แสดงว่าตั้งค่าถูกต้อง
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <span className="material-symbols-outlined text-[48px] text-amber-500">warning</span>
                    <p className="text-sm font-medium text-amber-800 mt-2">ยังไม่ได้บันทึก Credentials</p>
                    <p className="text-xs text-amber-600 mt-1">กรุณากลับไปขั้นตอนที่ 4 เพื่อกรอกและบันทึก</p>
                    <Button variant="outline" size="sm" icon="arrow_back" onClick={() => setStep(3)} className="mt-3">
                      กลับไปกรอก Credentials
                    </Button>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" icon="arrow_back" onClick={() => setStep(4)}>ย้อนกลับ</Button>
                  <Button variant="outline" onClick={() => { setSelectedBranch(null); setStep(0); }}>
                    ตั้งค่าสาขาอื่น
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
