export interface PivotConfig {
  method: 'standard' | 'demark';
  levels: 3 | 5;
}

export interface PivotPoints {
  pp: number;
  r1: number;
  r2: number;
  r3: number;
  r4?: number;
  r5?: number;
  s1: number;
  s2: number;
  s3: number;
  s4?: number;
  s5?: number;
}

export type PivotType = 'intraday' | 'daily' | 'weekly' | 'monthly';

export interface TimeframeConfig {
  periodsToAnalyze: number;
  pivotType: PivotType;
  periodsBack: number;
  levelsToShow: 3 | 5;
}

export interface PivotDisplay {
  level: keyof PivotPoints & string;
  price: number;
  distance: number;
  signal: 'support' | 'resistance' | 'neutral';
}

// Timeframe-spezifische Typen
export type TimeframeRecord = Record<Timeframe, number>;

export type PeriodMapType = {
  [K in Uppercase<PivotType>]: Partial<TimeframeRecord>;
};

export type PivotRangeType = {
  [K in PivotType]: Timeframe[];
};

export type PivotDefaultsType = {
  [K in PivotType]: {
    periodsBack: number;
    levelsToShow: 3 | 5;
  };
};

export interface PivotSetup {
  entry: PivotDisplay;
  stop: PivotDisplay;
  target: PivotDisplay;
  ratio: number;
}

export type Timeframe = '5m' | '15m' | '1h' | '4h' | '1d';

export interface HistoricalPrice {
  date: string;  // Required, not optional
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  [key: string]: string | number; // Allow additional properties
}