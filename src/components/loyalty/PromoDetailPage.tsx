'use client';

interface PromoDetailPageProps {
  promo?: any;
  onBack: () => void;
  onOpenBranches?: () => void;
}

export default function PromoDetailPage({ promo, onBack, onOpenBranches }: PromoDetailPageProps) {
  const p = promo || {
    title: 'โปรโมชั่นพิเศษ 7.7',
    description: 'เคลือบแก้วเซรามิก ลดราคาพิเศษเฉพาะเดือนนี้เท่านั้น',
    tag: 'Hot Deal',
    price: '฿ 2,999',
    originalPrice: '฿ 5,500',
    imageUrl: '',
    details: [
      'เคลือบแก้วเซรามิกแท้ 100% ความแข็งระดับ 9H',
      'รับประกันคุณภาพ 3 ปีเต็ม',
      'ฟรี! ล้างสี ดูดฝุ่น ขัดเคลือบสี 1 ครั้ง',
      'ฟรี! อบโอโซนฆ่าเชื้อโรคในห้องโดยสาร',
    ],
    conditions: [
      'โปรโมชั่นนี้ใช้ได้ถึงวันที่ 31 ก.ค. 67 เท่านั้น',
      'ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นๆ ได้',
      'กรุณาจองคิวล่วงหน้าอย่างน้อย 1 วัน',
    ],
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="relative h-72 w-full shrink-0">
        {p.imageUrl ? (
          <img alt={p.title} className="w-full h-full object-cover" src={p.imageUrl} />
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
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white">share</span>
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-6 -mt-10 overflow-y-auto scrollbar-hide pb-32">
        <div className="bg-surface-dark/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
          <div className="mb-6">
            {p.tag && (
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase mb-2 inline-block">{p.tag}</span>
            )}
            <h1 className="text-2xl font-bold text-white mb-2">{p.title}</h1>
            <p className="text-gray-400 text-sm">{p.description}</p>
          </div>

          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-white/10">
            <span className="text-3xl font-bold text-white">{p.price}</span>
            {p.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{p.originalPrice}</span>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">รายละเอียดโปรโมชั่น</h3>
            <ul className="space-y-2 text-sm text-gray-300 list-disc pl-4">
              {p.details.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>

            {p.conditions && p.conditions.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-white mt-6">เงื่อนไข</h3>
                <ul className="space-y-2 text-sm text-gray-400 list-disc pl-4">
                  {p.conditions.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button onClick={onOpenBranches} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(242,13,13,0.4)] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">calendar_today</span>
            จองบริการเลย
          </button>
        </div>
      </main>
    </div>
  );
}
