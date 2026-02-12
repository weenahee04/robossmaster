export default function LoginAdmin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="200" cy="200" r="180" fill="#fef2f2" opacity="0.5" />
      <circle cx="200" cy="200" r="140" fill="#fee2e2" opacity="0.3" />

      {/* Dashboard mockup */}
      <rect x="80" y="100" width="240" height="180" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      {/* Title bar */}
      <rect x="80" y="100" width="240" height="30" rx="12" fill="#CC0000" />
      <rect x="80" y="118" width="240" height="12" fill="#CC0000" />
      <circle cx="96" cy="115" r="4" fill="#fff" opacity="0.5" />
      <circle cx="108" cy="115" r="4" fill="#fff" opacity="0.5" />
      <circle cx="120" cy="115" r="4" fill="#fff" opacity="0.5" />

      {/* Sidebar mockup */}
      <rect x="80" y="130" width="60" height="150" fill="#f8fafc" />
      <rect x="88" y="142" width="44" height="6" rx="3" fill="#e2e8f0" />
      <rect x="88" y="156" width="44" height="6" rx="3" fill="#CC0000" opacity="0.2" />
      <rect x="88" y="170" width="44" height="6" rx="3" fill="#e2e8f0" />
      <rect x="88" y="184" width="44" height="6" rx="3" fill="#e2e8f0" />
      <rect x="88" y="198" width="44" height="6" rx="3" fill="#e2e8f0" />

      {/* KPI cards */}
      <rect x="150" y="140" width="75" height="45" rx="6" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
      <rect x="158" y="148" width="30" height="4" rx="2" fill="#CC0000" opacity="0.3" />
      <rect x="158" y="158" width="50" height="8" rx="2" fill="#CC0000" opacity="0.6" />
      <rect x="158" y="172" width="20" height="3" rx="1.5" fill="#10b981" opacity="0.5" />

      <rect x="235" y="140" width="75" height="45" rx="6" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
      <rect x="243" y="148" width="30" height="4" rx="2" fill="#3b82f6" opacity="0.3" />
      <rect x="243" y="158" width="50" height="8" rx="2" fill="#3b82f6" opacity="0.6" />
      <rect x="243" y="172" width="20" height="3" rx="1.5" fill="#3b82f6" opacity="0.3" />

      {/* Chart mockup */}
      <rect x="150" y="195" width="160" height="75" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      {/* Bar chart bars */}
      <rect x="165" y="240" width="12" height="20" rx="2" fill="#CC0000" opacity="0.7" />
      <rect x="185" y="230" width="12" height="30" rx="2" fill="#CC0000" opacity="0.8" />
      <rect x="205" y="220" width="12" height="40" rx="2" fill="#CC0000" />
      <rect x="225" y="235" width="12" height="25" rx="2" fill="#CC0000" opacity="0.7" />
      <rect x="245" y="225" width="12" height="35" rx="2" fill="#CC0000" opacity="0.9" />
      <rect x="265" y="215" width="12" height="45" rx="2" fill="#CC0000" />
      {/* Chart baseline */}
      <line x1="158" y1="260" x2="302" y2="260" stroke="#e2e8f0" strokeWidth="1" />

      {/* Admin icon */}
      <circle cx="320" cy="90" r="30" fill="#CC0000" opacity="0.1" />
      <circle cx="320" cy="82" r="10" fill="#CC0000" opacity="0.6" />
      <path d="M300 105 Q320 90 340 105" stroke="#CC0000" strokeWidth="3" fill="none" opacity="0.6" />

      {/* Decorative dots */}
      <circle cx="70" cy="310" r="4" fill="#fecaca" />
      <circle cx="340" cy="320" r="6" fill="#dbeafe" />
      <circle cx="60" cy="90" r="5" fill="#fef3c7" />
      <circle cx="350" cy="300" r="3" fill="#d1fae5" />
    </svg>
  );
}
