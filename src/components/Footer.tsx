import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-primary text-cream pt-20 pb-10 border-t border-primary/20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Branding & Mission */}
        <div className="flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Leaf className="text-primary w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Camellia<span className="text-accent">Trails</span>
              </span>
              <span className="block text-[9px] tracking-widest text-secondary uppercase -mt-1 font-semibold">
                Tea & Nature Travel
              </span>
            </div>
          </Link>
          <p className="text-sm text-cream/70 leading-relaxed font-light">
            Chúng tôi kiến tạo các trải nghiệm du lịch bền vững và nhập vai, kết hợp năng lượng chữa lành của văn hóa trà với hoạt động sinh thái bảo tồn sâu sắc.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-accent hover:text-primary transition-all duration-300 hover:-translate-y-1"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-accent hover:text-primary transition-all duration-300 hover:-translate-y-1"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.42 0-3 1.35-3 3v3z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-accent hover:text-primary transition-all duration-300 hover:-translate-y-1"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Popular Destinations */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-6 text-white border-l-2 border-accent pl-3">
            Điểm Đến
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-cream/70 font-light">
            <li>
              <Link to="/tours" className="hover:text-accent transition-colors">
                Đồi chè Shan Tuyết Sapa — Việt Nam
              </Link>
            </li>
            <li>
              <Link to="/tours" className="hover:text-accent transition-colors">
                Thung lũng thiền chè Shizuoka — Nhật Bản
              </Link>
            </li>
            <li>
              <Link to="/tours" className="hover:text-accent transition-colors">
                Đồi trị liệu Munnar Ayurveda — Ấn Độ
              </Link>
            </li>
            <li>
              <Link to="/tours" className="hover:text-accent transition-colors">
                Trà di sản Darjeeling — Ấn Độ
              </Link>
            </li>
          </ul>
        </div>

        {/* Helpful Links */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-6 text-white border-l-2 border-accent pl-3">
            Đồng Hành & Trách Nhiệm
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-cream/70 font-light">
            <li>
              <a href="#" className="hover:text-accent transition-colors">
                Triết lý bền vững của chúng tôi
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">
                Bảo tồn cây chè cổ thụ hoang dã
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">
                Chương trình hợp tác bản địa
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">
                Báo cáo giảm thiểu dấu chân Carbon
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-6 text-white border-l-2 border-accent pl-3">
            Tham Gia Hành Trình
          </h3>
          <p className="text-sm text-cream/70 leading-relaxed font-light mb-4">
            Đăng ký nhận bí quyết pha trà hữu cơ, cẩm nang du lịch chậm và thông báo ưu đãi về các kỳ nghỉ dưỡng độc quyền.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ email của bạn"
              className="w-full bg-cream/10 text-cream placeholder-cream/40 border border-cream/20 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none focus:border-accent transition-colors"
              required
            />
            <button
              type="submit"
              className="absolute right-1.5 w-9 h-9 rounded-full bg-accent flex items-center justify-center text-primary hover:bg-white transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-accent mt-2 animate-pulse">
              Chào mừng bạn đồng hành! Cẩm nang pha trà đang trên đường tới hòm thư của bạn.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-cream/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/50">
        <p>© 2026 Camellia Trails. Được dệt nên từ lá chè, ngọn gió và nước nguồn.</p>
        <div className="flex gap-6 font-light">
          <a href="#" className="hover:text-accent transition-colors">
            Chính sách bảo mật
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            Điều khoản dịch vụ
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            Cấu hình Cookie
          </a>
        </div>
      </div>
    </footer>
  );
};
