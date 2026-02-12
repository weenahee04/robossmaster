import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-white text-[40px]">
            local_car_wash
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Roboss</h1>
        <p className="text-sm text-slate-500 mb-8">
          ระบบจัดการแฟรนไชส์ร้านล้างรถอัตโนมัติ
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            เข้าสู่ระบบ Admin
          </Link>
          <Link
            href="/investor/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg shadow-lg shadow-slate-800/20 hover:bg-slate-700 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
            Investor Portal
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-12">
          © 2025 Roboss Franchise System
        </p>
      </div>
    </div>
  );
}
