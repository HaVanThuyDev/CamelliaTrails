import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useDashboard } from '../context/DashboardContext';
import {
  Leaf, Menu, Sun, Moon, Bell, Search, Globe, ChevronDown, User, LogOut,
  BarChart3, Briefcase, FileSpreadsheet, Home, Calendar, Users, Eye,
  AlertCircle, ShieldCheck, CreditCard, ClipboardList, Keyboard
} from 'lucide-react';

// Tab Components
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { TourTab } from '../components/dashboard/TourTab';
import { BookingTab } from '../components/dashboard/BookingTab';
import { RoomTab } from '../components/dashboard/RoomTab';
import { ScheduleTab } from '../components/dashboard/ScheduleTab';
import { StaffTab } from '../components/dashboard/StaffTab';
import { CustomerTab } from '../components/dashboard/CustomerTab';
import { ReviewTab } from '../components/dashboard/ReviewTab';
import { PaymentTab } from '../components/dashboard/PaymentTab';
import { AnalyticsTab } from '../components/dashboard/AnalyticsTab';
import { AuditLogTab } from '../components/dashboard/AuditLogTab';

export const Dashboard: React.FC = () => {
  const { currentUser, logout, theme, toggleTheme, tours, bookings } = useApp();
  const {
    role, setRole,
    lang, setLang, t,
    activeTab, setActiveTab,
    notifications, markNotificationRead, clearNotifications,
    staffList
  } = useDashboard();
  const navigate = useNavigate();

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; linkTab: string }[]>([]);

  // Keyboard shortcut listener for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global search handler
  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: typeof searchResults = [];

    // Search tours
    tours.forEach(tour => {
      if (tour.title.toLowerCase().includes(query.toLowerCase()) || tour.location.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Tour', title: tour.title, linkTab: 'tours' });
      }
    });

    // Search bookings
    bookings.forEach(b => {
      if (b.userName.toLowerCase().includes(query.toLowerCase()) || b.id.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Booking', title: `Đơn ${b.id} - ${b.userName}`, linkTab: 'bookings' });
      }
    });

    // Search staff
    staffList.forEach(s => {
      if (s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'Staff', title: `${s.name} (${s.role})`, linkTab: 'staff' });
      }
    });

    setSearchResults(results.slice(0, 5));
  };

  // Quick Action execution (Command Palette)
  const runCommand = (command: string) => {
    setIsCommandPaletteOpen(false);
    
    if (command.startsWith('goto:')) {
      setActiveTab(command.split(':')[1]);
    } else if (command === 'toggle-theme') {
      toggleTheme();
    } else if (command.startsWith('role:')) {
      setRole(command.split(':')[1] as any);
    } else if (command === 'clear-notifications') {
      clearNotifications();
    }
  };

  // Verify Admin or Authorized Access
  if (!currentUser) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-dark-bg text-center p-6">
        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mb-4 animate-pulse" />
        <h2 className="font-serif text-2xl font-bold mb-2">Bảng Điều Khiển Chưa Được Đăng Nhập</h2>
        <p className="text-sm font-light text-primary/60 dark:text-cream/60 mb-6 max-w-sm">
          Vui lòng đăng nhập để truy cập vào số liệu quản trị hệ thống.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-primary text-cream font-bold text-xs shadow-md cursor-pointer"
        >
          Đi tới Trang Đăng Nhập
        </button>
      </div>
    );
  }

  // Define sidebar navigation items based on role
  const navItems = [
    { id: 'overview', label: t('overview'), icon: BarChart3, roles: ['admin', 'staff', 'accountant'] },
    { id: 'tours', label: t('tours'), icon: Briefcase, roles: ['admin', 'staff'] },
    { id: 'bookings', label: t('bookings'), icon: FileSpreadsheet, roles: ['admin', 'staff', 'accountant'] },
    { id: 'rooms', label: t('rooms'), icon: Home, roles: ['admin', 'staff'] },
    { id: 'schedule', label: t('schedule'), icon: Calendar, roles: ['admin', 'staff'] },
    { id: 'staff', label: t('staff'), icon: Users, roles: ['admin'] },
    { id: 'customers', label: t('customers'), icon: User, roles: ['admin', 'staff'] },
    { id: 'reviews', label: t('reviews'), icon: Eye, roles: ['admin', 'staff'] },
    { id: 'payments', label: t('payments'), icon: CreditCard, roles: ['admin', 'accountant'] },
    { id: 'analytics', label: t('analytics'), icon: BarChart3, roles: ['admin', 'accountant'] },
    { id: 'auditLogs', label: t('auditLogs'), icon: ClipboardList, roles: ['admin'] }
  ];

  // Filter items matching active role
  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full min-h-screen flex bg-cream dark:bg-dark-bg text-primary dark:text-cream transition-colors duration-500 font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`bg-cream/75 dark:bg-dark-surface/75 border-r border-primary/10 dark:border-cream/10 backdrop-blur-md flex flex-col justify-between transition-all duration-300 z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="space-y-8">
          {/* Logo brand */}
          <div className={`p-6 border-b border-primary/5 flex items-center justify-between ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-md flex-shrink-0">
                <Leaf className="text-secondary w-5 h-5" />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <span className="font-serif text-lg font-bold tracking-tight text-primary dark:text-cream block">
                    Camellia<span className="text-accent">Trails</span>
                  </span>
                  <span className="block text-[8px] tracking-widest text-accent uppercase -mt-1 font-bold">
                    Console Portal
                  </span>
                </div>
              )}
            </div>
            
            {/* Sidebar toggle button */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1 rounded-lg hover:bg-primary/5 text-primary/60 dark:text-cream/60 cursor-pointer hidden md:block"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapsed sidebar toggle button wrapper */}
          {isSidebarCollapsed && (
            <div className="flex justify-center border-b border-primary/5 pb-4">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary dark:text-cream cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? 'bg-primary dark:bg-accent text-cream dark:text-primary shadow-md'
                      : 'text-primary/70 dark:text-cream/70 hover:bg-primary/5 dark:hover:bg-cream/5'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-accent dark:text-primary' : 'text-primary/60 dark:text-cream/60 group-hover:text-accent'}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar bottom profile controls */}
        <div className="p-4 border-t border-primary/5">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Đăng xuất console</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT FRAME */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* TOP HEADER NAVBAR */}
        <header className="h-16 border-b border-primary/10 dark:border-cream/10 bg-cream/40 dark:bg-dark-bg/40 backdrop-blur-md px-6 flex items-center justify-between z-20">
          
          {/* Left search bar */}
          <div className="flex items-center gap-3 flex-grow max-w-md relative">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                className="w-full bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-4 py-2 pl-9 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold"
              />
              <Search className="absolute left-3 w-4 h-4 text-primary/45 dark:text-cream/45" />
              <button 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="absolute right-3 p-1 rounded bg-primary/5 dark:bg-cream/5 text-[9px] font-mono text-primary/50 dark:text-cream/50 hover:bg-primary/10 hover:text-accent border border-primary/10"
                title="Mở Bảng lệnh (Ctrl+K)"
              >
                Ctrl K
              </button>
            </div>

            {/* Fuzzy Search overlay dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full rounded-2xl glass border border-primary/10 shadow-2xl py-2 z-50 animate-fade-in-up">
                <span className="block px-4 py-1 text-[8px] uppercase tracking-wider text-primary/55 dark:text-cream/55 font-bold">Tìm thấy nhanh:</span>
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(res.linkTab);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-primary/5 dark:hover:bg-cream/5 text-primary dark:text-cream flex justify-between items-center cursor-pointer border-b border-primary/5 last:border-0"
                  >
                    <span className="font-bold truncate max-w-[250px]">{res.title}</span>
                    <span className="text-[8px] uppercase bg-accent/25 text-primary dark:text-accent px-2 py-0.5 rounded font-bold">{res.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right action control panels */}
          <div className="flex items-center gap-3.5 sm:gap-5">
            
            {/* Live activity indicator status */}
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 text-accent font-semibold text-[10px] border border-accent/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>đang hoạt động: {role}</span>
            </span>

            {/* Role switcher trigger */}
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 rounded-xl px-3 py-2 text-xs font-bold text-primary dark:text-cream focus:outline-none focus:border-accent cursor-pointer pr-8 appearance-none"
              >
                <option value="admin">Quản trị (Admin)</option>
                <option value="staff">Lễ tân (Staff)</option>
                <option value="accountant">Kế toán (Accountant)</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/60 dark:text-cream/60 pointer-events-none" />
            </div>

            {/* Language switcher trigger */}
            <div className="relative">
              <button
                onClick={() => setLang(lang === 'vi' ? 'en' : lang === 'en' ? 'ja' : 'vi')}
                className="p-2 rounded-xl bg-cream/50 dark:bg-dark-surface/50 border border-primary/10 text-primary dark:text-cream flex items-center justify-center hover:bg-primary/5 transition-all text-xs font-bold cursor-pointer gap-1"
                title="Thay đổi ngôn ngữ"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-mono">{lang}</span>
              </button>
            </div>

            {/* Live Notifications bell panel */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 rounded-xl border border-primary/10 dark:border-cream/10 bg-cream/30 dark:bg-dark-surface/30 flex items-center justify-center text-primary dark:text-cream hover:bg-primary/5 hover:rotate-12 transition-all duration-300 shadow-sm relative cursor-pointer"
                title="Hộp thư thông báo"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce shadow-md">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications box */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3.5 w-80 rounded-2xl glass border border-primary/10 dark:border-cream/10 shadow-2xl py-3 z-50 animate-fade-in-up">
                  <div className="px-4 pb-2 border-b border-primary/5 dark:border-cream/5 flex justify-between items-center">
                    <h4 className="font-serif font-bold text-xs text-primary dark:text-cream">{t('notificationTitle')} ({notifications.length})</h4>
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="text-[9px] text-red-500 font-bold hover:underline cursor-pointer">Xóa tất cả</button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-primary/5 dark:divide-cream/5 px-2 mt-2">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-xl text-left cursor-pointer transition-all hover:bg-primary/5 my-1 ${!n.read ? 'bg-accent/10 border-l-2 border-accent' : ''}`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <h5 className="font-bold text-[11px] leading-tight text-primary dark:text-cream">{n.title}</h5>
                            <span className="text-[8px] text-primary/40 dark:text-cream/40 font-mono flex-shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-primary/70 dark:text-cream/70 font-light mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-primary/40 dark:text-cream/40">
                        Không có thông báo mới nào.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-primary/10 dark:border-cream/10 bg-cream/30 dark:bg-dark-surface/30 flex items-center justify-center text-primary dark:text-cream hover:bg-primary/5 hover:rotate-45 transition-all duration-300 shadow-sm cursor-pointer"
              title="Giao diện Tối/Sáng"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-accent animate-pulse-slow" />}
            </button>

            {/* User Profile avatar info */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8.5 h-8.5 rounded-xl object-cover border border-accent/30 shadow-sm"
                />
              </button>

              {/* Minimalist Profile options dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3.5 w-48 rounded-xl glass border border-primary/10 shadow-2xl py-1 z-50 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-primary/5">
                    <p className="font-bold text-xs truncate text-primary dark:text-cream">{currentUser.name}</p>
                    <p className="text-[9px] text-primary/50 dark:text-cream/50 truncate font-mono">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full text-left px-3 py-2 text-xs text-primary/80 dark:text-cream/80 hover:bg-primary/5 transition-all flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <Home className="w-3.5 h-3.5 text-primary/60 dark:text-cream/60" />
                    Trở về Website
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-all flex items-center gap-2 cursor-pointer border-t border-primary/5 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* MAIN MODULE VIEWPORT PANEL */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'tours' && <TourTab />}
          {activeTab === 'bookings' && <BookingTab />}
          {activeTab === 'rooms' && <RoomTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'staff' && <StaffTab />}
          {activeTab === 'customers' && <CustomerTab />}
          {activeTab === 'reviews' && <ReviewTab />}
          {activeTab === 'payments' && <PaymentTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'auditLogs' && <AuditLogTab />}
        </main>

      </div>

      {/* 3. COMMAND PALETTE MODAL OVERLAY (Ctrl+K) */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 z-50 animate-fade-in" onClick={() => setIsCommandPaletteOpen(false)}>
          <div className="w-full max-w-xl rounded-3xl glass border border-primary/20 shadow-2xl p-4 space-y-4 mx-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            
            {/* Search command input */}
            <div className="relative flex items-center border-b border-primary/10 dark:border-cream/10 pb-3">
              <Keyboard className="w-5 h-5 text-accent flex-shrink-0 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Nhập tên thao tác, đổi vai trò hoặc chuyển trang..."
                className="w-full bg-transparent border-none text-sm text-primary dark:text-cream focus:outline-none placeholder-primary/45 font-semibold"
                onChange={() => {
                  // Handle filtering command options in real-time if required
                }}
              />
              <span className="text-[9px] bg-primary/10 px-2 py-0.5 rounded text-primary/50 font-bold uppercase">Esc</span>
            </div>

            {/* Quick list actions list */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              <span className="block text-[8px] uppercase tracking-wider text-accent font-bold mb-2">Chuyển mô-đun nhanh:</span>
              {[
                { label: 'Đi tới Tổng quan (Dashboard Overview)', cmd: 'goto:overview' },
                { label: 'Đi tới Quản lý Tour', cmd: 'goto:tours' },
                { label: 'Đi tới Quản lý Đơn hàng', cmd: 'goto:bookings' },
                { label: 'Đi tới Lịch trình (Drag & Drop Scheduler)', cmd: 'goto:schedule' },
                { label: 'Đi tới Quản lý Phòng nghỉ', cmd: 'goto:rooms' },
                { label: 'Đi tới Nhật ký bảo mật (Audit Logs)', cmd: 'goto:auditLogs' }
              ].map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => runCommand(c.cmd)}
                  className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-primary hover:text-cream dark:hover:bg-accent dark:hover:text-primary transition-all cursor-pointer font-semibold flex items-center justify-between"
                >
                  <span>{c.label}</span>
                  <span className="text-[8px] bg-primary/5 dark:bg-cream/10 px-2 py-0.5 rounded font-bold uppercase">Tab Jump</span>
                </button>
              ))}

              <span className="block text-[8px] uppercase tracking-wider text-accent font-bold mt-4 mb-2">Cấu hình console nhanh:</span>
              {[
                { label: 'Chuyển quyền hoạt động sang Kế Toán (Accountant Role)', cmd: 'role:accountant' },
                { label: 'Chuyển quyền hoạt động sang Nhân viên (Staff Role)', cmd: 'role:staff' },
                { label: 'Chuyển quyền hoạt động sang Admin (Admin Role)', cmd: 'role:admin' },
                { label: 'Bật/Tắt chế độ tối (Toggle Dark Mode)', cmd: 'toggle-theme' },
                { label: 'Xóa toàn bộ thư thông báo (Clear Notifications)', cmd: 'clear-notifications' }
              ].map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => runCommand(c.cmd)}
                  className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-primary hover:text-cream dark:hover:bg-accent dark:hover:text-primary transition-all cursor-pointer font-semibold flex items-center justify-between"
                >
                  <span>{c.label}</span>
                  <span className="text-[8px] bg-primary/5 dark:bg-cream/10 px-2 py-0.5 rounded font-bold uppercase">Console Set</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
