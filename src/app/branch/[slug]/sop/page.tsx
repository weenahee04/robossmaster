"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface SopDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  videoUrl: string | null;
}

const categoryMap: Record<string, { label: string; icon: string }> = {
  STAFF: { label: "พนักงานหน้าร้าน", icon: "person" },
  WASH_CAR: { label: "ล้างรถยนต์", icon: "directions_car" },
  WASH_BIKE: { label: "ล้างมอเตอร์ไซค์", icon: "two_wheeler" },
  OPEN_CLOSE: { label: "เปิด-ปิดร้าน", icon: "store" },
  SAFETY: { label: "ความปลอดภัย", icon: "health_and_safety" },
  TROUBLESHOOT: { label: "แก้ปัญหาเบื้องต้น", icon: "build" },
};

export default function BranchSopPage() {
  const [sops, setSops] = useState<SopDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SopDoc | null>(null);
  const [filterCat, setFilterCat] = useState("");

  useEffect(() => {
    fetch("/api/sop")
      .then((res) => res.json())
      .then(setSops)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  const filtered = filterCat ? sops.filter((s) => s.category === filterCat) : sops;
  const categories = [...new Set(sops.map((s) => s.category))];

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>กลับ
        </button>
        <div>
          <Badge variant="info">{categoryMap[selected.category]?.label || selected.category}</Badge>
          <h1 className="text-2xl font-black text-slate-900 mt-2">{selected.title}</h1>
        </div>
        {selected.videoUrl && (
          <Card title="วิดีโอสอน">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe src={selected.videoUrl} className="w-full h-full" allowFullScreen title={selected.title} />
            </div>
          </Card>
        )}
        <Card>
          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">{selected.content.replace(/^# .+\n\n/, "")}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">SOP คู่มือปฏิบัติงาน</h1>
        <p className="text-sm text-slate-500 mt-1">มาตรฐานการทำงานทุกสาขา</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterCat("")} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${!filterCat ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>ทั้งหมด</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${filterCat === cat ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            <span className="material-symbols-outlined text-[16px]">{categoryMap[cat]?.icon || "description"}</span>
            {categoryMap[cat]?.label || cat}
          </button>
        ))}
      </div>

      {/* SOP List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((sop) => (
          <button key={sop.id} onClick={() => setSelected(sop)} className="text-left">
            <Card>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{categoryMap[sop.category]?.icon || "description"}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{sop.title}</h3>
                  <Badge variant="info" className="mt-1">{categoryMap[sop.category]?.label || sop.category}</Badge>
                </div>
              </div>
            </Card>
          </button>
        ))}
        {filtered.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2">description</span>
              <p>ไม่มี SOP</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
