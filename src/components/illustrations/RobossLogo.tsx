export default function RobossLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Car body */}
      <rect x="15" y="50" width="90" height="35" rx="8" fill="#CC0000" />
      <rect x="25" y="38" width="55" height="22" rx="6" fill="#CC0000" />
      {/* Windows */}
      <rect x="30" y="42" width="20" height="14" rx="3" fill="#fff" opacity="0.9" />
      <rect x="54" y="42" width="20" height="14" rx="3" fill="#fff" opacity="0.9" />
      {/* Wheels */}
      <circle cx="35" cy="85" r="12" fill="#334155" />
      <circle cx="35" cy="85" r="6" fill="#94a3b8" />
      <circle cx="85" cy="85" r="12" fill="#334155" />
      <circle cx="85" cy="85" r="6" fill="#94a3b8" />
      {/* Water drops */}
      <ellipse cx="100" cy="25" rx="5" ry="7" fill="#3b82f6" opacity="0.7">
        <animate attributeName="cy" values="25;18;25" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="88" cy="18" rx="4" ry="5.5" fill="#60a5fa" opacity="0.5">
        <animate attributeName="cy" values="18;12;18" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="108" cy="35" rx="3" ry="4" fill="#93c5fd" opacity="0.6">
        <animate attributeName="cy" values="35;28;35" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Bubbles */}
      <circle cx="18" cy="30" r="6" fill="#dbeafe" opacity="0.6">
        <animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="10" cy="45" r="4" fill="#dbeafe" opacity="0.4">
        <animate attributeName="r" values="4;5.5;4" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
