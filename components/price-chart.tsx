'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  CandlestickSeries, 
  HistogramSeries, 
  LineSeries
} from 'lightweight-charts';
import type { HistoricalPrice } from '@/lib/fmp';
import { calculateEMACloud, calculatePivots, type PivotLevels } from '@/lib/indicators';

interface PriceChartProps {
  data: HistoricalPrice[];
  height?: number;
  width?: number;
  showRipsterClouds?: boolean;
  showPivots?: boolean;
  timeframe?: string; // z.B. '1m', '15m', '1h', '4h', '1d'
}

// Hilfsfunktion für die Zeitrahmen
const getPivotType = (timeframe: string): string => {
  if (!timeframe) return 'daily';
  
  // Extrahiere die Zahl und Einheit aus dem Timeframe
  const match = timeframe.match(/(\d+)([mhd])/);
  if (!match) return 'daily';
  
  const [_, value, unit] = match;
  const numValue = parseInt(value);
  
  if (unit === 'm' && numValue <= 30) return 'daily';
  if ((unit === 'm' && numValue > 30) || (unit === 'h' && numValue <= 4)) return 'weekly';
  return 'monthly';
};

// Calculate pivots based on timeframe
const calculateTimeBasedPivots = (data: HistoricalPrice[], pivotType: string): PivotLevels => {
  // Use daily pivots by default
  if (!data || data.length === 0) {
    return { pp: 0, r1: 0, r2: 0, r3: 0, s1: 0, s2: 0, s3: 0 };
  }
  
  let pivots = calculatePivots(data);
  
  // For weekly pivots - based on last 5 trading days
  if (pivotType === 'weekly') {
    const weekData = data.slice(-5);
    if (weekData.length > 0) {
      const high = Math.max(...weekData.map(d => d.high));
      const low = Math.min(...weekData.map(d => d.low));
      const close = weekData[weekData.length - 1].close;
      
      const pp = (high + low + close) / 3;
      const r1 = (2 * pp) - low;
      const s1 = (2 * pp) - high;
      const r2 = pp + (high - low);
      const s2 = pp - (high - low);
      const r3 = high + 2 * (pp - low);
      const s3 = low - 2 * (high - pp);
      
      pivots = { pp, r1, r2, r3, s1, s2, s3 };
    }
  }
  
  // For monthly pivots - based on last ~20 trading days
  else if (pivotType === 'monthly') {
    const monthData = data.slice(-20);
    if (monthData.length > 0) {
      const high = Math.max(...monthData.map(d => d.high));
      const low = Math.min(...monthData.map(d => d.low));
      const close = monthData[monthData.length - 1].close;
      
      const pp = (high + low + close) / 3;
      const r1 = (2 * pp) - low;
      const s1 = (2 * pp) - high;
      const r2 = pp + (high - low);
      const s2 = pp - (high - low);
      const r3 = high + 2 * (pp - low);
      const s3 = low - 2 * (high - pp);
      
      pivots = { pp, r1, r2, r3, s1, s2, s3 };
    }
  }
  
  return pivots;
};

export function PriceChart({ 
  data, 
  height = 500, 
  width = 800,
  showRipsterClouds = true,
  showPivots = true,
  timeframe = '1h'
}: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any[]>([]);
  
  // Important: pivotType state depends on timeframe
  const [pivotType, setPivotType] = useState<string>(() => 
    getPivotType(timeframe)
  );
  
  // Update pivotType when timeframe changes
  useEffect(() => {
    setPivotType(getPivotType(timeframe));
  }, [timeframe]);

  // Main effect for chart creation and updates
  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;
    
    // Cleanup chart instance if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = [];
    }
    
    // Create new chart instance
    const chart = createChart(chartContainerRef.current);
    chartRef.current = chart;
    
    // Set chart options
    chart.applyOptions({
      layout: {
        background: { color: 'transparent' },
        textColor: '#64748b',
        fontFamily: 'Roboto, sans-serif',
      },
      grid: {
        vertLines: { color: '#e2e8f040' },
        horzLines: { color: '#e2e8f040' },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#e2e8f080',
      },
    });

    // Format and sort data by time
    const formattedData = data
      .map(item => ({
        time: new Date(item.date).getTime() / 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
      .sort((a, b) => a.time - b.time);

    const volumeData = data
      .map(item => ({
        time: new Date(item.date).getTime() / 1000,
        value: item.volume,
        color: item.close >= item.open ? '#22c55e50' : '#ef444450',
      }))
      .sort((a, b) => a.time - b.time);

    try {
      // Create candlestick series
      const candlestickSeries = chart.addSeries(CandlestickSeries);
      seriesRef.current.push(candlestickSeries);
      
      candlestickSeries.applyOptions({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });
      
      candlestickSeries.setData(formattedData);

      // Create volume series
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });
      seriesRef.current.push(volumeSeries);
      
      volumeSeries.applyOptions({
        color: '#94a3b880',
        priceScaleId: 'volume',
      });
      
      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.85,
          bottom: 0,
        },
        visible: true,
      });
      
      volumeSeries.setData(volumeData);

      // Add EMAs if enabled
      if (showRipsterClouds) {
        const cloud5_12 = calculateEMACloud(data, 5, 12);
        const cloud34_50 = calculateEMACloud(data, 34, 50);
        
        const emaSeriesConfigs = [
          { data: cloud5_12.fast, color: '#22c55e80', title: 'EMA 5' },
          { data: cloud5_12.slow, color: '#ef444480', title: 'EMA 12' },
          { data: cloud34_50.fast, color: '#3b82f680', title: 'EMA 34' },
          { data: cloud34_50.slow, color: '#8b5cf680', title: 'EMA 50' },
        ];

        emaSeriesConfigs.forEach(({ data: emaData, color, title }) => {
          if (emaData && emaData.length && cloud5_12.dates && cloud5_12.dates.length) {
            const series = chart.addSeries(LineSeries);
            seriesRef.current.push(series);
            
            series.applyOptions({ 
              color, 
              lineWidth: 1.5,
              title,
              lastValueVisible: true,
            });
            
            series.setData(
              emaData.map((value, i) => ({
                time: new Date(cloud5_12.dates[i]).getTime() / 1000,
                value,
              }))
            );
          }
        });
      }

      // Add pivot points if enabled
      if (showPivots && formattedData.length > 0) {
        const pivots = calculateTimeBasedPivots(data, pivotType);
        
        const lastTime = formattedData[formattedData.length - 1].time;
        const timeStart = formattedData[0].time;

        const pivotLineStyle = 2; // 2 = Dashed line style
        const pivotLevels: [keyof PivotLevels, string, number, string][] = [
          ['r3', '#dc2626', pivots.r3 || 0, 'R3'],
          ['r2', '#ef4444', pivots.r2 || 0, 'R2'],
          ['r1', '#f97316', pivots.r1 || 0, 'R1'],
          ['pp', '#16a34a', pivots.pp || 0, 'PP'],
          ['s1', '#f97316', pivots.s1 || 0, 'S1'],
          ['s2', '#ef4444', pivots.s2 || 0, 'S2'],
          ['s3', '#dc2626', pivots.s3 || 0, 'S3'],
        ];

        // Add information text
        const infoSeries = chart.addSeries(LineSeries);
        seriesRef.current.push(infoSeries);
        
        infoSeries.applyOptions({
          color: 'transparent',
          lastValueVisible: true,
          title: `${pivotType.charAt(0).toUpperCase() + pivotType.slice(1)} Pivots`,
        });
        
        infoSeries.setData([
          { time: timeStart, value: pivots.pp || 0 }
        ]);

        pivotLevels.forEach(([level, color, value, label]) => {
          if (value !== undefined && !isNaN(value) && value !== 0) {
            const series = chart.addSeries(LineSeries);
            seriesRef.current.push(series);
            
            series.applyOptions({
              color,
              lineWidth: 1,
              lineStyle: pivotLineStyle,
              title: label,
              lastValueVisible: true,
            });

            series.setData([
              { time: timeStart, value },
              { time: lastTime, value },
            ]);
          }
        });
      }

      // Fit content
      chart.timeScale().fitContent();
      
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    // Resize handler
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Cleanup
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = [];
      }
    };
  }, [data, height, showRipsterClouds, showPivots, pivotType, timeframe]); // timeframe hinzugefügt

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full"
      style={{ minHeight: height }}
    />
  );
}