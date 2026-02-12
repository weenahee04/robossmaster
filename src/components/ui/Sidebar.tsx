"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  icon: string;
  href: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  items: SidebarItem[];
  brandName?: string;
  brandSub?: string;
  logoUrl?: string | null;
}

export default function Sidebar({
  isOpen,
  onClose,
  onLogout,
  items,
  brandName = "Roboss",
  brandSub,
  logoUrl,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-800 rounded-lg flex items-center justify-center overflow-hidden shadow-md shadow-primary/20">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-white text-[20px]">
                local_car_wash
              </span>
            )}
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">
              {brandName}
            </h1>
            {brandSub && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {brandSub}
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3">
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary-50 text-primary font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px]",
                      isActive && "filled"
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        {/* Decorative wave */}
        <div className="px-3 pb-1">
          <svg viewBox="0 0 240 20" fill="none" className="w-full opacity-40">
            <path d="M0,10 C40,0 80,20 120,10 C160,0 200,20 240,10" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M0,14 C60,4 120,24 180,14 C210,9 230,16 240,14" stroke="#3b82f6" strokeWidth="0.5" fill="none" opacity="0.2" />
          </svg>
        </div>
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-danger transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            ออกจากระบบ
          </button>
        </div>
      </aside>
    </>
  );
}
