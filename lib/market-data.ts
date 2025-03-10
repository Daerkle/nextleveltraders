import yahooFinance from 'yahoo-finance2';
import { MarketData, MarketDataPoint, PivotLevels, DeMarkLevels } from './types/market';

function transformYahooData(data: any): MarketDataPoint {
  return {
    high: data.high,
    low: data.low,
    close: data.close,
    open: data.open
  };
}

export async function fetchMarketData(symbol: string): Promise<MarketData> {
  try {
    // Tageskerzen der letzten 30 Tage abrufen
    const dailyData = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      period2: new Date(),
      interval: '1d'
    });

    // Aktuelle Quote für den letzten Stand
    const quote = await yahooFinance.quote(symbol);

    if (!dailyData.length || !quote) {
      throw new Error(`Keine Daten verfügbar für ${symbol}`);
    }

    // Sicherstellen, dass wir gültige Werte haben
    const regularMarketPrice = quote.regularMarketPrice ?? dailyData[dailyData.length - 1].close;
    
    // Erstelle ein MarketDataPoint aus der Quote
    const currentData: MarketDataPoint = {
      high: quote.regularMarketDayHigh ?? regularMarketPrice,
      low: quote.regularMarketDayLow ?? regularMarketPrice,
      close: regularMarketPrice,
      open: quote.regularMarketOpen ?? regularMarketPrice
    };

    // Verwende die letzten 7 Tageskerzen als "Stundenkerzen"
    const recentData = dailyData.slice(-7).map(transformYahooData);

    return {
      daily: dailyData.map(transformYahooData),
      hourly: recentData,
      current: currentData
    };
  } catch (error) {
    console.error(`Fehler beim Abrufen der Marktdaten für ${symbol}:`, error);
    throw error;
  }
}

// Berechnet Standard Pivot Points
export function calculateStandardPivots(data: MarketDataPoint): PivotLevels {
  const high = data.high;
  const low = data.low;
  const close = data.close;

  const pivot = (high + low + close) / 3;
  const r1 = (2 * pivot) - low;
  const s1 = (2 * pivot) - high;
  const r2 = pivot + (high - low);
  const s2 = pivot - (high - low);

  return { pivot, r1, s1, r2, s2 };
}

// Berechnet DeMark Pivot Points
export function calculateDeMarkPivots(data: MarketDataPoint): DeMarkLevels {
  const high = data.high;
  const low = data.low;
  const close = data.close;
  const open = data.open;

  const x = close < open
    ? (high + (2 * low) + close) / 4
    : ((2 * high) + low + close) / 4;

  const dmR1 = x + (high - low);
  const dmS1 = x - (high - low);

  return { x, dmR1, dmS1 };
}