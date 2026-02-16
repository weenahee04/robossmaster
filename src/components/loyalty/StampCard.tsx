'use client';

import { CircleCheck } from 'lucide-react';

interface StampCardProps {
  current: number;
  total: number;
}

export default function StampCard({ current, total }: StampCardProps) {
  return (
    <div className="bg-roboss-dark p-6 rounded-3xl border border-white/5 grid grid-cols-5 gap-4 shadow-inner">
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < current;
        const isNext = i === current;
        return (
          <div
            key={i}
            className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 relative
              ${isCompleted
                ? 'bg-roboss-red text-white shadow-[0_0_15px_rgba(255,75,92,0.5)]'
                : isNext
                  ? 'bg-roboss-red/10 border-2 border-dashed border-roboss-red/40 text-roboss-red animate-pulse'
                  : 'bg-white/5 text-gray-700 border border-white/5'
              }`}
          >
            {isCompleted ? (
              <CircleCheck size={22} strokeWidth={3} className="drop-shadow-sm" />
            ) : (
              <div className="text-xs font-bold font-mono opacity-40">{i + 1}</div>
            )}
            {isCompleted && (
              <div className="absolute inset-0 rounded-2xl bg-roboss-red/20 blur-md -z-10"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
