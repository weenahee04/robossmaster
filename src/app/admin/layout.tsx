"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar, { SidebarGroup } from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

const adminMenuGroups: SidebarGroup[] = [
  {
    title: "ภาพรวม",
    icon: "dashboard",
    items: [
      { label: "แดชบอร์ด", icon: "dashboard", href: "/admin/dashboard" },
      { label: "จัดการสาขา", icon: "store", href: "/admin/branches" },
    ],
  },
  {
    title: "การเงิน",
    icon: "account_balance",
    items: [
      { label: "ภาพรวมการเงิน", icon: "account_balance", href: "/admin/finance" },
      { label: "ตั้งค่า ROI", icon: "calculate", href: "/admin/roi-config" },
    ],
  },
  {
    title: "บุคลากร",
    icon: "badge",
    items: [
      { label: "ภาพรวม HR", icon: "badge", href: "/admin/hr" },
    ],
  },
  {
    title: "ปฏิบัติการ",
    icon: "local_car_wash",
    items: [
      { label: "แพ็คเกจล้าง", icon: "local_car_wash", href: "/admin/wash-packages" },
      { label: "แจ้งซ่อม", icon: "build", href: "/admin/service" },
      { label: "SOP", icon: "menu_book", href: "/admin/sop" },
      { label: "คู่มือเครื่อง", icon: "precision_manufacturing", href: "/admin/manuals" },
    ],
  },
  {
    title: "Loyalty",
    icon: "loyalty",
    items: [
      { label: "ลูกค้า", icon: "people", href: "/admin/loyalty-customers" },
      { label: "คูปอง", icon: "confirmation_number", href: "/admin/loyalty-coupons" },
      { label: "ลิงก์ Loyalty", icon: "qr_code_2", href: "/admin/loyalty-links" },
      { label: "ตั้งค่า Loyalty", icon: "loyalty", href: "/admin/loyalty-config" },
      { label: "แบนเนอร์", icon: "image", href: "/admin/banners" },
    ],
  },
  {
    title: "LINE",
    icon: "chat",
    items: [
      { label: "ตั้งค่า LINE", icon: "chat", href: "/admin/line-setup" },
    ],
  },
  {
    title: "ระบบ",
    icon: "settings",
    items: [
      { label: "ผู้ใช้งาน", icon: "group", href: "/admin/users" },
      { label: "แจ้งเตือน", icon: "notifications", href: "/admin/notifications" },
      { label: "ตั้งค่าเว็บ", icon: "settings", href: "/admin/site-config" },
    ],
  },
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
    <div className="admin-dark min-h-screen bg-[#0a0a0a] text-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        groups={adminMenuGroups}
        brandName={brandName}
        brandSub="Admin Panel"
        logoUrl={logoUrl}
        variant="dark"
      />
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        userName={session?.user?.name || "Admin"}
        variant="dark"
      />
      <main className="lg:ml-72 p-4 lg:p-8">{children}</main>
    </div>
  );
}
