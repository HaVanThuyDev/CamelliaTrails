import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useApp } from '../../context/AppContext';
import { useDashboard } from '../../context/DashboardContext';
import { Download, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { bookings, theme } = useApp();
  const { addLog } = useDashboard();
  const [isExporting, setIsExporting] = useState(false);
  const isDark = theme === 'dark';

  // Theme-based colors
  const textColor = isDark ? '#e2f0eb' : '#0F3D2E';
  const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 61, 46, 0.08)';
  const tooltipBgColor = isDark ? '#0c271e' : '#F5F5EC';
  const tooltipTextColor = isDark ? '#e2f0eb' : '#0F3D2E';
  const tooltipBorderColor = isDark ? '#D4AF37' : '#0F3D2E';

  // Highcharts Config for Revenue Forecast Model
  const forecastOptions: Highcharts.Options = {
    chart: {
      type: 'areaspline',
      backgroundColor: 'transparent',
      height: 220,
      spacingBottom: 5,
      spacingTop: 5,
      spacingLeft: 0,
      spacingRight: 0,
      style: {
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }
    },
    title: {
      text: undefined
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6 (Dự báo)', 'T7 (Dự báo)'],
      labels: {
        style: {
          color: textColor,
          fontSize: '10px',
          fontWeight: '600'
        }
      },
      lineColor: gridLineColor,
      tickColor: gridLineColor
    },
    yAxis: {
      title: {
        text: undefined
      },
      labels: {
        style: {
          color: textColor,
          fontSize: '9px',
          fontWeight: '600'
        },
        formatter: function () {
          return '$' + this.value.toLocaleString();
        }
      },
      gridLineColor: gridLineColor
    },
    tooltip: {
      backgroundColor: tooltipBgColor,
      style: {
        color: tooltipTextColor,
        fontSize: '11px',
        fontWeight: 'bold'
      },
      borderColor: tooltipBorderColor,
      borderRadius: 12,
      shadow: true,
      shared: true,
      valuePrefix: '$'
    },
    plotOptions: {
      areaspline: {
        marker: {
          radius: 5,
          fillColor: isDark ? '#0c271e' : '#F5F5EC',
          lineWidth: 2,
          states: {
            hover: {
              radius: 7
            }
          }
        },
        lineWidth: 3,
        threshold: null
      }
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      borderWidth: 0,
      itemStyle: {
        color: textColor,
        fontSize: '10px',
        fontWeight: '600'
      }
    },
    series: [
      {
        name: 'Thực tế',
        type: 'areaspline',
        color: '#0F3D2E',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, isDark ? 'rgba(167, 215, 169, 0.25)' : 'rgba(15, 61, 46, 0.25)'],
            [1, 'rgba(15, 61, 46, 0)']
          ]
        },
        lineColor: isDark ? '#A7D7A9' : '#0F3D2E',
        marker: {
          lineColor: isDark ? '#A7D7A9' : '#0F3D2E'
        },
        data: [8500, 12500, 10200, 18900, 24500, null, null]
      },
      {
        name: 'Dự báo',
        type: 'areaspline',
        color: '#D4AF37',
        dashStyle: 'Dash',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(212, 175, 55, 0.25)'],
            [1, 'rgba(212, 175, 55, 0)']
          ]
        },
        lineColor: '#D4AF37',
        marker: {
          lineColor: '#D4AF37'
        },
        data: [null, null, null, null, 24500, 36000, 42000]
      }
    ]
  };

  // Heatmap click data (mocking destination click counts)
  const heatmapData = [
    { destination: 'Sapa Ruộng Bậc Thang & Trà Tuyết', clicks: 420, conversions: 38, hot: true },
    { destination: 'Thiền Trà Shizuoka & Ngắm Phú Sĩ', clicks: 350, conversions: 24, hot: true },
    { destination: 'Thung Lũng Sương Munnar & Ayurveda', clicks: 210, conversions: 18, hot: false },
    { destination: 'Darjeeling Rails & Trà Đồn Điền', clicks: 180, conversions: 12, hot: false }
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Create mockup CSV
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Khach hang,Tour dat,So khach,Gia tri,Trang thai\n";
      bookings.forEach(b => {
        csvContent += `${b.id},"${b.userName}","${b.tourTitle}",${b.guests},${b.totalPrice},"${b.status}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CamelliaTrails_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addLog('Xuất báo cáo hệ thống', 'Xuất báo cáo dữ liệu đơn đặt hàng dưới định dạng CSV/Excel');
      setIsExporting(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-cream">Phân Tích Chuyên Sâu & Dự Báo</h2>
          <p className="text-xs text-primary/60 dark:text-cream/60">Theo dõi nhu cầu đặt tour, dự đoán tăng trưởng doanh số bằng mô hình học máy và tải báo cáo sổ cái.</p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer disabled:opacity-50"
        >
          {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>{isExporting ? 'Đang xuất...' : 'Tải Báo Cáo Sổ Cái'}</span>
        </button>
      </div>

      {/* Grid: Predictive Analytics & Click Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Predictive Analytics (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-primary/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-accent/5 rounded-full blur-[40px]" />
          
          <div>
            <span className="text-[10px] tracking-wider uppercase text-accent font-bold flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Dự báo tăng trưởng (Predictive Analytics)
            </span>
            <h3 className="font-serif text-lg font-bold text-primary dark:text-cream mb-4">Mô Hình Ước Tính Doanh Thu Hè 2026</h3>
          </div>

          {/* Highcharts Render for Predictive Analytics */}
          <div className="w-full my-4">
            <HighchartsReact highcharts={Highcharts} options={forecastOptions} />
          </div>

          <div className="flex gap-2.5 items-start text-[10px] bg-accent/10 border border-accent/20 p-3.5 rounded-2xl text-primary/85 dark:text-cream/85">
            <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p>
              <strong>AI dự báo:</strong> Do lượng đặt chỗ hè tăng mạnh, doanh thu tháng 6 (T6) ước tính đạt <strong>$36,000</strong> (Tăng trưởng 15.3%). Đề xuất tăng lượng thực phẩm hữu cơ chuẩn bị trước tại Sapa Lodge để đáp ứng nhu cầu ẩm thực.
            </p>
          </div>
        </div>

        {/* Clicks Heatmap (1 Col) */}
        <div className="glass-card p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-primary/50 dark:text-cream/50 font-bold block mb-4">
              Lượt xem tour (Heatmap clicks)
            </span>
            <h3 className="font-serif text-lg font-bold text-primary dark:text-cream mb-4">Mức Độ Quan Tâm</h3>

            <div className="space-y-4">
              {heatmapData.map((data, idx) => {
                const percentage = (data.clicks / 500) * 100;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-primary/85 dark:text-cream/85">
                      <span className="truncate max-w-[180px]">{data.destination}</span>
                      <span className="font-mono text-accent font-bold">{data.clicks} lượt</span>
                    </div>

                    {/* Progress heat-bar */}
                    <div className="h-2 w-full rounded-full bg-primary/10 dark:bg-cream/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          data.hot ? 'bg-gradient-to-r from-emerald-500 to-accent' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-[8px] text-primary/45 dark:text-cream/45">
                      <span>Tỉ lệ chuyển đổi (CVR): {((data.conversions / data.clicks) * 100).toFixed(1)}%</span>
                      {data.hot && <span className="text-accent font-bold">HOT 🔥</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-primary/5 mt-6 flex justify-between text-[9px] font-bold text-primary/60 dark:text-cream/60">
            <span>Đồng bộ: 1 phút trước</span>
            <span className="text-accent">Tổng lượt xem đồi chè: 1.160</span>
          </div>
        </div>

      </div>

      {/* Grid: Conversion metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-5 rounded-2xl border border-primary/10 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-primary/45 dark:text-cream/45 font-bold">Khách Hàng Quay Lại (Retention)</span>
          <p className="font-serif text-2xl font-bold text-accent">24.5%</p>
          <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">+2.8% so với năm ngoái</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-primary/10 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-primary/45 dark:text-cream/45 font-bold">Thời Gian Lưu Trú Trung Bình</span>
          <p className="font-serif text-2xl font-bold text-primary dark:text-cream">5.2 Ngày</p>
          <span className="text-[8px] text-primary/45 dark:text-cream/45 block mt-1">Phù hợp mô hình du lịch chậm</span>
        </div>
        <div className="glass p-5 rounded-2xl border border-primary/10 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-primary/45 dark:text-cream/45 font-bold">Giá Trị Đơn Trung Bình (AOV)</span>
          <p className="font-serif text-2xl font-bold text-accent">$1,680</p>
          <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">+5.4% do tăng trưởng Gyokuro</span>
        </div>
      </div>

    </div>
  );
};
