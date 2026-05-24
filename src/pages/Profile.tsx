import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TourCard } from '../components/TourCard';
import { Mail, Calendar, Shield, Bookmark, Ticket, AlertTriangle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, bookings, tours, wishlist, cancelBooking } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'wishlist'>('bookings');

  if (!currentUser) {
    return (
      <div className="w-full min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-cream dark:bg-dark-bg text-center">
        <AlertTriangle className="w-12 h-12 text-accent mb-4 animate-bounce" />
        <h2 className="font-serif text-2xl font-bold mb-2">Quyền Truy Cập Bị Từ Chối</h2>
        <p className="text-sm font-light text-primary/60 dark:text-cream/60 mb-6">Vui lòng đăng nhập để xem thông tin lịch trình du lịch của bạn.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-primary text-cream font-bold text-xs shadow-md"
        >
          Đăng Nhập
        </button>
      </div>
    );
  }

  // Filter bookings and wishlist items belonging to the current user
  const userBookings = bookings.filter((b) => b.userEmail === currentUser.email);
  const wishlistedTours = tours.filter((t) => wishlist.includes(t.id));

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt lịch gói nghỉ dưỡng này không?')) {
      cancelBooking(bookingId);
    }
  };

  // Custom QR Code generator inside SVG for ticket aesthetic
  const renderMockQRCode = () => {
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 fill-primary dark:fill-accent">
        <rect x="0" y="0" width="20" height="20" />
        <rect x="5" y="5" width="10" height="10" fill="#F5F5EC" />
        <rect x="80" y="0" width="20" height="20" />
        <rect x="85" y="5" width="10" height="10" fill="#F5F5EC" />
        <rect x="0" y="80" width="20" height="20" />
        <rect x="5" y="85" width="10" height="10" fill="#F5F5EC" />
        {/* Randomized matrix points for mockup QR */}
        <rect x="30" y="10" width="10" height="10" />
        <rect x="50" y="0" width="10" height="20" />
        <rect x="25" y="40" width="20" height="10" />
        <rect x="60" y="50" width="10" height="30" />
        <rect x="80" y="60" width="20" height="10" />
        <rect x="30" y="70" width="20" height="20" />
        <rect x="50" y="85" width="30" height="10" />
      </svg>
    );
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Profile Card Summary Banner */}
        <div className="relative rounded-[32px] glass p-8 border border-primary/10 dark:border-cream/10 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-xl overflow-hidden">
          
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />
          
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="relative z-10 w-24 h-24 rounded-full object-cover border-2 border-accent shadow-md flex-shrink-0"
          />

          <div className="text-center md:text-left flex-grow relative z-10">
            <span className="text-[10px] tracking-wider uppercase text-accent font-bold bg-accent/15 px-2.5 py-1 rounded-full inline-block mb-2">
              {currentUser.role === 'admin' ? 'Đồng Sáng Lập & Nhân Viên' : 'Lữ Khách Xanh'}
            </span>
            <h1 className="font-serif text-3xl font-bold text-primary dark:text-cream leading-none">
              {currentUser.name}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-3 mt-4 text-xs font-semibold text-primary/70 dark:text-cream/70">
              <span className="flex items-center gap-1.5 justify-center md:justify-start">
                <Mail className="w-3.5 h-3.5 text-accent" /> {currentUser.email}
              </span>
              <span className="hidden sm:inline opacity-30">•</span>
              <span className="flex items-center gap-1.5 justify-center md:justify-start">
                <Calendar className="w-3.5 h-3.5 text-accent" /> Gia nhập 2026
              </span>
            </div>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => navigate('/dashboard')}
              className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs shadow-md hover:scale-105 active:scale-98 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Bảng Điều Khiển Admin</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-primary/10 dark:border-cream/10 mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'text-primary dark:text-cream'
                : 'text-primary/40 dark:text-cream/40 hover:text-primary/60 dark:hover:text-cream/60'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Đơn Đặt Chuyến Đi ({userBookings.length})</span>
            {activeTab === 'bookings' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'wishlist'
                ? 'text-primary dark:text-cream'
                : 'text-primary/40 dark:text-cream/40 hover:text-primary/60 dark:hover:text-cream/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Hành Trình Đã Lưu ({wishlistedTours.length})</span>
            {activeTab === 'wishlist' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Outputs */}
        {activeTab === 'bookings' ? (
          /* BOOKINGS LIST PANEL */
          userBookings.length > 0 ? (
            <div className="flex flex-col gap-8">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-3xl glass border border-primary/10 dark:border-cream/10 overflow-hidden shadow-lg flex flex-col md:flex-row"
                >
                  
                  {/* Left Side: Ticket Title */}
                  <div className="p-6 md:p-8 flex-grow space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-wider uppercase text-accent font-bold bg-accent/15 px-2.5 py-0.5 rounded-full">
                        {b.status === 'Confirmed' ? 'Vé Đang Hoạt Động' : 'Đã Hủy Đơn Đặt'}
                      </span>
                      <span className="text-xs text-primary/50 dark:text-cream/50 font-mono font-bold">Mã đơn: {b.id}</span>
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl font-bold text-primary dark:text-cream leading-tight">
                      {b.tourTitle}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2 border-t border-primary/5">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Ngày Khởi Hành</span>
                        <p className="text-primary dark:text-cream flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" /> {b.date}
                        </p>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Lữ khách</span>
                        <p className="text-primary dark:text-cream">
                          {b.guests} Người
                        </p>
                      </div>
                    </div>

                    {b.status === 'Confirmed' && (
                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-4.5 py-2.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-[10px] hover:bg-red-500/5 active:scale-95 transition-all cursor-pointer"
                        >
                          Hủy Đặt Lịch
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Price Boarding Pass slip */}
                  <div className="bg-[#EBEBE0]/40 dark:bg-dark-surface/40 p-6 md:p-8 flex flex-row md:flex-col items-center justify-between md:justify-center gap-6 border-t md:border-t-0 md:border-l border-primary/10 dark:border-cream/10 md:w-56 text-center">
                    
                    <div className="text-left md:text-center">
                      <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Đã Thanh Toán</span>
                      <p className="font-serif text-lg font-bold text-accent">${b.totalPrice.toLocaleString()}</p>
                      <span className="block text-[8px] tracking-wide text-primary/45 dark:text-cream/45 uppercase mt-0.5">Đã bao gồm thuế phí</span>
                    </div>

                    {/* Ticket QR Code */}
                    <div className="p-2 rounded-2xl bg-cream dark:bg-dark-surface border border-primary/5 flex items-center justify-center shadow-inner">
                      {renderMockQRCode()}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-cream/40 dark:bg-dark-surface/40 rounded-[32px] border border-primary/10 dark:border-cream/10">
              <Ticket className="w-10 h-10 text-accent/30 mx-auto mb-4 animate-pulse-slow" />
              <h3 className="font-serif text-lg font-bold mb-1 text-primary dark:text-cream">Chưa Có Chuyến Đi Nào</h3>
              <p className="text-xs font-light text-primary/60 dark:text-cream/60 max-w-sm mx-auto mb-6 leading-relaxed">
                Bạn chưa đặt lịch kỳ nghỉ dưỡng trà núi nào. Hãy khám phá danh mục của chúng tôi và chọn một hành trình xanh phù hợp.
              </p>
              <button
                onClick={() => navigate('/tours')}
                className="px-6 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs hover:scale-105 active:scale-98 transition-all cursor-pointer shadow-md"
              >
                Tìm Gói Nghỉ Dưỡng
              </button>
            </div>
          )
        ) : (
          /* WISHLIST PANEL */
          wishlistedTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-cream/40 dark:bg-dark-surface/40 rounded-[32px] border border-primary/10 dark:border-cream/10">
              <Bookmark className="w-10 h-10 text-accent/30 mx-auto mb-4" />
              <h3 className="font-serif text-lg font-bold mb-1 text-primary dark:text-cream">Danh Sách Lưu Trống</h3>
              <p className="text-xs font-light text-primary/60 dark:text-cream/60 max-w-sm mx-auto mb-6 leading-relaxed">
                Lưu lại những gói tour bạn yêu thích bằng cách nhấp vào biểu tượng trái tim trên các thẻ giới thiệu tour.
              </p>
              <button
                onClick={() => navigate('/tours')}
                className="px-6 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs hover:scale-105 active:scale-98 transition-all cursor-pointer shadow-md"
              >
                Khám Phá Trải Nghiệm
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
};
