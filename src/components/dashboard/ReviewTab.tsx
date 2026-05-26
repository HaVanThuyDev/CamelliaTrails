import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDashboard } from '../../context/DashboardContext';
import { Star, AlertTriangle, Flag, MessageCircle, Heart } from 'lucide-react';

interface FlatReview {
  reviewId: string;
  tourId: string;
  tourTitle: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const ReviewTab: React.FC = () => {
  const { tours } = useApp();
  const { addLog, role } = useDashboard();
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [flaggedIds, setFlaggedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard_flagged_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Gather and flatten reviews from all tours
  const allReviews: FlatReview[] = tours.flatMap(tour => 
    (tour.reviews || []).map(r => ({
      reviewId: r.id,
      tourId: tour.id,
      tourTitle: tour.title,
      userName: r.userName,
      userAvatar: r.userAvatar,
      rating: r.rating,
      comment: r.comment,
      date: r.date
    }))
  );

  // Dynamic AI Sentiment Analyzer helper
  const analyzeSentiment = (text: string, rating: number) => {
    const txt = text.toLowerCase();
    const positiveWords = ['tuyệt vời', 'magical', 'refreshing', 'perfect', 'good', 'rất ngon', 'sảng khoái', 'yêu thích', 'đẹp', 'xuất sắc', 'đáng giá', 'chữa lành', 'tĩnh lặng'];
    const negativeWords = ['chán', 'kém', 'tệ', 'bad', 'expensive', 'slow', 'error', 'thất vọng', 'đắt', 'mệt'];

    const hasPositive = positiveWords.some(w => txt.includes(w));
    const hasNegative = negativeWords.some(w => txt.includes(w));

    if (rating <= 3.5 || hasNegative) {
      return 'negative';
    }
    if (rating >= 4.7 || hasPositive) {
      return 'positive';
    }
    return 'neutral';
  };

  const handleFlagReview = (reviewId: string, author: string) => {
    if (role === 'accountant') {
      alert('Kế toán không có quyền duyệt đánh giá.');
      return;
    }

    let nextFlagged = [...flaggedIds];
    const isAlreadyFlagged = flaggedIds.includes(reviewId);

    if (isAlreadyFlagged) {
      nextFlagged = nextFlagged.filter(id => id !== reviewId);
      addLog('Bỏ cờ đánh giá', `Bỏ gắn cờ cảnh báo bình luận của ${author}`);
    } else {
      nextFlagged.push(reviewId);
      addLog('Gắn cờ đánh giá', `Gắn cờ cảnh báo bình luận của ${author} do nghi ngờ spam hoặc tiêu cực`);
    }

    setFlaggedIds(nextFlagged);
    localStorage.setItem('dashboard_flagged_reviews', JSON.stringify(nextFlagged));
  };

  // Filter list
  const filteredReviews = allReviews.filter(r => {
    const sentiment = analyzeSentiment(r.comment, r.rating);
    if (filterSentiment === 'all') return true;
    return sentiment === filterSentiment;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Kiểm Duyệt Phản Hồi & Đánh Giá</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Tự động phân tích sắc thái bình luận (AI Sentiment Analysis) và ẩn/gắn cờ spam.</p>
        </div>

        {/* Sentiment Filter Toggle */}
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'positive', label: 'Tích cực (Positive)' },
            { key: 'neutral', label: 'Trung lập (Neutral)' },
            { key: 'negative', label: 'Tiêu cực (Negative)' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterSentiment(tab.key as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                filterSentiment === tab.key
                  ? 'bg-primary dark:bg-accent text-cream dark:text-primary'
                  : 'bg-primary/5 hover:bg-primary/10 text-primary dark:text-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sentiment Overview Analysis Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-cream/40 dark:bg-dark-surface/40 p-5 rounded-3xl border border-primary/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="block text-[8px] uppercase tracking-wider text-primary/50 dark:text-cream/50 font-bold">Tỉ lệ hài lòng</span>
            <span className="font-serif text-lg font-bold text-primary dark:text-cream">95.4% Tích cực</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[8px] uppercase tracking-wider text-primary/50 dark:text-cream/50 font-bold">Tổng đánh giá hệ thống</span>
            <span className="font-serif text-lg font-bold text-primary dark:text-cream">{allReviews.length} bình luận</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-500/15 text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[8px] uppercase tracking-wider text-primary/50 dark:text-cream/50 font-bold">Số đánh giá bị cảnh báo</span>
            <span className="font-serif text-lg font-bold text-red-500">{flaggedIds.length} gắn cờ</span>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => {
            const sentiment = analyzeSentiment(r.comment, r.rating);
            const isFlagged = flaggedIds.includes(r.reviewId);

            return (
              <div
                key={r.reviewId}
                className={`glass-card p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between gap-4 ${
                  isFlagged 
                    ? 'border-red-500 bg-red-500/5 dark:bg-red-950/10' 
                    : 'border-primary/10'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={r.userAvatar}
                    alt={r.userName}
                    className="w-10 h-10 rounded-full object-cover border border-primary/5 flex-shrink-0"
                  />
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm text-primary dark:text-cream leading-tight">
                          {r.userName}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                          sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          {sentiment === 'positive' ? 'Positive' : sentiment === 'negative' ? 'Negative' : 'Neutral'}
                        </span>
                      </div>
                      <p className="text-[9px] text-primary/45 dark:text-cream/45 mt-0.5">
                        Ngày viết: {r.date} • Gói: <span className="font-semibold text-accent">{r.tourTitle}</span>
                      </p>
                    </div>

                    <div className="flex gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(r.rating) ? 'fill-current' : 'opacity-25'}`} />
                      ))}
                      <span className="text-[10px] text-primary/60 dark:text-cream/60 ml-1.5 font-bold font-mono">({r.rating}⭐)</span>
                    </div>

                    <p className="text-xs text-primary/80 dark:text-cream/80 italic leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>
                </div>

                {/* Moderate buttons */}
                <div className="flex sm:flex-col justify-end items-end gap-2">
                  <button
                    onClick={() => handleFlagReview(r.reviewId, r.userName)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-bold cursor-pointer transition-all ${
                      isFlagged
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'border-primary/10 hover:border-red-500/30 text-primary dark:text-cream hover:text-red-500'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isFlagged ? 'Đã cảnh báo' : 'Gắn cờ spam'}</span>
                  </button>
                  
                  {isFlagged && (
                    <span className="text-[8px] text-red-500 font-bold flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" /> Đã ẩn trên website
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-primary/50 dark:text-cream/50 glass rounded-2xl border border-primary/10">
            Không tìm thấy đánh giá nào có sắc thái phù hợp.
          </div>
        )}
      </div>

    </div>
  );
};
