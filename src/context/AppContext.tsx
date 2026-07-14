import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Tour } from '../data/mockData';
import { mockTours, mockBookings } from '../data/mockData';
import { api } from '../services/apiClient';

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

// Helper: map backend tour row → frontend Tour shape
function mapApiTour(t: any): Tour {
  const mock = mockTours.find(m => m.id === t.id);
  if (mock) return mock; // prefer mock for rich data (images, reviews, etc.)

  // Parse images field - backend stores as JSON string or single URL
  let images: string[] = [];
  if (t.images) {
    try { images = JSON.parse(t.images); } catch { images = [t.images]; }
  } else if (t.image) {
    images = [t.image];
  }

  // Parse next_dates field
  let nextDates: string[] = [];
  if (t.next_dates) {
    try { nextDates = JSON.parse(t.next_dates); } catch { nextDates = []; }
  }

  return {
    id: t.id,
    title: t.title || '',
    subtitle: t.subtitle || '',
    description: t.description || '',
    location: t.location || t.destination || '',
    country: t.country || '',
    duration: Number(t.duration) || 1,
    price: Number(t.price) || 0,
    rating: parseFloat(t.rating) || 5.0,
    category: (t.category as Tour['category']) || 'Eco-Tourism',
    images,
    difficulty: (t.difficulty as Tour['difficulty']) || 'Moderate',
    groupSize: Number(t.max_guests || t.groupSize) || 10,
    nextDates,
    highlights: t.highlights ? (Array.isArray(t.highlights) ? t.highlights : [t.highlights]) : [],
    itinerary: [],
    guide: { name: '', role: '', avatar: '', bio: '' },
    reviews: [],
    featured: t.featured === 1 || t.featured === true,
  };
}

// Helper: map backend booking row → Booking shape
function mapApiBooking(b: any): Booking {
  return {
    id: b.id,
    tourId: b.tour_id,
    tourTitle: b.tour_title,
    date: b.date,
    guests: b.guests,
    totalPrice: b.total_price,
    status: b.status,
    userEmail: b.user_email,
    userName: b.user_name,
    bookedAt: b.booked_at,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('tea_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.email) return parsed;
      }
    } catch (e) { /* ignore */ }
    return {
      name: 'Aveline Moreau',
      email: 'traveler@tea.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    };
  });

  const [tours, setTours] = useState<Tour[]>(() => {
    try {
      const saved = localStorage.getItem('tea_tours');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(t => {
            const mock = mockTours.find(mt => mt.id === t.id);
            return mock ? { ...mock } : t;
          });
        }
      }
    } catch (e) { /* ignore */ }
    return mockTours;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('tea_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* ignore */ }
    return mockBookings;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tea_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* ignore */ }
    return ['sapa-emerald-terraces'];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('tea_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { /* ignore */ }
    return 'light';
  });

  // ---- Fetch tours & bookings from backend on mount ----
  useEffect(() => {
    api.getTours()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTours(data.map(mapApiTour));
        }
      })
      .catch(() => {/* backend offline – keep localStorage/mock data */});
  }, []);

  useEffect(() => {
    api.getBookings()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data.map(mapApiBooking));
        }
      })
      .catch(() => {/* backend offline – keep localStorage/mock data */});
  }, []);

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

    // Sync to backend (fire-and-forget)
    api.createBooking({
      id: newBooking.id,
      tour_id: newBooking.tourId,
      tour_title: newBooking.tourTitle,
      date: newBooking.date,
      guests: newBooking.guests,
      total_price: newBooking.totalPrice,
      status: newBooking.status,
      user_email: newBooking.userEmail,
      user_name: newBooking.userName,
      booked_at: newBooking.bookedAt,
    }).catch(() => {/* backend offline */});

    return newBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Đã hủy' } : b))
    );
    api.cancelBooking(id).catch(() => {/* backend offline */});
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

    api.createTour({
      id: newTour.id,
      title: newTour.title,
      destination: newTour.destination,
      duration: newTour.duration,
      price: newTour.price,
      category: newTour.category,
      rating: newTour.rating,
      description: newTour.description,
      image: newTour.image,
      max_guests: (newTour as any).maxGuests || 10,
      featured: false,
    }).catch(() => {/* backend offline */});
  };

  const deleteTour = (id: string) => {
    setTours(prev => prev.filter(t => t.id !== id));
    api.deleteTour(id).catch(() => {/* backend offline */});
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
