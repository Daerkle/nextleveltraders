import { PeriodMapType, PivotRangeType, PivotDefaultsType } from './types';

export const TIMEFRAME_PERIODS: PeriodMapType = {
  INTRADAY: {
    '5m': 78,    // 6.5 Handelsstunden = 78 5min-Kerzen
    '15m': 26,   // 6.5 Handelsstunden = 26 15min-Kerzen
    '1h': 7,     // 6.5 Handelsstunden = 7 1h-Kerzen
    '4h': 2      // 6.5 Handelsstunden = 2 4h-Kerzen
  },
  DAILY: {
    '5m': 390,   // Ein Handelstag = 390 5min-Kerzen
    '15m': 130,  // Ein Handelstag = 130 15min-Kerzen
    '1h': 24,    // Ein Tag = 24 1h-Kerzen
    '4h': 6,     // Ein Tag = 6 4h-Kerzen
    '1d': 1      // Ein Tag = 1 Tageskerze
  },
  WEEKLY: {
    '5m': 1950,  // Eine Handelswoche = 1950 5min-Kerzen
    '15m': 650,  // Eine Handelswoche = 650 15min-Kerzen
    '1h': 120,   // Eine Handelswoche = 120 1h-Kerzen
    '4h': 30,    // Eine Handelswoche = 30 4h-Kerzen
    '1d': 5      // Eine Handelswoche = 5 Tageskerzen
  },
  MONTHLY: {
    '5m': 8190,  // Ein Handelsmonat (21 Tage) = 8190 5min-Kerzen
    '15m': 2730, // Ein Handelsmonat = 2730 15min-Kerzen
    '1h': 504,   // Ein Handelsmonat = 504 1h-Kerzen
    '4h': 126,   // Ein Handelsmonat = 126 4h-Kerzen
    '1d': 21     // Ein Handelsmonat = 21 Tageskerzen
  }
};

export const PIVOT_TYPE_RANGES: PivotRangeType = {
  'intraday': ['5m', '15m', '1h'],
  'daily': ['4h', '1d'],
  'weekly': ['1d'],
  'monthly': ['1d']
};

// Standardwerte für verschiedene Pivot-Typen
export const PIVOT_DEFAULTS: PivotDefaultsType = {
  'intraday': {
    periodsBack: 1,    // Letzte Session
    levelsToShow: 3    // R1-R3, S1-S3
  },
  'daily': {
    periodsBack: 1,    // Letzter Tag
    levelsToShow: 5    // R1-R5, S1-S5
  },
  'weekly': {
    periodsBack: 5,    // Letzte Woche
    levelsToShow: 5    // R1-R5, S1-S5
  },
  'monthly': {
    periodsBack: 21,   // Letzter Monat
    levelsToShow: 5    // R1-R5, S1-S5
  }
};