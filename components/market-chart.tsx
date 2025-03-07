import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface MarketChartProps {
  data: { time: string; value: number }[];
  containerHeight?: number;
}

export function MarketChart({ data, containerHeight = 100 }: MarketChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: containerHeight,
    });

    const lineSeries = chart.addLineSeries({
      color: '#0ea5e9',
      lineWidth: 2,
    });

    lineSeries.setData(data);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, containerHeight]);

  return <div ref={chartContainerRef} />;
}
