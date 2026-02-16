'use client';

import { use } from 'react';
import { AuthProvider, useAuth } from '@/lib/loyalty-auth-context';

function BranchGate({ children }: { children: React.ReactNode }) {
  const { branchLoading, branchNotFound, branchSlug } = useAuth();

  if (branchLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-roboss-red rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-red-600/40 mx-auto animate-pulse">
            <span className="text-3xl font-black text-white italic">R</span>
          </div>
          <p className="text-gray-500 text-sm font-kanit">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (branchNotFound) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-kanit">ไม่พบสาขา</h1>
          <p className="text-gray-400 text-sm">
            ไม่พบสาขา <span className="text-roboss-red font-bold">&quot;{branchSlug}&quot;</span> ในระบบ
          </p>
          <p className="text-gray-600 text-xs">กรุณาตรวจสอบลิงก์อีกครั้ง หรือติดต่อสาขาของคุณ</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function LoyaltyBranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <AuthProvider slug={slug}>
      <div className="min-h-screen max-w-md mx-auto relative bg-black shadow-2xl overflow-x-hidden font-kanit">
        <BranchGate>{children}</BranchGate>
      </div>
    </AuthProvider>
  );
}
