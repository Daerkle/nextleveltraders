import { calculateStandardPivots, calculateDeMarkPivots } from './market-data';
import { MarketData, Setup, MarketDataPoint } from './types/market';

export async function analyzeSetup(symbol: string, marketData: MarketData): Promise<Setup | null> {
  try {
    const { daily, hourly, current } = marketData;

    if (!daily.length || !current) {
      console.error(`Unvollständige Marktdaten für ${symbol}`);
      return null;
    }

    // Standard Pivots für verschiedene Zeitrahmen berechnen
    const dailyPivots = calculateStandardPivots(daily[daily.length - 2]); // Gestern
    
    // Wöchentliche High/Low/Close/Open berechnen
    const weeklyData: MarketDataPoint = {
      high: Math.max(...daily.slice(-5).map(d => d.high)),
      low: Math.min(...daily.slice(-5).map(d => d.low)),
      close: daily[daily.length - 1].close,
      open: daily[daily.length - 5].open // Öffnungskurs vor 5 Tagen
    };
    
    const weeklyPivots = calculateStandardPivots(weeklyData);

    // DeMark Pivots berechnen
    const deMarkPivots = calculateDeMarkPivots(daily[daily.length - 2]);

    // Aktueller Kurs
    const currentPrice = current.close;

    // Long Setup prüfen
    if (currentPrice > deMarkPivots.dmR1 && currentPrice > weeklyPivots.r1) {
      const stopLoss = Math.min(dailyPivots.s1, deMarkPivots.dmS1);
      const target = weeklyPivots.r2;
      const risk = currentPrice - stopLoss;
      const reward = target - currentPrice;
      const riskRewardRatio = reward / risk;

      if (riskRewardRatio >= 2) {
        return {
          symbol,
          type: 'LONG',
          entryPrice: currentPrice,
          stopLoss,
          target,
          riskRewardRatio,
          probability: 0.7,
          reason: 'Ausbruch über DM R1 mit Weekly R1 Bestätigung',
          timestamp: new Date().toISOString()
        };
      }
    }

    // Short Setup prüfen
    if (currentPrice < deMarkPivots.dmS1 && currentPrice < weeklyPivots.s1) {
      const stopLoss = Math.max(dailyPivots.r1, deMarkPivots.dmR1);
      const target = weeklyPivots.s2;
      const risk = stopLoss - currentPrice;
      const reward = currentPrice - target;
      const riskRewardRatio = reward / risk;

      if (riskRewardRatio >= 2) {
        return {
          symbol,
          type: 'SHORT',
          entryPrice: currentPrice,
          stopLoss,
          target,
          riskRewardRatio,
          probability: 0.7,
          reason: 'Ausbruch unter DM S1 mit Weekly S1 Bestätigung',
          timestamp: new Date().toISOString()
        };
      }
    }

    return null; // Kein valides Setup gefunden

  } catch (error) {
    console.error(`Fehler bei der Setup-Analyse für ${symbol}:`, error);
    return null;
  }
}