import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import type { Staff } from '../../context/DashboardContext';
import { Mail, ShieldAlert, LogIn, LogOut, CheckCircle2, Calendar, UserPlus, X } from 'lucide-react';

export const StaffTab: React.FC = () => {
  const { staffList, setStaffList, staffCheckIn, staffCheckOut, addLog, role } = useDashboard();
  const [isOpenForm, setIsOpenForm] = useState(false);

  // New staff states
  const [name, setName] = useState('');
  const [staffRole, setStaffRole] = useState<Staff['role']>('guide');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newStaff: Staff = {
      id: `S-${Math.floor(105 + Math.random() * 890)}`,
      name,
      role: staffRole,
      avatar,
      email,
      status: 'active',
      attendance: [],
      schedule: {
        monday: '09:00 - 18:00',
        tuesday: '09:00 - 18:00',
        wednesday: '09:00 - 18:00',
        thursday: '09:00 - 18:00',
        friday: '09:00 - 18:00',
        saturday: 'Day Off',
        sunday: 'Day Off',
      }
    };

    setStaffList(prev => [...prev, newStaff]);
    addLog('Đăng ký nhân viên', `Đăng ký nhân viên mới: ${name} (${staffRole})`);
    setName('');
    setEmail('');
    setIsOpenForm(false);
  };

  const getTodayAttendance = (staff: Staff) => {
    const today = new Date().toISOString().split('T')[0];
    return staff.attendance.find(a => a.date === today);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Quản Lý Nhân Viên & Phân Ca</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Theo dõi ca làm việc, lịch trình dẫn tour của hướng dẫn viên và điểm danh vào/ra.</p>
        </div>
        
        {role === 'admin' && (
          <button
            onClick={() => setIsOpenForm(!isOpenForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer"
          >
            {isOpenForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isOpenForm ? 'Đóng' : 'Đăng Ký Nhân Viên'}</span>
          </button>
        )}
      </div>

      {/* Add Staff Form */}
      {isOpenForm && (
        <form onSubmit={handleAddStaff} className="glass p-6 rounded-3xl border border-primary/10 shadow-lg space-y-4 animate-fade-in-up">
          <h3 className="font-serif text-lg font-bold text-primary dark:text-cream pb-2 border-b border-primary/5">Tuyển Dụng Nhân Sự Mới</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Tên nhân viên *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Trần Văn An"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Địa chỉ Email *</label>
              <input
                type="email"
                required
                placeholder="an.tran@camelliatrails.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Bộ phận / Vai trò</label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as any)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream cursor-pointer"
              >
                <option value="guide">Hướng Dẫn Viên (Guide)</option>
                <option value="receptionist">Lễ Tân (Receptionist)</option>
                <option value="accountant">Kế Toán (Accountant)</option>
                <option value="admin">Quản Trị Viên (Admin)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Đường dẫn ảnh đại diện</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-101 transition-all cursor-pointer"
          >
            Tuyển dụng nhân viên
          </button>
        </form>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffList.map(staff => {
          const todayAttend = getTodayAttendance(staff);

          return (
            <div
              key={staff.id}
              className="glass-card rounded-2xl p-5 border border-primary/10 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-primary/10 flex-shrink-0"
                />
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-primary dark:text-cream leading-tight">
                      {staff.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      staff.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300' :
                      staff.role === 'guide' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                      staff.role === 'accountant' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    }`}>
                      {staff.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-primary/50 dark:text-cream/50 flex items-center gap-1 font-mono truncate">
                    <Mail className="w-3.5 h-3.5" /> {staff.email}
                  </p>
                  <p className="text-[9px] text-primary/45 dark:text-cream/45">Mã nhân sự: <span className="font-bold font-mono">{staff.id}</span></p>
                </div>
              </div>

              {/* Weekly Schedule Display */}
              <div className="mt-4 p-3.5 rounded-xl bg-cream/30 dark:bg-dark-surface/30 border border-primary/5 space-y-2">
                <span className="text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-accent" /> Phân lịch tuần này
                </span>
                <div className="grid grid-cols-7 gap-1 text-[8px] font-semibold text-center text-primary/80 dark:text-cream/80">
                  <div className="p-1 rounded bg-primary/5">T2<span className="block font-bold text-[7px] text-primary/45 dark:text-cream/45 mt-0.5 truncate">{staff.schedule.monday.slice(0, 4)}</span></div>
                  <div className="p-1 rounded bg-primary/5">T3<span className="block font-bold text-[7px] text-primary/45 dark:text-cream/45 mt-0.5 truncate">{staff.schedule.tuesday.slice(0, 4)}</span></div>
                  <div className="p-1 rounded bg-primary/5">T4<span className="block font-bold text-[7px] text-primary/45 dark:text-cream/45 mt-0.5 truncate">{staff.schedule.wednesday.slice(0, 4)}</span></div>
                  <div className="p-1 rounded bg-primary/5">T5<span className="block font-bold text-[7px] text-primary/45 dark:text-cream/45 mt-0.5 truncate">{staff.schedule.thursday.slice(0, 4)}</span></div>
                  <div className="p-1 rounded bg-primary/5">T6<span className="block font-bold text-[7px] text-primary/45 dark:text-cream/45 mt-0.5 truncate">{staff.schedule.friday.slice(0, 4)}</span></div>
                  <div className="p-1 rounded bg-accent/15">T7<span className="block font-bold text-[7px] text-accent mt-0.5 truncate">{staff.schedule.saturday.slice(0, 4)}</span></div>
                  <div className="p-1 rounded bg-accent/15">CN<span className="block font-bold text-[7px] text-accent mt-0.5 truncate">{staff.schedule.sunday.slice(0, 4)}</span></div>
                </div>
              </div>

              {/* Attendance Tracker */}
              <div className="mt-4 pt-3 border-t border-primary/5 flex items-center justify-between gap-4">
                <div className="text-[10px]">
                  <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 font-bold">Hôm nay:</span>
                  {todayAttend ? (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Checkin: {todayAttend.checkIn || '--:--'} • Checkout: {todayAttend.checkOut || '--:--'}
                    </span>
                  ) : (
                    <span className="text-primary/50 dark:text-cream/50 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Chưa vào ca
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => staffCheckIn(staff.id)}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                    title="Điểm danh vào ca"
                    disabled={!!todayAttend?.checkIn}
                  >
                    <LogIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => staffCheckOut(staff.id)}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 cursor-pointer"
                    title="Điểm danh tan ca"
                    disabled={!todayAttend?.checkIn || !!todayAttend?.checkOut}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
