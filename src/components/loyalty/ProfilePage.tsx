'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, MapPin, ChevronRight, Shield, Car, Plus, Trash2, CheckCircle2, Settings, LogOut } from 'lucide-react';
import { api } from '@/lib/loyalty-api';

interface ProfilePageProps {
  user: any;
  customerId: string;
  onLogout: () => void;
}

export default function ProfilePage({ user, customerId, onLogout }: ProfilePageProps) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', licensePlate: '' });

  useEffect(() => {
    api.getVehicles(customerId).then(setVehicles).catch(() => {});
  }, [customerId]);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.licensePlate) return;
    const vehicle = await api.addVehicle({ customerId, ...newVehicle });
    if (vehicle.id) {
      setVehicles([vehicle, ...vehicles]);
      setNewVehicle({ make: '', model: '', licensePlate: '' });
      setShowAddForm(false);
    }
  };

  const removeVehicle = async (id: string) => {
    await api.deleteVehicle(id);
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const tierLabel = user.memberTier === 'SILVER' ? 'Silver' : user.memberTier === 'GOLD' ? 'Gold' : 'Platinum';

  const menuItems = [
    { icon: <UserIcon size={20} />, label: 'แก้ไขข้อมูลส่วนตัว' },
    { icon: <MapPin size={20} />, label: 'สาขาที่ใช้ประจำ' },
    { icon: <Shield size={20} />, label: 'ความปลอดภัย' },
    { icon: <Settings size={20} />, label: 'ตั้งค่าแอปพลิเคชัน' },
  ];

  return (
    <div className="px-6 py-4 space-y-8 pb-10">
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-roboss-red p-1 shadow-2xl shadow-red-600/20">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover rounded-[1.7rem]" />
            ) : (
              <div className="w-full h-full rounded-[1.7rem] bg-roboss-red/20 flex items-center justify-center text-roboss-red font-bold text-3xl">
                {(user.name || 'U').charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-roboss-red p-2 rounded-xl border-4 border-black shadow-lg">
            <Shield size={16} color="white" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white font-kanit">{user.name}</h2>
          <p className="text-gray-500 text-sm font-mono">ID: {user.id?.slice(0, 12)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-roboss-dark p-4 rounded-3xl border border-white/5 text-center">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">สถานะสมาชิก</p>
          <p className="text-yellow-500 font-bold text-lg">{tierLabel}</p>
        </div>
        <div className="bg-roboss-dark p-4 rounded-3xl border border-white/5 text-center">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">แต้มสะสม</p>
          <p className="text-white font-bold text-lg">{user.points.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-kanit">
            <Car size={20} className="text-roboss-red" /> รถที่ลงทะเบียนไว้
          </h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="text-roboss-red text-xs font-bold flex items-center gap-1 bg-roboss-red/10 px-3 py-1.5 rounded-xl active:scale-95 transition-transform">
            {showAddForm ? 'ยกเลิก' : <><Plus size={14} /> เพิ่มรถ</>}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddVehicle} className="bg-roboss-dark p-5 rounded-[2rem] border border-roboss-red/30 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="ยี่ห้อ" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-roboss-red/50" value={newVehicle.make} onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })} required />
              <input type="text" placeholder="รุ่น" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-roboss-red/50" value={newVehicle.model} onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })} />
            </div>
            <input type="text" placeholder="เลขทะเบียน" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-roboss-red/50" value={newVehicle.licensePlate} onChange={e => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })} required />
            <button type="submit" className="w-full gradient-red text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform">ยืนยันการลงทะเบียน</button>
          </form>
        )}

        <div className="space-y-3">
          {vehicles.length > 0 ? vehicles.map((v: any) => (
            <div key={v.id} className="bg-roboss-dark p-4 rounded-[1.5rem] border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-roboss-red"><Car size={24} /></div>
                <div>
                  <h4 className="text-white font-bold text-sm">{v.make} {v.model || ''}</h4>
                  <p className="text-gray-500 text-xs font-mono">{v.licensePlate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-green-500/50 group-hover:text-green-500 transition-colors"><CheckCircle2 size={18} /></div>
                <button onClick={() => removeVehicle(v.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          )) : (
            <div className="bg-roboss-dark p-8 rounded-[2rem] border border-dashed border-white/10 text-center">
              <p className="text-gray-600 text-sm">ยังไม่มีรถที่ลงทะเบียน</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-roboss-dark rounded-[2.5rem] overflow-hidden border border-white/5">
        {menuItems.map((item, i) => (
          <button key={i} className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors ${i !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="text-gray-400">{item.icon}</div>
              <span className="text-white font-medium">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        ))}
      </div>

      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-roboss-red/10 text-roboss-red py-4 rounded-2xl font-bold active:scale-95 transition-transform">
        <LogOut size={18} /> ออกจากระบบ
      </button>

      <p className="text-center text-gray-600 text-[10px] pb-4 uppercase tracking-[0.2em]">Roboss Loyalty v1.0.0</p>
    </div>
  );
}
