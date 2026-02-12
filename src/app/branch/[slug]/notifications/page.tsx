"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeIcon: Record<string, string> = {
  INCOME_DROP: "trending_down",
  MACHINE_DOWN: "build",
  EXPENSE_HIGH: "warning",
  ABSENT_FREQUENT: "person_off",
};
const typeColor: Record<string, string> = {
  INCOME_DROP: "text-red-500 bg-red-50",
  MACHINE_DOWN: "text-orange-500 bg-orange-50",
  EXPENSE_HIGH: "text-amber-500 bg-amber-50",
  ABSENT_FREQUENT: "text-purple-500 bg-purple-50",
};

export default function BranchNotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    if (!session?.user?.branchId) return;
    fetch(`/api/branch/notifications?branchId=${session.user.branchId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [session]);

  const markAllRead = async () => {
    await fetch("/api/branch/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchId: session?.user?.branchId }),
    });
    fetchData();
  };

  const markRead = async (id: string) => {
    await fetch("/api/branch/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span></div>;
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">แจ้งเตือน</h1>
          <p className="text-sm text-slate-500 mt-1">{unread > 0 ? `${unread} รายการยังไม่อ่าน` : "ไม่มีแจ้งเตือนใหม่"}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" icon="done_all" onClick={markAllRead}>อ่านทั้งหมด</Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id}>
            <div className={`flex items-start gap-4 ${n.isRead ? "opacity-60" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColor[n.type] || "text-slate-500 bg-slate-100"}`}>
                <span className="material-symbols-outlined text-[20px]">{typeIcon[n.type] || "notifications"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">{n.title}</h3>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-all shrink-0" title="อ่านแล้ว">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">check</span>
                </button>
              )}
            </div>
          </Card>
        ))}
        {notifications.length === 0 && (
          <Card>
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-2">notifications_off</span>
              <p>ไม่มีแจ้งเตือน</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
