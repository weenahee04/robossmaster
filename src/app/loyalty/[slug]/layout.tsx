'use client';

import { use } from 'react';
import { AuthProvider, useAuth } from '@/lib/loyalty-auth-context';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { themeData } = useAuth();
  const t = themeData;

  const cssVars = t ? {
    '--theme-primary': t.primaryColor,
    '--theme-secondary': t.secondaryColor,
    '--theme-bg': t.backgroundColor,
    '--theme-surface': t.surfaceColor,
    '--theme-text': t.textColor,
    '--theme-accent': t.accentColor,
    '--theme-font': `'${t.fontFamily}', sans-serif`,
  } as React.CSSProperties : {};

  return (
    <div
      className="loyalty-app min-h-screen max-w-md mx-auto relative shadow-2xl overflow-x-hidden font-display antialiased"
      style={{
        background: t?.backgroundColor || '#050505',
        color: t?.textColor || '#f3f4f6',
        fontFamily: t ? `'${t.fontFamily}', 'Noto Sans Thai', sans-serif` : "'Noto Sans Thai', 'Inter', sans-serif",
        ...cssVars,
      }}
    >
      {children}
    </div>
  );
}

function BranchGate({ children }: { children: React.ReactNode }) {
  const { branchLoading, branchNotFound, branchSlug, themeData } = useAuth();
  const primary = themeData?.primaryColor || '#FF4B5C';
  const bg = themeData?.backgroundColor || '#000';

  if (branchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl mx-auto animate-pulse"
            style={{ background: primary }}>
            <span className="text-3xl font-black text-white italic">R</span>
          </div>
          <p className="text-gray-500 text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (branchNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ background: bg }}>
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-white">ไม่พบสาขา</h1>
          <p className="text-gray-400 text-sm">
            ไม่พบสาขา <span className="font-bold" style={{ color: primary }}>&quot;{branchSlug}&quot;</span> ในระบบ
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
      <ThemeWrapper>
        <BranchGate>{children}</BranchGate>
      </ThemeWrapper>
    </AuthProvider>
  );
}
