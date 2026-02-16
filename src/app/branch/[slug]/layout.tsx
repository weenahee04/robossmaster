"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Sidebar, { SidebarItem } from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("Roboss");
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

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

  const branchMenuItems: SidebarItem[] = [
    { label: "แดชบอร์ด", icon: "dashboard", href: `/branch/${slug}/dashboard` },
    { label: "บันทึก Wash", icon: "local_car_wash", href: `/branch/${slug}/wash` },
    { label: "แพ็คเกจสาขา", icon: "inventory_2", href: `/branch/${slug}/wash-packages` },
    { label: "รายรับ", icon: "trending_up", href: `/branch/${slug}/income` },
    { label: "รายจ่าย", icon: "trending_down", href: `/branch/${slug}/expense` },
    { label: "รายงาน", icon: "assessment", href: `/branch/${slug}/reports` },
    { label: "ROI & คืนทุน", icon: "savings", href: `/branch/${slug}/roi` },
    { label: "แจ้งเตือน", icon: "notifications", href: `/branch/${slug}/notifications` },
    { label: "แจ้งซ่อม", icon: "build", href: `/branch/${slug}/service` },
    { label: "SOP", icon: "menu_book", href: `/branch/${slug}/sop` },
    { label: "คู่มือเครื่อง", icon: "precision_manufacturing", href: `/branch/${slug}/manuals` },
    { label: "พนักงาน", icon: "group", href: `/branch/${slug}/hr/employees` },
    { label: "ลงเวลา", icon: "schedule", href: `/branch/${slug}/hr/attendance` },
    { label: "เงินเดือน", icon: "payments", href: `/branch/${slug}/hr/payroll` },
    { label: "ลางาน", icon: "event_busy", href: `/branch/${slug}/hr/leave` },
    { label: "ลิงก์ Loyalty", icon: "qr_code_2", href: `/branch/${slug}/loyalty-link` },
    { label: "แบนเนอร์ Loyalty", icon: "image", href: `/branch/${slug}/loyalty-banners` },
    { label: "สแกนคูปอง", icon: "qr_code_scanner", href: `/branch/${slug}/loyalty-scan` },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/branch/${slug}/login`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        items={branchMenuItems}
        brandName={brandName}
        brandSub={session?.user?.branchName || slug}
        logoUrl={logoUrl}
      />
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        userName={session?.user?.name || ""}
      />
      <main className="lg:ml-72 p-4 lg:p-8">{children}</main>
    </div>
  );
}
