'use client';

import { useCallback } from 'react';

interface PromoDetailPageProps {
  promo?: any;
  onBack: () => void;
  onOpenBranches?: () => void;
}

export default function PromoDetailPage({ promo, onBack, onOpenBranches }: PromoDetailPageProps) {
  const p = promo || {};

  const title = p.title || 'โปรโมชั่น';
  const description = p.description || '';
  const tag = p.tag || '';
  const price = p.price || '';
  const originalPrice = p.originalPrice || '';
  const imageUrl = p.imageUrl || '';
  const details: string[] = Array.isArray(p.details) ? p.details : [];
  const conditions: string[] = Array.isArray(p.conditions) ? p.conditions : [];

  const handleShare = useCallback(async () => {
    const shareData = {
      title,
      text: `${title} — ${description}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${title}\n${description}\n${window.location.href}`);
      }
    } catch {
      // user cancelled
    }
  }, [title, description]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="relative h-72 w-full shrink-0">
        {imageUrl ? (
          <img alt={title} className="w-full h-full object-cover" src={imageUrl} />
        ) : (
          <div className="w-full h-full bg-surface-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-gray-700">local_offer</span>
          </div>
        )}
        <div className="absolute inset-0 gradient-overlay"></div>
        <div className="absolute top-12 left-6 flex items-center justify-between w-[calc(100%-48px)]">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white">chevron_left</span>
          </button>
          <button onClick={handleShare} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white">share</span>
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-6 -mt-10 overflow-y-auto scrollbar-hide pb-32">
        <div className="bg-surface-dark/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
          <div className="mb-6">
            {tag && (
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase mb-2 inline-block">{tag}</span>
            )}
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            {description && <p className="text-gray-400 text-sm">{description}</p>}
          </div>

          {(price || originalPrice) && (
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-white/10">
              {price && <span className="text-3xl font-bold text-white">{price}</span>}
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
              )}
            </div>
          )}

          {details.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">รายละเอียดโปรโมชั่น</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc pl-4">
                {details.map((d: string, i: number) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {conditions.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-bold text-white">เงื่อนไข</h3>
              <ul className="space-y-2 text-sm text-gray-400 list-disc pl-4">
                {conditions.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {details.length === 0 && conditions.length === 0 && !description && (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-600 block mb-2">info</span>
              <p className="text-gray-500 text-sm">ยังไม่มีรายละเอียดเพิ่มเติม</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button onClick={onOpenBranches} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(242,13,13,0.4)] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">location_on</span>
            ดูสาขาที่ร่วมรายการ
          </button>
        </div>
      </main>
    </div>
  );
}
