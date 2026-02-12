"use client";

import React from "react";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  userName?: string;
}

export default function Header({
  onMenuClick,
  title,
  userName,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 lg:ml-72 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-primary/20 after:via-primary/5 after:to-transparent">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all lg:hidden"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          {title && (
            <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
              {title}
            </h2>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>

          {/* User */}
          {userName && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
              <div className="w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
