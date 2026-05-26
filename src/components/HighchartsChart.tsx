import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

interface HighchartsChartProps {
  options: Highcharts.Options;
  className?: string;
}

export const HighchartsChart: React.FC<HighchartsChartProps> = ({ options, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Direct DOM rendering ensures 100% compatibility with React 19
      chartRef.current = Highcharts.chart(containerRef.current, options);
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [options]);

  return <div ref={containerRef} className={className || 'w-full'} />;
};
