import React, { useState } from 'react';
import { DollarSign, Eye, ShoppingCart, Sparkles } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Line Chart Data: Monthly Revenue (Tháng 1 -> Tháng 6)
  const lineData = [
    { label: 'Tháng 1', value: 8500 },
    { label: 'Tháng 2', value: 12500 },
    { label: 'Tháng 3', value: 10200 },
    { label: 'Tháng 4', value: 18900 },
    { label: 'Tháng 5', value: 24500 },
    { label: 'Tháng 6', value: 31200 }
  ];

  // Donut Chart Data: Category Popularity
  const donutData = [
    { name: 'Trị liệu', value: 35, color: '#D4AF37' },     // Gold
    { name: 'Sinh thái', value: 25, color: '#A7D7A9' }, // Light green
    { name: 'Trà đạo', value: 30, color: '#0F3D2E' }, // Deep green
    { name: 'Khám phá', value: 10, color: '#4B73E5' }     // Blue
  ];

  // Bar Chart Data: Bookings Count per Day
  const barData = [
    { day: 'T2', bookings: 12 },
    { day: 'T3', bookings: 19 },
    { day: 'T4', bookings: 15 },
    { day: 'T5', bookings: 25 },
    { day: 'T6', bookings: 32 },
    { day: 'T7', bookings: 45 },
    { day: 'CN', bookings: 28 }
  ];

  // SVG dimensions for Line Chart
  const svgWidth = 500;
  const svgHeight = 220;
  const padding = 35;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  // Find max value for scaling
  const maxValue = Math.max(...lineData.map(d => d.value)) * 1.1;

  // Calculate coordinates for the line curve (cubic bezier smooth path)
  const getCoordinates = () => {
    return lineData.map((d, i) => {
      const x = padding + (i / (lineData.length - 1)) * chartWidth;
      const y = padding + chartHeight - (d.value / maxValue) * chartHeight;
      return { x, y, val: d.value, label: d.label };
    });
  };

  const points = getCoordinates();

  // Create path command string
  const getPathD = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  // Create gradient filled area under path
  const getAreaD = () => {
    const linePath = getPathD();
    if (!linePath) return '';
    return `${linePath} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`;
  };

  const pathD = getPathD();
  const areaD = getAreaD();

  // Donut chart mathematics
  let accumPercentage = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Curved Line Chart: Revenue */}
      <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-primary/10 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-primary/60 dark:text-cream/60 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" /> Tổng Quan Thu Nhập
            </span>
            <h3 className="font-serif text-xl font-bold text-primary dark:text-cream">Doanh Thu Tăng Trưởng</h3>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-accent/20 text-accent font-semibold">
              <DollarSign className="w-3.5 h-3.5" /> Doanh Thu Trực Tiếp
            </span>
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[400px] overflow-visible">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0F3D2E" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#A7D7A9" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = padding + chartHeight * r;
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={padding + chartWidth}
                  y2={y}
                  stroke="rgba(15, 61, 46, 0.08)"
                  strokeDasharray="4 4"
                  className="dark:stroke-cream/10"
                />
              );
            })}

            {/* Area path */}
            {areaD && <path d={areaD} fill="url(#lineGrad)" />}

            {/* Line path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="url(#strokeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 2000,
                  strokeDashoffset: 0,
                  animation: 'dash 3s ease-in-out forwards'
                }}
              />
            )}

            {/* Interactive Data Nodes */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIndex === i ? 7 : 5}
                  fill={hoveredIndex === i ? '#D4AF37' : '#0F3D2E'}
                  stroke="#F5F5EC"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200 dark:stroke-dark-surface"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Horizontal label */}
                <text
                  x={pt.x}
                  y={padding + chartHeight + 20}
                  textAnchor="middle"
                  className="fill-primary/60 dark:fill-cream/60 text-[10px] font-sans font-semibold"
                >
                  {pt.label}
                </text>
              </g>
            ))}

            {/* Vertical Line indicator on hover */}
            {hoveredIndex !== null && (
              <line
                x1={points[hoveredIndex].x}
                y1={padding}
                x2={points[hoveredIndex].x}
                y2={padding + chartHeight}
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                pointerEvents="none"
              />
            )}
          </svg>
        </div>

        {/* Hover Floating Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute p-3.5 rounded-2xl glass border border-accent/30 shadow-xl pointer-events-none animate-fade-in-up"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 90}%`,
              top: `${(points[hoveredIndex].y / svgHeight) * 60}%`
            }}
          >
            <span className="block text-[9px] uppercase tracking-wider text-primary/60 dark:text-cream/60">Doanh thu</span>
            <span className="font-serif text-sm font-bold text-primary dark:text-cream">
              ${points[hoveredIndex].val.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* 2. Donut Pie Chart: Category shares */}
      <div className="glass-card p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
        <div>
          <span className="text-[10px] tracking-wider uppercase text-primary/60 dark:text-cream/60 font-bold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-accent" /> Thị Phần Loại Hình Tour
          </span>
          <h3 className="font-serif text-xl font-bold text-primary dark:text-cream mb-4">Phân Bổ Lượng Khách</h3>
        </div>

        {/* Donut drawing */}
        <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
            {donutData.map((d, i) => {
              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const strokeLength = (d.value / 100) * circumference;
              const strokeOffset = circumference - (accumPercentage / 100) * circumference;
              accumPercentage += d.value;

              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={d.color}
                  strokeWidth="11"
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500 hover:stroke-[13] cursor-pointer"
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-serif font-bold text-primary dark:text-cream">100%</span>
            <span className="text-[8px] uppercase tracking-widest text-primary/50 dark:text-cream/50">Hữu Cơ</span>
          </div>
        </div>

        {/* Legend labels list */}
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold">
          {donutData.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-primary/75 dark:text-cream/75">{d.name} ({d.value}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bar Chart: Bookings count per weekday */}
      <div className="lg:col-span-3 glass-card p-6 rounded-3xl border border-primary/10">
        <div>
          <span className="text-[10px] tracking-wider uppercase text-primary/60 dark:text-cream/60 font-bold flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5 text-accent" /> Lượt Đặt Vé
          </span>
          <h3 className="font-serif text-xl font-bold text-primary dark:text-cream mb-6">Sản Lượng Hàng Tuần</h3>
        </div>

        {/* Bars render */}
        <div className="flex justify-between items-end h-40 pt-4 px-2">
          {barData.map((b, i) => {
            const maxVal = Math.max(...barData.map(d => d.bookings));
            const barHeightPercentage = (b.bookings / maxVal) * 100;
            
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-grow max-w-[45px]">
                <div className="relative w-full flex items-end justify-center group h-32">
                  {/* Tooltip on bar hover */}
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 bg-primary text-cream text-[10px] font-bold px-2 py-1 rounded-lg transition-transform duration-200 shadow-md">
                    {b.bookings}
                  </span>
                  
                  {/* Bar pillar */}
                  <div
                    className="w-4 rounded-full bg-gradient-to-t from-primary/80 to-secondary group-hover:to-accent transition-all duration-500 cursor-pointer shadow-sm shadow-primary/10"
                    style={{ height: `${barHeightPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-sans font-semibold text-primary/60 dark:text-cream/60">
                  {b.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
