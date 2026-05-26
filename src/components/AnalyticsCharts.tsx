import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useApp } from '../context/AppContext';
import { DollarSign, Eye, ShoppingCart, Sparkles } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  // Theme-based colors
  const textColor = isDark ? '#e2f0eb' : '#0F3D2E';
  const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 61, 46, 0.08)';
  const tooltipBgColor = isDark ? '#0c271e' : '#F5F5EC';
  const tooltipTextColor = isDark ? '#e2f0eb' : '#0F3D2E';
  const tooltipBorderColor = isDark ? '#D4AF37' : '#0F3D2E';

  // 1. Line (Areaspline) Chart Configuration: Monthly Revenue
  const lineOptions: Highcharts.Options = {
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
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
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
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, isDark ? 'rgba(212, 175, 55, 0.35)' : 'rgba(212, 175, 55, 0.45)'],
            [1, 'rgba(212, 175, 55, 0)']
          ]
        },
        marker: {
          radius: 5,
          fillColor: isDark ? '#0c271e' : '#F5F5EC',
          lineWidth: 2,
          lineColor: '#D4AF37',
          states: {
            hover: {
              fillColor: '#D4AF37',
              radius: 7
            }
          }
        },
        lineWidth: 3,
        lineColor: '#D4AF37',
        threshold: null
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: 'Doanh thu',
        type: 'areaspline',
        data: [8500, 12500, 10200, 18900, 24500, 31200]
      }
    ]
  };

  // 2. Donut Pie Chart Configuration: Category Shares
  const donutOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 160,
      spacingBottom: 0,
      spacingTop: 0,
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
    tooltip: {
      backgroundColor: tooltipBgColor,
      style: {
        color: tooltipTextColor,
        fontSize: '11px',
        fontWeight: 'bold'
      },
      borderColor: tooltipBorderColor,
      borderRadius: 12,
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueDescriptionFormat: '{index}. {x} data, {y}%.'
      }
    },
    plotOptions: {
      pie: {
        innerSize: '65%',
        borderWidth: 0,
        colors: ['#D4AF37', '#A7D7A9', '#0F3D2E', '#4B73E5'],
        dataLabels: {
          enabled: false
        },
        showInLegend: false
      }
    },
    series: [
      {
        name: 'Tỷ lệ',
        type: 'pie',
        data: [
          { name: 'Trị liệu', y: 35 },
          { name: 'Sinh thái', y: 25 },
          { name: 'Trà đạo', y: 30 },
          { name: 'Khám phá', y: 10 }
        ]
      }
    ]
  };

  // 3. Column Bar Chart Configuration: Weekly bookings
  const barOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 160,
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
      categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
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
      valueSuffix: ' lượt đặt'
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        borderWidth: 0,
        color: isDark ? '#A7D7A9' : '#0F3D2E',
        states: {
          hover: {
            color: '#D4AF37'
          }
        }
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: 'Lượt đặt',
        type: 'column',
        data: [12, 19, 15, 25, 32, 45, 28]
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Curved Line Chart: Revenue */}
      <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-primary/10 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-primary/60 dark:text-cream/60 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Tổng Quan Thu Nhập
            </span>
            <h3 className="font-serif text-xl font-bold text-primary dark:text-cream">Doanh Thu Tăng Trưởng</h3>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-accent/20 text-accent font-semibold">
              <DollarSign className="w-3.5 h-3.5" /> Doanh Thu Trực Tiếp
            </span>
          </div>
        </div>

        {/* Highcharts Render */}
        <div className="w-full">
          <HighchartsReact highcharts={Highcharts} options={lineOptions} />
        </div>
      </div>

      {/* 2. Donut Pie Chart: Category shares */}
      <div className="glass-card p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
        <div className="mb-2">
          <span className="text-[10px] tracking-wider uppercase text-primary/60 dark:text-cream/60 font-bold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-accent" /> Thị Phần Loại Hình Tour
          </span>
          <h3 className="font-serif text-lg font-bold text-primary dark:text-cream">Phân Bổ Lượng Khách</h3>
        </div>

        {/* Highcharts Render */}
        <div className="relative py-2">
          <HighchartsReact highcharts={Highcharts} options={donutOptions} />
        </div>

        {/* Legend labels list */}
        <div className="grid grid-cols-2 gap-3 border-t border-primary/5 dark:border-cream/5 pt-3 text-[10px] font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <span className="text-primary/75 dark:text-cream/75">Trị liệu (35%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A7D7A9]" />
            <span className="text-primary/75 dark:text-cream/75">Sinh thái (25%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F3D2E]" />
            <span className="text-primary/75 dark:text-cream/75">Trà đạo (30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4B73E5]" />
            <span className="text-primary/75 dark:text-cream/75">Khám phá (10%)</span>
          </div>
        </div>
      </div>

      {/* 3. Bar Chart: Bookings count per weekday */}
      <div className="lg:col-span-3 glass-card p-6 rounded-3xl border border-primary/10">
        <div className="mb-4">
          <span className="text-[10px] tracking-wider uppercase text-primary/60 dark:text-cream/60 font-bold flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5 text-accent" /> Lượt Đặt Vé
          </span>
          <h3 className="font-serif text-xl font-bold text-primary dark:text-cream">Sản Lượng Hàng Tuần</h3>
        </div>

        {/* Highcharts Render */}
        <div className="w-full">
          <HighchartsReact highcharts={Highcharts} options={barOptions} />
        </div>
      </div>
    </div>
  );
};
