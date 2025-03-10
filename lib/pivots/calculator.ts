import { PivotConfig, PivotPoints, Timeframe, HistoricalPrice, PivotDisplay } from './types';
import { getTimeframeConfig } from './timeframes';

export class PivotCalculator {
  private cache = new Map<string, PivotPoints>();
  
  private getCacheKey(data: HistoricalPrice[], timeframe: Timeframe): string {
    if (data.length === 0) {
      throw new Error('No data provided for cache key generation');
    }
    const latest = data[data.length - 1];
    if (!latest.date) {
      throw new Error('Invalid data format: date is required');
    }
    return `${timeframe}-${latest.date}`;
  }
  
  private calculateStandardPivots(data: HistoricalPrice[], timeframe: Timeframe, levels: 3 | 5): PivotPoints {
    const period = this.getPeriodData(data, timeframe);
    const { high, low, close } = period;
    
    // Pivot Point
    const pp = (high + low + close) / 3;
    
    // Basis Levels (R1-R3, S1-S3)
    const r1 = (2 * pp) - low;
    const r2 = pp + (high - low);
    const r3 = high + 2 * (pp - low);
    
    const s1 = (2 * pp) - high;
    const s2 = pp - (high - low);
    const s3 = low - 2 * (high - pp);
    
    // Erweiterte Levels wenn benötigt
    if (levels === 3) {
      return { pp, r1, r2, r3, s1, s2, s3 };
    }
    
    // R4-R5, S4-S5 für 5 Levels
    const r4 = r3 + (high - low);
    const r5 = r4 + (high - low);
    const s4 = s3 - (high - low);
    const s5 = s4 - (high - low);
    
    return { pp, r1, r2, r3, r4, r5, s1, s2, s3, s4, s5 };
  }
  
  private calculateDeMarkPivots(data: HistoricalPrice[], timeframe: Timeframe, levels: 3 | 5): PivotPoints {
    const period = this.getPeriodData(data, timeframe);
    const { open, high, low, close } = period;
    
    // X Berechnung basierend auf Open/Close Verhältnis
    let x = close < open 
      ? high + (2 * low) + close 
      : close > open 
        ? (2 * high) + low + close 
        : high + low + (2 * close);
    
    const pp = x / 4;
    
    // Basis Levels
    const r1 = x / 2 - low;
    const r2 = pp + (high - low);
    const r3 = high + 2 * (pp - low);
    
    const s1 = x / 2 - high;
    const s2 = pp - (high - low);
    const s3 = low - 2 * (high - pp);
    
    if (levels === 3) {
      return { pp, r1, r2, r3, s1, s2, s3 };
    }
    
    // Erweiterte Levels
    const r4 = r3 + (high - low);
    const r5 = r4 + (high - low);
    const s4 = s3 - (high - low);
    const s5 = s4 - (high - low);
    
    return { pp, r1, r2, r3, r4, r5, s1, s2, s3, s4, s5 };
  }
  
  private getPeriodData(data: HistoricalPrice[], timeframe: Timeframe): HistoricalPrice {
    if (data.length === 0) {
      throw new Error('No data provided for pivot calculation');
    }

    // Hole TimeframeConfig
    const config = getTimeframeConfig(timeframe);

    // Bestimme relevante Daten basierend auf Konfiguration
    const relevantData = data.slice(-config.periodsToAnalyze);
    
    if (relevantData.length === 0) {
      throw new Error('Insufficient data for the specified timeframe');
    }

    // Gruppiere Daten je nach Pivot-Typ
    let periodData: HistoricalPrice;
    
    switch (config.pivotType) {
      case 'intraday':
        // Für Intraday verwenden wir die letzte Session
        periodData = {
          date: relevantData[relevantData.length - 1].date,
          open: relevantData[0].open,
          high: Math.max(...relevantData.map(d => d.high)),
          low: Math.min(...relevantData.map(d => d.low)),
          close: relevantData[relevantData.length - 1].close,
          volume: relevantData.reduce((sum, d) => sum + d.volume, 0)
        };
        break;

      case 'daily':
        // Für tägliche Pivots verwenden wir den letzten Tag
        const lastDay = relevantData.slice(-24);  // Letzter Tag
        periodData = {
          date: lastDay[lastDay.length - 1].date,
          open: lastDay[0].open,
          high: Math.max(...lastDay.map(d => d.high)),
          low: Math.min(...lastDay.map(d => d.low)),
          close: lastDay[lastDay.length - 1].close,
          volume: lastDay.reduce((sum, d) => sum + d.volume, 0)
        };
        break;

      case 'weekly':
        // Für wöchentliche Pivots verwenden wir die letzte Woche
        const lastWeek = relevantData.slice(-120);  // Letzte Woche (5 Tage * 24h)
        periodData = {
          date: lastWeek[lastWeek.length - 1].date,
          open: lastWeek[0].open,
          high: Math.max(...lastWeek.map(d => d.high)),
          low: Math.min(...lastWeek.map(d => d.low)),
          close: lastWeek[lastWeek.length - 1].close,
          volume: lastWeek.reduce((sum, d) => sum + d.volume, 0)
        };
        break;

      case 'monthly':
        // Für monatliche Pivots verwenden wir den letzten Monat
        periodData = {
          date: relevantData[relevantData.length - 1].date,
          open: relevantData[0].open,
          high: Math.max(...relevantData.map(d => d.high)),
          low: Math.min(...relevantData.map(d => d.low)),
          close: relevantData[relevantData.length - 1].close,
          volume: relevantData.reduce((sum, d) => sum + d.volume, 0)
        };
        break;

      default:
        throw new Error('Invalid pivot type configuration');
    }

    return periodData;
  }
  
  public calculate(data: HistoricalPrice[], timeframe: Timeframe, config: PivotConfig): PivotPoints {
    const key = this.getCacheKey(data, timeframe);
    
    // Cache-Prüfung
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    // Neue Berechnung
    const pivots = config.method === 'standard'
      ? this.calculateStandardPivots(data, timeframe, config.levels)
      : this.calculateDeMarkPivots(data, timeframe, config.levels);
    
    // Cache-Speicherung
    this.cache.set(key, pivots);
    
    // Cache-Größe kontrollieren (max 100 Einträge)
    while (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      } else {
        break;
      }
    }
    
    return pivots;
  }
  
  public analyzePivotLevels(
    pivots: PivotPoints,
    currentPrice: number
  ): PivotDisplay[] {
    const levels: PivotDisplay[] = [];
    const entries = Object.entries(pivots);
    
    entries.forEach(([key, value]) => {
      if (typeof value === 'number') {
        const distance = ((value - currentPrice) / currentPrice) * 100;
        
        levels.push({
          level: key as keyof PivotPoints,
          price: value,
          distance,
          signal: distance > 0 ? 'resistance' : distance < 0 ? 'support' : 'neutral'
        });
      }
    });
    
    return levels.sort((a, b) => Math.abs(a.distance) - Math.abs(b.distance));
  }
  
  public clearCache(): void {
    this.cache.clear();
  }
}