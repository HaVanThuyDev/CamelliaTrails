import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Tour } from '../data/mockData';
import { mockTours, mockBookings } from '../data/mockData';

export interface User {
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  date: string;
  guests: number;
  totalPrice: number;
  status: string;
  userEmail: string;
  userName: string;
  bookedAt: string;
}

interface AppContextType {
  currentUser: User | null;
  tours: Tour[];
  bookings: Booking[];
  wishlist: string[];
  theme: 'light' | 'dark';
  login: (email: string, role?: 'user' | 'admin') => boolean;
  register: (name: string, email: string) => boolean;
  logout: () => void;
  toggleTheme: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'bookedAt' | 'status' | 'userEmail' | 'userName'>) => Booking;
  cancelBooking: (id: string) => void;
  addTour: (tour: Omit<Tour, 'id' | 'rating' | 'reviews' | 'featured'>) => void;
  deleteTour: (id: string) => void;
  toggleWishlist: (tourId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tea_user');
    return saved ? JSON.parse(saved) : {
      name: 'Aveline Moreau',
      email: 'traveler@tea.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    };
  });

  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('tea_tours');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Tour[];
        // Đồng bộ hóa các tour mặc định với dữ liệu mock mới nhất (để áp dụng featured: true, cập nhật ảnh...)
        return parsed.map(t => {
          const mock = mockTours.find(mt => mt.id === t.id);
          if (mock) {
            return { ...mock };
          }
          return t;
        });
      } catch (e) {
        return mockTours;
      }
    }
    return mockTours;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('tea_bookings');
    return saved ? JSON.parse(saved) : mockBookings;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('tea_wishlist');
    return saved ? JSON.parse(saved) : ['sapa-emerald-terraces'];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tea_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Apply theme class to body
  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('tea_theme', theme);
  }, [theme]);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('tea_tours', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('tea_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('tea_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const login = (email: string, forcedRole?: 'user' | 'admin') => {
    let name = 'Nhà thám hiểm';
    let role: 'user' | 'admin' = 'user';
    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80';

    if (email === 'admin@tea.com' || forcedRole === 'admin') {
      name = 'Giám đốc Sáng tạo (Admin)';
      role = 'admin';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80';
    } else if (email === 'traveler@tea.com') {
      name = 'Aveline Moreau';
      role = 'user';
      avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80';
    } else {
      name = email.split('@')[0];
    }

    const newUser: User = { name, email, role, avatar };
    setCurrentUser(newUser);
    localStorage.setItem('tea_user', JSON.stringify(newUser));
    return true;
  };

  const register = (name: string, email: string) => {
    const role: 'user' | 'admin' = email.includes('admin') ? 'admin' : 'user';
    const newUser: User = {
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    };
    setCurrentUser(newUser);
    localStorage.setItem('tea_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tea_user');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookedAt' | 'status' | 'userEmail' | 'userName'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Đã xác nhận',
      userEmail: currentUser?.email || 'guest@tea.com',
      userName: currentUser?.name || 'Khách vãng lai',
      bookedAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Đã hủy' } : b))
    );
  };

  const addTour = (tourData: Omit<Tour, 'id' | 'rating' | 'reviews' | 'featured'>) => {
    const newTour: Tour = {
      ...tourData,
      id: tourData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviews: [],
      featured: false
    };
    setTours(prev => [newTour, ...prev]);
  };

  const deleteTour = (id: string) => {
    setTours(prev => prev.filter(t => t.id !== id));
  };

  const toggleWishlist = (tourId: string) => {
    setWishlist(prev =>
      prev.includes(tourId) ? prev.filter(id => id !== tourId) : [...prev, tourId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        tours,
        bookings,
        wishlist,
        theme,
        login,
        register,
        logout,
        toggleTheme,
        addBooking,
        cancelBooking,
        addTour,
        deleteTour,
        toggleWishlist
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
