import React from 'react';
import { useApp } from '../../context/AppContext';
import { useDashboard } from '../../context/DashboardContext';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Star,
  Sparkles,
  Zap,
  Calendar
} from 'lucide-react';
import { AnalyticsCharts } from '../AnalyticsCharts';

export const OverviewTab: React.FC = () => {
  const { tours, bookings } = useApp();
  const { t, transactions, simulateRealTimeBooking, triggerAIRecommendation } = useDashboard();

  // Metrics calculations
  const confirmedBookings = bookings.filter(b => b.status === 'Đã xác nhận' || b.status === 'Confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const uniqueCustomers = new Set(bookings.map(b => b.userEmail)).size;
  const averageRating = (tours.reduce((sum, t) => sum + t.rating, 0) / tours.length).toFixed(2);

  // Suggested optimization
  const featuredTour = tours[0] || null;
  const aiSuggestion = featuredTour ? triggerAIRecommendation(featuredTour.id) : null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-primary to-dark-surface p-8 text-cream border border-primary/20 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,215,169,0.15),transparent_50%)]" />
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-accent/10 blur-[40px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Bảng điều khiển tối ưu hóa bằng AI
            </span>
            <h2 className="font-serif text-3xl font-bold mb-2">
              Camellia Trails Admin
            </h2>
            <p className="text-sm font-light text-cream/70 max-w-xl">
              Hệ thống quản lý hành trình du lịch xanh, nghỉ dưỡng sinh thái hữu cơ & phục hồi sức khỏe. Theo dõi hoạt động và báo cáo trong thời gian thực.
            </p>
          </div>
          
          <button
            onClick={simulateRealTimeBooking}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent text-primary font-bold text-xs shadow-lg hover:scale-105 active:scale-98 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{t('realTimePush')}</span>
          </button>
        </div>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Doanh thu */}
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(212, 175, 55, 0.08)' }}
          className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-[20px] group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">{t('revenue')}</span>
            <div className="p-2 rounded-xl bg-accent/20 text-accent">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-primary dark:text-cream leading-none">
              ${totalRevenue.toLocaleString()}
            </p>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> +14.2% so với tháng trước
            </span>
          </div>
        </motion.div>

        {/* Lượt đặt vé */}
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(167, 215, 169, 0.08)' }}
          className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-[20px] group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">{t('bookingCount')}</span>
            <div className="p-2 rounded-xl bg-secondary/20 text-secondary-600 dark:text-secondary">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-primary dark:text-cream leading-none">
              {bookings.length}
            </p>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> +8.5% đặt chỗ mới tuần này
            </span>
          </div>
        </motion.div>

        {/* Khách hàng */}
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(15, 61, 46, 0.08)' }}
          className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[20px] group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">{t('activeUsers')}</span>
            <div className="p-2 rounded-xl bg-primary/20 text-primary dark:text-cream">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-primary dark:text-cream leading-none">
              {uniqueCustomers * 12 + 45}
            </p>
            <span className="text-[9px] text-accent font-bold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> +32 người dùng hoạt động hôm nay
            </span>
          </div>
        </motion.div>

        {/* Đánh giá */}
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 12px 30px 0 rgba(212, 175, 55, 0.08)' }}
          className="glass-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-between relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-[20px] group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold">{t('reviews')}</span>
            <div className="p-2 rounded-xl bg-accent/20 text-accent">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-3xl font-bold text-primary dark:text-cream leading-none">
              {averageRating} <span className="text-xs font-sans text-primary/40 dark:text-cream/40">/ 5.0</span>
            </p>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> 98% đánh giá tích cực (AI Sentiment)
            </span>
          </div>
        </motion.div>

      </div>

      {/* Embedded Dynamic SVG Analytics Charts */}
      <AnalyticsCharts />

      {/* Bottom widgets: AI Gợi ý & Đơn hàng gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Recommendations (2 Cols) */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-primary/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-accent/5 rounded-full blur-[40px]" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-wider uppercase text-accent font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {t('recommendations')}
              </span>
              <span className="text-[9px] font-bold text-primary/50 dark:text-cream/50">Mô hình GPT-4o-Travel</span>
            </div>
            
            <h3 className="font-serif text-xl font-bold text-primary dark:text-cream mb-2">Khuyến nghị tối ưu hóa giá tour</h3>
            <p className="text-xs text-primary/75 dark:text-cream/75 mb-6 leading-relaxed">
              Dựa vào tỷ lệ chuyển đổi, lượng truy cập đồi chè và xếp hạng đánh giá, thuật toán AI gợi ý thay đổi biểu phí sau đây để gia tăng doanh số.
            </p>

            {featuredTour && aiSuggestion && (
              <div className="p-5 rounded-2xl bg-cream/40 dark:bg-dark-surface/40 border border-primary/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredTour.images[0]}
                      alt={featuredTour.title}
                      className="w-12 h-12 rounded-xl object-cover border border-primary/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-primary dark:text-cream">{featuredTour.title}</h4>
                      <span className="text-[9px] text-primary/55 dark:text-cream/55">{featuredTour.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] uppercase font-bold text-primary/50 dark:text-cream/50">Giá hiện tại</span>
                    <span className="font-serif text-xs line-through text-red-500">${featuredTour.price}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-primary/5">
                  <div className="flex items-start gap-2 max-w-md">
                    <Zap className="w-4 h-4 text-accent mt-0.5 flex-shrink-0 animate-pulse" />
                    <p className="text-[10px] text-primary/75 dark:text-cream/75 leading-tight">{aiSuggestion.reason}</p>
                  </div>
                  <div className="text-right bg-accent/15 px-3.5 py-1.5 rounded-xl border border-accent/20 flex-shrink-0">
                    <span className="block text-[7px] uppercase font-bold text-accent">AI Đề xuất</span>
                    <span className="font-serif text-sm font-bold text-accent">${aiSuggestion.price}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button className="px-4 py-2 rounded-xl border border-primary/10 hover:border-primary/20 text-xs font-bold text-primary dark:text-cream transition-all cursor-pointer">
              Bỏ qua
            </button>
            <button className="px-5 py-2 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer">
              Áp dụng tối ưu
            </button>
          </div>
        </div>

        {/* Live System Activity Notification list (1 Col) */}
        <div className="glass p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold block mb-4">
              Hoạt động thực tế (Sockets)
            </span>
            <h3 className="font-serif text-lg font-bold text-primary dark:text-cream mb-4">Nhật ký trực tiếp</h3>
            
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-cream/30 dark:bg-dark-surface/30 border border-primary/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <p className="font-bold text-primary dark:text-cream leading-tight">{tx.customer}</p>
                      <p className="text-[9px] text-primary/50 dark:text-cream/50 mt-0.5">Đặt chỗ thành công</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-accent">${tx.amount}</p>
                    <p className="text-[8px] text-primary/40 dark:text-cream/40 mt-0.5">{tx.method}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-primary/5 mt-4">
            <span className="text-[9px] text-primary/55 dark:text-cream/55 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Máy chủ WebSocket: đang trực tuyến (Độ trễ 12ms)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
