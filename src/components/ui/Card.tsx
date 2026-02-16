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
}

export default function Card({
  title,
  subtitle,
  action,
  footer,
  noPadding = false,
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
          {title && (
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">{title}</h3>
              {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && "p-4 sm:p-6")}>{children}</div>
      {footer && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}
