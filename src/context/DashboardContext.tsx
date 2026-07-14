import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import type { Booking } from './AppContext';
import { api } from '../services/apiClient';

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
    invoices: 'Xuất hóa đơn điện tử',
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
    invoices: 'vInvoice Invoices',
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
    invoices: 'vInvoice 請求書',
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

  // Staff — loaded from backend
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Rooms — loaded from backend
  const [rooms, setRooms] = useState<Room[]>([]);

  // Audit Logs — loaded from backend
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
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

  // Transaction Ledger — loaded from backend
  const [transactions, setTransactions] = useState<{ id: string; date: string; amount: number; method: string; status: 'Completed' | 'Refunded'; customer: string }[]>([]);

  // ---- Fetch all dashboard data from backend on mount ----
  useEffect(() => {
    api.getStaff()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStaffList(data.map((s: any) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            role: s.role,
            avatar: s.avatar,
            status: s.status,
            attendance: s.checked_in_at
              ? [{ checkIn: s.checked_in_at, checkOut: s.checked_out_at, date: new Date().toISOString().split('T')[0] }]
              : [],
            schedule: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: 'Day Off', sunday: 'Day Off' },
          })));
        }
      })
      .catch(() => {/* backend offline */});
  }, []);

  useEffect(() => {
    api.getRooms()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRooms(data.map((r: any) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            capacity: 2,
            pricePerNight: r.price,
            status: r.status,
            location: r.name,
            bookings: r.current_booking ? JSON.parse(r.current_booking) : [],
          })));
        }
      })
      .catch(() => {/* backend offline */});
  }, []);

  useEffect(() => {
    api.getAuditLogs()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAuditLogs(data.map((l: any) => ({
            id: l.id,
            timestamp: l.timestamp,
            user: l.user,
            role: l.role,
            action: l.action,
            details: l.details,
          })));
        }
      })
      .catch(() => {/* backend offline */});
  }, []);

  useEffect(() => {
    api.getTransactions()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data.map((t: any) => ({
            id: t.id,
            date: t.date,
            amount: t.amount,
            method: t.method,
            status: t.status as 'Completed' | 'Refunded',
            customer: t.customer,
          })));
        }
      })
      .catch(() => {/* backend offline */});
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard_notifications', JSON.stringify(notifications));
  }, [notifications]);

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
    // Sync to backend
    api.createLog({
      id: newLog.id,
      timestamp: newLog.timestamp,
      user: newLog.user,
      role: newLog.role,
      action: newLog.action,
      details: newLog.details,
    }).catch(() => {/* backend offline */});
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
    // Sync to backend
    api.createTransaction(newTx).catch(() => {/* backend offline */});
  };

  const refundTransaction = (id: string) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: 'Refunded' as const } : tx));
    const tx = transactions.find(t => t.id === id);
    addLog('Hoàn tiền khách hàng', `Hoàn trả số tiền $${tx?.amount} cho hóa đơn ${id}`);
    addNotification('Hoàn tiền thành công', `Hóa đơn thanh toán ${id} đã được hoàn tiền thành công.`, 'warning');
    // Sync to backend
    api.refundTransaction(id).catch(() => {/* backend offline */});
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
