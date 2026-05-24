import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Mail, Lock, User, Shield, Key } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, currentUser } = useApp();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate('/profile');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isRegister) {
      if (!name) return;
      register(name, email);
      alert(`Chào mừng ${name}! Hồ sơ lữ khách của bạn đã được tạo.`);
    } else {
      login(email);
    }
    navigate('/profile');
  };

  const handleQuickLogin = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      login('admin@tea.com');
    } else {
      login('traveler@tea.com');
    }
    navigate('/profile');
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F5EC] to-[#EBEBE0] dark:from-[#071913] dark:to-[#0A241C] relative overflow-hidden transition-colors duration-500">
      
      {/* Decorative floating leaves */}
      <div className="absolute top-1/4 left-1/10 w-8 h-8 rounded-full bg-secondary/10 animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-12 h-12 rounded-full bg-accent/5 animate-float-medium pointer-events-none" />

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="glass p-8 rounded-3xl border border-primary/10 shadow-2xl space-y-8">
          
          {/* Brand Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 shadow-md">
              <Leaf className="text-secondary w-6 h-6 animate-leaf-sway" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">
              {isRegister ? 'Tham Gia Camellia Trails' : 'Chào Mừng Trở Lại'}
            </h2>
            <p className="text-xs font-light text-primary/60 dark:text-cream/60 mt-1.5">
              {isRegister ? 'Bắt đầu hành trình du lịch xanh của bạn.' : 'Truy cập vé điện tử & lịch trình chuyến đi.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-1.5">
                  Họ và tên
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                  />
                  <User className="absolute left-3.5 w-4 h-4 text-primary/45 dark:text-cream/45" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-1.5">
                Địa Chỉ Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                />
                <Mail className="absolute left-3.5 w-4 h-4 text-primary/45 dark:text-cream/45" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary/75 dark:text-cream/75 uppercase mb-1.5">
                Mật Khẩu Bảo Mật
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream/40 dark:bg-dark-surface/40 border border-primary/10 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream"
                />
                <Lock className="absolute left-3.5 w-4 h-4 text-primary/45 dark:text-cream/45" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer mt-2"
            >
              {isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
            </button>
          </form>

          {/* Quick-Demo logins */}
          {!isRegister && (
            <div className="pt-4 border-t border-primary/5 space-y-3">
              <span className="block text-center text-[9px] uppercase tracking-widest text-primary/40 dark:text-cream/40 font-bold">
                Đăng nhập nhanh (Bản thử nghiệm)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-accent/25 hover:bg-accent/35 text-primary dark:text-accent border border-accent/20 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Demo</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('user')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary/5 dark:bg-cream/5 hover:bg-primary/10 text-primary dark:text-cream border border-primary/10 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-accent" />
                  <span>Khách Demo</span>
                </button>
              </div>
            </div>
          )}

          {/* Switch tab */}
          <div className="text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-primary/60 dark:text-cream/60 hover:text-accent font-semibold underline cursor-pointer"
            >
              {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
