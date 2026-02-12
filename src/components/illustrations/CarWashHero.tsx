export default function CarWashHero({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background arch */}
      <ellipse cx="300" cy="380" rx="260" ry="30" fill="#f1f5f9" />

      {/* Wash machine frame */}
      <rect x="140" y="60" width="320" height="280" rx="20" fill="#e2e8f0" />
      <rect x="150" y="70" width="300" height="260" rx="16" fill="#f8fafc" />

      {/* Machine top bar */}
      <rect x="140" y="60" width="320" height="50" rx="20" fill="#CC0000" />
      <rect x="140" y="85" width="320" height="25" fill="#CC0000" />
      <text x="300" y="92" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="sans-serif">ROBOSS AUTO WASH</text>

      {/* Rollers */}
      {[140, 180, 220].map((y, i) => (
        <g key={i}>
          <rect x="170" y={y} width="260" height="8" rx="4" fill="#CC0000" opacity={0.15 + i * 0.1} />
          <rect x="170" y={y + 2} width="260" height="4" rx="2" fill="#CC0000" opacity={0.08}>
            <animate attributeName="x" values="170;180;170" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}

      {/* Car */}
      <g>
        <animate attributeName="opacity" values="1;1;1" dur="4s" repeatCount="indefinite" />
        {/* Car body */}
        <rect x="210" y="240" width="180" height="60" rx="12" fill="#334155" />
        <rect x="230" y="215" width="110" height="35" rx="10" fill="#334155" />
        {/* Windows */}
        <rect x="238" y="220" width="40" height="24" rx="5" fill="#93c5fd" opacity="0.8" />
        <rect x="284" y="220" width="40" height="24" rx="5" fill="#93c5fd" opacity="0.8" />
        {/* Headlights */}
        <rect x="380" y="255" width="12" height="8" rx="4" fill="#fbbf24" />
        <rect x="208" y="255" width="12" height="8" rx="4" fill="#fbbf24" opacity="0.6" />
        {/* Wheels */}
        <circle cx="250" cy="300" r="18" fill="#1e293b" />
        <circle cx="250" cy="300" r="9" fill="#64748b" />
        <circle cx="350" cy="300" r="18" fill="#1e293b" />
        <circle cx="350" cy="300" r="9" fill="#64748b" />
      </g>

      {/* Water spray left */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={`wl${i}`} cx={185 + i * 3} cy={160 + i * 25} r={3 - i * 0.3} fill="#3b82f6" opacity={0.6 - i * 0.1}>
          <animate attributeName="cx" values={`${185 + i * 3};${175 + i * 3};${185 + i * 3}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${0.6 - i * 0.1};${0.2};${0.6 - i * 0.1}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Water spray right */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={`wr${i}`} cx={415 - i * 3} cy={160 + i * 25} r={3 - i * 0.3} fill="#3b82f6" opacity={0.6 - i * 0.1}>
          <animate attributeName="cx" values={`${415 - i * 3};${425 - i * 3};${415 - i * 3}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${0.6 - i * 0.1};${0.2};${0.6 - i * 0.1}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Bubbles floating */}
      {[
        { cx: 180, cy: 180, r: 8, dur: "3s" },
        { cx: 420, cy: 170, r: 6, dur: "2.5s" },
        { cx: 200, cy: 250, r: 5, dur: "3.5s" },
        { cx: 400, cy: 230, r: 7, dur: "2.8s" },
        { cx: 300, cy: 150, r: 9, dur: "4s" },
        { cx: 260, cy: 190, r: 4, dur: "2.2s" },
        { cx: 340, cy: 200, r: 5, dur: "3.2s" },
      ].map((b, i) => (
        <circle key={`b${i}`} cx={b.cx} cy={b.cy} r={b.r} fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" opacity="0.7">
          <animate attributeName="cy" values={`${b.cy};${b.cy - 15};${b.cy}`} dur={b.dur} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur={b.dur} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Foam on car */}
      {[240, 270, 300, 330, 360].map((x, i) => (
        <ellipse key={`f${i}`} cx={x} cy={238} rx={12} ry={5} fill="white" opacity="0.8">
          <animate attributeName="ry" values="5;7;5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </svg>
  );
}
