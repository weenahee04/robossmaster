"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "primary" | "neutral";
  hasDot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: "bg-success-light text-emerald-700",
  warning: "bg-warning-light text-amber-700",
  danger: "bg-danger-light text-red-700",
  info: "bg-info-light text-blue-700",
  primary: "bg-primary-100 text-primary-800",
  neutral: "bg-slate-100 text-slate-600",
};

const dotStyles: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  primary: "bg-primary",
  neutral: "bg-slate-400",
};

export default function Badge({
  variant = "neutral",
  hasDot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {hasDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", dotStyles[variant])}
        />
      )}
      {children}
    </span>
  );
}
