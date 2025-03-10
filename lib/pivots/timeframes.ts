import {
  Timeframe,
  PivotType,
  TimeframeConfig,
  PeriodMapType,
  PivotDefaultsType
} from './types';
import { TIMEFRAME_PERIODS, PIVOT_TYPE_RANGES, PIVOT_DEFAULTS } from './constants';

/**
 * Bestimmt die Konfiguration für verschiedene Zeitrahmen
 */
function getPivotTypeForTimeframe(timeframe: Timeframe): PivotType {
  const entry = Object.entries(PIVOT_TYPE_RANGES).find(([_, ranges]) =>
    ranges.includes(timeframe)
  );
  return (entry?.[0] as PivotType) || 'daily';
}

function getPeriodsToAnalyze(timeframe: Timeframe, pivotType: PivotType): number {
  const periodKey = pivotType.toUpperCase() as keyof PeriodMapType;
  return TIMEFRAME_PERIODS[periodKey]?.[timeframe] || 1;
}

export function getTimeframeConfig(timeframe: Timeframe): TimeframeConfig {
  const pivotType = getPivotTypeForTimeframe(timeframe);
  const defaults = PIVOT_DEFAULTS[pivotType];
  
  return {
    periodsToAnalyze: getPeriodsToAnalyze(timeframe, pivotType),
    pivotType,
    periodsBack: defaults.periodsBack,
    levelsToShow: defaults.levelsToShow
  };
}

/**
 * Gruppiert historische Daten nach dem gewählten Zeitraum
 */
export function groupByTimeframe(data: Date[]): {
  daily: Date[];
  weekly: Date[];
  monthly: Date[];
} {
  const grouped = {
    daily: [] as Date[],
    weekly: [] as Date[],
    monthly: [] as Date[]
  };

  data.forEach(date => {
    // Tägliche Gruppierung
    const dayKey = date.toISOString().split('T')[0];
    if (!grouped.daily.find(d => d.toISOString().split('T')[0] === dayKey)) {
      grouped.daily.push(date);
    }

    // Wöchentliche Gruppierung (Montag-Freitag)
    const weekKey = getWeekKey(date);
    if (!grouped.weekly.find(d => getWeekKey(d) === weekKey)) {
      grouped.weekly.push(date);
    }

    // Monatliche Gruppierung
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!grouped.monthly.find(d => `${d.getFullYear()}-${d.getMonth() + 1}` === monthKey)) {
      grouped.monthly.push(date);
    }
  });

  return grouped;
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}