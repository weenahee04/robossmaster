export function WaveTop({ color = "#CC0000", opacity = 0.05, className = "" }: { color?: string; opacity?: number; className?: string }) {
  return (
    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full ${className}`} preserveAspectRatio="none">
      <path
        d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,0 L0,0 Z"
        fill={color}
        opacity={opacity}
      />
      <path
        d="M0,40 C360,100 720,-20 1080,40 C1260,70 1380,30 1440,40 L1440,0 L0,0 Z"
        fill={color}
        opacity={opacity * 0.6}
      />
    </svg>
  );
}

export function WaveBottom({ color = "#CC0000", opacity = 0.05, className = "" }: { color?: string; opacity?: number; className?: string }) {
  return (
    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full ${className}`} preserveAspectRatio="none">
      <path
        d="M0,60 C240,0 480,120 720,60 C960,0 1200,120 1440,60 L1440,120 L0,120 Z"
        fill={color}
        opacity={opacity}
      />
      <path
        d="M0,80 C360,20 720,140 1080,80 C1260,50 1380,90 1440,80 L1440,120 L0,120 Z"
        fill={color}
        opacity={opacity * 0.6}
      />
    </svg>
  );
}

export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full ${className}`} preserveAspectRatio="none">
      <path
        d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30"
        stroke="#CC0000"
        strokeWidth="1"
        opacity="0.15"
        fill="none"
      />
      <path
        d="M0,35 C240,10 480,50 720,35 C960,20 1200,50 1440,35"
        stroke="#3b82f6"
        strokeWidth="1"
        opacity="0.1"
        fill="none"
      />
    </svg>
  );
}
