import yahooFinance from 'yahoo-finance2';
import { QuoteResponseArray } from 'yahoo-finance2/dist/esm/src/modules/quote';

export interface YahooQuote {
  symbol: string;
  longName?: string;
  shortName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  averageDailyVolume3Month?: number;
}

export interface MarketDataResponse {
  spy: YahooQuote;
  qqq: YahooQuote;
  watchlist: YahooQuote[];
  news: MarketNewsItem[];
}

export interface MarketNewsItem {
  title: string;
  text: string;
  symbol: string;
  publishedDate: string;
}

export async function getQuotes(symbols: string[]): Promise<YahooQuote[]> {
  try {
    const result = await yahooFinance.quote(symbols);
    
    // Yahoo Finance kann ein einzelnes Objekt oder ein Array zurückgeben
    const quotes = Array.isArray(result) ? result : [result];
    
    return quotes.map(quote => ({
      symbol: quote.symbol,
      longName: quote.longName,
      shortName: quote.shortName,
      regularMarketPrice: quote.regularMarketPrice || 0,
      regularMarketChange: quote.regularMarketChange || 0,
      regularMarketChangePercent: quote.regularMarketChangePercent || 0,
      regularMarketDayHigh: quote.regularMarketDayHigh || 0,
      regularMarketDayLow: quote.regularMarketDayLow || 0,
      regularMarketVolume: quote.regularMarketVolume || 0,
      averageDailyVolume3Month: quote.averageDailyVolume3Month
    }));
  } catch (error) {
    console.error('Error fetching Yahoo Finance quotes:', error);
    return [];
  }
}

export async function getMarketTrend(symbol: string): Promise<{
  trend: 'Bullisch' | 'Bärisch' | 'Neutral';
  changePercent: number;
}> {
  try {
    const quotes = await getQuotes([symbol]);
    
    if (quotes.length === 0) {
      return { trend: 'Neutral', changePercent: 0 };
    }
    
    const quote = quotes[0];
    const changePercent = quote.regularMarketChangePercent;
    
    let trend: 'Bullisch' | 'Bärisch' | 'Neutral' = 'Neutral';
    if (changePercent > 0.1) {
      trend = 'Bullisch';
    } else if (changePercent < -0.1) {
      trend = 'Bärisch';
    }
    
    return { 
      trend, 
      changePercent 
    };
  } catch (error) {
    console.error(`Error getting market trend for ${symbol}:`, error);
    return { trend: 'Neutral', changePercent: 0 };
  }
}

export async function getMarketNews(): Promise<MarketNewsItem[]> {
  try {
    // Wir holen einige Aktien, um ihre aktuellen Bewegungen als "News" zu verwenden
    // In einer echten Anwendung würden Sie hier einen spezifischen News-API-Endpunkt verwenden
    const marketMovers = await getQuotes(['AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL']);
    
    return marketMovers.map(mover => ({
      title: `${mover.symbol} - ${mover.regularMarketChangePercent.toFixed(2)}%`,
      text: `Preis: $${mover.regularMarketPrice.toFixed(2)} | Änderung: ${mover.regularMarketChange.toFixed(2)} | Volumen: ${mover.regularMarketVolume.toLocaleString()}`,
      symbol: mover.symbol,
      publishedDate: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error getting market news:', error);
    return [];
  }
}