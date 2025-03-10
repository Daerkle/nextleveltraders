export interface MarketDataPoint {
  high: number;
  low: number;
  close: number;
  open: number;
}

export interface MarketData {
  daily: MarketDataPoint[];
  hourly: MarketDataPoint[];
  current: MarketDataPoint;
}

export interface PivotLevels {
  pivot: number;
  r1: number;
  s1: number;
  r2: number;
  s2: number;
}

export interface DeMarkLevels {
  x: number;
  dmR1: number;
  dmS1: number;
}

export interface Setup {
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  target: number;
  riskRewardRatio: number;
  probability: number;
  reason: string;
  timestamp?: string;
}