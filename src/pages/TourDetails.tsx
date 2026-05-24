import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MockPaymentModal } from '../components/MockPaymentModal';
import {
  Clock,
  Users,
  Compass,
  Star,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Heart,
  ChevronLeft,
  Share2
} from 'lucide-react';

const categoryTranslations: Record<string, string> = {
  'Wellness': 'Trị Liệu & Sức Khỏe',
  'Eco-Tourism': 'Du Lịch Sinh Thái',
  'Tea Ceremony': 'Trà Đạo',
  'Adventure': 'Phiêu Lưu & Trải Nghiệm',
};

const difficultyTranslations: Record<string, string> = {
  'Easy': 'Dễ Dàng',
  'Moderate': 'Vừa Phải',
  'Challenging': 'Thử Thách',
};

export const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tours, addBooking, wishlist, toggleWishlist } = useApp();

  const tour = tours.find((t) => t.id === id);

  // States
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!tour) {
    return (
      <div className="w-full min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-cream dark:bg-dark-bg text-center">
        <h2 className="font-serif text-3xl font-bold mb-4">Không Tìm Thấy Gói Tour</h2>
        <p className="text-sm font-light text-primary/60 dark:text-cream/60 mb-6">Gói nghỉ dưỡng thiên nhiên bạn yêu cầu không tồn tại.</p>
        <button
          onClick={() => navigate('/tours')}
          className="px-6 py-2.5 rounded-xl bg-primary text-cream font-bold text-xs"
        >
          Quay Lại Gói Tour
        </button>
      </div>
    );
  }

  // Initialize date selection if not set
  if (!selectedDate && tour.nextDates.length > 0) {
    setSelectedDate(tour.nextDates[0]);
  }

  const isWishlisted = wishlist.includes(tour.id);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (_bookingId: string) => {
    // Add the reservation to our global context
    addBooking({
      tourId: tour.id,
      tourTitle: tour.title,
      date: selectedDate,
      guests: guestsCount,
      totalPrice: tour.price * guestsCount
    });

    // Take the user to the profile page to view their new ticket voucher!
    setTimeout(() => {
      navigate('/profile');
    }, 500);
  };

  const toggleDayAccordion = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-500">
      
      {/* Dynamic Payment Modal overlay */}
      <MockPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        tourTitle={tour.title}
        tourPrice={tour.price}
        selectedDate={selectedDate}
        guestsCount={guestsCount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb / Top Actions */}
        <div className="flex items-center justify-between mb-8 text-xs font-semibold">
          <button
            onClick={() => navigate('/tours')}
            className="flex items-center gap-1.5 text-primary/60 dark:text-cream/60 hover:text-accent cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Quay Lại Trang Khám Phá
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => toggleWishlist(tour.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass border border-primary/10 dark:border-cream/10 text-primary dark:text-cream hover:text-accent hover:border-accent/30 transition-all cursor-pointer shadow-sm"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
              <span>{isWishlisted ? 'Đã Lưu' : 'Lưu'}</span>
            </button>
            <button
              onClick={() => alert('Đã sao chép liên kết vào bộ nhớ tạm!')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass border border-primary/10 dark:border-cream/10 text-primary dark:text-cream hover:text-accent transition-all cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" /> Chia sẻ
            </button>
          </div>
        </div>

        {/* Title Block Header */}
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Kỳ nghỉ {categoryTranslations[tour.category] || tour.category}</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary dark:text-cream leading-tight mb-3">
            {tour.title}
          </h1>
          <p className="text-xs md:text-sm font-light text-primary/70 dark:text-cream/70 italic max-w-3xl">
            {tour.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main big image preview */}
          <div className="lg:col-span-2 h-[450px] rounded-3xl overflow-hidden shadow-md border border-primary/5 relative">
            <img
              src={tour.images[activeImageIdx]}
              alt={tour.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>
          
          {/* Side columns: image selectors */}
          <div className="flex flex-row lg:flex-col gap-4 h-24 lg:h-[450px] overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto">
            {tour.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`flex-shrink-0 w-28 lg:w-full h-full lg:h-[138px] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx ? 'border-accent shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Core Content splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT 2 COLUMNS: Detail metrics */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* Tour Highlights Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#EBEBE0]/30 dark:bg-dark-surface/30 border border-primary/5">
              <div className="text-center md:border-r border-primary/10">
                <span className="block text-[10px] uppercase tracking-wider text-primary/50 dark:text-cream/50">Thời Lượng</span>
                <p className="font-serif text-lg font-bold text-primary dark:text-cream mt-0.5 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4 text-accent" /> {tour.duration} Ngày
                </p>
              </div>
              <div className="text-center md:border-r border-primary/10">
                <span className="block text-[10px] uppercase tracking-wider text-primary/50 dark:text-cream/50">Mức Độ</span>
                <p className="font-serif text-lg font-bold text-primary dark:text-cream mt-0.5 flex items-center justify-center gap-1">
                  <Compass className="w-4 h-4 text-accent" /> {difficultyTranslations[tour.difficulty] || tour.difficulty}
                </p>
              </div>
              <div className="text-center md:border-r border-primary/10">
                <span className="block text-[10px] uppercase tracking-wider text-primary/50 dark:text-cream/50">Số Lượng Khách</span>
                <p className="font-serif text-lg font-bold text-primary dark:text-cream mt-0.5 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-accent" /> Tối đa {tour.groupSize} Người
                </p>
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-wider text-primary/50 dark:text-cream/50">Đánh Giá</span>
                <p className="font-serif text-lg font-bold text-primary dark:text-cream mt-0.5 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" /> {tour.rating}
                </p>
              </div>
            </div>

            {/* Description Details */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4 text-primary dark:text-cream">Tổng Quan Chuyến Đi</h2>
              <p className="text-sm font-light text-primary/80 dark:text-cream/80 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Highlights bullet checklist */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 text-primary dark:text-cream">Điểm Nổi Bật Của Hành Trình</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-primary/80 dark:text-cream/80 font-medium leading-normal">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day Itinerary Calendar timelines */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 text-primary dark:text-cream">Lịch Trình Chi Tiết</h2>
              <div className="flex flex-col gap-4">
                {tour.itinerary.map((dayObj) => {
                  const isExpanded = expandedDay === dayObj.day;
                  return (
                    <div
                      key={dayObj.day}
                      className="rounded-2xl border border-primary/10 dark:border-cream/10 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleDayAccordion(dayObj.day)}
                        className="w-full px-6 py-4.5 bg-cream/40 dark:bg-dark-surface/40 flex items-center justify-between text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-cream text-xs font-bold font-serif dark:bg-accent dark:text-primary">
                            N{dayObj.day}
                          </span>
                          <span className="font-serif font-bold text-sm text-primary dark:text-cream">
                            {dayObj.title}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-primary/60 dark:text-cream/60" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-primary/60 dark:text-cream/60" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-5 bg-white/30 dark:bg-dark-surface/10 border-t border-primary/5 text-xs text-primary/80 dark:text-cream/80 space-y-3 font-light leading-relaxed">
                          <p>{dayObj.description}</p>
                          <div className="pt-3 border-t border-primary/5 flex items-center gap-2">
                            <span className="text-[9px] uppercase font-bold text-accent">Hoạt động chính:</span>
                            <span className="font-semibold text-primary dark:text-cream">{dayObj.activity}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guide Card Profile */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 text-primary dark:text-cream">Chuyên Gia Trà Của Bạn</h2>
              <div className="p-6 rounded-3xl border border-primary/10 dark:border-cream/10 glass flex flex-col md:flex-row gap-6 items-center">
                <img
                  src={tour.guide.avatar}
                  alt={tour.guide.name}
                  className="w-20 h-20 rounded-full object-cover border border-accent/20 shadow-sm flex-shrink-0"
                />
                <div className="text-center md:text-left">
                  <h3 className="font-serif font-bold text-base text-primary dark:text-cream">{tour.guide.name}</h3>
                  <p className="text-xs text-accent font-semibold mb-2">{tour.guide.role}</p>
                  <p className="text-xs text-primary/70 dark:text-cream/70 leading-relaxed font-light font-sans">
                    {tour.guide.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer reviews listing */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 text-primary dark:text-cream">Trải Nghiệm Của Lữ Khách</h2>
              <div className="flex flex-col gap-6">
                {tour.reviews.map((rev) => (
                  <div key={rev.id} className="pb-6 border-b border-primary/5 dark:border-cream/5 flex gap-4 items-start">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover border border-accent/10"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <h4 className="text-xs font-bold text-primary dark:text-cream">{rev.userName}</h4>
                          <span className="text-[9px] text-primary/45 dark:text-cream/45 font-medium">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5 text-accent">
                          {Array.from({ length: Math.floor(rev.rating) }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-primary/80 dark:text-cream/80 font-light leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Booking Sticky Action Panel */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-[32px] border border-primary/10 dark:border-cream/10 sticky top-28 shadow-xl">
              
              <div className="pb-4 border-b border-primary/5 dark:border-cream/5 mb-6">
                <span className="text-[10px] uppercase font-semibold text-primary/60 dark:text-cream/60">Gói Nghỉ Dưỡng</span>
                <p className="font-serif text-2xl font-bold text-primary dark:text-cream mt-0.5">
                  ${tour.price.toLocaleString()} <span className="text-xs font-light text-primary/50 dark:text-cream/50">/ người</span>
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                
                {/* Dates selection */}
                <div>
                  <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" /> Chọn Ngày Khởi Hành
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full bg-cream dark:bg-dark-surface border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold cursor-pointer"
                  >
                    {tour.nextDates.map((date) => (
                      <option key={date} value={date} className="dark:bg-dark-surface">
                        Khởi hành: {date}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guests counter */}
                <div>
                  <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-2">
                    Số Lượng Lữ Khách
                  </label>
                  <div className="flex items-center justify-between bg-cream dark:bg-dark-surface border border-primary/10 dark:border-cream/10 rounded-xl p-2.5">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-cream/5 flex items-center justify-center text-primary dark:text-cream font-bold hover:bg-primary/10 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-primary dark:text-cream">{guestsCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.min(tour.groupSize, guestsCount + 1))}
                      className="w-8 h-8 rounded-lg bg-primary/5 dark:bg-cream/5 flex items-center justify-center text-primary dark:text-cream font-bold hover:bg-primary/10 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="block text-[9px] text-primary/50 dark:text-cream/50 mt-1.5 font-medium">
                    Số lượng tối đa: {tour.groupSize} người
                  </span>
                </div>

                {/* Pricing Summary */}
                <div className="pt-4 border-t border-primary/5 dark:border-cream/5 space-y-2 text-xs font-semibold">
                  <div className="flex justify-between text-primary/70 dark:text-cream/70">
                    <span>Giá gốc (${tour.price} × {guestsCount})</span>
                    <span>${(tour.price * guestsCount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-primary/70 dark:text-cream/70">
                    <span>Phí sinh thái (5%)</span>
                    <span>${Math.round(tour.price * guestsCount * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-primary dark:text-cream pt-2 border-t border-primary/5">
                    <span>Tổng Chi Phí</span>
                    <span className="text-accent">${Math.round(tour.price * guestsCount * 1.05).toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit action */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Đặt Tour Ngay</span>
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
