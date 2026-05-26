import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Calendar, Heart, Sparkles } from 'lucide-react';

interface MockCustomer {
  email: string;
  name: string;
  avatar: string;
  joinDate: string;
  spendingTier: 'Cao' | 'Trung bình' | 'Thấp';
  favCategory: 'Wellness' | 'Eco-Tourism' | 'Tea Ceremony' | 'Adventure';
  clicksHistory: { destination: string; count: number }[];
}

export const CustomerTab: React.FC = () => {
  const { bookings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Derived customers list from bookings + some initial mock details
  const mockCustomers: MockCustomer[] = [
    {
      email: 'traveler@tea.com',
      name: 'Aveline Moreau',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      joinDate: '2026-01-10',
      spendingTier: 'Cao',
      favCategory: 'Wellness',
      clicksHistory: [
        { destination: 'Shizuoka', count: 5 },
        { destination: 'Sapa', count: 3 }
      ]
    },
    {
      email: 'isabella@gmail.com',
      name: 'Isabella Ross',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=100&q=80',
      joinDate: '2026-03-15',
      spendingTier: 'Trung bình',
      favCategory: 'Tea Ceremony',
      clicksHistory: [
        { destination: 'Munnar', count: 4 },
        { destination: 'Darjeeling', count: 2 }
      ]
    },
    {
      email: 'tuanminh@gmail.com',
      name: 'Nguyễn Minh Tuấn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      joinDate: '2026-02-18',
      spendingTier: 'Cao',
      favCategory: 'Eco-Tourism',
      clicksHistory: [
        { destination: 'Sapa', count: 8 }
      ]
    },
    {
      email: 'yuki.tanaka@yahoo.co.jp',
      name: 'Yuki Tanaka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      joinDate: '2026-04-01',
      spendingTier: 'Cao',
      favCategory: 'Tea Ceremony',
      clicksHistory: [
        { destination: 'Shizuoka', count: 12 }
      ]
    }
  ];

  // Get dynamic bookings count for a customer email
  const getCustomerBookingsCount = (email: string) => {
    return bookings.filter(b => b.userEmail === email).length;
  };

  const getCustomerTotalSpend = (email: string) => {
    return bookings
      .filter(b => b.userEmail === email && (b.status === 'Confirmed' || b.status === 'Đã xác nhận'))
      .reduce((sum, b) => sum + b.totalPrice, 0);
  };

  const filteredCustomers = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Hồ Sơ Du Khách & CRM</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Theo dõi thông tin, hành vi tìm kiếm (Behavior Tracking) và lịch sử tham gia của khách hàng.</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Tìm khách hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold"
        />
      </div>

      {/* CRM Customer Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map(customer => {
          const spend = getCustomerTotalSpend(customer.email);
          const activeBookingsCount = getCustomerBookingsCount(customer.email);

          return (
            <div
              key={customer.email}
              className="glass-card rounded-3xl p-6 border border-primary/10 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-primary/10 flex-shrink-0"
                />
                
                <div className="space-y-1.5 overflow-hidden flex-grow">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-primary dark:text-cream leading-tight">
                      {customer.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      customer.spendingTier === 'Cao' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      Mức chi: {customer.spendingTier}
                    </span>
                  </div>

                  <p className="text-[10px] text-primary/50 dark:text-cream/50 flex items-center gap-1 font-mono truncate">
                    <Mail className="w-3.5 h-3.5" /> {customer.email}
                  </p>
                  
                  <p className="text-[9px] text-primary/45 dark:text-cream/45 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-accent" /> Thành viên từ: {customer.joinDate}
                  </p>
                </div>
              </div>

              {/* Behavior Tracking Widget */}
              <div className="mt-5 p-4 rounded-2xl bg-cream/35 dark:bg-dark-surface/35 border border-primary/5 space-y-3">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-accent font-bold">
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Phân tích hành vi (AI Tracker)</span>
                  <span className="flex items-center gap-1 font-sans text-primary/55 dark:text-cream/55"><Heart className="w-3 h-3 fill-current" /> Thích: {customer.favCategory}</span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] text-primary/70 dark:text-cream/70 font-semibold">Tương tác đồi chè:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {customer.clicksHistory.map((click, i) => (
                      <div key={i} className="flex justify-between items-center text-[9px] bg-primary/5 p-1.5 rounded-lg text-primary/85 dark:text-cream/85">
                        <span className="font-bold">{click.destination}</span>
                        <span className="font-mono text-accent font-bold">Xem: {click.count} lần</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics summaries */}
              <div className="mt-5 pt-3 border-t border-primary/5 grid grid-cols-2 gap-4 text-center">
                <div className="p-2 rounded-xl bg-primary/5">
                  <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Đặt chỗ tích cực</span>
                  <span className="font-serif text-sm font-bold text-primary dark:text-cream font-mono">{activeBookingsCount} đơn</span>
                </div>
                <div className="p-2 rounded-xl bg-accent/10">
                  <span className="block text-[8px] uppercase tracking-wider text-primary/45 dark:text-cream/45 mb-0.5">Tổng chi tiêu</span>
                  <span className="font-serif text-sm font-bold text-accent font-mono">${spend.toLocaleString()}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
