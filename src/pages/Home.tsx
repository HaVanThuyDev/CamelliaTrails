import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TourCard } from '../components/TourCard';
import { teaJourneySteps } from '../data/mockData';
import { Search, MapPin, Compass, ArrowRight, Quote, Sparkles, Star } from 'lucide-react';
import { WorldMapSVG } from '../components/WorldMapSVG';

export const Home: React.FC = () => {
  const { tours, theme } = useApp();
  const navigate = useNavigate();

  // Search parameters state
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  // Storytelling Active Step state
  const [activeStep, setActiveStep] = useState('step-1');

  // Interactive Map Tooltip State
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Background Switzerland slideshow state
  const [currentBgIdx, setCurrentBgIdx] = useState(0);
  const bgImages = [
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIdx((prev) => (prev + 1) % bgImages.length);
    }, 6000); // changes image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const featuredTours = tours.filter((t) => t.featured);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tours?location=${searchLocation}&category=${searchCategory}`);
  };

  // Coordinates for the interactive map pins (Calculated for detailed Robinson SVG map projection)
  const pins = [
    { id: 'sapa', name: 'Sapa, Vietnam', x: '77.3%', y: '45.5%', price: '$1,250', tourId: 'sapa-emerald-terraces' },
    { id: 'shizuoka', name: 'Shizuoka, Japan', x: '87.1%', y: '36.8%', price: '$2,450', tourId: 'shizuoka-zen-sanctuary' },
    { id: 'munnar', name: 'Munnar, India', x: '70.5%', y: '62.5%', price: '$1,420', tourId: 'munnar-misty-valleys' },
    { id: 'darjeeling', name: 'Darjeeling, India', x: '73.2%', y: '51.8%', price: '$1,850', tourId: 'darjeeling-himalayan-rails' }
  ];

  // Helper to generate animated leaves in the hero section
  const renderFloatingLeaves = () => {
    // Generate 12 leaves with randomized positions and animation properties
    return Array.from({ length: 12 }).map((_, idx) => {
      const left = `${Math.random() * 90 + 5}%`;
      const delay = `${Math.random() * 8}s`;
      const size = `${Math.random() * 20 + 15}px`;
      const duration = `${Math.random() * 6 + 9}s`; // 9s to 15s

      return (
        <div
          key={idx}
          className="absolute top-0 pointer-events-none z-10 animate-drift-leaf opacity-0"
          style={{
            left,
            animationDelay: delay,
            animationDuration: duration,
            width: size,
            height: size
          }}
        >
          <svg viewBox="0 0 24 36" className="w-full h-full fill-[#A7D7A9]/40 text-[#0F3D2E]">
            <path d="M12 0 C20 12, 24 24, 12 36 C0 24, 4 12, 12 0 Z" />
          </svg>
        </div>
      );
    });
  };

  return (
    <div className="w-full">
      
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden transition-colors duration-500">
        
        {/* Background Ken Burns Slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBgIdx}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: theme === 'dark' ? 0.4 : 0.75, scale: 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.0, ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${bgImages[currentBgIdx]})`,
              }}
            />
          </AnimatePresence>
          {/* Subtle overlay to ensure text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5EC]/35 to-[#EBEBE0]/50 dark:from-[#071913]/65 dark:to-[#0A241C]/80 pointer-events-none transition-colors duration-500" />
        </div>

        {/* Animated Leaf drift layers */}
        {renderFloatingLeaves()}

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-secondary/5 blur-[120px] dark:bg-[#A7D7A9]/5 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-20 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass border border-primary/10 dark:border-cream/10 text-xs font-semibold text-primary/80 dark:text-cream/90 shadow-sm uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-spin-slow" /> Du Lịch Chậm Bền Vững
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-primary dark:text-cream leading-[1.08] tracking-tight max-w-5xl mb-6"
          >
            Hành Trình Du Lịch Xanh Giao Hòa <span className="text-gold-gradient">Văn Hóa Trà</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl font-light text-primary/80 dark:text-cream/80 max-w-2xl mb-12 leading-relaxed"
          >
            Sống chậm lại, hít thở làn sương mai hữu cơ, tự tay hái những lá trà hoang dã. Khám phá các kỳ nghỉ dưỡng sinh thái cao cấp giúp chữa lành thân - tâm - trí.
          </motion.p>

          {/* Quick-Search Filter Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-4xl p-4 rounded-[32px] glass shadow-xl border border-primary/10 dark:border-cream/10"
          >
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
              
              {/* Location Input */}
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-cream/50 dark:bg-dark-surface/50 border border-primary/5">
                <MapPin className="text-accent w-5 h-5 flex-shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[9px] uppercase tracking-wider text-primary/50 dark:text-cream/50 font-bold">Điểm đến?</label>
                  <input
                    type="text"
                    placeholder="Sapa, Shizuoka, Munnar..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent border-none text-sm text-primary dark:text-cream focus:outline-none placeholder-primary/30 dark:placeholder-cream/30 font-semibold"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-cream/50 dark:bg-dark-surface/50 border border-primary/5">
                <Compass className="text-accent w-5 h-5 flex-shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[9px] uppercase tracking-wider text-primary/50 dark:text-cream/50 font-bold">Chủ Đề Trải Nghiệm</label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full bg-transparent border-none text-sm text-primary dark:text-cream focus:outline-none font-semibold cursor-pointer"
                  >
                    <option value="" className="dark:bg-dark-surface">Tất Cả Trải Nghiệm</option>
                    <option value="Wellness" className="dark:bg-dark-surface">Trị Liệu & Sức Khỏe</option>
                    <option value="Eco-Tourism" className="dark:bg-dark-surface">Du Lịch Sinh Thái</option>
                    <option value="Tea Ceremony" className="dark:bg-dark-surface">Trà Đạo</option>
                    <option value="Adventure" className="dark:bg-dark-surface">Leo Núi Sinh Thái</option>
                  </select>
                </div>
              </div>

              {/* Submit Search button */}
              <button
                type="submit"
                className="w-full md:w-auto h-full flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-sm hover:scale-105 active:scale-98 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Tìm Kỳ Nghỉ</span>
              </button>

            </form>
          </motion.div>

        </div>

        {/* Hero Bottom Organic Wave vector divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 fill-cream dark:fill-dark-bg transition-colors duration-500">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,88.43,26.54,166.49,47,249.07,70.18,321.39,56.44Z" />
          </svg>
        </div>

      </section>

      {/* ====================================
          FEATURED TOURS SECTION (Card Grids)
          ==================================== */}
      <section className="py-24 bg-cream dark:bg-dark-bg transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Hành Trình Chọn Lọc</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary dark:text-cream">Kỳ Nghỉ Nổi Bật</h2>
            </div>
            <Link
              to="/tours"
              className="flex items-center gap-2 text-sm font-semibold hover:text-accent group transition-colors"
            >
              <span>Xem toàn bộ các gói tour</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

        </div>
      </section>

      {/* ====================================
          TEA JOURNEY STORYTELLING SECTION (Interactive timeline)
          ==================================== */}
      <section className="py-24 bg-[#EBEBE0]/50 dark:bg-dark-surface/50 border-y border-primary/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Câu Chuyện Từ Lá Trà</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary dark:text-cream mb-4">Trải Nghiệm Hành Trình Trà</h2>
            <p className="text-sm font-light text-primary/70 dark:text-cream/70">
              Mỗi kỳ nghỉ đều được liên kết chặt chẽ với nông nghiệp bản địa. Trải nghiệm hành trình của những búp chè từ lúc thu hái sương sớm đến khi hòa vào tách trà thiền phục hồi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Big Image display with smooth layout change */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[450px] border border-primary/10">
              {teaJourneySteps.map((step) => (
                <div
                  key={step.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    activeStep === step.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="font-serif text-5xl font-bold opacity-30 block mb-1">{step.step}</span>
                    <p className="text-xs uppercase tracking-widest text-accent font-semibold">{step.tagline}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Clickable Timeline steps list */}
            <div className="flex flex-col gap-4">
              {teaJourneySteps.map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary border-primary text-cream shadow-lg dark:bg-dark-surface dark:border-accent/40'
                        : 'bg-transparent border-primary/10 hover:border-primary/20 dark:border-cream/10 dark:hover:border-cream/20 text-primary dark:text-cream'
                    }`}
                  >
                    <div className="flex gap-4">
                      <span className={`font-serif text-2xl font-bold ${isActive ? 'text-accent' : 'opacity-40'}`}>
                        {step.step}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-bold mb-1">{step.title}</h3>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-xs font-light text-cream/80 dark:text-cream/70 leading-relaxed mt-2"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ====================================
          INTERACTIVE WORLD MAP SECTION
          ==================================== */}
      <section className="py-24 bg-cream dark:bg-dark-bg transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Vùng Trà Quốc Tế</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary dark:text-cream mb-4">Bản Đồ Kỳ Nghỉ</h2>
            <p className="text-sm font-light text-primary/70 dark:text-cream/70">
              Rê chuột lên các điểm ghim để khám phá các trang trại trà núi, các khu lưu trú trên cao và điểm trị liệu sức khỏe tùy chọn.
            </p>
          </div>

          {/* Interactive World Map SVG Layout */}
          <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-primary/10 dark:border-cream/10 bg-[#EBEBE0]/30 dark:bg-dark-surface/30 p-4 md:p-8">
            <WorldMapSVG
              className="w-full h-auto opacity-70 fill-primary/10 dark:fill-cream/15 text-primary/20"
            />

            {/* Render Pins overlay */}
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer"
                style={{ left: pin.x, top: pin.y }}
                onMouseEnter={() => setHoveredPin(pin.id)}
                onMouseLeave={() => setHoveredPin(null)}
                onClick={() => navigate(`/tours/${pin.tourId}`)}
              >
                {/* Pin element */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-accent/30 animate-ping" />
                  <div className={`relative w-4.5 h-4.5 rounded-full border border-white shadow-md flex items-center justify-center transition-all ${
                    hoveredPin === pin.id ? 'bg-accent scale-125' : 'bg-primary dark:bg-secondary'
                  }`}>
                    <MapPin className={`w-2.5 h-2.5 text-white ${hoveredPin === pin.id ? 'text-primary' : ''}`} />
                  </div>
                </div>

                {/* Pin Tooltip */}
                {hoveredPin === pin.id && (
                  <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-3.5 w-44 rounded-2xl glass border border-accent/40 shadow-xl p-3 text-center z-30 animate-fade-in-up">
                    <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-0.5">{pin.name}</p>
                    <p className="text-xs font-semibold text-primary dark:text-cream">Giá tour chỉ từ</p>
                    <p className="font-serif text-sm font-bold text-primary dark:text-cream">{pin.price}</p>
                    <span className="block text-[8px] text-primary/60 dark:text-cream/50 underline mt-1">Click để xem chi tiết</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================
          TESTIMONIALS SECTION (Glassmorphism cards)
          ==================================== */}
      <section className="py-24 bg-[#EBEBE0]/30 dark:bg-dark-surface/30 border-t border-primary/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-2">Ý Kiến Lữ Khách</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary dark:text-cream mb-4">Giai Điệu Tĩnh Lặng</h2>
            <p className="text-sm font-light text-primary/70 dark:text-cream/70">
              Cảm nhận của các lữ khách khi tạm rời xa nhịp sống hối hả thường nhật để hòa mình vào những ngọn đồi chè yên bình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-3xl border border-primary/10 flex flex-col justify-between">
              <Quote className="text-accent/40 w-10 h-10 mb-6" />
              <p className="italic text-sm text-primary/80 dark:text-cream/80 leading-relaxed font-light mb-6">
                "Nghỉ dưỡng tại Shizuoka giống như bước vào một không gian khác. Các nghệ nhân trà đã dạy chúng tôi cách pha trà Gyokuro bằng nước suối tự nhiên. Thức dậy ngắm nhìn núi Phú Sĩ trong sự tĩnh lặng tuyệt đối là kỷ niệm tôi sẽ mang theo suốt đời."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
                  alt="Clara"
                  className="w-10 h-10 rounded-full object-cover border border-accent/20"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-primary dark:text-cream">Clara Jenkins</h4>
                  <div className="flex gap-0.5 text-accent mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 rounded-3xl border border-primary/10 flex flex-col justify-between">
              <Quote className="text-accent/40 w-10 h-10 mb-6" />
              <p className="italic text-sm text-primary/80 dark:text-cream/80 leading-relaxed font-light mb-6">
                "Hành trình leo núi hái trà tuyết Sapa tuy vất vả nhưng vô cùng xứng đáng. Giang Thị Mảy (hướng dẫn viên của chúng tôi) đã đưa chúng tôi đến với những cây trà cổ thụ hơn 300 năm tuổi và trải nghiệm tắm lá thuốc Dao đỏ. Làn da của tôi chưa bao giờ cảm thấy tuyệt vời đến thế."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80"
                  alt="Julian"
                  className="w-10 h-10 rounded-full object-cover border border-accent/20"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-primary dark:text-cream">Julian Alvarez</h4>
                  <div className="flex gap-0.5 text-accent mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-8 rounded-3xl border border-primary/10 flex flex-col justify-between">
              <Quote className="text-accent/40 w-10 h-10 mb-6" />
              <p className="italic text-sm text-primary/80 dark:text-cream/80 leading-relaxed font-light mb-6">
                "Các lớp học pha trà Chai hương thảo mộc ở Kerala thật tuyệt vời. Tìm hiểu chế độ ăn uống Ayurveda kết hợp với các chuyến đi bộ tham quan trang trại chè đen địa phương đã giúp tôi thay đổi cách giải tỏa căng thẳng khi trở về nhà."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                  alt="Sophia"
                  className="w-10 h-10 rounded-full object-cover border border-accent/20"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-primary dark:text-cream">Sophia Sterling</h4>
                  <div className="flex gap-0.5 text-accent mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ====================================
          CTA BOOKING SECTION (Stunning Deep Green Banner)
          ==================================== */}
      <section className="py-24 bg-cream dark:bg-dark-bg transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[40px] bg-primary overflow-hidden p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl border border-white/5">
            
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,215,169,0.15),transparent_60%)]" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent/5 blur-[80px]" />
            
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-accent font-bold block mb-4">Bắt Đầu Hành Trình Của Bạn</span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Bước Vào Thế Giới Chữa Lành Của Trà & Thiên Nhiên
              </h2>
              <p className="text-sm md:text-base text-cream/80 font-light leading-relaxed">
                Kết nối với các truyền thống cổ xưa, nghỉ ngơi tại các thánh đường thiên nhiên hoang sơ và tự tay phối trộn hộp trà kỷ niệm hữu cơ của riêng bạn. Cổng đăng ký các hành trình năm 2026 hiện đang mở.
              </p>
            </div>

            <div className="relative z-10 flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                to="/tours"
                className="w-full sm:w-auto text-center px-8 py-4.5 rounded-2xl bg-accent text-primary font-bold text-sm hover:scale-105 active:scale-98 transition-all shadow-md"
              >
                Đặt Lịch Kỳ Nghỉ
              </Link>
              <Link
                to="/planner"
                className="w-full sm:w-auto text-center px-8 py-4.5 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 hover:scale-105 active:scale-98 border border-white/15 transition-all"
              >
                Tự Lên Lịch Trình
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
