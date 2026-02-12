export default function LoginInvestor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background */}
      <circle cx="200" cy="200" r="180" fill="#1e293b" opacity="0.05" />
      <circle cx="200" cy="200" r="140" fill="#334155" opacity="0.05" />

      {/* Chart area */}
      <rect x="60" y="80" width="280" height="220" rx="16" fill="white" stroke="#e2e8f0" strokeWidth="2" />

      {/* Chart title */}
      <rect x="80" y="100" width="80" height="6" rx="3" fill="#334155" opacity="0.3" />
      <rect x="80" y="112" width="50" height="4" rx="2" fill="#94a3b8" opacity="0.3" />

      {/* Line chart */}
      <polyline
        points="90,240 130,220 170,230 210,190 250,170 290,150 320,160"
        stroke="#CC0000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Area fill */}
      <path
        d="M90,240 L130,220 L170,230 L210,190 L250,170 L290,150 L320,160 L320,270 L90,270 Z"
        fill="#CC0000"
        opacity="0.08"
      />

      {/* Data points */}
      {[
        { x: 90, y: 240 },
        { x: 130, y: 220 },
        { x: 170, y: 230 },
        { x: 210, y: 190 },
        { x: 250, y: 170 },
        { x: 290, y: 150 },
        { x: 320, y: 160 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#CC0000" strokeWidth="2" />
        </g>
      ))}

      {/* Grid lines */}
      {[160, 190, 220, 250].map((y, i) => (
        <line key={i} x1="80" y1={y} x2="330" y2={y} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      <line x1="80" y1="270" x2="330" y2="270" stroke="#e2e8f0" strokeWidth="1" />

      {/* Money icon */}
      <circle cx="320" cy="70" r="28" fill="#d1fae5" />
      <text x="320" y="78" textAnchor="middle" fill="#10b981" fontSize="24" fontWeight="800" fontFamily="sans-serif">฿</text>

      {/* Growth arrow */}
      <g transform="translate(70, 60)">
        <circle r="20" fill="#fef2f2" />
        <path d="M-8,5 L0,-8 L8,5" stroke="#CC0000" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* KPI badges */}
      <rect x="80" y="130" width="100" height="35" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
      <rect x="88" y="138" width="40" height="4" rx="2" fill="#10b981" opacity="0.4" />
      <rect x="88" y="148" width="60" height="6" rx="2" fill="#10b981" opacity="0.7" />

      <rect x="195" y="130" width="100" height="35" rx="8" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
      <rect x="203" y="138" width="40" height="4" rx="2" fill="#CC0000" opacity="0.4" />
      <rect x="203" y="148" width="60" height="6" rx="2" fill="#CC0000" opacity="0.7" />

      {/* Decorative */}
      <circle cx="50" cy="320" r="5" fill="#dbeafe" opacity="0.6" />
      <circle cx="350" cy="340" r="4" fill="#fecaca" opacity="0.6" />
      <circle cx="40" cy="150" r="3" fill="#d1fae5" opacity="0.6" />
      <circle cx="370" cy="120" r="6" fill="#fef3c7" opacity="0.5" />
    </svg>
  );
}
