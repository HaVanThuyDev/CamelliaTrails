import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDashboard } from '../../context/DashboardContext';
import { Trash2, Plus, Calendar, Compass, DollarSign, Users, Tag, Sparkles, X } from 'lucide-react';

export const TourTab: React.FC = () => {
  const { tours, addTour, deleteTour } = useApp();
  const { addLog, role } = useDashboard();
  
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // New tour form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [country, setCountry] = useState('Vietnam');
  const [duration, setDuration] = useState(3);
  const [price, setPrice] = useState(500);
  const [category, setCategory] = useState<'Wellness' | 'Eco-Tourism' | 'Tea Ceremony' | 'Adventure'>('Eco-Tourism');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging'>('Moderate');
  const [groupSize, setGroupSize] = useState(10);
  const [description, setDescription] = useState('');
  const [tourImage, setTourImage] = useState('https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80');
  const [tagsInput, setTagsInput] = useState('eco, organic, tea');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !description.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const highlights = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

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
      nextDates: ['2026-07-15', '2026-08-20'],
      highlights: highlights.length > 0 ? highlights : ['Chè cổ thụ hữu cơ', 'Trị liệu thiên nhiên'],
      itinerary: [
        { day: 1, title: 'Đón khách & Nghi lễ trà', description: 'Đón khách về khu nghỉ dưỡng sinh thái, chào đón bằng trà thảo mộc.', activity: 'Giao lưu chào mừng' },
        { day: 2, title: 'Hái trà & Thiền hành', description: 'Đi bộ đồi chè lúc bình minh, học hái chè cùng nông dân.', activity: 'Lớp học thu hoạch chè' }
      ],
      guide: {
        name: 'Giang Thị Mảy',
        role: 'Chuyên gia Trà Bản Địa',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        bio: 'Chuyên gia hướng dẫn trà địa phương.'
      }
    });

    addLog('Tạo gói tour mới', `Tạo tour "${title}" với giá $${price} và thời lượng ${duration} ngày`);
    alert('Gói nghỉ dưỡng du lịch mới đã được xuất bản thành công!');
    
    // Reset States
    setTitle('');
    setSubtitle('');
    setLocationName('');
    setDescription('');
    setIsAddFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (role !== 'admin') {
      alert('Chỉ quản trị viên (Admin) mới có quyền xóa gói tour.');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa gói tour "${name}"? Thao tác này không thể hoàn tác.`)) {
      deleteTour(id);
      addLog('Xóa gói tour', `Xóa tour "${name}" (ID: ${id})`);
    }
  };

  const filteredTours = filterCategory === 'all' 
    ? tours 
    : tours.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Header Buttons and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Quản Lý Gói Tour Nghỉ Dưỡng</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Tạo, cập nhật giá và kiểm duyệt các tour du lịch sinh thái trà.</p>
        </div>
        
        {role === 'admin' && (
          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer"
          >
            {isAddFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddFormOpen ? 'Hủy' : 'Đăng Gói Tour Mới'}</span>
          </button>
        )}
      </div>

      {/* Slide-over Form for Creating Tour */}
      {isAddFormOpen && (
        <form onSubmit={handleCreate} className="glass p-6 rounded-3xl border border-primary/10 shadow-lg space-y-6 animate-fade-in-up">
          <h3 className="font-serif text-lg font-bold text-primary dark:text-cream border-b border-primary/5 pb-2">Tạo Gói Nghỉ Dưỡng Mới</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Tên Gói Nghỉ Dưỡng *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Munnar Yoga & Đồi chè organic"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Tiêu Đề Phụ / Slogan *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nghỉ dưỡng cabin sinh thái & Trị liệu Ayurveda"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Địa điểm *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Munnar, Kerala"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Quốc gia</label>
              <input
                type="text"
                placeholder="Ví dụ: Ấn Độ"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Danh Mục Kỳ Nghỉ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-bold cursor-pointer"
              >
                <option value="Eco-Tourism">Du Lịch Sinh Thái</option>
                <option value="Wellness">Trị Liệu & Sức Khỏe</option>
                <option value="Tea Ceremony">Trà Đạo</option>
                <option value="Adventure">Phiêu Lưu & Trải Nghiệm</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Giá cả (USD) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Thời lượng (Ngày)</label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Mức độ hoạt động</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream cursor-pointer"
              >
                <option value="Easy">Dễ dàng (Easy)</option>
                <option value="Moderate">Vừa phải (Moderate)</option>
                <option value="Challenging">Thử thách (Challenging)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Số khách tối đa</label>
              <input
                type="number"
                required
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Cover Image URL</label>
              <input
                type="text"
                value={tourImage}
                onChange={(e) => setTourImage(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Nhãn nổi bật (phân tách bằng dấu phẩy)</label>
              <input
                type="text"
                placeholder="Ví dụ: eco, yoga, organic tea, organic food"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Mô tả chi tiết trải nghiệm *</label>
            <textarea
              rows={4}
              required
              placeholder="Nhập lịch trình tổng quát, văn hóa bản địa, và điểm đặc sắc liên quan đến chè đồi núi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>XUẤT BẢN KỲ NGHỈ</span>
          </button>
        </form>
      )}

      {/* Category filters tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-primary/5">
        {[
          { key: 'all', label: 'Tất cả gói' },
          { key: 'Eco-Tourism', label: 'Du Lịch Sinh Thái' },
          { key: 'Wellness', label: 'Trị Liệu & Sức Khỏe' },
          { key: 'Tea Ceremony', label: 'Trà Đạo' },
          { key: 'Adventure', label: 'Phiêu Lưu' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === cat.key
                ? 'bg-primary dark:bg-accent text-cream dark:text-primary'
                : 'bg-primary/5 hover:bg-primary/10 text-primary dark:text-cream'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tours grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTours.map(tour => (
          <div
            key={tour.id}
            className="glass-card rounded-2xl overflow-hidden border border-primary/10 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48 w-full">
              <img
                src={tour.images[0]}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                {tour.category}
              </span>
              {role === 'admin' && (
                <button
                  onClick={() => handleDelete(tour.id, tour.title)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white transition-all cursor-pointer shadow-md"
                  title="Xóa tour"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary dark:text-cream leading-tight mb-1">{tour.title}</h3>
                <p className="text-[10px] text-primary/55 dark:text-cream/55 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> {tour.location}, {tour.country}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-primary/5 text-center text-[10px] font-semibold text-primary/75 dark:text-cream/75">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Thời gian</span>
                  <span className="flex items-center justify-center gap-0.5"><Calendar className="w-3 h-3 text-accent" /> {tour.duration} Ngày</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Chi phí</span>
                  <span className="flex items-center justify-center gap-0.5 text-accent"><DollarSign className="w-3 h-3 text-accent" /> ${tour.price}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Đoàn tối đa</span>
                  <span className="flex items-center justify-center gap-0.5"><Users className="w-3 h-3 text-accent" /> {tour.groupSize} Khách</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tour.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[8px] font-bold"
                  >
                    <Tag className="w-2.5 h-2.5" /> {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
