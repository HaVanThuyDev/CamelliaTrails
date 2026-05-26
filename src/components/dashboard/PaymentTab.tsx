import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { CreditCard, DollarSign, RotateCcw, Receipt, CheckCircle } from 'lucide-react';

export const PaymentTab: React.FC = () => {
  const { transactions, addTransaction, refundTransaction, role } = useDashboard();

  // Cashier form states
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState('Tiền mặt (Cash)');

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || amount <= 0) {
      alert('Vui lòng nhập tên khách hàng và số tiền giao dịch hợp lệ.');
      return;
    }

    addTransaction(amount, method, customer);
    alert(`Thanh toán thành công! Đã ghi nhận hóa đơn trị giá $${amount} từ ${customer}`);
    setCustomer('');
    setAmount(0);
  };

  const handleRefund = (txId: string) => {
    if (role === 'staff') {
      alert('Nhân viên lễ tân không có quyền hoàn trả giao dịch. Vui lòng liên hệ Kế toán hoặc Admin.');
      return;
    }

    if (window.confirm(`Xác nhận hoàn tiền cho mã hóa đơn ${txId}?`)) {
      refundTransaction(txId);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
      
      {/* Transaction List (Left 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Nhật Ký Giao Dịch & Sổ Cái</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Theo dõi toàn bộ lịch sử thanh toán, nguồn tiền và quản lý quy trình hoàn chi phí.</p>
        </div>

        {/* Ledger Table */}
        <div className="glass rounded-3xl overflow-hidden border border-primary/10 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-primary dark:text-cream border-collapse">
              <thead className="bg-[#EBEBE0]/60 dark:bg-dark-surface/60 text-primary/60 dark:text-cream/60 uppercase border-b border-primary/10">
                <tr>
                  <th className="p-4 md:p-6">Mã giao dịch</th>
                  <th className="p-4 md:p-6">Khách hàng</th>
                  <th className="p-4 md:p-6">Ngày thanh toán</th>
                  <th className="p-4 md:p-6">Cổng thanh toán</th>
                  <th className="p-4 md:p-6 text-right">Tổng phí</th>
                  <th className="p-4 md:p-6 text-center">Trạng thái</th>
                  <th className="p-4 md:p-6 text-right">Hoàn trả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 dark:divide-cream/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-primary/5 dark:hover:bg-cream/5 transition-colors">
                    <td className="p-4 md:p-6 font-mono font-bold text-primary/80 dark:text-cream/80">{tx.id}</td>
                    <td className="p-4 md:p-6">{tx.customer}</td>
                    <td className="p-4 md:p-6 font-mono text-primary/55 dark:text-cream/55">{tx.date}</td>
                    <td className="p-4 md:p-6 font-semibold text-[10px] uppercase text-primary/65 dark:text-cream/65">{tx.method}</td>
                    <td className="p-4 md:p-6 text-right font-serif font-bold text-accent font-mono">${tx.amount.toLocaleString()}</td>
                    <td className="p-4 md:p-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                      }`}>
                        {tx.status === 'Completed' ? 'Thành công' : 'Đã hoàn tiền'}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-right">
                      {tx.status === 'Completed' && (
                        <button
                          onClick={() => handleRefund(tx.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer"
                          title="Hoàn tiền giao dịch"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cashier Register Checkout Panel (Right 1 column) */}
      <div className="glass p-6 rounded-3xl border border-primary/10 flex flex-col justify-between self-start shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-accent/5 rounded-full blur-[40px]" />
        
        <form onSubmit={handleCheckout} className="space-y-5">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Receipt className="w-5 h-5" />
            <h3 className="font-serif text-lg font-bold text-primary dark:text-cream">Quầy Thu Ngân Trực Tiếp</h3>
          </div>
          
          <p className="text-[10px] text-primary/60 dark:text-cream/60 leading-relaxed">
            Sử dụng khi khách hàng thanh toán tại quầy lễ tân chi nhánh Sapa/Shizuoka bằng thẻ vật lý hoặc tiền mặt.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Tên Khách Hàng *</label>
              <input
                type="text"
                required
                placeholder="Nhập tên người mua..."
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Số tiền thanh toán (USD) *</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  required
                  min="5"
                  max="10000"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 pl-9 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream font-mono font-bold"
                />
                <DollarSign className="absolute left-3.5 w-4 h-4 text-accent" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/75 dark:text-cream/75 mb-1.5">Phương thức thanh toán</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-cream/35 dark:bg-dark-surface/35 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent text-primary dark:text-cream cursor-pointer font-semibold"
              >
                <option value="Tiền mặt (Cash)">Tiền mặt (Cash)</option>
                <option value="Visa/Mastercard">Visa/Mastercard</option>
                <option value="Chuyển khoản (Bank Transfer)">Chuyển khoản (Bank Transfer)</option>
                <option value="PayPal">PayPal Portal</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>XUẤT HÓA ĐƠN GIAO DỊCH</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-primary/5 text-center flex items-center justify-center gap-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 py-2 rounded-xl">
          <CheckCircle className="w-4 h-4" /> Báo cáo doanh thu đã đồng bộ
        </div>
      </div>

    </div>
  );
};
