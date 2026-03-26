"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  userName?: string;
  variant?: "light" | "dark";
}

export default function Header({
  onMenuClick,
  title,
  userName,
  variant = "light",
}: HeaderProps) {
  const dark = variant === "dark";

  return (
    <header className={cn(
      "sticky top-0 z-30 h-16 backdrop-blur-md lg:ml-72",
      dark
        ? "bg-[#0a0a0a]/90 border-b border-white/[0.06]"
        : "bg-white/80 border-b border-slate-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-primary/20 after:via-primary/5 after:to-transparent"
    )}>
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className={cn(
              "p-2 rounded-lg transition-all lg:hidden",
              dark ? "text-gray-400 hover:bg-white/[0.05]" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          {title && (
            <h2 className={cn(
              "text-lg font-bold hidden sm:block",
              dark ? "text-white" : "text-slate-800"
            )}>
              {title}
            </h2>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className={cn(
            "relative p-2 rounded-lg transition-all",
            dark ? "text-gray-500 hover:bg-white/[0.05] hover:text-gray-300" : "text-slate-500 hover:bg-slate-100"
          )}>
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>

          {/* User */}
          {userName && (
            <div className={cn(
              "flex items-center gap-2 pl-2 border-l ml-1",
              dark ? "border-white/[0.08]" : "border-slate-200"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                dark
                  ? "bg-gradient-to-br from-red-600 to-red-700 text-white"
                  : "bg-primary-100 text-primary"
              )}>
                <span className="text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className={cn(
                "text-sm font-medium hidden sm:block",
                dark ? "text-gray-300" : "text-slate-700"
              )}>
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
