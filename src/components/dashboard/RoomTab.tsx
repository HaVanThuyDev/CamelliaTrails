import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import type { Room } from '../../context/DashboardContext';
import { Key, AlertTriangle, CheckCircle, Plus, X, MapPin, Users, DollarSign } from 'lucide-react';

export const RoomTab: React.FC = () => {
  const { rooms, setRooms, addLog, role } = useDashboard();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New room state
  const [name, setName] = useState('');
  const [type, setType] = useState<'Villa' | 'Cabin' | 'Suite'>('Cabin');
  const [capacity, setCapacity] = useState(2);
  const [price, setPrice] = useState(200);
  const [location, setLocation] = useState('Sapa Lodge');

  const handleStatusChange = (roomId: string, currentStatus: Room['status']) => {
    let nextStatus: Room['status'] = 'Available';
    if (currentStatus === 'Available') nextStatus = 'Maintenance';
    else if (currentStatus === 'Maintenance') nextStatus = 'Available';
    else {
      alert('Phòng đang có khách lưu trú, không thể chuyển sang bảo trì.');
      return;
    }

    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: nextStatus } : r));
    addLog('Cập nhật trạng thái phòng', `Chuyển trạng thái phòng ${roomId} sang: ${nextStatus}`);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRoom: Room = {
      id: `R-${Math.floor(200 + Math.random() * 800)}`,
      name,
      type,
      capacity,
      pricePerNight: price,
      status: 'Available',
      location,
      bookings: []
    };

    setRooms(prev => [...prev, newRoom]);
    addLog('Thêm phòng nghỉ mới', `Tạo cơ sở lưu trú mới: ${name} (${type}) tại ${location}`);
    setName('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Quản Lý Phòng & Tiện Ích</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Theo dõi trạng thái các Villa, Cabin sinh thái mộc mạc và lên lịch bảo trì phòng.</p>
        </div>
        
        {role !== 'accountant' && (
          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer"
          >
            {isAddOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddOpen ? 'Đóng' : 'Thêm Phòng Nghỉ'}</span>
          </button>
        )}
      </div>

      {/* Create Room Form */}
      {isAddOpen && (
        <form onSubmit={handleCreateRoom} className="glass p-6 rounded-3xl border border-primary/10 shadow-lg space-y-4 animate-fade-in-up">
          <h3 className="font-serif text-lg font-bold text-primary dark:text-cream pb-2 border-b border-primary/5">Thêm Cơ Sở Lưu Trú</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Tên phòng/Villa *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Sa Pa Cloud Cabin C"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Khu vực / Chi nhánh</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Loại hình</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream cursor-pointer"
              >
                <option value="Cabin">Cabin Sinh Thái</option>
                <option value="Villa">Villa Kính Mây</option>
                <option value="Suite">Phòng Suite Hạng Sang</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Sức chứa tối đa (Khách)</label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Giá thuê/đêm (USD)</label>
              <input
                type="number"
                required
                min="50"
                max="2000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-101 transition-all cursor-pointer"
          >
            Tạo phòng nghỉ
          </button>
        </form>
      )}

      {/* Grid of rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div
            key={room.id}
            className="glass-card rounded-2xl p-5 border border-primary/10 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group"
          >
            {/* Status indicator line on top */}
            <div className={`absolute top-0 left-0 w-full h-[3px] ${
              room.status === 'Available' ? 'bg-emerald-500' :
              room.status === 'Occupied' ? 'bg-amber-500' : 'bg-red-500'
            }`} />

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider font-bold bg-primary/5 dark:bg-cream/5 px-2 py-0.5 rounded text-primary/65 dark:text-cream/65">
                  {room.type}
                </span>
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${
                  room.status === 'Available' ? 'text-emerald-600 dark:text-emerald-400' :
                  room.status === 'Occupied' ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'
                }`}>
                  {room.status === 'Available' ? <CheckCircle className="w-3.5 h-3.5" /> :
                   room.status === 'Occupied' ? <Key className="w-3.5 h-3.5" /> :
                   <AlertTriangle className="w-3.5 h-3.5" />}
                  {room.status === 'Available' ? 'Sẵn sàng' :
                   room.status === 'Occupied' ? 'Có khách' : 'Bảo trì'}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-cream leading-snug group-hover:text-accent transition-colors">
                  {room.name}
                </h3>
                <p className="text-[9px] text-primary/50 dark:text-cream/50 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-accent" /> {room.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-primary/75 dark:text-cream/75 border-y border-primary/5 py-2">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-accent" /> {room.capacity} Khách</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-accent" /> ${room.pricePerNight}/đêm</span>
              </div>

              {/* Show occupancy schedule if occupied */}
              {room.bookings.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-[9px] text-amber-800 dark:text-amber-300">
                  <p className="font-bold">Lịch lưu trú hiện tại:</p>
                  <p className="font-mono mt-0.5">{room.bookings[0].checkIn} đến {room.bookings[0].checkOut}</p>
                  <p className="mt-0.5">Mã đơn: <span className="font-bold font-mono">{room.bookings[0].bookingId}</span></p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {role !== 'accountant' && (
              <div className="mt-4 pt-3 border-t border-primary/5 flex justify-end">
                <button
                  onClick={() => handleStatusChange(room.id, room.status)}
                  className={`text-[9px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    room.status === 'Available' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400' :
                    room.status === 'Maintenance' ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    'bg-gray-500/10 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                  disabled={room.status === 'Occupied'}
                >
                  {room.status === 'Available' ? 'Chuyển bảo trì' :
                   room.status === 'Maintenance' ? 'Bảo trì xong' : 'Khóa'}
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
