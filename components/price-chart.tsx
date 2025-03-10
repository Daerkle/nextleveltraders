'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  Time,
  UTCTimestamp,
  LineWidth
} from 'lightweight-charts';
import { HistoricalPrice } from '@/lib/pivots/types';
import { calculateEMACloud } from '@/lib/indicators';
import { PivotCalculator } from '@/lib/pivots/calculator';
import { 
  aggregateHistoricalData,
  getPivotLevelColor,
  getPivotLevelStyle
} from '@/lib/pivots/utils';

interface PriceChartProps {
  data: HistoricalPrice[];
  height?: number;
  width?: number;
  showRipsterClouds?: boolean;
  showPivots?: boolean;
  timeframe?: '5m' | '15m' | '1h' | '4h' | '1d';
}

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
  const pivotCalculator = useMemo(() => new PivotCalculator(), []);
  
  const [aggregatedData, setAggregatedData] = useState<HistoricalPrice[]>([]);
  
  // Daten-Aggregation wenn sich Timeframe oder Daten ändern
  useEffect(() => {
    setAggregatedData(aggregateHistoricalData(data, timeframe));
  }, [data, timeframe]);

  // Haupteffekt für Chart-Erstellung und Updates
  useEffect(() => {
    if (!chartContainerRef.current || !aggregatedData.length) return;
    
    // Cleanup
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = [];
    }
    
    // Chart erstellen
    const chart = createChart(chartContainerRef.current);
    chartRef.current = chart;
    
    // Chart-Optionen
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

    // Daten formatieren
    const formattedData = aggregatedData.map(item => ({
      time: (new Date(item.date).getTime() / 1000) as UTCTimestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    const volumeData = aggregatedData.map(item => ({
      time: (new Date(item.date).getTime() / 1000) as UTCTimestamp,
      value: item.volume,
      color: item.close >= item.open ? '#22c55e50' : '#ef444450',
    }));

    try {
      // Candlestick-Serie
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

      // Volumen-Serie
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

      // EMAs wenn aktiviert
      if (showRipsterClouds) {
        const cloud5_12 = calculateEMACloud(aggregatedData, 5, 12);
        const cloud34_50 = calculateEMACloud(aggregatedData, 34, 50);
        
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
              lineWidth: 1 as LineWidth,
              title,
              lastValueVisible: true,
            });
            
            // EMA-Daten eindeutig sortieren
            const uniqueEmaDates = new Set<UTCTimestamp>();
            const sortedEmaData = emaData
              .map((value, i) => ({
                time: (new Date(cloud5_12.dates[i]).getTime() / 1000) as UTCTimestamp,
                value,
              }))
              .filter(item => {
                if (uniqueEmaDates.has(item.time)) {
                  return false;
                }
                uniqueEmaDates.add(item.time);
                return true;
              })
              .sort((a, b) => Number(a.time) - Number(b.time));

            series.setData(sortedEmaData);
          }
        });
      }

      // Pivot-Punkte wenn aktiviert
      if (showPivots && formattedData.length > 0) {
        const currentPrice = formattedData[formattedData.length - 1].close;
        const pivots = pivotCalculator.calculate(aggregatedData, timeframe, {
          method: 'standard',
          levels: 5
        });
        
        const pivotLevels = pivotCalculator.analyzePivotLevels(pivots, currentPrice);
        const lastTime = formattedData[formattedData.length - 1].time;
        const timeStart = formattedData[0].time;

        // Info-Text für Pivot-Typ
        const infoSeries = chart.addSeries(LineSeries);
        seriesRef.current.push(infoSeries);
        
        infoSeries.applyOptions({
          color: 'transparent',
          lastValueVisible: true,
          title: `${timeframe.toUpperCase()} Pivots`,
        });
        
        infoSeries.setData([
          { time: timeStart, value: pivots.pp }
        ]);

        // Pivot-Levels zeichnen
        pivotLevels.forEach(({ level, price }) => {
          const series = chart.addSeries(LineSeries);
          seriesRef.current.push(series);
          
          series.applyOptions({
            color: getPivotLevelColor(level),
            lineWidth: 1 as LineWidth,
            lineStyle: getPivotLevelStyle(level),
            title: level.toUpperCase(),
            lastValueVisible: true,
          });

          series.setData([
            { time: timeStart as UTCTimestamp, value: price },
            { time: lastTime as UTCTimestamp, value: price },
          ]);
        });
      }

      // Content anpassen
      chart.timeScale().fitContent();
      
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    // Resize Handler
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
      
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = [];
      }
    };
  }, [aggregatedData, height, showRipsterClouds, showPivots, timeframe, pivotCalculator]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full"
      style={{ minHeight: height }}
    />
  );
}