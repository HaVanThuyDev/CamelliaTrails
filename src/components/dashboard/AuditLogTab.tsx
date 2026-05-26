import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ShieldCheck, Clock, Filter } from 'lucide-react';

export const AuditLogTab: React.FC = () => {
  const { auditLogs } = useDashboard();
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'staff' | 'accountant'>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (roleFilter === 'all') return true;
    return log.role === roleFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Sổ Nhật Ký Bảo Mật & Đánh Giá</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Danh sách ghi nhận tất cả hành động cấu hình, điểm danh, thanh toán và kiểm duyệt của nhân viên.</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 bg-cream/40 dark:bg-dark-surface/40 px-3.5 py-1.5 rounded-xl border border-primary/5">
          <Filter className="w-3.5 h-3.5 text-accent" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-transparent text-xs font-semibold focus:outline-none text-primary dark:text-cream cursor-pointer"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên (Admin)</option>
            <option value="staff">Nhân viên lễ tân</option>
            <option value="accountant">Kế toán</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass rounded-3xl overflow-hidden border border-primary/10 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-primary dark:text-cream border-collapse">
            <thead className="bg-[#EBEBE0]/60 dark:bg-dark-surface/60 text-primary/60 dark:text-cream/60 uppercase border-b border-primary/10">
              <tr>
                <th className="p-4 md:p-6">Thời gian</th>
                <th className="p-4 md:p-6">Mã nhật ký</th>
                <th className="p-4 md:p-6">Tài khoản</th>
                <th className="p-4 md:p-6">Quyền hạn</th>
                <th className="p-4 md:p-6">Hành động</th>
                <th className="p-4 md:p-6">Chi tiết thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5 dark:divide-cream/5 font-sans">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary/5 dark:hover:bg-cream/5 transition-colors">
                    <td className="p-4 md:p-6 font-mono text-[10px] text-primary/55 dark:text-cream/55 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-accent" /> {log.timestamp}
                    </td>
                    <td className="p-4 md:p-6 font-mono text-primary/60 dark:text-cream/60">{log.id}</td>
                    <td className="p-4 md:p-6">{log.user}</td>
                    <td className="p-4 md:p-6">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        log.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300' :
                        log.role === 'accountant' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 font-bold text-primary dark:text-cream">{log.action}</td>
                    <td className="p-4 md:p-6 text-primary/70 dark:text-cream/70 font-light text-[11px]">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-primary/50 dark:text-cream/50">
                    Không tìm thấy bản ghi nhật ký nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bottom Alert System status */}
      <div className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
        <ShieldCheck className="w-4.5 h-4.5" />
        <span>Tất cả ghi nhận bảo mật đều được băm bảo mật và đồng bộ ngoại tuyến vào localStorage.</span>
      </div>

    </div>
  );
};
