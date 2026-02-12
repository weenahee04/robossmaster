"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingCar from "@/components/illustrations/LoadingCar";

interface MaintenanceSchedule {
  id: string;
  taskName: string;
  frequency: string;
  lastDoneAt: string | null;
  nextDueAt: string | null;
  status: string;
}

interface Manual {
  id: string;
  title: string;
  machineModel: string;
  content: string;
  videoUrl: string | null;
  checklist: string | null;
  maintenanceSchedules?: MaintenanceSchedule[];
}

const freqMap: Record<string, string> = { DAILY: "ทุกวัน", WEEKLY: "ทุกสัปดาห์", MONTHLY: "ทุกเดือน", QUARTERLY: "ทุก 3 เดือน", YEARLY: "ทุกปี" };

export default function BranchManualsPage() {
  const { data: session } = useSession();
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Manual | null>(null);

  useEffect(() => {
    const branchId = session?.user?.branchId || "";
    fetch(`/api/manuals?branchId=${branchId}`)
      .then((res) => res.json())
      .then(setManuals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingCar /></div>;
  }

  if (selected) {
    const checklist: string[] = selected.checklist ? JSON.parse(selected.checklist) : [];
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>กลับ
        </button>
        <div>
          <Badge variant="info">{selected.machineModel}</Badge>
          <h1 className="text-2xl font-black text-slate-900 mt-2">{selected.title}</h1>
        </div>

        {selected.videoUrl && (
          <Card title="วิดีโอสอน">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe src={selected.videoUrl} className="w-full h-full" allowFullScreen title={selected.title} />
            </div>
          </Card>
        )}

        <Card title="คู่มือ">
          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">{selected.content.replace(/^# .+\n\n/, "")}</div>
        </Card>

        {checklist.length > 0 && (
          <Card title="Checklist บำรุงรักษา">
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <label key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </Card>
        )}

        {selected.maintenanceSchedules && selected.maintenanceSchedules.length > 0 && (
          <Card title="ตาราง PM (Preventive Maintenance)">
            <div className="space-y-3">
              {selected.maintenanceSchedules.map((pm) => (
                <div key={pm.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{pm.taskName}</p>
                    <p className="text-xs text-slate-400">{freqMap[pm.frequency] || pm.frequency}</p>
                  </div>
                  <div className="sm:text-right">
                    <Badge variant={pm.status === "DONE" ? "success" : pm.status === "OVERDUE" ? "danger" : "warning"} hasDot>
                      {pm.status === "DONE" ? "เสร็จแล้ว" : pm.status === "OVERDUE" ? "เลยกำหนด" : "รอดำเนินการ"}
                    </Badge>
                    {pm.nextDueAt && <p className="text-xs text-slate-400 mt-1">ครั้งถัดไป: {new Date(pm.nextDueAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">คู่มือเครื่อง</h1>
        <p className="text-sm text-slate-500 mt-1">Digital Manual + Checklist + PM Schedule</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {manuals.map((manual) => (
          <button key={manual.id} onClick={() => setSelected(manual)} className="text-left">
            <Card>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">precision_manufacturing</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{manual.title}</h3>
                  <Badge variant="neutral" className="mt-1">{manual.machineModel}</Badge>
                  <div className="flex gap-2 mt-2">
                    {manual.videoUrl && <span className="text-xs text-slate-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">play_circle</span>วิดีโอ</span>}
                    {manual.checklist && <span className="text-xs text-slate-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">checklist</span>Checklist</span>}
                  </div>
                </div>
              </div>
            </Card>
          </button>
        ))}
        {manuals.length === 0 && (
          <Card className="sm:col-span-2">
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2">menu_book</span>
              <p>ยังไม่มีคู่มือ</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
