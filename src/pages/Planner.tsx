import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Leaf, Clock, MapPin, BookOpen } from 'lucide-react';

interface DayPlan {
  dayNumber: number;
  morning: string;
  afternoon: string;
  evening: string;
  notes: string;
}

interface CustomTrip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  days: DayPlan[];
}

export const Planner: React.FC = () => {
  const [trips, setTrips] = useState<CustomTrip[]>([]);
  
  // Form input states
  const [tripTitle, setTripTitle] = useState('');
  const [tripLocation, setTripLocation] = useState('Sapa, Vietnam');
  const [startDate, setStartDate] = useState('2026-06-20');
  const [durationDays, setDurationDays] = useState(3);
  
  // Active editing trip or active form day index
  const [currentDays, setCurrentDays] = useState<DayPlan[]>([]);
  const [activeTab, setActiveTab] = useState(1);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tea_custom_trips');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTrips(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error parsing tea_custom_trips:', e);
    }

    // Seed initial custom trip
    const seed: CustomTrip = {
      id: 'trip-seed',
      title: 'Hành Trình Trà Mây & Thảo Dược Dao Đỏ',
      location: 'Sapa, Lào Cai',
      startDate: '2026-06-15',
      days: [
        { dayNumber: 1, morning: 'Thu hoạch lá trà Shan Tuyết', afternoon: 'Tắm lá thuốc Dao đỏ trong bồn gỗ', evening: 'Bữa tối cá hồi xông khói hương nhài', notes: 'Đi bộ chậm rãi quanh thung lũng.' },
        { dayNumber: 2, morning: 'Thiền âm thanh bên thác nước', afternoon: 'Khóa học sấy trà tại hợp tác xã', evening: 'Kể chuyện cổ tích bên đống lửa', notes: 'Mang theo áo mưa ấm.' }
      ]
    };
    setTrips([seed]);
    localStorage.setItem('tea_custom_trips', JSON.stringify([seed]));
  }, []);

  // Update current editing days when duration changes
  useEffect(() => {
    const newDays: DayPlan[] = Array.from({ length: durationDays }).map((_, i) => ({
      dayNumber: i + 1,
      morning: 'Thiền Tĩnh Lặng & Thưởng Trà Bình Minh',
      afternoon: 'Tắm Thuốc Thảo Dược Dao Đỏ Phục Hồi Sức Khỏe',
      evening: 'Trải Nghiệm Trà Đạo & Trị Liệu Âm Thanh',
      notes: ''
    }));
    setCurrentDays(newDays);
    setActiveTab(1);
  }, [durationDays]);

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle.trim()) return;

    const newTrip: CustomTrip = {
      id: `trip-${Date.now()}`,
      title: tripTitle,
      location: tripLocation,
      startDate,
      days: currentDays
    };

    const updated = [newTrip, ...trips];
    setTrips(updated);
    localStorage.setItem('tea_custom_trips', JSON.stringify(updated));
    
    // Clear inputs
    setTripTitle('');
    setDurationDays(3);
    alert('Lưu lịch trình chuyến đi thành công!');
  };

  const handleDeleteTrip = (id: string) => {
    const updated = trips.filter(t => t.id !== id);
    setTrips(updated);
    localStorage.setItem('tea_custom_trips', JSON.stringify(updated));
  };

  // Activity options matching our theme
  const morningActivities = [
    'Thiền Tĩnh Lặng & Thưởng Trà Bình Minh',
    'Thu hoạch lá trà Shan Tuyết',
    'Dạo Bước Vườn Trà Thiền & Thở Chánh Niệm',
    'Leo Núi Ngắm Đồi Chè cổ thụ',
    'Tập Yoga Ấn Độ & Điều Hòa Hơi Thở'
  ];

  const afternoonActivities = [
    'Tìm Hiểu Quy Trình Nhà Máy Chế Biến Trà',
    'Lớp Học Pha Trà Sencha & Gyokuro',
    'Tắm Thuốc Thảo Dược Dao Đỏ Phục Hồi Sức Khỏe',
    'Nghiền Bột Matcha Bằng Cối Đá Truyền Thống',
    'Học Cách Làm Phân Bón Hữu Cơ Tại Nông Trại'
  ];

  const eveningActivities = [
    'Trải Nghiệm Trà Đạo & Trị Liệu Âm Thanh',
    'Giao Lưu Kể Chuyện Bên Bếp Lửa Đồi Chè',
    'Thưởng Thức Ẩm Thiết Tinh Hoa Kết Hợp Trà',
    'Khóa Học Phối Trộn Trà Thảo Mộc Chai',
    'Ngắm Sao Giữa Rừng Với Trà Thảo Mộc Ấm'
  ];

  const handleActivityChange = (dayNum: number, field: 'morning' | 'afternoon' | 'evening' | 'notes', val: string) => {
    setCurrentDays(prev =>
      prev.map(d => (d.dayNumber === dayNum ? { ...d, [field]: val } : d))
    );
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Intro */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Tạo Lịch Trình Chuyến Đi</span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary dark:text-cream mb-4">Lên Kế Hoạch</h1>
          <p className="text-sm font-light text-primary/70 dark:text-cream/70 max-w-xl">
            Thiết kế lịch trình du lịch độc đáo của riêng bạn theo từng ngày. Chọn các hoạt động xanh, ghi chú và lưu lại lịch trình.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: Itinerary Builder Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <form onSubmit={handleSaveTrip} className="glass p-8 rounded-3xl border border-primary/10 dark:border-cream/10 space-y-6">
              <h2 className="font-serif text-xl font-bold text-primary dark:text-cream flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent animate-pulse-slow" /> Trình Tạo Lịch Trình Tự Chọn
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-1.5">
                    Tiêu Đề Lịch Trình
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tuần lễ Trà trị liệu của tôi"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-1.5">
                    Điểm Đến
                  </label>
                  <select
                    value={tripLocation}
                    onChange={(e) => setTripLocation(e.target.value)}
                    className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold cursor-pointer"
                  >
                    <option value="Sapa, Vietnam">Sapa, Việt Nam</option>
                    <option value="Shizuoka, Japan">Shizuoka, Nhật Bản</option>
                    <option value="Munnar, India">Munnar, Ấn Độ</option>
                    <option value="Darjeeling, India">Darjeeling, Ấn Độ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-1.5">
                    Ngày Khởi Hành
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-1.5">
                    Thời Lượng (Ngày)
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold cursor-pointer"
                  >
                    <option value={2}>2 Ngày</option>
                    <option value={3}>3 Ngày</option>
                    <option value={4}>4 Ngày</option>
                    <option value={5}>5 Ngày</option>
                  </select>
                </div>
              </div>

              {/* Day Tab Selectors */}
              <div className="pt-4 border-t border-primary/5">
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {currentDays.map((d) => (
                    <button
                      key={d.dayNumber}
                      type="button"
                      onClick={() => setActiveTab(d.dayNumber)}
                      className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === d.dayNumber
                          ? 'bg-primary text-cream dark:bg-dark-surface dark:text-accent border border-accent/20'
                          : 'bg-cream/30 border border-primary/5 text-primary/60 dark:text-cream/60'
                      }`}
                    >
                      Ngày {d.dayNumber}
                    </button>
                  ))}
                </div>

                {/* Day Editor panel */}
                {currentDays.length > 0 && (
                  <div className="space-y-4 p-5 rounded-2xl bg-primary/5 dark:bg-cream/5 border border-primary/5">
                    <span className="text-[10px] tracking-wider uppercase text-accent font-bold">
                      Thiết lập lịch trình Ngày {activeTab}
                    </span>

                    {/* Morning */}
                    <div>
                      <label className="block text-xs font-semibold text-primary/80 dark:text-cream/80 mb-1">
                        Hoạt Động Buổi Sáng
                      </label>
                      <select
                        value={currentDays[activeTab - 1]?.morning || ''}
                        onChange={(e) => handleActivityChange(activeTab, 'morning', e.target.value)}
                        className="w-full bg-cream dark:bg-dark-surface border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream cursor-pointer"
                      >
                        {morningActivities.map(act => (
                          <option key={act} value={act}>{act}</option>
                        ))}
                      </select>
                    </div>

                    {/* Afternoon */}
                    <div>
                      <label className="block text-xs font-semibold text-primary/80 dark:text-cream/80 mb-1">
                        Trải Nghiệm Buổi Chiều
                      </label>
                      <select
                        value={currentDays[activeTab - 1]?.afternoon || ''}
                        onChange={(e) => handleActivityChange(activeTab, 'afternoon', e.target.value)}
                        className="w-full bg-cream dark:bg-dark-surface border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream cursor-pointer"
                      >
                        {afternoonActivities.map(act => (
                          <option key={act} value={act}>{act}</option>
                        ))}
                      </select>
                    </div>

                    {/* Evening */}
                    <div>
                      <label className="block text-xs font-semibold text-primary/80 dark:text-cream/80 mb-1">
                        Nghỉ Ngơi Buổi Tối
                      </label>
                      <select
                        value={currentDays[activeTab - 1]?.evening || ''}
                        onChange={(e) => handleActivityChange(activeTab, 'evening', e.target.value)}
                        className="w-full bg-cream dark:bg-dark-surface border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream cursor-pointer"
                      >
                        {eveningActivities.map(act => (
                          <option key={act} value={act}>{act}</option>
                        ))}
                      </select>
                    </div>

                    {/* Daily notes */}
                    <div>
                      <label className="block text-xs font-semibold text-primary/80 dark:text-cream/80 mb-1">
                        Ghi Chú / Nhắc Nhở Hàng Ngày
                      </label>
                      <textarea
                        rows={2}
                        value={currentDays[activeTab - 1]?.notes || ''}
                        onChange={(e) => handleActivityChange(activeTab, 'notes', e.target.value)}
                        placeholder="Ví dụ: Dậy sớm chuẩn bị máy ảnh, mang giày leo núi..."
                        className="w-full bg-cream dark:bg-dark-surface border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-primary dark:text-cream"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Save */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Lưu Kế Hoạch Lịch Trình</span>
              </button>

            </form>

          </div>

          {/* RIGHT COLUMN: List of Saved Custom Itineraries */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-3xl border border-primary/10 dark:border-cream/10 space-y-6">
              
              <div>
                <span className="text-[10px] tracking-wider uppercase text-primary/60 dark:text-cream/60 font-bold flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-accent animate-spin-slow" /> Cơ Sở Dữ Liệu Lưu Trữ
                </span>
                <h3 className="font-serif text-lg font-bold text-primary dark:text-cream">Lịch Trình Đã Lưu</h3>
              </div>

              {trips.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-5 rounded-2xl bg-primary/5 dark:bg-cream/5 border border-primary/5 hover:border-primary/10 transition-all space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-primary dark:text-cream leading-tight">
                            {trip.title}
                          </h4>
                          <span className="text-[10px] text-accent font-semibold flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {trip.location}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                          aria-label="Xóa lịch trình"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display days summary list */}
                      <div className="space-y-2 text-[10px] text-primary/80 dark:text-cream/80 border-t border-primary/5 pt-3">
                        <div className="flex items-center gap-1 font-semibold text-primary/50 dark:text-cream/50">
                          <Clock className="w-3 h-3" /> Khởi hành: {trip.startDate} ({trip.days.length} Ngày)
                        </div>
                        {trip.days.map((day) => (
                          <div key={day.dayNumber} className="pl-3.5 border-l border-accent flex flex-col gap-0.5">
                            <span className="font-bold text-accent">Điểm nổi bật Ngày {day.dayNumber}:</span>
                            <span className="truncate">Sáng: {day.morning}</span>
                            <span className="truncate">Chiều: {day.afternoon}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-primary/60 dark:text-cream/60">
                  <Leaf className="w-10 h-10 text-accent/30 mx-auto mb-4 animate-leaf-sway" />
                  <p className="text-xs font-semibold">Chưa Có Lịch Trình Nào Được Lưu</p>
                  <p className="text-[10px] leading-relaxed text-primary/50 dark:text-cream/50 mt-1">
                    Điền vào biểu mẫu lịch trình bên trái để lưu hành trình tùy chỉnh của bạn.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
