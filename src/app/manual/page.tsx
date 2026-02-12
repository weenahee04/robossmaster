"use client";

import { useState } from "react";
import Link from "next/link";

const sections = [
  { id: "overview", title: "ภาพรวมระบบ", icon: "info" },
  { id: "login", title: "การเข้าสู่ระบบ", icon: "login" },
  { id: "admin", title: "Admin Portal", icon: "admin_panel_settings", children: [
    { id: "admin-dashboard", title: "แดชบอร์ด" },
    { id: "admin-branches", title: "จัดการสาขา" },
    { id: "admin-users", title: "ผู้ใช้งาน" },
    { id: "admin-finance", title: "การเงิน" },
    { id: "admin-hr", title: "ภาพรวม HR" },
    { id: "admin-roi", title: "ตั้งค่า ROI" },
    { id: "admin-wash", title: "แพ็คเกจล้าง" },
    { id: "admin-notify", title: "แจ้งเตือน" },
    { id: "admin-service", title: "แจ้งซ่อม" },
    { id: "admin-sop", title: "SOP" },
    { id: "admin-manuals", title: "คู่มือเครื่อง" },
    { id: "admin-site", title: "ตั้งค่าเว็บ" },
    { id: "admin-banners", title: "แบนเนอร์" },
  ]},
  { id: "branch", title: "Branch Portal", icon: "store", children: [
    { id: "branch-dashboard", title: "แดชบอร์ด" },
    { id: "branch-wash", title: "บันทึก Wash" },
    { id: "branch-income", title: "รายรับ" },
    { id: "branch-expense", title: "รายจ่าย" },
    { id: "branch-reports", title: "รายงาน" },
    { id: "branch-roi", title: "ROI & คืนทุน" },
    { id: "branch-notify", title: "แจ้งเตือน" },
    { id: "branch-service", title: "แจ้งซ่อม" },
    { id: "branch-sop", title: "SOP" },
    { id: "branch-manuals", title: "คู่มือเครื่อง" },
    { id: "branch-employees", title: "พนักงาน" },
    { id: "branch-attendance", title: "ลงเวลา" },
    { id: "branch-payroll", title: "เงินเดือน" },
    { id: "branch-leave", title: "ลางาน" },
  ]},
  { id: "investor", title: "Investor Portal", icon: "trending_up" },
  { id: "faq", title: "คำถามที่พบบ่อย", icon: "help" },
];

export default function ManualPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/roboss-logo.png" alt="Roboss" className="w-8 h-8 rounded-lg" />
              <span className="text-lg font-black text-slate-900">Roboss</span>
            </Link>
            <span className="hidden sm:inline text-sm text-slate-400 ml-2">คู่มือการใช้งาน</span>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            กลับหน้าหลัก
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside className={`fixed lg:sticky top-16 left-0 z-30 w-72 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 overflow-y-auto transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <nav className="p-4 space-y-1">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => scrollTo(section.id)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === section.id ? "bg-primary-50 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{section.icon}</span>
                  {section.title}
                </button>
                {section.children && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => scrollTo(child.id)}
                        className={`block w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeSection === child.id ? "text-primary bg-primary-50/50" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        {child.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-4 lg:px-12 py-8 lg:py-12">
          <div className="max-w-3xl mx-auto space-y-16">

            {/* ===== ภาพรวมระบบ ===== */}
            <section id="overview">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[22px]">info</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900">ภาพรวมระบบ</h1>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  <strong>Roboss</strong> คือระบบจัดการแฟรนไชส์ร้านล้างรถอัตโนมัติ ออกแบบมาเพื่อให้เจ้าของธุรกิจ ผู้จัดการสาขา และนักลงทุน สามารถบริหารจัดการได้อย่างมีประสิทธิภาพผ่านเว็บเบราว์เซอร์
                </p>

                <h3 className="text-lg font-bold text-slate-800">ระบบแบ่งออกเป็น 3 Portal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-primary-50 p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
                      <span className="font-bold text-primary">Admin Portal</span>
                    </div>
                    <p className="text-xs text-slate-600">สำหรับเจ้าของธุรกิจ / Super Admin จัดการทุกอย่างในระบบ</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4 border border-blue-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">store</span>
                      <span className="font-bold text-blue-600">Branch Portal</span>
                    </div>
                    <p className="text-xs text-slate-600">สำหรับผู้จัดการสาขา บันทึกรายรับ-รายจ่าย Wash พนักงาน</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-slate-700 text-[20px]">trending_up</span>
                      <span className="font-bold text-slate-700">Investor Portal</span>
                    </div>
                    <p className="text-xs text-slate-600">สำหรับนักลงทุน ดูภาพรวมธุรกิจ (Read-only)</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800">บทบาทผู้ใช้ (Roles)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-200"><th className="text-left py-2 px-3 font-bold text-slate-700">Role</th><th className="text-left py-2 px-3 font-bold text-slate-700">สิทธิ์</th></tr></thead>
                    <tbody>
                      <tr className="border-b border-slate-100"><td className="py-2 px-3 font-semibold text-primary">Super Admin</td><td className="py-2 px-3 text-slate-600">เข้าถึงทุกฟีเจอร์ จัดการสาขา ผู้ใช้ การเงิน ตั้งค่าระบบ</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-2 px-3 font-semibold text-blue-600">Branch Admin</td><td className="py-2 px-3 text-slate-600">จัดการสาขาตัวเอง บันทึกรายรับ-รายจ่าย Wash พนักงาน</td></tr>
                      <tr><td className="py-2 px-3 font-semibold text-amber-600">Investor</td><td className="py-2 px-3 text-slate-600">ดูภาพรวมธุรกิจ (Read-only) Export รายงาน</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ===== การเข้าสู่ระบบ ===== */}
            <section id="login">
              <SectionHeader icon="login" title="การเข้าสู่ระบบ" />
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <SubSection title="Admin Login">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                    <li>เปิดเว็บไซต์ แล้วกดปุ่ม <strong>&quot;เข้าสู่ระบบ Admin&quot;</strong></li>
                    <li>กรอก <strong>อีเมล</strong> และ <strong>รหัสผ่าน</strong> ที่ได้รับจากผู้ดูแลระบบ</li>
                    <li>กดปุ่ม <strong>&quot;เข้าสู่ระบบ&quot;</strong></li>
                    <li>ระบบจะพาไปหน้า Admin Dashboard</li>
                  </ol>
                </SubSection>
                <SubSection title="Branch Login">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                    <li>เปิด URL ของสาขา: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/branch/&#123;slug&#125;/login</code></li>
                    <li>กรอก <strong>อีเมล</strong> และ <strong>รหัสผ่าน</strong> ของ Branch Admin</li>
                    <li>กดปุ่ม <strong>&quot;เข้าสู่ระบบ&quot;</strong></li>
                  </ol>
                  <Tip>URL สำหรับ login สาขาจะได้รับจาก Admin ตอนสร้างสาขา</Tip>
                </SubSection>
                <SubSection title="Investor Login">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                    <li>เปิดเว็บไซต์ แล้วกดปุ่ม <strong>&quot;Investor Portal&quot;</strong></li>
                    <li>กรอก <strong>อีเมล</strong> และ <strong>รหัสผ่าน</strong> ที่ได้รับจาก Admin</li>
                    <li>กดปุ่ม <strong>&quot;เข้าสู่ระบบ&quot;</strong></li>
                  </ol>
                </SubSection>
                <SubSection title="ออกจากระบบ">
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    <li><strong>Admin / Branch:</strong> กดปุ่ม &quot;ออกจากระบบ&quot; ที่ด้านล่างของ Sidebar</li>
                    <li><strong>Investor:</strong> กดปุ่ม &quot;ออกจากระบบ&quot; ที่มุมขวาบน</li>
                  </ul>
                </SubSection>
              </div>
            </section>

            {/* ===== ADMIN PORTAL ===== */}
            <section id="admin">
              <SectionHeader icon="admin_panel_settings" title="Admin Portal — สำนักงานใหญ่" color="primary" />
            </section>

            <FeatureSection id="admin-dashboard" title="แดชบอร์ด" path="/admin/dashboard">
              <p className="text-sm text-slate-600 mb-3">หน้าภาพรวมของระบบทั้งหมด แสดง:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>สาขาทั้งหมด</strong> — จำนวนสาขาที่เปิดใช้งาน</li>
                <li><strong>รายรับรวม (เดือนนี้)</strong> — ยอดรายรับรวมทุกสาขา</li>
                <li><strong>รายจ่ายรวม (เดือนนี้)</strong> — ยอดรายจ่ายรวมทุกสาขา</li>
                <li><strong>กำไรสุทธิ</strong> — รายรับ - รายจ่าย</li>
                <li><strong>กราฟรายรับ-รายจ่ายรายสัปดาห์</strong> — แสดงเป็น Bar Chart</li>
                <li><strong>รายการล่าสุด</strong> — รายรับ/รายจ่ายล่าสุดจากทุกสาขา</li>
              </ul>
            </FeatureSection>

            <FeatureSection id="admin-branches" title="จัดการสาขา" path="/admin/branches">
              <SubSection title="สร้างสาขาใหม่">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>กดปุ่ม <strong>&quot;+ สร้างสาขา&quot;</strong></li>
                  <li>กรอกข้อมูล:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-500">
                      <li><strong>ชื่อสาขา</strong> (จำเป็น) — เช่น &quot;สาขาบางนา&quot;</li>
                      <li><strong>ที่อยู่</strong> — ที่อยู่ร้าน</li>
                      <li><strong>เบอร์โทร</strong> — เบอร์ติดต่อสาขา</li>
                      <li><strong>อีเมลสาขา</strong> — อีเมลสำหรับ login</li>
                      <li><strong>รหัสผ่าน</strong> — รหัสผ่านสำหรับ login</li>
                      <li><strong>ข้อมูลบัญชีธนาคาร</strong> — ชื่อธนาคาร, สาขาธนาคาร, ชื่อบัญชี, เลขบัญชี, PromptPay</li>
                      <li><strong>ตำแหน่งบนแผนที่</strong> — ปักหมุดตำแหน่งร้าน</li>
                    </ul>
                  </li>
                  <li>กดปุ่ม <strong>&quot;สร้างสาขา&quot;</strong></li>
                  <li>ระบบจะแสดง <strong>ข้อมูล Login</strong> ของสาขา — <strong className="text-primary">บันทึกไว้ให้ดี!</strong></li>
                </ol>
              </SubSection>
              <SubSection title="จัดการสาขาที่มีอยู่">
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  <li><strong>ดูรายละเอียด</strong> — กดที่การ์ดสาขาเพื่อดูข้อมูลทั้งหมด</li>
                  <li><strong>เปิด/ปิดสาขา</strong> — Toggle สถานะ Active/Inactive</li>
                  <li><strong>แก้ไข</strong> — แก้ไขข้อมูลสาขา</li>
                  <li><strong>ลบ</strong> — ลบสาขา (จะลบข้อมูลที่เกี่ยวข้องทั้งหมด)</li>
                </ul>
              </SubSection>
              <Warning>การลบสาขาจะลบข้อมูลผู้ใช้ บัญชีธนาคาร และข้อมูลทั้งหมดของสาขานั้น</Warning>
            </FeatureSection>

            <FeatureSection id="admin-users" title="ผู้ใช้งาน" path="/admin/users">
              <SubSection title="เพิ่มผู้ใช้ใหม่">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>กดปุ่ม <strong>&quot;+ เพิ่มผู้ใช้&quot;</strong></li>
                  <li>กรอกข้อมูล: ชื่อ, อีเมล, เบอร์โทร, รหัสผ่าน</li>
                  <li>เลือก <strong>บทบาท</strong> — Super Admin / Branch Admin / Investor</li>
                  <li>เลือก <strong>สาขา</strong> (กรณี Branch Admin)</li>
                  <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
                </ol>
              </SubSection>
              <Tip>Branch Admin จะต้องเลือกสาขาที่สังกัด, Investor ไม่ต้องเลือกสาขา</Tip>
            </FeatureSection>

            <FeatureSection id="admin-finance" title="การเงิน" path="/admin/finance">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>รายรับรวม</strong> — ยอดรายรับทั้งหมดของเดือนนี้</li>
                <li><strong>รายจ่ายรวม</strong> — ยอดรายจ่ายทั้งหมดของเดือนนี้</li>
                <li><strong>กำไรสุทธิ</strong> — รายรับ - รายจ่าย</li>
                <li><strong>ตารางเปรียบเทียบรายสาขา</strong> — แสดงรายรับ/รายจ่ายแยกตามสาขา</li>
                <li><strong>กราฟแนวโน้ม</strong> — กราฟรายรับ-รายจ่ายตามช่วงเวลา</li>
              </ul>
            </FeatureSection>

            <FeatureSection id="admin-hr" title="ภาพรวม HR" path="/admin/hr">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>จำนวนพนักงานทั้งหมด</strong> — รวมทุกสาขา</li>
                <li><strong>สถิติการลงเวลา</strong> — เข้างาน/ขาดงาน/มาสาย</li>
                <li><strong>สถิติการลา</strong> — จำนวนวันลาแยกตามประเภท</li>
                <li><strong>ข้อมูลเงินเดือน</strong> — ยอดเงินเดือนรวม</li>
              </ul>
            </FeatureSection>

            <FeatureSection id="admin-roi" title="ตั้งค่า ROI" path="/admin/roi-config">
              <p className="text-sm text-slate-600 mb-3">ตั้งค่าพารามิเตอร์สำหรับคำนวณ ROI (Return on Investment)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-200"><th className="text-left py-2 px-3 font-bold text-slate-700">พารามิเตอร์</th><th className="text-left py-2 px-3 font-bold text-slate-700">คำอธิบาย</th><th className="text-left py-2 px-3 font-bold text-slate-700">ค่าเริ่มต้น</th></tr></thead>
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-100"><td className="py-2 px-3 font-medium">อัตราค่าเสื่อมราคา</td><td className="py-2 px-3">เปอร์เซ็นต์ค่าเสื่อมราคาต่อปี</td><td className="py-2 px-3">10%</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-3 font-medium">ค่าธรรมเนียม Admin</td><td className="py-2 px-3">เปอร์เซ็นต์ค่าบริหารจัดการ</td><td className="py-2 px-3">5%</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-3 font-medium">เป้าหมาย ROI</td><td className="py-2 px-3">เป้าหมายผลตอบแทนต่อปี</td><td className="py-2 px-3">25%</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-3 font-medium">เป้าหมายคืนทุน</td><td className="py-2 px-3">จำนวนเดือนที่คาดว่าจะคืนทุน</td><td className="py-2 px-3">24 เดือน</td></tr>
                    <tr><td className="py-2 px-3 font-medium">รวมเงินเดือนในต้นทุน</td><td className="py-2 px-3">นับเงินเดือนเป็นต้นทุนหรือไม่</td><td className="py-2 px-3">เปิด</td></tr>
                  </tbody>
                </table>
              </div>
            </FeatureSection>

            <FeatureSection id="admin-wash" title="แพ็คเกจล้าง" path="/admin/wash-packages">
              <SubSection title="เพิ่มแพ็คเกจ">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>กดปุ่ม <strong>&quot;+ เพิ่มแพ็คเกจ&quot;</strong></li>
                  <li>กรอก: ชื่อแพ็คเกจ, ประเภท (CAR/BIKE/HELMET), ราคา</li>
                  <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
                </ol>
              </SubSection>
              <SubSection title="แพ็คเกจเริ่มต้น">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-slate-200"><th className="text-left py-2 px-3 font-bold text-slate-700">แพ็คเกจ</th><th className="text-left py-2 px-3 font-bold text-slate-700">ประเภท</th><th className="text-left py-2 px-3 font-bold text-slate-700">ราคา</th></tr></thead>
                    <tbody className="text-slate-600">
                      <tr className="border-b border-slate-100"><td className="py-1.5 px-3">ล้างรถยนต์ ธรรมดา</td><td className="py-1.5 px-3">CAR</td><td className="py-1.5 px-3">฿80</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1.5 px-3">ล้างรถยนต์ พรีเมียม</td><td className="py-1.5 px-3">CAR</td><td className="py-1.5 px-3">฿150</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1.5 px-3">เคลือบแก้วรถยนต์</td><td className="py-1.5 px-3">CAR</td><td className="py-1.5 px-3">฿350</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1.5 px-3">ล้างมอเตอร์ไซค์</td><td className="py-1.5 px-3">BIKE</td><td className="py-1.5 px-3">฿40</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-1.5 px-3">ล้างมอเตอร์ไซค์ พรีเมียม</td><td className="py-1.5 px-3">BIKE</td><td className="py-1.5 px-3">฿80</td></tr>
                      <tr><td className="py-1.5 px-3">ล้างหมวกกันน็อค</td><td className="py-1.5 px-3">HELMET</td><td className="py-1.5 px-3">฿50</td></tr>
                    </tbody>
                  </table>
                </div>
              </SubSection>
            </FeatureSection>

            <FeatureSection id="admin-notify" title="แจ้งเตือน" path="/admin/notifications">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>กดปุ่ม <strong>&quot;+ สร้างแจ้งเตือน&quot;</strong></li>
                <li>กรอก <strong>หัวข้อ</strong> และ <strong>เนื้อหา</strong></li>
                <li>เลือกสาขาที่ต้องการส่ง (หรือส่งทุกสาขา)</li>
                <li>กดปุ่ม <strong>&quot;ส่ง&quot;</strong></li>
              </ol>
            </FeatureSection>

            <FeatureSection id="admin-service" title="แจ้งซ่อม" path="/admin/service">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>รายการแจ้งซ่อม</strong> — แสดงคำขอทั้งหมดจากทุกสาขา</li>
                <li><strong>สถานะ</strong> — รอดำเนินการ / กำลังดำเนินการ / เสร็จสิ้น</li>
                <li><strong>อัปเดตสถานะ</strong> — เปลี่ยนสถานะการซ่อม</li>
                <li><strong>เพิ่มหมายเหตุ</strong> — บันทึกรายละเอียดการซ่อม</li>
              </ul>
            </FeatureSection>

            <FeatureSection id="admin-sop" title="SOP" path="/admin/sop">
              <p className="text-sm text-slate-600 mb-3">จัดการเอกสาร SOP (Standard Operating Procedure) สำหรับทุกสาขา</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li><strong>เพิ่ม SOP</strong> — กดปุ่ม &quot;+ สร้าง SOP&quot; กรอกหัวข้อ หมวดหมู่ และเนื้อหา (รองรับ Markdown)</li>
                <li><strong>แก้ไข</strong> — กดที่ SOP เพื่อแก้ไขเนื้อหา</li>
                <li><strong>ลบ</strong> — ลบ SOP ที่ไม่ต้องการ</li>
              </ol>
              <Tip>SOP ที่สร้างจะแสดงในหน้า SOP ของทุกสาขาอัตโนมัติ</Tip>
            </FeatureSection>

            <FeatureSection id="admin-manuals" title="คู่มือเครื่อง" path="/admin/manuals">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>กดปุ่ม <strong>&quot;+ เพิ่มคู่มือ&quot;</strong></li>
                <li>กรอก: ชื่อคู่มือ, รุ่นเครื่อง, เนื้อหา (Markdown), ลิงก์วิดีโอ, Checklist</li>
                <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
              </ol>
            </FeatureSection>

            <FeatureSection id="admin-site" title="ตั้งค่าเว็บ" path="/admin/site-config">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>ชื่อแบรนด์</strong> — ชื่อที่แสดงใน Sidebar, หน้า Login และทั่วทั้งระบบ</li>
                <li><strong>โลโก้</strong> — อัปโหลดรูปโลโก้ (รองรับ JPG, PNG)</li>
              </ul>
              <Tip>ดูตัวอย่าง Sidebar ด้านล่างเพื่อตรวจสอบก่อนบันทึก</Tip>
            </FeatureSection>

            <FeatureSection id="admin-banners" title="แบนเนอร์" path="/admin/banners">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>กดปุ่ม <strong>&quot;+ เพิ่มแบนเนอร์&quot;</strong></li>
                <li>กรอก: ชื่อแบนเนอร์, URL รูปภาพ, URL ลิงก์ (ถ้ามี), ลำดับ</li>
                <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
              </ol>
              <Tip>แบนเนอร์จะแสดงเป็น Slideshow อัตโนมัติในหน้า Dashboard ของทุกสาขา (สลับทุก 5 วินาที)</Tip>
            </FeatureSection>

            {/* ===== BRANCH PORTAL ===== */}
            <section id="branch">
              <SectionHeader icon="store" title="Branch Portal — สาขา" color="blue" />
            </section>

            <FeatureSection id="branch-dashboard" title="แดชบอร์ด" path="/branch/{slug}/dashboard" color="blue">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>แบนเนอร์โปรโมชั่น</strong> — Slideshow จาก Admin</li>
                <li><strong>ยอดขายวันนี้</strong> — รายรับวันนี้</li>
                <li><strong>รายรับ/รายจ่ายเดือนนี้</strong> — ยอดสะสมของเดือน</li>
                <li><strong>กำไรสุทธิ</strong> — แสดงสีเขียว/แดงตามกำไร/ขาดทุน</li>
                <li><strong>สถิติ Wash วันนี้</strong> — จำนวนรถ/มอเตอร์ไซค์/หมวก</li>
                <li><strong>กราฟรายสัปดาห์</strong> — Bar Chart รายรับ-รายจ่าย</li>
                <li><strong>หมวดหมู่รายจ่ายสูงสุด</strong> — Top 5</li>
              </ul>
            </FeatureSection>

            <FeatureSection id="branch-wash" title="บันทึก Wash" path="/branch/{slug}/wash" color="blue">
              <SubSection title="บันทึกการล้าง">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>กดปุ่ม <strong>&quot;+ บันทึก Wash&quot;</strong></li>
                  <li>เลือก <strong>แพ็คเกจ</strong> ที่ลูกค้าเลือก (แยกตามประเภท: รถยนต์ / มอเตอร์ไซค์ / หมวก)</li>
                  <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
                  <li>ระบบจะบันทึกรายการและ <strong>เพิ่มรายรับอัตโนมัติ</strong></li>
                </ol>
              </SubSection>
              <SubSection title="ข้อมูลที่แสดง">
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  <li><strong>สถิติวันนี้/เดือนนี้</strong> — จำนวนและรายได้แยกตามประเภท</li>
                  <li><strong>รายได้ตามแพ็คเกจ</strong> — จำนวนครั้งและรายได้แยกตามแพ็คเกจ</li>
                  <li><strong>ประวัติการล้าง</strong> — รายการทั้งหมดเรียงตามวันที่</li>
                </ul>
              </SubSection>
            </FeatureSection>

            <FeatureSection id="branch-income" title="รายรับ" path="/branch/{slug}/income" color="blue">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>กดปุ่ม <strong>&quot;+ เพิ่มรายรับ&quot;</strong></li>
                <li>กรอก: จำนวนเงิน, หมวดหมู่ (ล้างรถ/เคลือบแก้ว/ขัดสี/อื่นๆ), หมายเหตุ, วันที่</li>
                <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
              </ol>
              <Tip>รายรับจากการบันทึก Wash จะถูกเพิ่มอัตโนมัติ ไม่ต้องบันทึกซ้ำ</Tip>
            </FeatureSection>

            <FeatureSection id="branch-expense" title="รายจ่าย" path="/branch/{slug}/expense" color="blue">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>กดปุ่ม <strong>&quot;+ เพิ่มรายจ่าย&quot;</strong></li>
                <li>กรอก: จำนวนเงิน, หมวดหมู่ (ค่าน้ำ/ค่าไฟ/ค่าเช่า/เงินเดือน/วัสดุสิ้นเปลือง/อื่นๆ), หมายเหตุ, วันที่</li>
                <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
              </ol>
            </FeatureSection>

            <FeatureSection id="branch-reports" title="รายงาน" path="/branch/{slug}/reports" color="blue">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>รายงานรายวัน</strong> — สรุปรายรับ-รายจ่ายรายวัน</li>
                <li><strong>รายงานรายเดือน</strong> — สรุปรายรับ-รายจ่ายรายเดือน</li>
                <li><strong>กราฟเปรียบเทียบ</strong> — กราฟแสดงแนวโน้ม</li>
                <li><strong>เลือกช่วงเวลา</strong> — กรองข้อมูลตามช่วงเวลาที่ต้องการ</li>
              </ul>
            </FeatureSection>

            <FeatureSection id="branch-roi" title="ROI & คืนทุน" path="/branch/{slug}/roi" color="blue">
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li><strong>ROI ปัจจุบัน (%)</strong> — ผลตอบแทนการลงทุนปัจจุบัน</li>
                <li><strong>ระยะเวลาคืนทุน</strong> — จำนวนเดือนที่คาดว่าจะคืนทุน</li>
                <li><strong>เป้าหมาย vs ปัจจุบัน</strong> — เปรียบเทียบกับเป้าหมาย</li>
                <li><strong>กราฟแนวโน้ม ROI</strong> — กราฟแสดงแนวโน้มตามเวลา</li>
              </ul>
              <Tip>ค่า ROI คำนวณจากพารามิเตอร์ที่ Admin ตั้งไว้ในหน้า &quot;ตั้งค่า ROI&quot;</Tip>
            </FeatureSection>

            <FeatureSection id="branch-notify" title="แจ้งเตือน" path="/branch/{slug}/notifications" color="blue">
              <p className="text-sm text-slate-600">ดูประกาศ/แจ้งเตือนจาก Admin แสดงรายการเรียงตามวันที่ล่าสุด กดที่แจ้งเตือนเพื่อดูรายละเอียด</p>
            </FeatureSection>

            <FeatureSection id="branch-service" title="แจ้งซ่อม" path="/branch/{slug}/service" color="blue">
              <SubSection title="แจ้งซ่อม">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>กดปุ่ม <strong>&quot;+ แจ้งซ่อม&quot;</strong></li>
                  <li>กรอก <strong>หัวข้อ</strong> และ <strong>รายละเอียด</strong> อาการเสีย</li>
                  <li>กดปุ่ม <strong>&quot;ส่ง&quot;</strong></li>
                </ol>
              </SubSection>
              <SubSection title="ติดตามสถานะ">
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  <li><strong>รอดำเนินการ</strong> — Admin ยังไม่รับเรื่อง</li>
                  <li><strong>กำลังดำเนินการ</strong> — Admin กำลังจัดการ</li>
                  <li><strong>เสร็จสิ้น</strong> — ซ่อมเสร็จแล้ว</li>
                </ul>
              </SubSection>
            </FeatureSection>

            <FeatureSection id="branch-sop" title="SOP" path="/branch/{slug}/sop" color="blue">
              <p className="text-sm text-slate-600">ดูเอกสาร SOP ที่ Admin สร้างไว้ แสดงเป็น Markdown กดที่ SOP เพื่อดูเนื้อหาเต็ม</p>
              <Tip>สาขาสามารถดูได้อย่างเดียว ไม่สามารถแก้ไข SOP ได้</Tip>
            </FeatureSection>

            <FeatureSection id="branch-manuals" title="คู่มือเครื่อง" path="/branch/{slug}/manuals" color="blue">
              <p className="text-sm text-slate-600">ดูคู่มือเครื่องจักร/อุปกรณ์ที่ Admin สร้างไว้ พร้อมวิดีโอสอนการใช้งาน (ถ้ามี) และ Checklist ตรวจสอบก่อนใช้งาน</p>
            </FeatureSection>

            <FeatureSection id="branch-employees" title="พนักงาน" path="/branch/{slug}/hr/employees" color="blue">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>กดปุ่ม <strong>&quot;+ เพิ่มพนักงาน&quot;</strong></li>
                <li>กรอก: ชื่อ-นามสกุล, เบอร์โทร, ตำแหน่ง, เงินเดือน, วันเริ่มงาน</li>
                <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
              </ol>
            </FeatureSection>

            <FeatureSection id="branch-attendance" title="ลงเวลา" path="/branch/{slug}/hr/attendance" color="blue">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>เลือก <strong>พนักงาน</strong></li>
                <li>เลือก <strong>ประเภท</strong> — เข้างาน / ออกงาน / ขาดงาน / มาสาย</li>
                <li>เลือก <strong>วันที่</strong> และ <strong>เวลา</strong></li>
                <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
              </ol>
            </FeatureSection>

            <FeatureSection id="branch-payroll" title="เงินเดือน" path="/branch/{slug}/hr/payroll" color="blue">
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>เลือก <strong>เดือน/ปี</strong></li>
                <li>ระบบจะคำนวณเงินเดือนจาก: เงินเดือนพื้นฐาน, จำนวนวันทำงาน, วันลา</li>
                <li>ตรวจสอบและ <strong>อนุมัติ</strong> การจ่ายเงินเดือน</li>
              </ol>
            </FeatureSection>

            <FeatureSection id="branch-leave" title="ลางาน" path="/branch/{slug}/hr/leave" color="blue">
              <SubSection title="บันทึกการลา">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>กดปุ่ม <strong>&quot;+ บันทึกลา&quot;</strong></li>
                  <li>เลือก: พนักงาน, ประเภทการลา (ลาป่วย/ลากิจ/ลาพักร้อน), วันที่, เหตุผล</li>
                  <li>กดปุ่ม <strong>&quot;บันทึก&quot;</strong></li>
                </ol>
              </SubSection>
            </FeatureSection>

            {/* ===== INVESTOR PORTAL ===== */}
            <section id="investor">
              <SectionHeader icon="trending_up" title="Investor Portal — นักลงทุน" color="slate" />
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <SubSection title="แดชบอร์ด (Read-only)">
                  <p className="text-sm text-slate-600 mb-3">หน้าภาพรวมธุรกิจสำหรับนักลงทุน แสดง:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    <li><strong>สาขาทั้งหมด</strong> — จำนวนสาขาทั้งหมด / เปิดใช้งาน</li>
                    <li><strong>รายรับวันนี้</strong> — รายรับรวมวันนี้ทุกสาขา</li>
                    <li><strong>รายรับเดือนนี้</strong> — รายรับรวมเดือนนี้</li>
                    <li><strong>อัตราการเติบโต</strong> — เปรียบเทียบกับเดือนก่อน</li>
                    <li><strong>กราฟรายรับรายเดือน</strong> — Line Chart แสดงแนวโน้ม</li>
                    <li><strong>Top 10 สาขา</strong> — สาขาที่มีรายรับสูงสุด</li>
                    <li><strong>ตารางสรุปรายสาขา</strong> — รายรับ/รายจ่าย/กำไร</li>
                  </ul>
                </SubSection>
                <SubSection title="Export PDF Report">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                    <li>กดปุ่ม <strong>&quot;PDF Report&quot;</strong> ที่มุมขวาบน</li>
                    <li>ระบบจะเปิดหน้าพิมพ์ของเบราว์เซอร์</li>
                    <li>เลือก <strong>&quot;Save as PDF&quot;</strong> หรือ <strong>&quot;Print&quot;</strong></li>
                  </ol>
                </SubSection>
                <Tip>Investor Portal เป็น Read-only ไม่สามารถแก้ไขข้อมูลใดๆ ได้</Tip>
              </div>
            </section>

            {/* ===== FAQ ===== */}
            <section id="faq">
              <SectionHeader icon="help" title="คำถามที่พบบ่อย (FAQ)" />
              <div className="space-y-3">
                <FaqItem q="ลืมรหัสผ่าน ทำอย่างไร?" a="ติดต่อ Super Admin เพื่อรีเซ็ตรหัสผ่านในหน้า &quot;ผู้ใช้งาน&quot; (/admin/users)" />
                <FaqItem q="สร้างสาขาแล้ว login ไม่ได้?" a="ตรวจสอบว่า: 1) ใช้ URL ที่ถูกต้อง (/branch/{slug}/login) 2) ใช้อีเมลและรหัสผ่านที่ได้รับตอนสร้างสาขา 3) สาขามีสถานะ Active" />
                <FaqItem q="รายรับจาก Wash ไม่แสดงในหน้ารายรับ?" a="รายรับจาก Wash จะถูกบันทึกอัตโนมัติ ลองรีเฟรชหน้าเว็บ" />
                <FaqItem q="แก้ไขแพ็คเกจล้างรถได้ที่ไหน?" a="เฉพาะ Admin เท่านั้นที่แก้ไขได้ ที่หน้า &quot;แพ็คเกจล้าง&quot; (/admin/wash-packages)" />
                <FaqItem q="Investor ดูข้อมูลสาขาเฉพาะได้ไหม?" a="Investor เห็นข้อมูลรวมทุกสาขา และ Top 10 สาขาที่มีรายรับสูงสุด" />
                <FaqItem q="แบนเนอร์แสดงที่ไหน?" a="แบนเนอร์จะแสดงเป็น Slideshow ที่ด้านบนของหน้า Dashboard ของทุกสาขา" />
                <FaqItem q="SOP และคู่มือเครื่อง สาขาแก้ไขได้ไหม?" a="ไม่ได้ สาขาสามารถดูได้อย่างเดียว Admin เท่านั้นที่สร้าง/แก้ไข/ลบได้" />
                <FaqItem q="ROI คำนวณอย่างไร?" a="ROI (%) = (กำไรสุทธิ / เงินลงทุน) × 100 โดยใช้พารามิเตอร์จากหน้า &quot;ตั้งค่า ROI&quot;" />
                <FaqItem q="ระบบรองรับมือถือไหม?" a="รองรับ! ระบบออกแบบมาเป็น Responsive ใช้งานได้ทั้งคอมพิวเตอร์ แท็บเล็ต และมือถือ" />
                <FaqItem q="ข้อมูลปลอดภัยไหม?" a="ระบบใช้ NextAuth.js, bcrypt เข้ารหัสรหัสผ่าน, JWT Session, CSRF Token ป้องกัน Cross-Site Request Forgery" />
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-8 border-t border-slate-200">
              <p className="text-xs text-slate-400">© 2025 Roboss Franchise System — Innovation of Automobile Detailing</p>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */

function SectionHeader({ icon, title, color = "primary" }: { icon: string; title: string; color?: string }) {
  const bgMap: Record<string, string> = { primary: "bg-primary-50", blue: "bg-blue-50", slate: "bg-slate-100" };
  const textMap: Record<string, string> = { primary: "text-primary", blue: "text-blue-600", slate: "text-slate-700" };
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 ${bgMap[color]} rounded-xl flex items-center justify-center`}>
        <span className={`material-symbols-outlined ${textMap[color]} text-[22px]`}>{icon}</span>
      </div>
      <h2 className="text-2xl font-black text-slate-900">{title}</h2>
    </div>
  );
}

function FeatureSection({ id, title, path, color = "primary", children }: { id: string; title: string; path: string; color?: string; children: React.ReactNode }) {
  const borderMap: Record<string, string> = { primary: "border-l-primary", blue: "border-l-blue-500" };
  return (
    <section id={id}>
      <div className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${borderMap[color]} p-6 sm:p-8 space-y-4`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <code className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{path}</code>
        </div>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-slate-700 mb-2">{title}</h4>
      {children}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mt-3">
      <span className="material-symbols-outlined text-blue-500 text-[16px] mt-0.5 shrink-0">lightbulb</span>
      <p className="text-xs text-blue-700">{children}</p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg mt-3">
      <span className="material-symbols-outlined text-red-500 text-[16px] mt-0.5 shrink-0">warning</span>
      <p className="text-xs text-red-700">{children}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-white rounded-xl border border-slate-200 group">
      <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none">
        <span className="material-symbols-outlined text-primary text-[18px] group-open:rotate-90 transition-transform">chevron_right</span>
        <span className="text-sm font-semibold text-slate-800">{q}</span>
      </summary>
      <div className="px-5 pb-4 pl-12">
        <p className="text-sm text-slate-600">{a}</p>
      </div>
    </details>
  );
}
