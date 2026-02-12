export default function WaterBubbles({ className = "" }: { className?: string }) {
  const bubbles = [
    { cx: "5%", cy: "20%", r: 30, dur: "6s", delay: "0s", opacity: 0.08 },
    { cx: "15%", cy: "60%", r: 20, dur: "8s", delay: "1s", opacity: 0.06 },
    { cx: "25%", cy: "80%", r: 40, dur: "7s", delay: "0.5s", opacity: 0.05 },
    { cx: "40%", cy: "15%", r: 25, dur: "9s", delay: "2s", opacity: 0.07 },
    { cx: "55%", cy: "70%", r: 35, dur: "6.5s", delay: "1.5s", opacity: 0.06 },
    { cx: "70%", cy: "30%", r: 22, dur: "7.5s", delay: "0.8s", opacity: 0.08 },
    { cx: "80%", cy: "85%", r: 28, dur: "8.5s", delay: "2.5s", opacity: 0.05 },
    { cx: "90%", cy: "45%", r: 18, dur: "6s", delay: "1.2s", opacity: 0.07 },
    { cx: "35%", cy: "40%", r: 15, dur: "10s", delay: "3s", opacity: 0.04 },
    { cx: "65%", cy: "55%", r: 32, dur: "7s", delay: "0.3s", opacity: 0.06 },
    { cx: "50%", cy: "90%", r: 20, dur: "9s", delay: "1.8s", opacity: 0.05 },
    { cx: "85%", cy: "10%", r: 24, dur: "8s", delay: "2.2s", opacity: 0.07 },
  ];

  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      {bubbles.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#3b82f6" opacity={b.opacity}>
          <animate
            attributeName="cy"
            values={`${b.cy};${parseFloat(b.cy) - 5}%;${b.cy}`}
            dur={b.dur}
            begin={b.delay}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${b.r};${b.r + 5};${b.r}`}
            dur={b.dur}
            begin={b.delay}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={`${b.opacity};${b.opacity * 0.5};${b.opacity}`}
            dur={b.dur}
            begin={b.delay}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
