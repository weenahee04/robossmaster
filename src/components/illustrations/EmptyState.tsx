export default function EmptyState({ 
  message = "ยังไม่มีข้อมูล", 
  className = "" 
}: { 
  message?: string; 
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Road */}
        <rect x="10" y="110" width="160" height="6" rx="3" fill="#e2e8f0" />
        <rect x="40" y="112" width="20" height="2" rx="1" fill="#cbd5e1" />
        <rect x="80" y="112" width="20" height="2" rx="1" fill="#cbd5e1" />
        <rect x="120" y="112" width="20" height="2" rx="1" fill="#cbd5e1" />

        {/* Car body */}
        <rect x="45" y="72" width="90" height="38" rx="8" fill="#e2e8f0" />
        <rect x="58" y="56" width="55" height="22" rx="6" fill="#e2e8f0" />

        {/* Windows */}
        <rect x="63" y="60" width="20" height="14" rx="3" fill="#f1f5f9" />
        <rect x="87" y="60" width="20" height="14" rx="3" fill="#f1f5f9" />

        {/* Wheels */}
        <circle cx="70" cy="110" r="10" fill="#cbd5e1" />
        <circle cx="70" cy="110" r="5" fill="#e2e8f0" />
        <circle cx="110" cy="110" r="10" fill="#cbd5e1" />
        <circle cx="110" cy="110" r="5" fill="#e2e8f0" />

        {/* Question marks */}
        <text x="90" y="40" textAnchor="middle" fill="#94a3b8" fontSize="24" fontWeight="700" fontFamily="sans-serif">?</text>
        <text x="65" y="30" textAnchor="middle" fill="#cbd5e1" fontSize="16" fontWeight="700" fontFamily="sans-serif">?</text>
        <text x="115" y="35" textAnchor="middle" fill="#cbd5e1" fontSize="16" fontWeight="700" fontFamily="sans-serif">?</text>

        {/* Dots */}
        <circle cx="30" cy="90" r="3" fill="#e2e8f0" />
        <circle cx="155" cy="80" r="2" fill="#e2e8f0" />
        <circle cx="20" cy="70" r="2" fill="#f1f5f9" />
        <circle cx="165" cy="95" r="3" fill="#f1f5f9" />
      </svg>
      <p className="text-sm text-slate-400 mt-4 font-medium">{message}</p>
    </div>
  );
}
