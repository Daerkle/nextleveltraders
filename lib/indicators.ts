import type { HistoricalPrice } from './fmp';

export type PivotType = 'standard' | 'demark';

export interface DeMarkPivotLevels {
  x: number;
  r1: number;
  pp: number;
  s1: number;
}

export interface StandardPivotLevels {
  r3: number;
  r2: number;
  r1: number;
  pp: number;
  s1: number;
  s2: number;
  s3: number;
}


export type PivotLevels = StandardPivotLevels | DeMarkPivotLevels;

export function calculateDeMarkPivots(prices: HistoricalPrice[]): DeMarkPivotLevels {
  if (!prices || prices.length === 0) {
    return { x: 0, r1: 0, pp: 0, s1: 0 };
  }

  const price = prices[0];
  const close = price.close;
  const high = price.high;
  const low = price.low;

  // Calculate X based on DeMark's conditions
  let x;
  if (close < price.open) {
    x = high + (2 * low) + close;
  } else if (close > price.open) {
    x = (2 * high) + low + close;
  } else {
    x = high + low + (2 * close);
  }

  // Calculate pivot points
  const pp = x / 4;
  const r1 = x / 2 - low;
  const s1 = x / 2 - high;

  return {
    x: Number(x.toFixed(2)),
    r1: Number(r1.toFixed(2)),
    pp: Number(pp.toFixed(2)),
    s1: Number(s1.toFixed(2))
  };
}

export interface EMACloud {
  fast: number[];
  slow: number[];
  dates: string[];
  crossovers: { date: string; type: 'bullish' | 'bearish' }[];
}

export function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const emaData: number[] = [];
  let ema = prices[0];
  
  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      emaData.push(ema);
      continue;
    }
    ema = (prices[i] * k) + (ema * (1 - k));
    emaData.push(ema);
  }
  
  return emaData;
}

export function calculateEMACloud(
  prices: HistoricalPrice[],
  fastPeriod: number,
  slowPeriod: number
): EMACloud {
  const closePrices = prices.map(p => p.close);
  const dates = prices.map(p => p.date);
  
  const fastEMA = calculateEMA(closePrices, fastPeriod);
  const slowEMA = calculateEMA(closePrices, slowPeriod);
  
  // Find crossovers
  const crossovers = [];
  for (let i = 1; i < prices.length; i++) {
    const prevFast = fastEMA[i - 1];
    const prevSlow = slowEMA[i - 1];
    const currFast = fastEMA[i];
    const currSlow = slowEMA[i];
    
    if (prevFast <= prevSlow && currFast > currSlow) {
      crossovers.push({ date: dates[i], type: 'bullish' });
    } else if (prevFast >= prevSlow && currFast < currSlow) {
      crossovers.push({ date: dates[i], type: 'bearish' });
    }
  }
  
  return {
    fast: fastEMA,
    slow: slowEMA,
    dates,
    crossovers
  };
}

export function calculateTimeBasedPivots(
  prices: HistoricalPrice[],
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  pivotType: PivotType = 'standard'
): PivotLevels {
  if (!prices || prices.length === 0) {
    return { r3: 0, r2: 0, r1: 0, pp: 0, s1: 0, s2: 0, s3: 0 };
  }

  // Bestimme den relevanten Datensatz basierend auf dem Timeframe
  let relevantPrices = prices;
  if (timeframe === 'weekly' && prices.length >= 5) {
    relevantPrices = prices.slice(-5);
  } else if (timeframe === 'monthly' && prices.length >= 20) {
    relevantPrices = prices.slice(-20);
  } else if (timeframe === 'quarterly' && prices.length >= 60) {
    relevantPrices = prices.slice(-60);
  } else if (timeframe === 'yearly' && prices.length >= 250) {
    relevantPrices = prices.slice(-250);
  }

  if (!relevantPrices || relevantPrices.length === 0) {
    return { r3: 0, r2: 0, r1: 0, pp: 0, s1: 0, s2: 0, s3: 0 };
  }

  // Calculate period high and low
  let periodHigh = relevantPrices[0].high;
  let periodLow = relevantPrices[0].low;
  let periodClose = relevantPrices[0].close;

  // For timeframes longer than daily, find the period's high and low
  if (timeframe !== 'daily' && relevantPrices.length > 1) {
    periodHigh = Math.max(...relevantPrices.map(p => p.high));
    periodLow = Math.min(...relevantPrices.map(p => p.low));
    // Use the most recent close for the period
    periodClose = relevantPrices[0].close;
  }

  // Standard Floor Trader's Method
  const pp = (periodHigh + periodLow + periodClose) / 3;

  if (pivotType === 'standard') {
    // Standard Pivot Points
    const r1 = (2 * pp) - periodLow;
    const s1 = (2 * pp) - periodHigh;
    const r2 = pp + (periodHigh - periodLow);
    const s2 = pp - (periodHigh - periodLow);
    const r3 = periodHigh + 2 * (pp - periodLow);
    const s3 = periodLow - 2 * (periodHigh - pp);

    return {
      r3: Number(r3.toFixed(2)),
      r2: Number(r2.toFixed(2)),
      r1: Number(r1.toFixed(2)),
      pp: Number(pp.toFixed(2)),
      s1: Number(s1.toFixed(2)),
      s2: Number(s2.toFixed(2)),
      s3: Number(s3.toFixed(2))
    };
  }
  }

// Legacy-Funktion für Kompatibilität
export function calculatePivots(prices: HistoricalPrice[]): PivotLevels {
  const levels = calculateTimeBasedPivots(prices, 'daily');
  return levels;
}

export function getRipsterStatus(cloud5_12: EMACloud, cloud34_50: EMACloud): {
  shortTerm: 'bullish' | 'bearish' | 'neutral';
  longTerm: 'bullish' | 'bearish' | 'neutral';
  strength: number;
} {
  const latest5_12 = {
    fast: cloud5_12.fast[cloud5_12.fast.length - 1],
    slow: cloud5_12.slow[cloud5_12.slow.length - 1]
  };
  
  const latest34_50 = {
    fast: cloud34_50.fast[cloud34_50.fast.length - 1],
    slow: cloud34_50.slow[cloud34_50.slow.length - 1]
  };
  
  const shortTerm = latest5_12.fast > latest5_12.slow ? 'bullish' : 
                    latest5_12.fast < latest5_12.slow ? 'bearish' : 'neutral';
                    
  const longTerm = latest34_50.fast > latest34_50.slow ? 'bullish' : 
                   latest34_50.fast < latest34_50.slow ? 'bearish' : 'neutral';
  
  // Calculate trend strength (0-100)
  const shortTermDiff = Math.abs(latest5_12.fast - latest5_12.slow) / latest5_12.slow * 100;
  const longTermDiff = Math.abs(latest34_50.fast - latest34_50.slow) / latest34_50.slow * 100;
  
  const strength = Math.min(100, Math.round((shortTermDiff + longTermDiff) * 5));
  
  return {
    shortTerm,
    longTerm,
    strength
  };
}
