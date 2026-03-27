'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-start-wash',
    title: 'เริ่มล้างรถ',
    description: 'กดที่นี่เพื่อเริ่มล้างรถ สแกน QR ที่เครื่อง เลือกแพ็กเกจ แล้วจ่ายเงินได้เลย',
  },
  {
    targetId: 'tour-points-card',
    title: 'คะแนนสะสม',
    description: 'ดูคะแนนสะสมของคุณได้ที่นี่ ยิ่งล้างมาก ยิ่งได้แต้มเยอะ!',
  },
  {
    targetId: 'tour-nav-coupons',
    title: 'คูปองส่วนลด',
    description: 'แลกแต้มเป็นคูปองส่วนลด หรือใช้คูปองจ่ายค่าล้างรถได้',
  },
  {
    targetId: 'tour-nav-scan',
    title: 'สแกน QR',
    description: 'กดปุ่มนี้เพื่อสแกน QR ที่เครื่องล้างรถได้เลย',
  },
  {
    targetId: 'tour-nav-profile',
    title: 'บัญชีของคุณ',
    description: 'จัดการข้อมูลส่วนตัว รถของคุณ และตั้งค่าต่าง ๆ',
  },
];

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<'top' | 'bottom'>('bottom');
  const rafRef = useRef<number>();

  const step = TOUR_STEPS[currentStep];

  const updateSpotlight = useCallback(() => {
    const el = document.querySelector(`[data-tour-id="${step.targetId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightRect(rect);
      const midY = rect.top + rect.height / 2;
      setTooltipPos(midY < window.innerHeight * 0.5 ? 'bottom' : 'top');
    }
  }, [step.targetId]);

  useEffect(() => {
    updateSpotlight();
    const handleResize = () => {
      cancelAnimationFrame(rafRef.current!);
      rafRef.current = requestAnimationFrame(updateSpotlight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      cancelAnimationFrame(rafRef.current!);
    };
  }, [updateSpotlight]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const pad = 8;

  return (
    <div className="fixed inset-0 z-[70]">
      {spotlightRect && (
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={spotlightRect.left - pad}
                y={spotlightRect.top - pad}
                width={spotlightRect.width + pad * 2}
                height={spotlightRect.height + pad * 2}
                rx="16"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0" y="0" width="100%" height="100%"
            fill="rgba(0,0,0,0.8)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      )}

      {spotlightRect && (
        <div
          className="absolute border-2 border-primary rounded-2xl pointer-events-none animate-pulse"
          style={{
            left: spotlightRect.left - pad,
            top: spotlightRect.top - pad,
            width: spotlightRect.width + pad * 2,
            height: spotlightRect.height + pad * 2,
          }}
        />
      )}

      <div
        className="absolute inset-0"
        onClick={handleNext}
        style={{ pointerEvents: 'auto' }}
      />

      {spotlightRect && (
        <div
          className="absolute left-4 right-4 max-w-sm mx-auto transition-all duration-300"
          style={{
            ...(tooltipPos === 'bottom'
              ? { top: spotlightRect.bottom + pad + 16 }
              : { bottom: window.innerHeight - spotlightRect.top + pad + 16 }),
            pointerEvents: 'auto',
          }}
        >
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                </div>
                <h3 className="text-white font-bold text-base">{step.title}</h3>
              </div>
              <span className="text-xs text-gray-500 font-mono mt-1">
                {currentStep + 1}/{TOUR_STEPS.length}
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">{step.description}</p>

            <div className="flex items-center justify-between">
              <button
                onClick={(e) => { e.stopPropagation(); onSkip(); }}
                className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
              >
                ข้ามทั้งหมด
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="px-5 py-2.5 bg-primary rounded-xl text-white text-sm font-bold active:scale-95 transition-transform"
              >
                {currentStep < TOUR_STEPS.length - 1 ? 'ถัดไป' : 'เข้าใจแล้ว'}
              </button>
            </div>

            <div className="flex justify-center gap-1.5 mt-4">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-5 bg-primary' : i < currentStep ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
