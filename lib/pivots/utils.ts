import { HistoricalPrice, PivotPoints, Timeframe } from './types';

export const getTimeframeMinutes = (timeframe: Timeframe): number => {
  const [value, unit] = timeframe.match(/(\d+)([mhd])/)?.slice(1) || [];
  const number = parseInt(value);
  
  switch(unit) {
    case 'm': return number;
    case 'h': return number * 60;
    case 'd': return number * 60 * 24;
    default: return 60; // default 1h
  }
};

export const aggregateHistoricalData = (
  data: HistoricalPrice[],
  timeframe: Timeframe
): HistoricalPrice[] => {
  if (!data.length) return [];

  const minutes = getTimeframeMinutes(timeframe);
  const aggregated = new Map<number, HistoricalPrice[]>();
  
  // Sortiere Daten nach Zeit
  const sortedData = [...data].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sortedData.forEach((candle) => {
    const timestamp = new Date(candle.date).getTime();
    // Runde auf das nächste Zeitfenster
    const windowStart = Math.floor(timestamp / (minutes * 60 * 1000)) * minutes * 60 * 1000;
    
    if (!aggregated.has(windowStart)) {
      aggregated.set(windowStart, []);
    }
    aggregated.get(windowStart)!.push(candle);
  });

  // Konvertiere aggregierte Daten zurück in Candles
  return Array.from(aggregated.entries())
    .map(([timestamp, candles]) => ({
      date: new Date(timestamp).toISOString(),
      open: candles[0].open,
      high: Math.max(...candles.map(c => c.high)),
      low: Math.min(...candles.map(c => c.low)),
      close: candles[candles.length - 1].close,
      volume: candles.reduce((sum, c) => sum + c.volume, 0)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const formatPivotLevel = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const getPivotLevelColor = (level: keyof PivotPoints): string => {
  switch(level) {
    case 'r5': return '#dc2626';
    case 'r4': return '#ef4444';
    case 'r3': return '#f97316';
    case 'r2': return '#fb923c';
    case 'r1': return '#fdba74';
    case 'pp': return '#16a34a';
    case 's1': return '#93c5fd';
    case 's2': return '#60a5fa';
    case 's3': return '#3b82f6';
    case 's4': return '#2563eb';
    case 's5': return '#1d4ed8';
    default: return '#64748b';
  }
};

export const getPivotLevelStyle = (level: keyof PivotPoints): number => {
  // 0 = solid, 1 = dotted, 2 = dashed
  switch(level) {
    case 'pp': return 0; // Solid für PP
    case 'r1':
    case 'r2':
    case 'r3':
    case 's1':
    case 's2':
    case 's3':
      return 2; // Dashed für Hauptlevels
    default:
      return 1; // Dotted für erweiterte Levels
  }
};