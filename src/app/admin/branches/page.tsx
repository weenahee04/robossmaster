"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), { ssr: false });

interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  bankAccount: {
    bankName: string;
    bankBranch: string;
    accountName: string;
    accountNumber: string;
    promptPay: string;
  } | null;
  _count: { users: number; employees: number; incomes: number; expenses: number };
}

interface Credentials {
  email: string;
  password: string;
  loginUrl: string;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    bankName: "กสิกรไทย",
    bankBranch: "",
    accountName: "",
    accountNumber: "",
    promptPay: "",
    latitude: 13.7563,
    longitude: 100.5018,
    initialInvestment: "",
    openDate: "",
  });
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [toggling, setToggling] = useState("");

  const bankOptions = [
    "กสิกรไทย",
    "กรุงเทพ",
    "กรุงไทย",
    "ไทยพาณิชย์",
    "กรุงศรีอยุธยา",
    "ทหารไทยธนชาต",
    "ออมสิน",
    "อื่นๆ",
  ];

  const fetchBranches = () => {
    fetch("/api/admin/branches")
      .then((res) => res.json())
      .then(setBranches)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      setCredentials(data.credentials);
      setShowCreate(false);
      setShowCredentials(true);
      setForm({
        name: "",
        address: "",
        phone: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
        bankName: "กสิกรไทย",
        bankBranch: "",
        accountName: "",
        accountNumber: "",
        promptPay: "",
        latitude: 13.7563,
        longitude: 100.5018,
        initialInvestment: "",
        openDate: "",
      });
      fetchBranches();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleToggleActive = async (branch: Branch) => {
    setToggling(branch.id);
    try {
      await fetch("/api/admin/branches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: branch.id, isActive: !branch.isActive }),
      });
      fetchBranches();
    } catch { console.error("Toggle error"); }
    finally { setToggling(""); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">จัดการสาขา</h1>
          <p className="text-sm text-slate-500 mt-1">
            ลงทะเบียนและจัดการสาขาแฟรนไชส์
          </p>
        </div>
        <Button icon="add" onClick={() => setShowCreate(true)}>
          ลงทะเบียนสาขาใหม่
        </Button>
      </div>

      {/* Branches List */}
      <div className="grid gap-4">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">
                    {branch.name}
                  </h3>
                  <Badge
                    variant={branch.isActive ? "success" : "danger"}
                    hasDot
                  >
                    {branch.isActive ? "เปิดใช้งาน" : "ปิด"}
                  </Badge>
                </div>
                {branch.address && (
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    {branch.address}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      group
                    </span>
                    {branch._count.employees} พนักงาน
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      receipt_long
                    </span>
                    {branch._count.incomes} รายการรายรับ
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="content_copy"
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/branch/${branch.slug}/login`
                    )
                  }
                >
                  คัดลอกลิงก์
                </Button>
                <Button
                  variant={branch.isActive ? "danger" : "success"}
                  size="sm"
                  icon={branch.isActive ? "block" : "check_circle"}
                  isLoading={toggling === branch.id}
                  onClick={() => handleToggleActive(branch)}
                >
                  {branch.isActive ? "ปิดสาขา" : "เปิดสาขา"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {branches.length === 0 && (
          <Card>
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2">
                store
              </span>
              <p>ยังไม่มีสาขา กดปุ่ม &quot;ลงทะเบียนสาขาใหม่&quot; เพื่อเริ่มต้น</p>
            </div>
          </Card>
        )}
      </div>

      {/* Create Branch Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="ลงทะเบียนสาขาใหม่"
        maxWidth="xl"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          {/* Owner Info */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">person</span>
              ข้อมูลเจ้าของสาขา
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="ชื่อ-นามสกุล"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                required
              />
              <Input
                label="อีเมล"
                type="email"
                value={form.ownerEmail}
                onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                required
              />
              <Input
                label="เบอร์โทร"
                value={form.ownerPhone}
                onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Branch Info */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">store</span>
              ข้อมูลสาขา
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="ชื่อสาขา"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="เช่น Roboss บางพลี"
                required
              />
              <Input
                label="เบอร์โทรสาขา"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="ที่อยู่"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="เช่น 115/216 หมู่10 ต.บางรัดพัฒนา อ.บางบัวทอง จ.นนทบุรี 11110"
                />
              </div>
              <Input
                label="เงินลงทุนเริ่มต้น (บาท)"
                type="number"
                value={form.initialInvestment}
                onChange={(e) => setForm({ ...form, initialInvestment: e.target.value })}
                placeholder="เช่น 1500000"
              />
              <Input
                label="วันที่เปิดสาขา"
                type="date"
                value={form.openDate}
                onChange={(e) => setForm({ ...form, openDate: e.target.value })}
              />
            </div>
          </div>

          {/* Bank Info */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              ข้อมูลบัญชีธนาคาร
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  ธนาคาร
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                >
                  {bankOptions.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="สาขาธนาคาร"
                value={form.bankBranch}
                onChange={(e) => setForm({ ...form, bankBranch: e.target.value })}
                placeholder="เช่น เยส บางพลี"
              />
              <Input
                label="ชื่อบัญชี"
                value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              />
              <Input
                label="เลขบัญชี"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="เช่น 095-1-38735-5"
              />
              <Input
                label="พร้อมเพย์"
                value={form.promptPay}
                onChange={(e) => setForm({ ...form, promptPay: e.target.value })}
                placeholder="เช่น 084-169-8674"
              />
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">map</span>
              ตำแหน่งสาขา
            </h3>
            <MapPicker
              latitude={form.latitude}
              longitude={form.longitude}
              address={form.address}
              onChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger-light rounded-lg">
              <span className="material-symbols-outlined text-danger text-[18px]">error</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" icon="add" isLoading={creating}>
              ลงทะเบียนสาขา
            </Button>
          </div>
        </form>
      </Modal>

      {/* Credentials Modal */}
      <Modal
        isOpen={showCredentials}
        onClose={() => setShowCredentials(false)}
        title="สร้างสาขาสำเร็จ!"
        maxWidth="md"
      >
        {credentials && (
          <div className="space-y-4">
            <div className="bg-success-light rounded-lg p-4">
              <p className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                สร้างสาขาเรียบร้อยแล้ว ส่งข้อมูลด้านล่างให้เจ้าของสาขา
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  ลิงก์เข้าสู่ระบบ
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-primary font-mono flex-1 break-all">
                    {window.location.origin}{credentials.loginUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}${credentials.loginUrl}`)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  อีเมล
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-slate-800 font-mono flex-1">{credentials.email}</code>
                  <button
                    onClick={() => copyToClipboard(credentials.email)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  รหัสผ่าน
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-slate-800 font-mono flex-1">{credentials.password}</code>
                  <button
                    onClick={() => copyToClipboard(credentials.password)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowCredentials(false)}>ปิด</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
