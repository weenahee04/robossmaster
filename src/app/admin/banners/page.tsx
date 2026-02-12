"use client";

import { useEffect, useState, useRef } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface BannerData {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const emptyForm = { title: "", imageUrl: "", linkUrl: "", sortOrder: "0" };

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBanner, setEditBanner] = useState<BannerData | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = () => {
    fetch("/api/admin/banners")
      .then((res) => res.json())
      .then(setBanners)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditBanner(null);
    setForm(emptyForm);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (b: BannerData) => {
    setEditBanner(b);
    setForm({
      title: b.title,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl || "",
      sortOrder: b.sortOrder.toString(),
    });
    setImagePreview(b.imageUrl);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert("ไฟล์ใหญ่เกินไป (สูงสุด 1MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      alert("กรุณาเลือกรูปแบนเนอร์");
      return;
    }
    setSaving(true);
    try {
      if (editBanner) {
        await fetch("/api/admin/banners", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editBanner.id, ...form }),
        });
      } else {
        await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบแบนเนอร์นี้?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting("");
    }
  };

  const toggleActive = async (b: BannerData) => {
    await fetch("/api/admin/banners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, isActive: !b.isActive }),
    });
    fetchData();
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
          <h1 className="text-2xl font-black text-slate-900">แบนเนอร์โฆษณา</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการแบนเนอร์ที่แสดงใน Dashboard สาขา</p>
        </div>
        <Button icon="add" onClick={openCreate}>เพิ่มแบนเนอร์</Button>
      </div>

      {banners.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-slate-300 text-[48px]">image</span>
            <p className="text-slate-400 mt-2">ยังไม่มีแบนเนอร์</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {banners.map((b) => (
            <Card key={b.id}>
              <div className="space-y-3">
                {/* Image Preview */}
                <div className="aspect-[3/1] rounded-lg overflow-hidden bg-slate-100">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{b.title}</h3>
                    {b.linkUrl && (
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{b.linkUrl}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={b.isActive ? "success" : "neutral"} hasDot>
                        {b.isActive ? "เปิดแสดง" : "ปิด"}
                      </Badge>
                      <span className="text-xs text-slate-400">ลำดับ: {b.sortOrder}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button onClick={() => toggleActive(b)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-600">
                      <span className="material-symbols-outlined text-[16px]">{b.isActive ? "visibility_off" : "visibility"}</span>
                    </button>
                    <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-50">
                      <span className="material-symbols-outlined text-[16px]">{deleting === b.id ? "progress_activity" : "delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editBanner ? "แก้ไขแบนเนอร์" : "เพิ่มแบนเนอร์"} maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ชื่อแบนเนอร์" icon="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="เช่น โปรโมชั่นเดือนนี้" />

          {/* Image Upload */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">รูปแบนเนอร์</label>
            {imagePreview ? (
              <div className="space-y-2">
                <div className="aspect-[3/1] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <Button variant="outline" size="sm" icon="refresh" type="button" onClick={() => fileRef.current?.click()}>
                  เปลี่ยนรูป
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-[3/1] rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400 text-[32px]">cloud_upload</span>
                <span className="text-sm text-slate-500">คลิกเพื่ออัพโหลดรูป (สูงสุด 1MB)</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Or paste URL */}
          <Input label="หรือใส่ URL รูปภาพ" icon="link" value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl} onChange={(e) => { setForm({ ...form, imageUrl: e.target.value }); setImagePreview(e.target.value || null); }} placeholder="https://example.com/banner.jpg" />

          <Input label="ลิงก์เมื่อคลิก (ไม่บังคับ)" icon="open_in_new" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://example.com/promo" />

          <Input label="ลำดับการแสดง" type="number" icon="sort" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            <Button type="submit" icon="save" isLoading={saving}>{editBanner ? "บันทึก" : "สร้างแบนเนอร์"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
