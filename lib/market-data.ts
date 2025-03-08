import yahooFinance from 'yahoo-finance2';

export async function fetchMarketData(symbol: string) {
  try {
    // Tageskerzen der letzten 30 Tage abrufen
    const dailyData = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      period2: new Date(),
      interval: '1d'
    });

    // Stunden-Kerzen des aktuellen Tages
    const hourlyData = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 24 * 60 * 60 * 1000),
      period2: new Date(),
      interval: '60m'
    });

    return {
      daily: dailyData,
      hourly: hourlyData,
      current: hourlyData[hourlyData.length - 1]
    };
  } catch (error) {
    console.error(`Fehler beim Abrufen der Marktdaten für ${symbol}:`, error);
    throw error;
  }
}

// Berechnet Standard Pivot Points
export function calculateStandardPivots(data: any) {
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
export function calculateDeMarkPivots(data: any) {
  const high = data.high;
  const low = data.low;
  const close = data.close;
  const open = data.open;

  let x;
  if (close < open) {
    x = (high + (2 * low) + close) / 4;
  } else {
    x = ((2 * high) + low + close) / 4;
  }

  const dmR1 = x + (high - low);
  const dmS1 = x - (high - low);

  return { x, dmR1, dmS1 };
}