export function KpiBranch({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="18" width="32" height="24" rx="4" fill="#CC0000" opacity="0.15" />
      <rect x="14" y="8" width="20" height="14" rx="3" fill="#CC0000" opacity="0.25" />
      <rect x="18" y="26" width="5" height="8" rx="1" fill="#CC0000" opacity="0.4" />
      <rect x="25" y="26" width="5" height="8" rx="1" fill="#CC0000" opacity="0.4" />
      <rect x="20" y="36" width="8" height="6" rx="1" fill="#CC0000" opacity="0.3" />
      <path d="M24 4L28 8H20L24 4Z" fill="#CC0000" opacity="0.5" />
    </svg>
  );
}

export function KpiMoney({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="24" r="18" fill="#10b981" opacity="0.12" />
      <circle cx="24" cy="24" r="13" fill="#10b981" opacity="0.08" />
      <text x="24" y="30" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="800" fontFamily="sans-serif" opacity="0.7">฿</text>
      <path d="M12 18L16 14" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M36 18L32 14" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M24 8V11" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function KpiChart({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#3b82f6" opacity="0.1" />
      <rect x="12" y="28" width="5" height="10" rx="2" fill="#3b82f6" opacity="0.4" />
      <rect x="20" y="22" width="5" height="16" rx="2" fill="#3b82f6" opacity="0.6" />
      <rect x="28" y="16" width="5" height="22" rx="2" fill="#3b82f6" opacity="0.8" />
      <polyline points="12,26 20,20 28,14 36,10" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="36" cy="10" r="3" fill="#3b82f6" opacity="0.6" />
    </svg>
  );
}

export function KpiUsers({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="16" r="8" fill="#f59e0b" opacity="0.15" />
      <circle cx="24" cy="16" r="5" fill="#f59e0b" opacity="0.25" />
      <path d="M12 40C12 32 17 28 24 28C31 28 36 32 36 40" stroke="#f59e0b" strokeWidth="3" fill="#f59e0b" opacity="0.12" strokeLinecap="round" />
      <circle cx="36" cy="18" r="4" fill="#f59e0b" opacity="0.15" />
      <circle cx="12" cy="18" r="4" fill="#f59e0b" opacity="0.15" />
    </svg>
  );
}

export function KpiWash({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="24" cy="30" rx="16" ry="10" fill="#3b82f6" opacity="0.1" />
      {/* Water drops */}
      <ellipse cx="16" cy="14" rx="3" ry="5" fill="#3b82f6" opacity="0.3">
        <animate attributeName="cy" values="14;10;14" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="24" cy="10" rx="3.5" ry="6" fill="#3b82f6" opacity="0.4">
        <animate attributeName="cy" values="10;6;10" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="32" cy="14" rx="3" ry="5" fill="#3b82f6" opacity="0.3">
        <animate attributeName="cy" values="14;10;14" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Bubbles */}
      <circle cx="18" cy="28" r="4" fill="#dbeafe" opacity="0.5" />
      <circle cx="30" cy="26" r="3" fill="#dbeafe" opacity="0.4" />
      <circle cx="24" cy="32" r="5" fill="#dbeafe" opacity="0.3" />
    </svg>
  );
}
