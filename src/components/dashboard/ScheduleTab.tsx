import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDashboard } from '../../context/DashboardContext';
import { ChevronLeft, ChevronRight, GripVertical, Info, Clock } from 'lucide-react';

export const ScheduleTab: React.FC = () => {
  const { bookings } = useApp();
  const { updateTourDrag } = useDashboard();

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(5); // June 2026
  const [currentYear] = useState(2026);

  // Drag and drop local state
  const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);
  const [draggedOverDay, setDraggedOverDay] = useState<number | null>(null);

  // Month information
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const startDayOfWeek = (month: number, year: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  };

  const totalDays = daysInMonth(currentMonth, currentYear);
  const firstDay = startDayOfWeek(currentMonth, currentYear);

  // Adjust firstDay for Monday start (0=Mon, 1=Tue... 6=Sun)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  // Create array of days
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  // Next/Prev Month
  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
  };

  // Helper to format date string
  const formatDateString = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  // Get bookings for a specific day
  const getBookingsForDay = (day: number) => {
    const dateStr = formatDateString(day);
    return bookings.filter(b => b.date === dateStr && b.status !== 'Cancelled' && b.status !== 'Đã hủy');
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    setDraggedBookingId(bookingId);
    e.dataTransfer.setData('text/plain', bookingId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    setDraggedOverDay(day);
  };

  const handleDragLeave = () => {
    setDraggedOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData('text/plain') || draggedBookingId;
    if (!bookingId) return;

    const newDate = formatDateString(day);
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
      updateTourDrag(bookingId, newDate);
      alert(`Đã dời ngày hành trình "${booking.tourTitle}" sang ngày ${newDate}`);
      
      // Notify parent/storage change to force updates
      window.dispatchEvent(new Event('storage'));
    }

    setDraggedBookingId(null);
    setDraggedOverDay(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Lịch Trình Khởi Hành</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">
            Xem lịch khởi hành hàng ngày. Nhấp và kéo (Drag & Drop) thẻ đặt tour để đổi ngày khởi hành trực quan.
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-3 bg-cream/50 dark:bg-dark-surface/50 px-4 py-2 rounded-2xl border border-primary/5">
          <button onClick={handlePrevMonth} className="p-1 rounded-lg hover:bg-primary/5 dark:hover:bg-cream/5 text-primary dark:text-cream cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-primary dark:text-cream font-mono min-w-[100px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button onClick={handleNextMonth} className="p-1 rounded-lg hover:bg-primary/5 dark:hover:bg-cream/5 text-primary dark:text-cream cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Hướng dẫn:</strong> Kéo giữ phần tay cầm <GripVertical className="inline w-3 h-3 mx-0.5 text-primary/60" /> của thẻ đặt tour trong ô lịch, và thả vào ô ngày mong muốn để cập nhật ngày khởi hành.
        </p>
      </div>

      {/* Calendar Grid Container */}
      <div className="glass rounded-3xl border border-primary/10 shadow-xl overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-[#EBEBE0]/60 dark:bg-dark-surface/60 border-b border-primary/10 text-center py-3 text-[10px] font-bold uppercase tracking-wider text-primary/60 dark:text-cream/60">
            <div>Thứ 2</div>
            <div>Thứ 3</div>
            <div>Thứ 4</div>
            <div>Thứ 5</div>
            <div>Thứ 6</div>
            <div>Thứ 7</div>
            <div>Chủ Nhật</div>
          </div>

          {/* Days Cells Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-primary/5 dark:divide-cream/5 bg-transparent min-h-[500px]">
            {calendarDays.map((day, idx) => {
              const dayBookings = day ? getBookingsForDay(day) : [];
              const isTarget = draggedOverDay === day;

              return (
                <div
                  key={idx}
                  className={`p-2.5 flex flex-col justify-between min-h-[100px] transition-colors relative ${
                    !day ? 'bg-cream/10 dark:bg-dark-bg/10' : 'bg-transparent'
                  } ${
                    isTarget ? 'bg-accent/15 border-2 border-dashed border-accent z-10' : ''
                  }`}
                  onDragOver={(e) => day && handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => day && handleDrop(e, day)}
                >
                  {/* Day number */}
                  {day && (
                    <span className="font-mono text-xs font-bold text-primary/50 dark:text-cream/50 self-start block mb-1">
                      {day}
                    </span>
                  )}

                  {/* Day Bookings timeline items list */}
                  <div className="space-y-1.5 flex-grow flex flex-col justify-start mt-2">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, b.id)}
                        className="p-2 rounded-xl bg-primary text-cream dark:bg-dark-surface dark:border dark:border-accent/30 text-[9px] font-semibold cursor-grab active:cursor-grabbing hover:scale-102 transition-all flex items-start gap-1 select-none shadow-md group relative"
                      >
                        <GripVertical className="w-3.5 h-3.5 text-cream/40 group-hover:text-accent flex-shrink-0 mt-0.5" />
                        <div className="overflow-hidden">
                          <p className="font-serif truncate font-bold text-white leading-tight">{b.userName}</p>
                          <p className="opacity-75 truncate">{b.tourTitle}</p>
                          <p className="opacity-60 flex items-center gap-0.5 mt-0.5"><Clock className="w-2.5 h-2.5" /> {b.guests} khách</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
