import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Sun, Moon, Menu, X, User, LogOut, ChevronDown, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, theme, toggleTheme, logout, login } = useApp();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleDemoAdminLogin = () => {
    login('admin@tea.com', 'admin');
    setIsProfileDropdownOpen(false);
  };

  const handleDemoUserLogin = () => {
    login('traveler@tea.com', 'user');
    setIsProfileDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Khám phá Tour', path: '/tours' },
    { name: 'Lịch trình', path: '/planner' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass py-3 shadow-md'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-md">
            <Leaf className="text-secondary w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-primary dark:text-cream transition-colors duration-300">
              Camellia<span className="text-accent">Trails</span>
            </span>
            <span className="block text-[9px] tracking-widest text-primary/70 dark:text-cream/70 uppercase -mt-1 font-semibold">
              Du lịch Trà & Thiên nhiên
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative py-2 font-medium transition-all duration-300 hover:text-accent font-sans ${
                isActive(link.path)
                  ? 'text-accent dark:text-accent font-semibold'
                  : 'text-primary/80 dark:text-cream/80 hover:text-primary dark:hover:text-cream'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-1/4 w-1/2 h-[2px] bg-accent rounded-full animate-pulse" />
              )}
            </Link>
          ))}
          {currentUser && currentUser.role === 'admin' && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-1 py-2 font-medium transition-all duration-300 text-accent font-sans hover:scale-105`}
            >
              <Shield className="w-4 h-4" />
              Quản trị
            </Link>
          )}
        </div>

        {/* Action Buttons (Right-side) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-primary/10 dark:border-cream/10 bg-transparent flex items-center justify-center text-primary dark:text-cream hover:bg-primary/5 dark:hover:bg-cream/5 hover:rotate-45 transition-all duration-300 shadow-sm cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5 text-accent" />
            )}
          </button>

          {/* User Account Controls */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-primary/10 dark:border-cream/10 bg-cream/30 dark:bg-dark-surface/30 hover:border-primary/30 dark:hover:border-cream/30 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-accent/30 shadow-sm"
                />
                <span className="text-xs font-semibold max-w-[120px] truncate text-primary dark:text-cream">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-primary/60 dark:text-cream/60" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-2xl glass border border-primary/10 dark:border-cream/10 shadow-xl py-2 animate-fade-in-up z-50">
                  <div className="px-4 py-2.5 border-b border-primary/5 dark:border-cream/5">
                    <p className="text-xs text-primary/60 dark:text-cream/60">Đăng nhập bởi</p>
                    <p className="font-semibold text-sm truncate text-primary dark:text-cream">{currentUser.name}</p>
                    <p className="text-xs text-primary/50 dark:text-cream/50 truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary/80 dark:text-cream/80 hover:bg-primary/5 dark:hover:bg-cream/5 transition-all"
                  >
                    <User className="w-4 h-4 text-primary/60 dark:text-cream/60" />
                    Hồ sơ du lịch
                  </Link>
                  {currentUser.role === 'admin' ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-accent hover:bg-primary/5 dark:hover:bg-cream/5 transition-all font-semibold"
                    >
                      <Shield className="w-4 h-4" />
                      Trang quản trị
                    </Link>
                  ) : (
                    <button
                      onClick={handleDemoAdminLogin}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-secondary-500 hover:text-accent hover:bg-primary/5 dark:hover:bg-cream/5 transition-all text-primary/60 dark:text-cream/60"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Chuyển sang Admin
                    </button>
                  )}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={handleDemoUserLogin}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs hover:text-accent hover:bg-primary/5 dark:hover:bg-cream/5 transition-all text-primary/60 dark:text-cream/60"
                    >
                      <User className="w-3.5 h-3.5" />
                      Chuyển sang Khách
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-all border-t border-primary/5 dark:border-cream/5"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary dark:bg-accent text-cream dark:text-primary font-semibold text-sm hover:scale-105 hover:shadow-lg transition-all"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile Menu Action Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-primary/10 dark:border-cream/10 flex items-center justify-center text-primary dark:text-cream"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-accent" />}
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg border border-primary/10 dark:border-cream/10 text-primary dark:text-cream"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass shadow-lg border-b border-primary/10 dark:border-cream/10 py-5 px-6 animate-fade-in-up">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 text-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-primary dark:text-cream'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {currentUser && currentUser.role === 'admin' && (
              <Link
                to="/dashboard"
                className="py-2 text-lg font-medium text-accent flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Trang quản trị
              </Link>
            )}
            {currentUser && (
              <Link
                to="/profile"
                className="py-2 text-lg font-medium text-primary dark:text-cream flex items-center gap-2"
              >
                <User className="w-5 h-5 text-primary/70 dark:text-cream/70" />
                Hồ sơ cá nhân
              </Link>
            )}

            {/* Auth section */}
            <div className="pt-4 border-t border-primary/10 dark:border-cream/10">
              {currentUser ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full border border-accent/30"
                    />
                    <div>
                      <p className="font-semibold text-sm text-primary dark:text-cream">{currentUser.name}</p>
                      <p className="text-xs text-primary/60 dark:text-cream/60">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentUser.role !== 'admin' ? (
                      <button
                        onClick={handleDemoAdminLogin}
                        className="flex-1 py-2 rounded-xl border border-primary/10 text-xs text-primary dark:text-cream text-center"
                      >
                        Demo Admin
                      </button>
                    ) : (
                      <button
                        onClick={handleDemoUserLogin}
                        className="flex-1 py-2 rounded-xl border border-primary/10 text-xs text-primary dark:text-cream text-center"
                      >
                        Demo Khách
                      </button>
                    )}
                    <button
                      onClick={logout}
                      className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold text-center"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full py-2.5 rounded-xl bg-primary text-cream text-center font-semibold text-sm"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
