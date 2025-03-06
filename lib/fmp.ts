const FMP_API_KEY = process.env.FMP_API_KEY;
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

export type TimeInterval = '1min' | '5min' | '15min' | '30min' | '1hour' | '4hour' | 'daily';

export interface Quote {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changesPercentage: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  value: number;
  date: string;
}

export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  if (!symbols.length) return [];
  
  try {
    const response = await fetch(
      `${FMP_BASE_URL}/quote/${symbols.join(',')}?apikey=${FMP_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    
    // Transform the data to ensure correct percentage values
    return data.map(quote => ({
      symbol: quote.symbol,
      name: quote.name,
      price: Number(quote.price) || 0,
      change: Number(quote.change) || 0,
      changesPercentage: Number(quote.changesPercentage) || 0,
      dayHigh: Number(quote.dayHigh) || 0,
      dayLow: Number(quote.dayLow) || 0,
      volume: Number(quote.volume) || 0,
      avgVolume: Number(quote.avgVolume) || 0
    }));
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}

export async function getHistoricalPrices(
  symbol: string,
  interval: TimeInterval = 'daily',
  limit: number = 100
): Promise<HistoricalPrice[]> {
  try {
    let endpoint = '';
    if (interval === 'daily') {
      endpoint = `historical-price-full/${symbol}`;
    } else {
      endpoint = `historical-chart/${interval}/${symbol}`;
    }

    const response = await fetch(
      `${FMP_BASE_URL}/${endpoint}?apikey=${FMP_API_KEY}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historical prices');
    }

    const data = await response.json();
    const prices = interval === 'daily' ? data.historical : data;
    return Array.isArray(prices) ? prices.reverse() : [];
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
}

export async function getTechnicalIndicator(
  symbol: string,
  indicator: 'ema' | 'sma' | 'rsi' | 'macd',
  period: number = 20,
  interval: TimeInterval = 'daily'
): Promise<TechnicalIndicator[]> {
  try {
    const response = await fetch(
      `${FMP_BASE_URL}/technical_indicator/${interval}/${symbol}?period=${period}&type=${indicator}&apikey=${FMP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${indicator.toUpperCase()}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching ${indicator.toUpperCase()}:`, error);
    return [];
  }
}

export async function searchSymbol(query: string) {
  try {
    const response = await fetch(
      `${FMP_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search symbols');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error searching symbols:', error);
    return [];
  }
}

export async function getMarketIndices() {
  try {
    const response = await fetch(
      `${FMP_BASE_URL}/quote/%5EGSPC,%5EIXIC?apikey=${FMP_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch market indices');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return [];
  }
}
