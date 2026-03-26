"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark";
}

export default function Card({
  title,
  subtitle,
  action,
  footer,
  noPadding = false,
  children,
  className,
  variant = "light",
}: CardProps) {
  const dark = variant === "dark";

  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm",
        dark
          ? "bg-[#111111] border-white/[0.06]"
          : "bg-white border-slate-200",
        className
      )}
    >
      {(title || action) && (
        <div className={cn(
          "flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b",
          dark ? "border-white/[0.06]" : "border-slate-100"
        )}>
          {title && (
            <div>
              <h3 className={cn(
                "font-bold text-sm sm:text-base",
                dark ? "text-white" : "text-slate-800"
              )}>{title}</h3>
              {subtitle && <p className={cn(
                "text-[11px] mt-0.5",
                dark ? "text-gray-500" : "text-slate-400"
              )}>{subtitle}</p>}
            </div>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && "p-4 sm:p-6")}>{children}</div>
      {footer && (
        <div className={cn(
          "px-4 sm:px-6 py-3 sm:py-4 border-t rounded-b-xl",
          dark ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"
        )}>
          {footer}
        </div>
      )}
    </div>
  );
}
