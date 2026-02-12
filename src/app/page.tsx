import Link from "next/link";
import { WaveBottom } from "@/components/illustrations/WaveDecoration";
import WaterBubbles from "@/components/illustrations/WaterBubbles";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <WaterBubbles />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 pt-12">
        {/* Logo */}
        <div className="animate-float mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl shadow-primary/20 animate-pulse-glow">
            <img src="/roboss-logo.png" alt="Roboss" className="w-full h-full object-cover" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-3 tracking-tight text-center">
          Roboss
        </h1>
        <p className="text-base sm:text-lg text-slate-500 mb-2 text-center max-w-md">
          ระบบจัดการแฟรนไชส์ร้านล้างรถอัตโนมัติ
        </p>
        <p className="text-sm text-slate-400 mb-8 text-center">
          Automated Car Wash Franchise Management
        </p>

        {/* Hero Illustration */}
        <div className="w-full max-w-xs mb-10 animate-float-slow">
          <img src="/roboss-logo.png" alt="Roboss" className="w-full h-auto drop-shadow-2xl rounded-full" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            href="/admin/login"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">admin_panel_settings</span>
            เข้าสู่ระบบ Admin
          </Link>
          <Link
            href="/investor/login"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-800/25 hover:shadow-xl hover:shadow-slate-800/30 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">trending_up</span>
            Investor Portal
          </Link>
        </div>
      </div>

      {/* Wave Divider */}
      <WaveBottom className="relative z-10" />

      {/* Features Section */}
      <div className="relative z-10 bg-gradient-to-b from-transparent to-slate-50 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xl font-black text-slate-800 mb-8">ทำไมต้อง Roboss?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-[24px]">store</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">จัดการแฟรนไชส์</h3>
              <p className="text-sm text-slate-500 leading-relaxed">ดูแลทุกสาขาจากที่เดียว ติดตามรายรับ-รายจ่าย พนักงาน และ ROI แบบ Real-time</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="4" width="20" height="20" rx="4" fill="#3b82f6" opacity="0.15" />
                  <rect x="7" y="16" width="4" height="6" rx="1" fill="#3b82f6" opacity="0.4" />
                  <rect x="12" y="12" width="4" height="10" rx="1" fill="#3b82f6" opacity="0.6" />
                  <rect x="17" y="8" width="4" height="14" rx="1" fill="#3b82f6" opacity="0.8" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">รายงาน & วิเคราะห์</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Dashboard สวยงาม กราฟชัดเจน ดูข้อมูลได้ทุกที่ทุกเวลา พร้อม Export PDF</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" fill="#10b981" opacity="0.15" />
                  <text x="14" y="18" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="800" fontFamily="sans-serif" opacity="0.7">฿</text>
                  <path d="M8 10L11 7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                  <path d="M20 10L17 7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">ROI & คืนทุน</h3>
              <p className="text-sm text-slate-500 leading-relaxed">คำนวณ ROI อัตโนมัติ ติดตามจุดคุ้มทุน แจ้งเตือนนักลงทุนแบบ Transparent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          © 2025 Roboss Franchise System — Powered by Innovation
        </p>
      </footer>
    </div>
  );
}
