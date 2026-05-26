import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDashboard } from '../../context/DashboardContext';
import { User, Calendar, Trash2, Check, Search } from 'lucide-react';

export const BookingTab: React.FC = () => {
  const { bookings, cancelBooking } = useApp();
  const { addLog } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Confirmed' | 'Cancelled' | 'Pending'>('all');

  const handleCancel = (id: string, customer: string) => {
    if (window.confirm(`Hủy đặt đơn cho du khách "${customer}"? Điều này sẽ thay đổi số liệu doanh thu.`)) {
      cancelBooking(id);
      addLog('Hủy đơn đặt chỗ', `Hủy đơn đặt chỗ ${id} của khách hàng ${customer}`);
    }
  };

  const handleConfirm = (id: string, customer: string) => {
    // Modify standard bookings in localStorage
    const saved = localStorage.getItem('tea_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((b: any) => b.id === id ? { ...b, status: 'Đã xác nhận' } : b);
        localStorage.setItem('tea_bookings', JSON.stringify(updated));
        addLog('Xác nhận đơn đặt chỗ', `Xác nhận đơn đặt chỗ ${id} cho khách hàng ${customer}`);
        // Force refresh
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'Confirmed' && (b.status === 'Confirmed' || b.status === 'Đã xác nhận')) ||
      (statusFilter === 'Cancelled' && (b.status === 'Cancelled' || b.status === 'Đã hủy')) ||
      (statusFilter === 'Pending' && b.status === 'Chờ xử lý');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Quản Lý Đơn Đặt Tour</h2>
        <p className="text-xs text-primary/60 dark:text-cream/60">Theo dõi trạng thái thanh toán, duyệt vé và dời ngày dã ngoại cho du khách.</p>
      </div>

      {/* Filters & Search panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream/40 dark:bg-dark-surface/40 p-4 rounded-2xl border border-primary/5">
        <div className="relative w-full sm:max-w-xs flex items-center">
          <input
            type="text"
            placeholder="Tìm theo tên, tour hoặc mã đơn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cream/30 dark:bg-dark-surface/30 border border-primary/10 rounded-xl px-4 py-2 pl-10 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
          />
          <Search className="absolute left-3 w-4 h-4 text-primary/45 dark:text-cream/45" />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'Confirmed', label: 'Đã xác nhận' },
            { key: 'Pending', label: 'Chờ xử lý' },
            { key: 'Cancelled', label: 'Đã hủy' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === tab.key
                  ? 'bg-primary dark:bg-accent text-cream dark:text-primary shadow-sm'
                  : 'bg-primary/5 hover:bg-primary/10 text-primary dark:text-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass rounded-3xl overflow-hidden border border-primary/10 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-primary dark:text-cream border-collapse">
            <thead className="bg-[#EBEBE0]/60 dark:bg-dark-surface/60 text-primary/60 dark:text-cream/60 uppercase border-b border-primary/10">
              <tr>
                <th className="p-4 md:p-6">Đơn hàng / Khách hàng</th>
                <th className="p-4 md:p-6 hidden sm:table-cell">Gói Tour đã chọn</th>
                <th className="p-4 md:p-6 hidden md:table-cell">Ngày khởi hành</th>
                <th className="p-4 md:p-6 text-center hidden lg:table-cell">Khách</th>
                <th className="p-4 md:p-6">Tổng phí</th>
                <th className="p-4 md:p-6 text-center">Trạng thái</th>
                <th className="p-4 md:p-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5 dark:divide-cream/5">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-primary/5 dark:hover:bg-cream/5 transition-colors">
                    <td className="p-4 md:p-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-primary dark:text-cream leading-tight">{b.userName}</p>
                        <p className="text-[10px] text-primary/50 dark:text-cream/50 mt-0.5">{b.userEmail} • <span className="font-bold">{b.id}</span></p>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 max-w-[200px] truncate hidden sm:table-cell">{b.tourTitle}</td>
                    <td className="p-4 md:p-6 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-accent" /> {b.date}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-center font-mono hidden lg:table-cell">{b.guests}</td>
                    <td className="p-4 md:p-6 font-serif font-bold text-accent font-mono">${b.totalPrice.toLocaleString()}</td>
                    <td className="p-4 md:p-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                        b.status === 'Confirmed' || b.status === 'Đã xác nhận'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : b.status === 'Cancelled' || b.status === 'Đã hủy'
                          ? 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 animate-pulse'
                      }`}>
                        {b.status === 'Confirmed' || b.status === 'Đã xác nhận' 
                          ? 'Đã xác nhận' 
                          : b.status === 'Cancelled' || b.status === 'Đã hủy' 
                          ? 'Đã hủy' 
                          : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Confirm button */}
                        {b.status === 'Chờ xử lý' && (
                          <button
                            onClick={() => handleConfirm(b.id, b.userName)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                            title="Duyệt đơn đặt"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {/* Cancel button */}
                        {(b.status === 'Confirmed' || b.status === 'Đã xác nhận' || b.status === 'Chờ xử lý') && (
                          <button
                            onClick={() => handleCancel(b.id, b.userName)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer"
                            title="Hủy đơn đặt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-primary/50 dark:text-cream/50">
                    Không tìm thấy đơn đặt chỗ nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
