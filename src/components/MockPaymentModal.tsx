import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  tourPrice: number;
  selectedDate: string;
  guestsCount: number;
  onPaymentSuccess: (bookingId: string) => void;
}

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({
  isOpen,
  onClose,
  tourTitle,
  tourPrice,
  selectedDate,
  guestsCount,
  onPaymentSuccess
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [mockId, setMockId] = useState('');

  if (!isOpen) return null;

  const totalPrice = tourPrice * guestsCount;
  const serviceFee = Math.round(totalPrice * 0.05);
  const finalAmount = totalPrice + serviceFee;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(val);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) return;
    setCardCvv(val);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 19 || !cardName || cardExpiry.length < 5 || cardCvv.length < 3) {
      alert('Vui lòng điền đầy đủ và chính xác thông tin thẻ.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      const transactionId = `B-${Math.floor(1000 + Math.random() * 9000)}`;
      setMockId(transactionId);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0F3D2E', '#A7D7A9', '#D4AF37', '#F5F5EC']
      });

    }, 2500);
  };

  const handleDone = () => {
    onPaymentSuccess(mockId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="relative w-full max-w-4xl rounded-3xl glass shadow-2xl border border-primary/10 overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
        
        {/* Left Side: Summary */}
        <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-primary/10 overflow-y-auto">
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-1.5 rounded-full hover:bg-primary/10 text-primary dark:text-cream cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="font-serif text-2xl font-bold mb-6 text-primary dark:text-cream">
            Thanh Toán Đặt Chỗ
          </h2>

          <div className="flex flex-col gap-4 text-sm mb-6">
            <div className="p-4 rounded-2xl bg-primary/5 dark:bg-cream/5 border border-primary/5">
              <span className="text-xs uppercase tracking-wider text-primary/60 dark:text-cream/60">Tour Đã Chọn</span>
              <p className="font-serif font-bold text-base text-primary dark:text-cream mt-0.5">{tourTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-primary/5 dark:bg-cream/5 border border-primary/5">
                <span className="text-xs uppercase tracking-wider text-primary/60 dark:text-cream/60 font-medium">Khởi Hành</span>
                <p className="font-semibold text-primary dark:text-cream mt-0.5">{selectedDate}</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/5 dark:bg-cream/5 border border-primary/5">
                <span className="text-xs uppercase tracking-wider text-primary/60 dark:text-cream/60 font-medium">Số Khách</span>
                <p className="font-semibold text-primary dark:text-cream mt-0.5">{guestsCount} Khách</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-primary/5 dark:border-cream/5 text-sm">
            <div className="flex justify-between text-primary/80 dark:text-cream/80">
              <span>Giá Tour Cơ Bản (${tourPrice} × {guestsCount})</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-primary/80 dark:text-cream/80">
              <span>Phí Bảo Tồn Sinh Thái (5%)</span>
              <span>${serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-primary dark:text-cream pt-3 border-t border-primary/5">
              <span>Tổng Số Tiền</span>
              <span className="text-accent">${finalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full md:w-1/2 p-8 bg-cream/40 dark:bg-dark-surface/40 flex flex-col justify-center overflow-y-auto">
          {step === 'checkout' ? (
            <form onSubmit={handlePay} className="flex flex-col gap-6">
              <div className="hidden md:flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-xs text-primary/75 dark:text-cream/75">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Mã hóa bảo mật SSL 256-bit</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-primary/10 dark:hover:bg-cream/10 text-primary dark:text-cream cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3D Card Visual */}
              <div className="perspective-1000 w-full h-48 mx-auto max-w-[320px] mb-2 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#1b5c46] p-6 text-cream flex flex-col justify-between backface-hidden shadow-xl border border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-6 bg-secondary/80 rounded-sm" />
                        <div className="w-3.5 h-6 bg-accent/80 rounded-sm -ml-1.5" />
                      </div>
                      <CreditCard className="w-8 h-8 text-cream/30" />
                    </div>

                    <div className="w-10 h-7 bg-amber-200/80 rounded-md border border-amber-300 -mt-2" />

                    <div>
                      <p className="font-mono text-base tracking-widest leading-none">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider opacity-60">CHỦ THẺ</span>
                          <p className="text-xs uppercase tracking-wide truncate max-w-[170px] font-semibold">
                            {cardName || 'HỌ VÀ TÊN'}
                          </p>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider opacity-60">HẠN THẺ</span>
                          <p className="text-xs font-mono font-semibold">{cardExpiry || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#1b5c46] text-cream flex flex-col justify-between backface-hidden rotate-y-180 shadow-xl border border-white/10 py-6">
                    <div className="w-full h-10 bg-black mt-2" />
                    <div className="px-6 flex items-center gap-4">
                      <div className="bg-white/80 h-8 flex-grow rounded-sm px-2 text-primary font-mono italic text-sm text-right flex items-center justify-end pr-3">
                        •••• ••••
                      </div>
                      <div className="bg-accent text-primary h-8 w-12 rounded-sm flex items-center justify-center font-mono font-bold text-sm shadow-md">
                        {cardCvv || '•••'}
                      </div>
                    </div>
                    <p className="text-[7px] text-cream/40 px-6 leading-tight italic">
                      Dải chữ ký xác thực bảo mật. Các thông tin thẻ giả lập được mã hóa an toàn trên hệ thống.
                    </p>
                  </div>

                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary/75 dark:text-cream/75 mb-1.5">
                    Tên Trên Thẻ
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="NHAP HO VA TEN"
                    className="w-full bg-cream dark:bg-dark-surface border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-primary dark:text-cream"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary/75 dark:text-cream/75 mb-1.5">
                    Số Thẻ Tín Dụng
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-cream dark:bg-dark-surface border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-primary dark:text-cream font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary/75 dark:text-cream/75 mb-1.5">
                      Ngày Hết Hạn
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setIsFlipped(false)}
                      placeholder="MM/YY"
                      className="w-full bg-cream dark:bg-dark-surface border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-primary dark:text-cream font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary/75 dark:text-cream/75 mb-1.5 flex items-center gap-1 justify-center">
                      <span>Mã CVV</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={handleCvvChange}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      placeholder="•••"
                      className="w-full bg-cream dark:bg-dark-surface border border-primary/10 dark:border-cream/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-primary dark:text-cream font-mono text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cream dark:border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Đang Xác Thực Giao Dịch...</span>
                  </>
                ) : (
                  <>
                    <span>Xác Nhận & Thanh Toán ${finalAmount.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SUCCESS PANEL */
            <div className="flex flex-col items-center justify-center text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary dark:text-cream mb-2">
                Đặt Tour Thành Công!
              </h3>
              <p className="text-sm text-primary/70 dark:text-cream/70 max-w-sm mb-6 leading-relaxed">
                Giao dịch thanh toán đã được xử lý thành công. Email xác nhận kèm theo vé điện tử du lịch sinh thái đã được gửi tới hòm thư của bạn.
              </p>

              <div className="w-full max-w-xs p-4 bg-primary/5 dark:bg-cream/5 border border-primary/5 rounded-2xl mb-8 flex justify-between text-xs font-semibold text-primary dark:text-cream font-mono">
                <span className="opacity-60">Mã Giao Dịch:</span>
                <span className="text-accent">{mockId}</span>
              </div>

              <button
                onClick={handleDone}
                className="px-8 py-3 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-sm hover:scale-105 active:scale-98 transition-all shadow-md cursor-pointer"
              >
                Đến Trang Cá Nhân
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
