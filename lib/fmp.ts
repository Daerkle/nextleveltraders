const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY || '7429b5ed13d44707b05ea011b9461a92';
// Verwende die API v3, die nachweislich funktioniert
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3/';

// Logging für Debugging
console.log('FMP API Key:', FMP_API_KEY);
console.log('FMP Base URL:', FMP_BASE_URL);

interface FMPConfig {
  dataDelay: number;
  lastUpdate: number | null;
}

// Hilfsfunktion zum Abrufen der API-Konfiguration
function getFMPConfig(): FMPConfig {
  if (typeof window === 'undefined') {
    return { dataDelay: 900, lastUpdate: null };
  }

  const delay = window.localStorage.getItem('fmp_data_delay');
  const lastUpdate = window.localStorage.getItem('fmp_last_update');

  return {
    dataDelay: delay ? parseInt(delay, 10) : 900,
    lastUpdate: lastUpdate ? parseInt(lastUpdate, 10) : null
  };
}

// Hilfsfunktion zum Setzen des letzten Updates
function setLastUpdate(timestamp: number) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('fmp_last_update', timestamp.toString());
  }
}

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
  delayed: boolean;
  timestamp: string;
  nextUpdate: string;
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
    const { dataDelay, lastUpdate } = getFMPConfig();
    const currentTime = Math.floor(Date.now() / 1000);
    const timestamp = currentTime - dataDelay;

    // Prüfe ob wir neue Daten abrufen müssen
    if (lastUpdate && currentTime - lastUpdate < dataDelay) {
      console.log('Using cached data, next update in:', dataDelay - (currentTime - lastUpdate), 'seconds');
      // Instead of returning empty array, we should still fetch the data
      // This is a temporary fix to ensure data is always returned
    }
    
    // Verwende die korrekten Endpunkte gemäß der FMP-Dokumentation
    // Verwende die v3 API direkt, da diese am stabilsten ist
    const urls = [
      // Haupt-API-Endpunkt (v3)
      `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${FMP_API_KEY}`,
      // Fallback auf den Batch-Quote-Endpunkt
      `https://financialmodelingprep.com/api/v3/quote-short/${symbols.join(',')}?apikey=${FMP_API_KEY}`,
      // Letzter Fallback auf die stable API
      `${FMP_BASE_URL}/quote?symbol=${symbols.join(',')}&apikey=${FMP_API_KEY}`
    ];
    
    let response;
    let error;
    
    // Try each URL until one works
    for (const url of urls) {
      try {
        console.log('Fetching quotes from:', url);
        response = await fetch(url, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          console.log('Successfully fetched data from:', url);
          break; // Exit the loop if we get a successful response
        } else {
          const errorText = await response.text();
          console.warn(`API error from ${url}:`, {
            status: response.status,
            statusText: response.statusText,
            body: errorText.substring(0, 100) // Limit log size
          });
        }
      } catch (e) {
        console.warn(`Failed to fetch from ${url}:`, e);
        error = e;
      }
    }
    
    // If we didn't get a successful response from any URL
    if (!response || !response.ok) {
      console.error('All FMP API endpoints failed');
      throw new Error(`Failed to fetch quotes: ${error || 'All endpoints failed'}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Unexpected data format:', data);
      return [];
    }

    // Aktualisiere den Zeitstempel des letzten Updates
    setLastUpdate(currentTime);
    
    // Transformiere die Daten und stelle sicher, dass die Prozentangaben korrekt sind
    return data.map(quote => {
      // Stelle sicher, dass changesPercentage korrekt ist
      // Manchmal liefert die API changesPercentage als String mit '%' am Ende
      let changesPercentage = quote.changesPercentage;
      if (typeof changesPercentage === 'string') {
        changesPercentage = parseFloat(changesPercentage.replace('%', ''));
      }

      // Debug-Ausgabe für die Prozentangaben
      console.log(`Symbol: ${quote.symbol}, Price: ${quote.price}, Change: ${quote.change}, ChangesPercentage: ${changesPercentage}`);
      
      return {
        symbol: quote.symbol,
        name: quote.name,
        price: Number(quote.price) || 0,
        change: Number(quote.change) || 0,
        changesPercentage: Number(changesPercentage) || 0,
        dayHigh: Number(quote.dayHigh) || 0,
        dayLow: Number(quote.dayLow) || 0,
        volume: Number(quote.volume) || 0,
        avgVolume: Number(quote.avgVolume) || 0,
        delayed: dataDelay > 0,
        timestamp: new Date(timestamp * 1000).toISOString(),
        nextUpdate: new Date((currentTime + dataDelay) * 1000).toISOString()
      };
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
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
    
    console.log('Interval:', interval, 'Endpoint:', endpoint);

    // Use the stable API endpoint
    const url = `${FMP_BASE_URL}${endpoint}?${params.toString()}`;
    console.log('Fetching historical prices from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

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
    // Use the stable API endpoint for technical indicators
    const url = `${FMP_BASE_URL}technical_indicator/${interval}/${symbol}?period=${period}&type=${indicator}&apikey=${FMP_API_KEY}`;
    console.log('Fetching technical indicator from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

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
    const url = `${FMP_BASE_URL}search?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_API_KEY}`;
    console.log('Searching symbols from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
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
    const url = `${FMP_BASE_URL}quote/%5EGSPC,%5EIXIC?apikey=${FMP_API_KEY}`;
    console.log('Fetching market indices from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
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
