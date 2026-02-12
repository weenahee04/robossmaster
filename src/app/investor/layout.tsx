"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/investor/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-primary">ROBOSS</h1>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">INVESTOR</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">{session?.user?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
