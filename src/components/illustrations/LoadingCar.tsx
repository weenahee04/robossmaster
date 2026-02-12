export default function LoadingCar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Car body */}
        <rect x="20" y="30" width="80" height="30" rx="8" fill="#CC0000">
          <animate attributeName="y" values="30;28;30" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="32" y="18" width="48" height="18" rx="6" fill="#CC0000">
          <animate attributeName="y" values="18;16;18" dur="1s" repeatCount="indefinite" />
        </rect>

        {/* Windows */}
        <rect x="36" y="21" width="17" height="12" rx="3" fill="#fff" opacity="0.85">
          <animate attributeName="y" values="21;19;21" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="57" y="21" width="17" height="12" rx="3" fill="#fff" opacity="0.85">
          <animate attributeName="y" values="21;19;21" dur="1s" repeatCount="indefinite" />
        </rect>

        {/* Wheels */}
        <circle cx="40" cy="60" r="9" fill="#334155">
          <animate attributeName="cy" values="60;58;60" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="60" r="4.5" fill="#64748b">
          <animate attributeName="cy" values="60;58;60" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="60" r="9" fill="#334155">
          <animate attributeName="cy" values="60;58;60" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="60" r="4.5" fill="#64748b">
          <animate attributeName="cy" values="60;58;60" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Water drops */}
        <circle cx="15" cy="25" r="3" fill="#3b82f6" opacity="0.6">
          <animate attributeName="cy" values="25;10;25" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="105" cy="20" r="2.5" fill="#60a5fa" opacity="0.5">
          <animate attributeName="cy" values="20;8;20" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="10" r="2" fill="#93c5fd" opacity="0.4">
          <animate attributeName="cy" values="10;2;10" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>

        {/* Bubbles */}
        <circle cx="8" cy="45" r="5" fill="#dbeafe" opacity="0.5">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="112" cy="40" r="4" fill="#dbeafe" opacity="0.4">
          <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
      <p className="text-sm text-slate-400 mt-3 font-medium animate-pulse">กำลังโหลด...</p>
    </div>
  );
}
