const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
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
    let params = new URLSearchParams({
      apikey: FMP_API_KEY || '',
    });

    if (interval === 'daily') {
      endpoint = `historical-price-full/${symbol}`;
      // For daily data, we need more historical data for pivot calculations
      params.append('limit', Math.max(limit, 30).toString());
    } else {
      endpoint = `historical-chart/${interval}/${symbol}`;
      params.append('limit', limit.toString());
    }

    const response = await fetch(
      `${FMP_BASE_URL}/${endpoint}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historical prices');
    }

    const data = await response.json();
    const prices = interval === 'daily' ? data.historical : data;
    
    if (!Array.isArray(prices)) {
      console.error('Unexpected data format from FMP API:', data);
      return [];
    }

    // Sort data by date (newest first)
    return prices
      .map(price => ({
        date: price.date,
        open: Number(price.open) || 0,
        high: Number(price.high) || 0,
        low: Number(price.low) || 0,
        close: Number(price.close) || 0,
        volume: Number(price.volume) || 0
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
