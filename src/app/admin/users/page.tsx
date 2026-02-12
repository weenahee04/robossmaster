"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  branch: { id: string; name: string; slug: string } | null;
  createdAt: string;
}

interface BranchOption {
  id: string;
  name: string;
}

const roleMap: Record<string, { label: string; variant: "primary" | "info" | "warning" }> = {
  SUPER_ADMIN: { label: "Super Admin", variant: "primary" },
  BRANCH_ADMIN: { label: "Branch Admin", variant: "info" },
  INVESTOR: { label: "Investor", variant: "warning" },
};

const emptyForm = { name: "", email: "", phone: "", password: "", role: "BRANCH_ADMIN", branchId: "" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");

  const fetchData = () => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => { setUsers(data.users); setBranches(data.branches); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.role,
      branchId: user.branch?.id || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const method = editUser ? "PATCH" : "POST";
      const body = editUser ? { id: editUser.id, ...form } : form;
      if (editUser && !form.password) {
        const { password, ...rest } = body as any;
        const res = await fetch("/api/admin/users", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(rest) });
        if (!res.ok) { const d = await res.json(); setError(d.error || "เกิดข้อผิดพลาด"); return; }
      } else {
        const res = await fetch("/api/admin/users", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) { const d = await res.json(); setError(d.error || "เกิดข้อผิดพลาด"); return; }
      }
      setShowForm(false);
      fetchData();
    } catch { setError("เกิดข้อผิดพลาด"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบผู้ใช้นี้?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch { console.error("Delete error"); }
    finally { setDeleting(""); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingCar />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">ผู้ใช้งาน</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการบัญชีผู้ใช้ทั้งหมด</p>
        </div>
        <Button icon="person_add" onClick={openCreate}>เพิ่มผู้ใช้</Button>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ชื่อ</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">อีเมล</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">บทบาท</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สาขา</th>
                <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">เบอร์โทร</th>
                <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={roleMap[user.role]?.variant || "neutral"}>
                      {roleMap[user.role]?.label || user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.branch?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-600">{user.phone || "-"}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(user)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-primary">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(user.id)} disabled={deleting === user.id} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600 disabled:opacity-50">
                        <span className="material-symbols-outlined text-[18px]">{deleting === user.id ? "progress_activity" : "delete"}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">ไม่มีผู้ใช้งาน</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editUser ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ชื่อ-นามสกุล" icon="person" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="อีเมล" type="email" icon="mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="เบอร์โทร" icon="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label={editUser ? "รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)" : "รหัสผ่าน"} type="password" icon="lock" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editUser} />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">บทบาท</label>
            <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="BRANCH_ADMIN">Branch Admin</option>
              <option value="INVESTOR">Investor</option>
            </select>
          </div>
          {form.role === "BRANCH_ADMIN" && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">สาขา</label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
                <option value="">-- เลือกสาขา --</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger-light rounded-lg">
              <span className="material-symbols-outlined text-danger text-[18px]">error</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button type="submit" icon="save" isLoading={saving}>{editUser ? "บันทึก" : "สร้างผู้ใช้"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
