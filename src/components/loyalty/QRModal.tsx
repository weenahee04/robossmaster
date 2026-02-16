'use client';

import { X, Download, Share2 } from 'lucide-react';

interface QRModalProps {
  user: any;
  onClose: () => void;
}

export default function QRModal({ user, onClose }: QRModalProps) {
  const qrData = `ROBOSS-CUSTOMER-${user.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl" onClick={onClose}>
      <div className="bg-roboss-dark rounded-[2.5rem] p-8 w-[90%] max-w-sm border border-white/10 shadow-2xl space-y-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white font-kanit">Scan to Wash</h3>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl flex items-center justify-center">
          <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-white font-bold text-lg font-kanit">{user.name}</p>
          <p className="text-gray-500 text-xs font-mono">ID: {user.id?.slice(0, 16)}</p>
          <p className="text-roboss-red text-xs font-bold mt-2">{user.points.toLocaleString()} แต้ม</p>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-gray-400 py-4 rounded-2xl text-sm font-bold hover:bg-white/10 transition-colors active:scale-95">
            <Download size={18} /> บันทึก
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-gray-400 py-4 rounded-2xl text-sm font-bold hover:bg-white/10 transition-colors active:scale-95">
            <Share2 size={18} /> แชร์
          </button>
        </div>

        <p className="text-center text-gray-600 text-[10px]">แสดง QR Code นี้ให้พนักงานสแกนเมื่อใช้บริการ</p>
      </div>
    </div>
  );
}
