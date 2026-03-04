'use client';

interface ScanPageProps {
  user: any;
  onClose: () => void;
}

export default function ScanPage({ user, onClose }: ScanPageProps) {
  const tierLabel = user.memberTier === 'SILVER' ? 'Silver' : user.memberTier === 'GOLD' ? 'Gold' : 'Platinum';

  return (
    <div className="fixed inset-0 max-w-md mx-auto z-[60] bg-black flex flex-col font-display text-gray-100 antialiased overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 pt-14 px-6 flex items-center justify-between">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">flashlight_on</span>
            ไฟแฟลช
          </button>
        </div>
      </header>

      {/* QR Scanner Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative w-full aspect-square max-w-[280px]">
          {/* Corner frames */}
          <div className="qr-frame-corner top-0 left-0 rounded-tl-xl border-b-0 border-r-0"></div>
          <div className="qr-frame-corner top-0 right-0 rounded-tr-xl border-b-0 border-l-0"></div>
          <div className="qr-frame-corner bottom-0 left-0 rounded-bl-xl border-t-0 border-r-0"></div>
          <div className="qr-frame-corner bottom-0 right-0 rounded-br-xl border-t-0 border-l-0"></div>
          <div className="absolute inset-0 rounded-xl" style={{ background: 'rgba(242,13,13,0.05)', filter: 'blur(40px)' }}></div>
          <div className="absolute top-1/2 left-4 right-4 scanner-line animate-pulse"></div>
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg font-semibold text-white mb-2">สแกนคิวอาร์โค้ดเพื่อสะสมแต้ม</p>
          <p className="text-gray-400 text-sm font-light">วางคิวอาร์โค้ดให้อยู่ภายในกรอบเพื่อสแกน</p>
        </div>
      </main>

      {/* Bottom Info */}
      <div className="relative z-10 px-6 pb-12">
        <div className="rounded-2xl p-4 border border-white/10 flex items-center gap-4" style={{ background: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(20px)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(242,13,13,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: '#f20d0d' }}>stars</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider">คะแนนคงเหลือ</p>
            <p className="text-xl font-bold text-white">{user.points.toLocaleString()} <span className="text-sm font-normal" style={{ color: '#f20d0d' }}>pts</span></p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-right">
            <p className="text-xs text-gray-400">ระดับ</p>
            <p className="text-sm font-bold text-white">{tierLabel} Tier</p>
          </div>
        </div>
      </div>

      <div className="relative z-20 pb-2 flex justify-center w-full">
        <div className="w-32 h-1.5 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
}
