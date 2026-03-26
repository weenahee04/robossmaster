"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

export interface SidebarGroup {
  title: string;
  icon: string;
  items: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  items?: SidebarItem[];
  groups?: SidebarGroup[];
  brandName?: string;
  brandSub?: string;
  logoUrl?: string | null;
  variant?: "light" | "dark";
}

export default function Sidebar({
  isOpen,
  onClose,
  onLogout,
  items,
  groups,
  brandName = "Roboss",
  brandSub,
  logoUrl,
  variant = "light",
}: SidebarProps) {
  const dark = variant === "dark";
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Auto-expand group containing active item
  useEffect(() => {
    if (!groups) return;
    const newCollapsed: Record<string, boolean> = {};
    groups.forEach((group) => {
      const hasActive = group.items.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
      );
      newCollapsed[group.title] = !hasActive;
    });
    setCollapsed(newCollapsed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, groups?.length]);

  const toggleGroup = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Filter groups/items by search
  const filteredGroups = useMemo(() => {
    if (!groups) return null;
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            g.title.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, search]);

  const filteredItems = useMemo(() => {
    if (!items) return null;
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, search]);

  const renderItem = (item: SidebarItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          isActive
            ? dark
              ? "bg-red-600/15 text-red-400 font-semibold"
              : "bg-primary-50 text-primary font-semibold"
            : dark
              ? "text-gray-400 hover:bg-white/[0.05] hover:text-gray-200"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        )}
      >
        <span
          className={cn(
            "material-symbols-outlined text-[18px]",
            isActive && "filled"
          )}
        >
          {item.icon}
        </span>
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge !== undefined && item.badge > 0 && (
          <span className={cn(
            "min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full flex items-center justify-center",
            dark ? "bg-red-600 text-white" : "bg-primary text-white"
          )}>
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}
      </Link>
    );
  };

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
          "fixed top-0 left-0 z-50 h-full w-72 flex flex-col transition-transform duration-300",
          dark
            ? "bg-[#0e0e0e] border-r border-white/[0.06]"
            : "bg-white border-r border-slate-200",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className={cn(
          "flex items-center gap-3 px-6 h-16 border-b",
          dark ? "border-white/[0.06]" : "border-slate-100"
        )}>
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shadow-md",
            dark
              ? "bg-gradient-to-br from-red-600 to-red-700 shadow-red-900/30"
              : "bg-gradient-to-br from-primary to-primary-800 shadow-primary/20"
          )}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : dark ? (
              <span className="text-white font-black text-sm italic">R</span>
            ) : (
              <img src="/roboss-logo.png" alt="Roboss" className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <h1 className={cn(
              "text-lg font-black leading-tight",
              dark ? "text-white" : "text-slate-900"
            )}>
              {brandName}
            </h1>
            {brandSub && (
              <p className={cn(
                "text-[11px] font-bold uppercase tracking-wider",
                dark ? "text-red-500" : "text-slate-400"
              )}>
                {brandSub}
              </p>
            )}
          </div>
        </div>

        {/* Quick Search */}
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <span className={cn(
              "material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2",
              dark ? "text-gray-500" : "text-slate-400"
            )}>
              search
            </span>
            <input
              type="text"
              placeholder="ค้นหาเมนู..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none transition-all",
                dark
                  ? "bg-white/[0.04] border border-white/[0.08] text-gray-200 placeholder:text-gray-600 focus:ring-1 focus:ring-red-500/20 focus:border-red-500/30"
                  : "bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-primary/30 focus:border-primary/30"
              )}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded",
                  dark ? "text-gray-500 hover:text-gray-300" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-2 px-3">
          {/* Grouped navigation */}
          {filteredGroups && (
            <div className="space-y-1">
              {filteredGroups.map((group) => {
                const isGroupCollapsed = search ? false : collapsed[group.title];
                const hasActive = group.items.some(
                  (item) => pathname === item.href || pathname.startsWith(item.href + "/")
                );

                return (
                  <div key={group.title}>
                    {/* Group header */}
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                        hasActive
                          ? dark ? "text-red-400" : "text-primary"
                          : dark
                            ? "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {group.icon}
                      </span>
                      <span className="flex-1 text-left">{group.title}</span>
                      <span
                        className={cn(
                          "material-symbols-outlined text-[16px] transition-transform duration-200",
                          isGroupCollapsed && "-rotate-90"
                        )}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* Group items */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isGroupCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
                      )}
                    >
                      <div className={cn(
                        "ml-2 pl-2 border-l space-y-0.5 pb-1",
                        dark ? "border-white/[0.06]" : "border-slate-100"
                      )}>
                        {group.items.map(renderItem)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Flat items (backward compatibility) */}
          {filteredItems && !filteredGroups && (
            <div className="space-y-1">
              {filteredItems.map(renderItem)}
            </div>
          )}

          {/* No results */}
          {search && (
            (filteredGroups && filteredGroups.length === 0) ||
            (filteredItems && filteredItems.length === 0)
          ) && (
            <div className={cn("text-center py-8 text-sm", dark ? "text-gray-500" : "text-slate-400")}>
              <span className="material-symbols-outlined text-[32px] block mb-2">search_off</span>
              ไม่พบเมนู &quot;{search}&quot;
            </div>
          )}
        </nav>

        {/* Decorative wave */}
        <div className="px-3 pb-1">
          <svg viewBox="0 0 240 20" fill="none" className="w-full opacity-40">
            <path d="M0,10 C40,0 80,20 120,10 C160,0 200,20 240,10" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M0,14 C60,4 120,24 180,14 C210,9 230,16 240,14" stroke={dark ? "#dc2626" : "#3b82f6"} strokeWidth="0.5" fill="none" opacity="0.2" />
          </svg>
        </div>
        <div className={cn("p-3 border-t", dark ? "border-white/[0.06]" : "border-slate-100")}>
          <button
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              dark
                ? "text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                : "text-slate-600 hover:bg-red-50 hover:text-danger"
            )}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            ออกจากระบบ
          </button>
        </div>
      </aside>
    </>
  );
}
