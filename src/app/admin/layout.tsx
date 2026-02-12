"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

const adminMenuItems: SidebarItem[] = [
  { label: "แดชบอร์ด", icon: "dashboard", href: "/admin/dashboard" },
  { label: "จัดการสาขา", icon: "store", href: "/admin/branches" },
  { label: "ผู้ใช้งาน", icon: "group", href: "/admin/users" },
  { label: "การเงิน", icon: "account_balance", href: "/admin/finance" },
  { label: "ภาพรวม HR", icon: "badge", href: "/admin/hr" },
  { label: "ตั้งค่า ROI", icon: "calculate", href: "/admin/roi-config" },
  { label: "แพ็คเกจล้าง", icon: "local_car_wash", href: "/admin/wash-packages" },
  { label: "แจ้งเตือน", icon: "notifications", href: "/admin/notifications" },
  { label: "แจ้งซ่อม", icon: "build", href: "/admin/service" },
  { label: "SOP", icon: "menu_book", href: "/admin/sop" },
  { label: "คู่มือเครื่อง", icon: "precision_manufacturing", href: "/admin/manuals" },
  { label: "ตั้งค่าเว็บ", icon: "settings", href: "/admin/site-config" },
  { label: "แบนเนอร์", icon: "image", href: "/admin/banners" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("Roboss");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setLogoUrl(data.config.logoUrl || null);
          setBrandName(data.config.brandName || "Roboss");
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        items={adminMenuItems}
        brandName={brandName}
        brandSub="Admin Panel"
        logoUrl={logoUrl}
      />
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        userName={session?.user?.name || "Admin"}
      />
      <main className="lg:ml-72 p-4 lg:p-8">{children}</main>
    </div>
  );
}
