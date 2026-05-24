import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import {
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  PlusCircle,
  ShieldCheck,
  Calendar,
  User,
  Trash2,
  AlertCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, bookings, tours, addTour, cancelBooking } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reservations' | 'new-tour'>('reservations');

  // New tour form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [country, setCountry] = useState('Vietnam');
  const [duration, setDuration] = useState(5);
  const [price, setPrice] = useState(1500);
  const [category, setCategory] = useState<'Wellness' | 'Eco-Tourism' | 'Tea Ceremony' | 'Adventure'>('Eco-Tourism');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging'>('Moderate');
  const [groupSize, setGroupSize] = useState(8);
  const [description, setDescription] = useState('');
  const [tourImage, setTourImage] = useState('https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80');

  // Verify Admin Access
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="w-full min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-cream dark:bg-dark-bg text-center">
        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mb-4 animate-pulse" />
        <h2 className="font-serif text-2xl font-bold mb-2">Bảng Điều Khiển Chưa Được Cấp Quyền</h2>
        <p className="text-sm font-light text-primary/60 dark:text-cream/60 mb-6 max-w-sm">
          Trang này chỉ dành cho quản trị viên. Vui lòng đăng nhập bằng tài khoản quản trị để mở khóa số liệu thống kê.
        </p>
        <button
          onClick={() => {
            navigate('/login');
          }}
          className="px-6 py-2.5 rounded-xl bg-primary text-cream font-bold text-xs shadow-md"
        >
          Đi tới Trang Đăng Nhập
        </button>
      </div>
    );
  }

  // Calculate metrics
  const activeBookings = bookings.filter(b => b.status === 'Confirmed');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !description.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    addTour({
      title,
      subtitle,
      description,
      location: locationName,
      country,
      duration,
      price,
      category,
      images: [tourImage],
      difficulty,
      groupSize,
      nextDates: ['2026-06-25', '2026-07-12', '2026-08-30'],
      highlights: ['Trải nghiệm canh tác trà hữu cơ bản địa thực sự', 'Các buổi thưởng trà riêng với nghệ nhân trà trong vùng'],
      itinerary: [
        { day: 1, title: 'Đón Khách & Thưởng Trà Chào Mừng', description: 'Đến khu lưu trú, trải nghiệm chào đón bằng trà thảo mộc ấm áp.', activity: 'Nghi thức thảo mộc chào mừng' },
        { day: 2, title: 'Đi bộ tham quan cánh đồng hữu cơ', description: 'Đi bộ qua thung lũng chè, gặp gỡ nông dân.', activity: 'Khám phá nông trại' }
      ],
      guide: {
        name: 'Giang Thị Mảy',
        role: 'Chuyên gia Trà Bản Địa',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        bio: 'Hướng dẫn viên trà địa phương chuyên về các phương pháp trị liệu bằng thảo mộc hữu cơ.'
      }
    });

    alert('Gói nghỉ dưỡng du lịch mới đã được xuất bản thành công!');
    setActiveTab('reservations');
    // Reset Form
    setTitle('');
    setSubtitle('');
    setLocationName('');
    setDescription('');
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Hủy đặt đơn du khách này? Điều này sẽ thay đổi số liệu doanh thu ngay lập tức.')) {
      cancelBooking(bookingId);
    }
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Bảng Quản Trị Hệ Thống</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary dark:text-cream">Trang Quản Trị</h1>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/20 text-accent font-semibold text-xs border border-accent/10">
            <ShieldCheck className="w-4 h-4" /> đang hoạt động ở chế độ admin
          </span>
        </div>

        {/* METRICS CARD GRIDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">Doanh Số Bán Hàng</span>
            <p className="font-serif text-2xl font-bold text-primary dark:text-cream mt-2 flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-accent" /> {totalRevenue.toLocaleString()}
            </p>
            <span className="text-[9px] text-accent font-semibold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> +14.2% so với tháng trước
            </span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">Vé Đã Xác Nhận</span>
            <p className="font-serif text-2xl font-bold text-primary dark:text-cream mt-2">{activeBookings.length}</p>
            <span className="text-[9px] text-primary/45 dark:text-cream/45 mt-2 font-medium">Đã kiểm toán đơn đặt</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">Số Gói Tour Sẵn Có</span>
            <p className="font-serif text-2xl font-bold text-primary dark:text-cream mt-2">{tours.length}</p>
            <span className="text-[9px] text-primary/45 dark:text-cream/45 mt-2 font-medium">4 điểm đến hoạt động</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">Thành Viên Lữ Khách</span>
            <p className="font-serif text-2xl font-bold text-primary dark:text-cream mt-2">153</p>
            <span className="text-[9px] text-accent font-semibold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> +28 lượt đăng ký tuần này
            </span>
          </div>

        </div>

        {/* CUSTOM SVG CHARTS WRAPPER */}
        <div className="mb-16">
          <AnalyticsCharts />
        </div>

        {/* TAB CHOICES */}
        <div className="flex gap-4 border-b border-primary/10 dark:border-cream/10 mb-8">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'reservations'
                ? 'text-primary dark:text-cream'
                : 'text-primary/40 dark:text-cream/40'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Quản Lý Đơn Đặt ({bookings.length})</span>
            {activeTab === 'reservations' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('new-tour')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'new-tour'
                ? 'text-primary dark:text-cream'
                : 'text-primary/40 dark:text-cream/40'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng Gói Tour Mới</span>
            {activeTab === 'new-tour' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full" />
            )}
          </button>
        </div>

        {/* TAB PANELS OUTPUT */}
        {activeTab === 'reservations' ? (
          /* MANAGING BOOKINGS TABLE */
          <div className="glass rounded-3xl overflow-hidden border border-primary/10 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-primary dark:text-cream border-collapse">
                <thead className="bg-[#EBEBE0]/60 dark:bg-dark-surface/60 text-primary/60 dark:text-cream/60 uppercase border-b border-primary/10">
                  <tr>
                    <th className="p-4 md:p-6">Lữ khách</th>
                    <th className="p-4 md:p-6">Gói Nghỉ Dưỡng Đã Chọn</th>
                    <th className="p-4 md:p-6">Ngày khởi hành</th>
                    <th className="p-4 md:p-6">Số khách</th>
                    <th className="p-4 md:p-6">Đã thanh toán</th>
                    <th className="p-4 md:p-6 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 dark:divide-cream/5">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-primary/5 dark:hover:bg-cream/5 transition-colors">
                      <td className="p-4 md:p-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-sm text-primary dark:text-cream leading-tight">{b.userName}</p>
                          <p className="text-[10px] text-primary/50 dark:text-cream/50 mt-0.5">{b.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-4 md:p-6 max-w-[200px] truncate">{b.tourTitle}</td>
                      <td className="p-4 md:p-6">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" /> {b.date}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 text-center">{b.guests}</td>
                      <td className="p-4 md:p-6 font-serif font-bold text-accent">${b.totalPrice.toLocaleString()}</td>
                      <td className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                            b.status === 'Confirmed' || b.status === 'Đã xác nhận'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                              : 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                          }`}>
                            {b.status === 'Confirmed' ? 'Đã xác nhận' : b.status === 'Cancelled' ? 'Đã hủy' : b.status}
                          </span>
                          {(b.status === 'Confirmed' || b.status === 'Đã xác nhận') && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer"
                              title="Hủy đơn đặt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* NEW TOUR FORM CREATOR */
          <form onSubmit={handleCreateTour} className="glass p-8 rounded-3xl border border-primary/10 shadow-lg space-y-6">
            <h3 className="font-serif text-xl font-bold text-primary dark:text-cream">Tạo Gói Nghỉ Dưỡng Mới</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Tên Gói Nghỉ Dưỡng</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sapa Shan Tuyết & Thảo Dược Trị Liệu"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Tiêu Đề Phụ / Slogan</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cây chè trăm tuổi, leo núi ngắm cảnh, bồn tắm gỗ"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Địa điểm</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tả Van, Sa Pa"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Quốc gia</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Việt Nam"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Danh Mục Kỳ Nghỉ</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold cursor-pointer"
                >
                  <option value="Eco-Tourism">Du Lịch Sinh Thái</option>
                  <option value="Wellness">Trị Liệu & Sức Khỏe</option>
                  <option value="Tea Ceremony">Trà Đạo</option>
                  <option value="Adventure">Phiêu Lưu & Trải Nghiệm</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Giá cả (USD)</label>
                <input
                  type="number"
                  min="100"
                  max="9000"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Thời lượng (Ngày)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Mức Độ Leo Núi</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold cursor-pointer"
                >
                  <option value="Easy">Dễ Dàng</option>
                  <option value="Moderate">Vừa Phải</option>
                  <option value="Challenging">Thử Thách</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Số khách tối đa</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  required
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Đường dẫn hình ảnh bìa</label>
              <input
                type="text"
                required
                value={tourImage}
                onChange={(e) => setTourImage(e.target.value)}
                className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Mô tả tổng quan</label>
              <textarea
                rows={5}
                required
                placeholder="Mô tả chi tiết trải nghiệm, môi trường xung quanh và các yếu tố liên quan đến trà hữu cơ..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-sm shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Xuất Bản Gói Nghỉ Dưỡng</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
