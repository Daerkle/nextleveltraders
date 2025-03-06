import { HistoricalPrice } from './fmp';

export interface PivotLevel {
  level: string;
  value: number;
  distance: number;
  isAbove: boolean;
  touches: number;
}

export interface PivotPoints {
  pp: number;
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  r5: number;
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
}

export function calculateStandardPivots(data: HistoricalPrice): PivotPoints {
  const { high, low, close } = data;
  
  // Pivot Point
  const pp = (high + low + close) / 3;
  
  // Resistance levels
  const r1 = (2 * pp) - low;
  const r2 = pp + (high - low);
  const r3 = high + 2 * (pp - low);
  const r4 = r3 + (high - low);
  const r5 = r4 + (high - low);
  
  // Support levels
  const s1 = (2 * pp) - high;
  const s2 = pp - (high - low);
  const s3 = low - 2 * (high - pp);
  const s4 = s3 - (high - low);
  const s5 = s4 - (high - low);
  
  return { pp, r1, r2, r3, r4, r5, s1, s2, s3, s4, s5 };
}

export function calculateDeMarkPivots(data: HistoricalPrice): PivotPoints {
  const { open, high, low, close } = data;
  let x = 0;
  
  if (close < open) {
    x = high + (2 * low) + close;
  } else if (close > open) {
    x = (2 * high) + low + close;
  } else {
    x = high + low + (2 * close);
  }
  
  const pp = x / 4;
  
  // Resistance levels
  const r1 = x / 2 - low;
  const r2 = pp + (high - low);
  const r3 = r2 + (high - low);
  const r4 = r3 + (high - low);
  const r5 = r4 + (high - low);
  
  // Support levels
  const s1 = x / 2 - high;
  const s2 = pp - (high - low);
  const s3 = s2 - (high - low);
  const s4 = s3 - (high - low);
  const s5 = s4 - (high - low);
  
  return { pp, r1, r2, r3, r4, r5, s1, s2, s3, s4, s5 };
}

export function analyzePivotLevels(
  pivots: PivotPoints,
  currentPrice: number,
  historicalPrices: HistoricalPrice[]
): PivotLevel[] {
  const levels: PivotLevel[] = [];
  const pivotEntries = Object.entries(pivots);
  
  // Count touches for each level
  const touchCounts = new Map<number, number>();
  historicalPrices.forEach(price => {
    pivotEntries.forEach(([_, value]) => {
      const tolerance = value * 0.001; // 0.1% tolerance
      if (Math.abs(price.high - value) <= tolerance || Math.abs(price.low - value) <= tolerance) {
        touchCounts.set(value, (touchCounts.get(value) || 0) + 1);
      }
    });
  });
  
  // Create level objects
  pivotEntries.forEach(([key, value]) => {
    const distance = ((value - currentPrice) / currentPrice) * 100;
    const touches = touchCounts.get(value) || 0;
    
    let touchText = 'Keine';
    if (touches === 1) touchText = 'Einmal';
    else if (touches === 2) touchText = 'Zweimal';
    else if (touches === 3) touchText = 'Dreimal';
    else if (touches > 3) touchText = 'Mehrmals';
    
    levels.push({
      level: key.toUpperCase(),
      value: value,
      distance: distance,
      isAbove: value > currentPrice,
      touches: touches
    });
  });
  
  return levels.sort((a, b) => b.value - a.value);
}
