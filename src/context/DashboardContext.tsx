import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import type { Booking } from './AppContext';

// Types for Dashboard
export interface Staff {
  id: string;
  name: string;
  role: 'admin' | 'guide' | 'accountant' | 'receptionist';
  avatar: string;
  email: string;
  status: 'active' | 'inactive';
  attendance: {
    checkIn: string | null;
    checkOut: string | null;
    date: string;
  }[];
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface Room {
  id: string;
  name: string;
  type: 'Villa' | 'Cabin' | 'Suite';
  capacity: number;
  pricePerNight: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  location: string;
  bookings: {
    bookingId: string;
    checkIn: string;
    checkOut: string;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

// Translations dictionary
export const translations = {
  vi: {
    overview: 'Tổng quan',
    tours: 'Quản lý Tour',
    bookings: 'Đơn đặt hàng',
    rooms: 'Phòng & Tiện ích',
    schedule: 'Lịch trình',
    staff: 'Nhân viên',
    customers: 'Khách hàng',
    reviews: 'Đánh giá & Phản hồi',
    payments: 'Thanh toán & Thu ngân',
    analytics: 'Phân tích & Báo cáo',
    auditLogs: 'Nhật ký bảo mật',
    revenue: 'Doanh thu',
    activeUsers: 'Hoạt động',
    bookingCount: 'Tổng lượt đặt',
    sentiment: 'Phân tích Sentiment',
    recommendations: 'AI Gợi ý',
    predictive: 'Dự báo doanh thu',
    heatmap: 'Bản đồ click',
    role: 'Vai trò',
    lang: 'Ngôn ngữ',
    searchPlaceholder: 'Tìm kiếm nhanh (Ctrl + K)...',
    realTimePush: 'Mô phỏng đặt vé (Real-time)',
    notificationTitle: 'Thông báo mới',
    cashierRegister: 'Quầy thu ngân',
  },
  en: {
    overview: 'Overview',
    tours: 'Tours',
    bookings: 'Bookings',
    rooms: 'Rooms & Lodges',
    schedule: 'Schedule',
    staff: 'Staff & Team',
    customers: 'Customers',
    reviews: 'Reviews',
    payments: 'Payments & Cashier',
    analytics: 'Analytics',
    auditLogs: 'Audit Logs',
    revenue: 'Revenue',
    activeUsers: 'Active Users',
    bookingCount: 'Total Bookings',
    sentiment: 'Sentiment Analysis',
    recommendations: 'AI Insights',
    predictive: 'Revenue Forecast',
    heatmap: 'Click Heatmap',
    role: 'Role',
    lang: 'Language',
    searchPlaceholder: 'Quick search (Ctrl + K)...',
    realTimePush: 'Simulate Booking (Real-time)',
    notificationTitle: 'New Notification',
    cashierRegister: 'Cashier Portal',
  },
  ja: {
    overview: 'ダッシュボード',
    tours: 'ツアー管理',
    bookings: '予約一覧',
    rooms: '客室・施設',
    schedule: 'スケジュール',
    staff: 'スタッフ',
    customers: '顧客管理',
    reviews: '口コミ・評価',
    payments: '決済・会計',
    analytics: '分析レポート',
    auditLogs: '監査ログ',
    revenue: '売上高',
    activeUsers: 'アクティブユーザー',
    bookingCount: '総予約数',
    sentiment: '感情分析',
    recommendations: 'AI推奨',
    predictive: '売上予測',
    heatmap: 'クリックヒートマップ',
    role: '権限',
    lang: '言語',
    searchPlaceholder: 'クイック検索 (Ctrl + K)...',
    realTimePush: '予約シミュレーション',
    notificationTitle: '新着通知',
    cashierRegister: 'レジ・会計',
  }
};

interface DashboardContextType {
  role: 'admin' | 'staff' | 'accountant';
  setRole: (role: 'admin' | 'staff' | 'accountant') => void;
  lang: 'vi' | 'en' | 'ja';
  setLang: (lang: 'vi' | 'en' | 'ja') => void;
  t: (key: keyof typeof translations['vi']) => string;
  staffList: Staff[];
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  auditLogs: AuditLog[];
  addLog: (action: string, details: string) => void;
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  simulateRealTimeBooking: () => void;
  triggerAIRecommendation: (tourId: string) => { price: number; reason: string };
  updateRoomBooking: (roomId: string, bookingId: string, checkIn: string, checkOut: string) => void;
  updateTourDrag: (bookingId: string, newDate: string) => void;
  staffCheckIn: (staffId: string) => void;
  staffCheckOut: (staffId: string) => void;
  transactions: { id: string; date: string; amount: number; method: string; status: 'Completed' | 'Refunded'; customer: string }[];
  addTransaction: (amount: number, method: string, customer: string) => void;
  refundTransaction: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tours, currentUser, addBooking } = useApp();
  const [role, setRoleState] = useState<'admin' | 'staff' | 'accountant'>('admin');
  const [lang, setLang] = useState<'vi' | 'en' | 'ja'>('vi');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Multi-language translation helper
  const t = (key: keyof typeof translations['vi']) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  // Staff Mock Data
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_staff');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing dashboard_staff:', e);
    }
    return [
      {
        id: 'S-101',
        name: 'Giang Thị Mảy',
        role: 'guide',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        email: 'may.giang@camelliatrails.com',
        status: 'active',
        attendance: [
          { checkIn: '08:00', checkOut: '17:00', date: '2026-05-25' },
        ],
        schedule: {
          monday: 'Sapa Trekking 5D',
          tuesday: 'Sapa Trekking 5D',
          wednesday: 'Sapa Trekking 5D',
          thursday: 'Sapa Trekking 5D',
          friday: 'Sapa Trekking 5D',
          saturday: 'Day Off',
          sunday: 'Tea Class',
        }
      },
      {
        id: 'S-102',
        name: 'Kenji Sato',
        role: 'guide',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        email: 'kenji.sato@camelliatrails.com',
        status: 'active',
        attendance: [
          { checkIn: '08:15', checkOut: '17:30', date: '2026-05-25' },
        ],
        schedule: {
          monday: 'Zen Ceremony',
          tuesday: 'Zen Ceremony',
          wednesday: 'Zen Ceremony',
          thursday: 'Day Off',
          friday: 'Matcha Workshop',
          saturday: 'Matcha Workshop',
          sunday: 'Day Off',
        }
      },
      {
        id: 'S-103',
        name: 'Lê Minh Tuấn',
        role: 'receptionist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        email: 'tuan.le@camelliatrails.com',
        status: 'active',
        attendance: [],
        schedule: {
          monday: '08:00 - 16:00',
          tuesday: '08:00 - 16:00',
          wednesday: '08:00 - 16:00',
          thursday: '08:00 - 16:00',
          friday: '08:00 - 16:00',
          saturday: 'Day Off',
          sunday: 'Day Off',
        }
      },
      {
        id: 'S-104',
        name: 'Nguyễn Thị Hương',
        role: 'accountant',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        email: 'huong.nguyen@camelliatrails.com',
        status: 'active',
        attendance: [
          { checkIn: '08:05', checkOut: null, date: '2026-05-26' }
        ],
        schedule: {
          monday: '09:00 - 18:00',
          tuesday: '09:00 - 18:00',
          wednesday: '09:00 - 18:00',
          thursday: '09:00 - 18:00',
          friday: '09:00 - 18:00',
          saturday: 'Day Off',
          sunday: 'Day Off',
        }
      }
    ];
  });

  // Rooms/Lodges Mock Data
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_rooms');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing dashboard_rooms:', e);
    }
    return [
      {
        id: 'R-201',
        name: 'Sapa Bamboo Suite 1',
        type: 'Suite',
        capacity: 2,
        pricePerNight: 220,
        status: 'Occupied',
        location: 'Sapa Lodge',
        bookings: [
          { bookingId: 'B-8472', checkIn: '2026-06-15', checkOut: '2026-06-20' }
        ]
      },
      {
        id: 'R-202',
        name: 'Sapa Bamboo Villa 2',
        type: 'Villa',
        capacity: 4,
        pricePerNight: 350,
        status: 'Available',
        location: 'Sapa Lodge',
        bookings: []
      },
      {
        id: 'R-203',
        name: 'Shizuoka Zen Cabin A',
        type: 'Cabin',
        capacity: 2,
        pricePerNight: 280,
        status: 'Occupied',
        location: 'Shizuoka Sanctuary',
        bookings: [
          { bookingId: 'B-9201', checkIn: '2026-07-15', checkOut: '2026-07-21' }
        ]
      },
      {
        id: 'R-204',
        name: 'Munnar Ayurveda Hut 1',
        type: 'Cabin',
        capacity: 2,
        pricePerNight: 190,
        status: 'Maintenance',
        location: 'Munnar Retreat',
        bookings: []
      }
    ];
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing dashboard_audit_logs:', e);
    }
    return [
      {
        id: 'L-5001',
        timestamp: '2026-05-26 10:15:23',
        user: 'Giám đốc Sáng tạo (Admin)',
        role: 'admin',
        action: 'Khởi tạo hệ thống',
        details: 'Khởi chạy bảng quản trị Camellia Trails'
      },
      {
        id: 'L-5002',
        timestamp: '2026-05-26 14:02:11',
        user: 'Giám đốc Sáng tạo (Admin)',
        role: 'admin',
        action: 'Thay đổi cấu hình',
        details: 'Bật chế độ đồng bộ dữ liệu ngoại tuyến'
      }
    ];
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing dashboard_notifications:', e);
    }
    return [
      {
        id: 'N-301',
        title: 'Chào mừng trở lại!',
        message: 'Hệ thống đã sẵn sàng. Bạn đang hoạt động dưới quyền Admin.',
        type: 'info',
        time: '5 phút trước',
        read: false
      },
      {
        id: 'N-302',
        title: 'Giao dịch thành công',
        message: 'Đơn đặt phòng B-9201 đã thanh toán thành công qua Stripe.',
        type: 'success',
        time: '30 phút trước',
        read: true
      }
    ];
  });

  // Transaction Ledger (Payments Module)
  const [transactions, setTransactions] = useState<{ id: string; date: string; amount: number; method: string; status: 'Completed' | 'Refunded'; customer: string }[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing dashboard_transactions:', e);
    }
    return [
      { id: 'TX-901', date: '2026-05-25', amount: 2500, method: 'Stripe (Visa)', status: 'Completed', customer: 'Aveline Moreau' },
      { id: 'TX-902', date: '2026-05-22', amount: 2450, method: 'Stripe (Mastercard)', status: 'Completed', customer: 'Aveline Moreau' },
      { id: 'TX-903', date: '2026-05-20', amount: 1420, method: 'PayPal', status: 'Completed', customer: 'Isabella Ross' }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dashboard_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('dashboard_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('dashboard_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('dashboard_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('dashboard_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Set Role & log it
  const setRole = (newRole: 'admin' | 'staff' | 'accountant') => {
    setRoleState(newRole);
    addLog('Thay đổi quyền truy cập', `Chuyển vai trò hoạt động sang: ${newRole}`);
  };

  // Log helper
  const addLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `L-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser?.name || 'Hệ thống',
      role: role,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Notification helper
  const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
    const newNotif: Notification = {
      id: `N-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      message,
      type,
      time: 'Vừa xong',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Real-time updates simulator (WebSocket simulation)
  const simulateRealTimeBooking = () => {
    const randomTour = tours[Math.floor(Math.random() * tours.length)];
    const guests = Math.floor(Math.random() * 3) + 1;
    const price = randomTour.price * guests;
    const guestNames = ['Minh Trí', 'Sarah Parker', 'Takahiro Sato', 'Emma Watson', 'Nguyễn Văn Nam'];
    const idx = Math.floor(Math.random() * guestNames.length);

    // Call addBooking from context
    const booking = addBooking({
      tourId: randomTour.id,
      tourTitle: randomTour.title,
      guests,
      totalPrice: price,
      date: randomTour.nextDates[0] || '2026-06-25'
    });

    // Add transaction
    addTransaction(price, 'Card / Online', guestNames[idx]);

    // Push live notification
    addNotification(
      'Đặt vé trực tuyến mới',
      `Khách hàng ${guestNames[idx]} vừa đặt ${randomTour.title} (${guests} vé) - $${price.toLocaleString()}`,
      'success'
    );

    // Add Audit Log
    addLog(
      'Vé đặt trực tuyến',
      `Giao dịch đặt chỗ ${booking.id} được tạo tự động bởi client socket`
    );
  };

  // WebSocket background tick (simulating incoming bookings every 45s)
  useEffect(() => {
    const interval = setInterval(() => {
      // 25% chance of automated booking every interval
      if (Math.random() > 0.6) {
        simulateRealTimeBooking();
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [tours]);

  // AI Recommendation simulation
  const triggerAIRecommendation = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return { price: 0, reason: '' };

    const averageRating = tour.rating || 5.0;
    const priceAdjust = averageRating > 4.9 ? tour.price * 1.15 : tour.price * 0.95;
    const roundedPrice = Math.round(priceAdjust / 10) * 10;
    const reason = averageRating > 4.9 
      ? `Nhu cầu cao & đánh giá xuất sắc (${averageRating}⭐). Gợi ý tăng giá 15% để tối ưu hóa lợi nhuận.`
      : `Đánh giá trung bình. Khuyến nghị giảm giá nhẹ 5% hoặc chạy chiến dịch flash sale để thúc đẩy lượt đặt.`;

    return { price: roundedPrice, reason };
  };

  // Room Booking Updater
  const updateRoomBooking = (roomId: string, bookingId: string, checkIn: string, checkOut: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const existIdx = r.bookings.findIndex(b => b.bookingId === bookingId);
        let newBookings = [...r.bookings];
        if (existIdx >= 0) {
          newBookings[existIdx] = { bookingId, checkIn, checkOut };
        } else {
          newBookings.push({ bookingId, checkIn, checkOut });
        }
        return {
          ...r,
          status: 'Occupied' as const,
          bookings: newBookings
        };
      }
      return r;
    }));
    addLog('Gán phòng nghỉ', `Gán phòng ${roomId} cho mã đặt chỗ ${bookingId}`);
  };

  // Tour Drag and Drop Date Shift
  const updateTourDrag = (bookingId: string, newDate: string) => {
    // Modify standard bookings array inside AppContext by triggering changes
    // Since AppContext bookings are updated via setBookings, we will modify in AppContext localStorage
    const savedBookingsStr = localStorage.getItem('tea_bookings');
    if (savedBookingsStr) {
      try {
        const bList = JSON.parse(savedBookingsStr) as Booking[];
        const updated = bList.map(b => b.id === bookingId ? { ...b, date: newDate } : b);
        localStorage.setItem('tea_bookings', JSON.stringify(updated));
        // Force refresh by reloading window or dispatching event
        // But for visual update, we will also add audit log
        addLog('Dời ngày dã ngoại', `Dời mã đặt đơn ${bookingId} sang ngày mới: ${newDate} via Drag-and-Drop`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Staff Attendance Tracker
  const staffCheckIn = (staffId: string) => {
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];

    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        const attendIndex = s.attendance.findIndex(a => a.date === today);
        let newAttend = [...s.attendance];
        if (attendIndex >= 0) {
          newAttend[attendIndex] = { ...newAttend[attendIndex], checkIn: timeNow };
        } else {
          newAttend.push({ checkIn: timeNow, checkOut: null, date: today });
        }
        return { ...s, attendance: newAttend };
      }
      return s;
    }));

    const staff = staffList.find(s => s.id === staffId);
    addLog('Điểm danh vào ca', `Nhân viên ${staff?.name} check-in lúc ${timeNow}`);
    addNotification('Điểm danh nhân viên', `${staff?.name} đã vào ca làm việc.`, 'info');
  };

  const staffCheckOut = (staffId: string) => {
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];

    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        const attendIndex = s.attendance.findIndex(a => a.date === today);
        let newAttend = [...s.attendance];
        if (attendIndex >= 0) {
          newAttend[attendIndex] = { ...newAttend[attendIndex], checkOut: timeNow };
        } else {
          newAttend.push({ checkIn: null, checkOut: timeNow, date: today });
        }
        return { ...s, attendance: newAttend };
      }
      return s;
    }));

    const staff = staffList.find(s => s.id === staffId);
    addLog('Điểm danh tan ca', `Nhân viên ${staff?.name} check-out lúc ${timeNow}`);
    addNotification('Điểm danh nhân viên', `${staff?.name} đã tan ca làm việc.`, 'info');
  };

  // Transactions ledger actions
  const addTransaction = (amount: number, method: string, customer: string) => {
    const newTx = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      method,
      status: 'Completed' as const,
      customer
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const refundTransaction = (id: string) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: 'Refunded' as const } : tx));
    const tx = transactions.find(t => t.id === id);
    addLog('Hoàn tiền khách hàng', `Hoàn trả số tiền $${tx?.amount} cho hóa đơn ${id}`);
    addNotification('Hoàn tiền thành công', `Hóa đơn thanh toán ${id} đã được hoàn tiền thành công.`, 'warning');
  };

  return (
    <DashboardContext.Provider
      value={{
        role,
        setRole,
        lang,
        setLang,
        t,
        staffList,
        setStaffList,
        rooms,
        setRooms,
        auditLogs,
        addLog,
        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
        simulateRealTimeBooking,
        triggerAIRecommendation,
        updateRoomBooking,
        updateTourDrag,
        staffCheckIn,
        staffCheckOut,
        transactions,
        addTransaction,
        refundTransaction,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
