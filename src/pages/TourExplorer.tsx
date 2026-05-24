import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TourCard } from '../components/TourCard';
import { Search, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

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

export const TourExplorer: React.FC = () => {
  const { tours } = useApp();
  const location = useLocation();

  // Search/Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  // Read URL search params initially if available (e.g. from hero search redirect)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryLoc = params.get('location');
    const queryCat = params.get('category');
    
    if (queryLoc) setSearchTerm(queryLoc);
    if (queryCat) setSelectedCategory(queryCat);
  }, [location.search]);

  // Clean filter resetting
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange(3000);
    setSelectedDifficulty('');
  };

  // Run the filtering logic
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? tour.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? tour.difficulty === selectedDifficulty : true;
    const matchesPrice = tour.price <= priceRange;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
  });

  const categories = ['Wellness', 'Eco-Tourism', 'Tea Ceremony', 'Adventure'];
  const difficulties = ['Easy', 'Moderate', 'Challenging'];

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Title & Intro */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Khám Phá Các Đồi Chè</span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary dark:text-cream mb-4">Kỳ Nghỉ Thiên Nhiên</h1>
          <p className="text-sm font-light text-primary/70 dark:text-cream/70 max-w-xl">
            Lựa chọn kỳ nghỉ dưỡng phục hồi sức khỏe lấy cảm hứng từ trà. Lọc các gói tour theo giá cả, chủ đề hoặc mức độ thử thách leo núi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR: Filters panel */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="glass p-6 rounded-3xl border border-primary/10">
              
              <div className="flex items-center justify-between mb-6">
                <span className="font-serif font-bold text-lg text-primary dark:text-cream flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" /> Bộ Lọc
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-primary/60 dark:text-cream/60 hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Đặt Lại
                </button>
              </div>

              {/* Text Search filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary/80 dark:text-cream/80 uppercase tracking-wide mb-2">
                  Tìm Theo Từ Khóa
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Tìm địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                  />
                  <Search className="absolute left-3.5 w-4 h-4 text-primary/40 dark:text-cream/40" />
                </div>
              </div>

              {/* Category selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary/80 dark:text-cream/80 uppercase tracking-wide mb-2">
                  Chủ Đề Kỳ Nghỉ
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between border cursor-pointer ${
                      selectedCategory === ''
                        ? 'bg-primary border-primary text-cream dark:bg-dark-surface dark:border-accent'
                        : 'bg-transparent border-primary/10 hover:border-primary/25 dark:border-cream/10 dark:hover:border-cream/25 text-primary dark:text-cream'
                    }`}
                  >
                    <span>Tất Cả Trải Nghiệm</span>
                    {selectedCategory === '' && <Check className="w-3.5 h-3.5 text-accent" />}
                  </button>
                  
                  {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between border cursor-pointer ${
                          active
                            ? 'bg-primary border-primary text-cream dark:bg-dark-surface dark:border-accent'
                            : 'bg-transparent border-primary/10 hover:border-primary/25 dark:border-cream/10 dark:hover:border-cream/25 text-primary dark:text-cream'
                        }`}
                      >
                        <span>{categoryTranslations[cat] || cat}</span>
                        {active && <Check className="w-3.5 h-3.5 text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-primary/80 dark:text-cream/80 uppercase tracking-wide">
                    Ngân Sách Tối Đa
                  </label>
                  <span className="text-xs font-bold text-accent">${priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-primary/10 dark:bg-cream/15 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-primary/45 dark:text-cream/45 mt-1 font-semibold">
                  <span>$500</span>
                  <span>$3.000</span>
                </div>
              </div>

              {/* Difficulty selector */}
              <div>
                <label className="block text-xs font-bold text-primary/80 dark:text-cream/80 uppercase tracking-wide mb-2">
                  Mức Độ Leo Núi
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedDifficulty('')}
                    className={`px-4 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between border cursor-pointer ${
                      selectedDifficulty === ''
                        ? 'bg-primary border-primary text-cream dark:bg-dark-surface dark:border-accent'
                        : 'bg-transparent border-primary/10 hover:border-primary/25 dark:border-cream/10 dark:hover:border-cream/25 text-primary dark:text-cream'
                    }`}
                  >
                    <span>Tất Cả Cấp Độ</span>
                    {selectedDifficulty === '' && <Check className="w-3.5 h-3.5 text-accent" />}
                  </button>
                  {difficulties.map((diff) => {
                    const active = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-4 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between border cursor-pointer ${
                          active
                            ? 'bg-primary border-primary text-cream dark:bg-dark-surface dark:border-accent'
                            : 'bg-transparent border-primary/10 hover:border-primary/25 dark:border-cream/10 dark:hover:border-cream/25 text-primary dark:text-cream'
                        }`}
                      >
                        <span>{difficultyTranslations[diff] || diff}</span>
                        {active && <Check className="w-3.5 h-3.5 text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT GRID: Tours output list */}
          <div className="lg:col-span-3">
            
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-cream/40 dark:bg-dark-surface/40 rounded-3xl border border-primary/10 dark:border-cream/10">
                <div className="w-16 h-16 rounded-full bg-primary/5 dark:bg-cream/5 flex items-center justify-center text-primary/60 dark:text-cream/60 mb-6">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-primary dark:text-cream">Không Tìm Thấy Kỳ Nghỉ Phù Hợp</h3>
                <p className="text-sm font-light text-primary/60 dark:text-cream/60 max-w-sm mb-6 leading-relaxed">
                  Hãy thử thay đổi điều kiện tìm kiếm hoặc đặt lại bộ lọc để khám phá toàn bộ trải nghiệm thiên nhiên tuyệt vời của chúng tôi.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs hover:scale-105 active:scale-98 transition-all cursor-pointer shadow-md"
                >
                  Đặt Lại Bộ Lọc Tìm Kiếm
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
