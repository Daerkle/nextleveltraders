import { NextResponse } from "next/server";

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

interface MarketNewsItem {
  title: string;
  text: string;
  symbol: string;
  publishedDate: string;
}

interface FMPQuote {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changesPercentage: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume?: number;
}

interface MarketDataResponse {
  spy: FMPQuote;
  qqq: FMPQuote;
  vix: FMPQuote;
  tlt: FMPQuote;
  iwm: FMPQuote;
  dxy: FMPQuote;
  watchlist: FMPQuote[];
  news: MarketNewsItem[];
}

export async function GET(): Promise<NextResponse<MarketDataResponse>> {
  try {
    // Fetch all indices data in parallel
    const indicesResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/SPY,QQQ,VIX,TLT,IWM,DXY?apikey=${FMP_API_KEY}`
    );
    
    const indicesData = await indicesResponse.json();
    
    // Extract specific indices from the response
    const spyQuote = indicesData.find((item: FMPQuote) => item.symbol === 'SPY') || null;
    const qqqQuote = indicesData.find((item: FMPQuote) => item.symbol === 'QQQ') || null;
    const vixQuote = indicesData.find((item: FMPQuote) => item.symbol === 'VIX') || null;
    const tltQuote = indicesData.find((item: FMPQuote) => item.symbol === 'TLT') || null;
    const iwmQuote = indicesData.find((item: FMPQuote) => item.symbol === 'IWM') || null;
    const dxyQuote = indicesData.find((item: FMPQuote) => item.symbol === 'DXY') || null;

    // Fetch watchlist data
    const watchlistResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/AAPL,MSFT,AMZN,NVDA?apikey=${FMP_API_KEY}`
    );
    const watchlistData = await watchlistResponse.json();

    // Fetch market news using available endpoint
    const newsData: MarketNewsItem[] = [];
    try {
      const newsResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${FMP_API_KEY}`
      );
      const responseData = await newsResponse.json();
      
      if (Array.isArray(responseData)) {
        responseData.slice(0, 5).forEach((item: FMPQuote) => {
          newsData.push({
            title: `${item.symbol} - ${item.changesPercentage.toFixed(2)}%`,
            text: `Price: ${item.price.toFixed(2)} | Change: ${item.change.toFixed(2)} | Volume: ${item.volume}`,
            symbol: item.symbol,
            publishedDate: new Date().toISOString()
          });
        });
      } else {
        console.warn('Unexpected market data format:', responseData);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }

    // Transform the data to use correct percentage changes
    const transformQuote = (quote: Partial<FMPQuote>, symbol: string): FMPQuote => ({
      symbol: quote?.symbol || symbol,
      name: quote?.name,
      price: quote?.price || 0,
      change: quote?.change || 0,
      changesPercentage: quote?.changesPercentage || 0,
      dayHigh: quote?.dayHigh || 0,
      dayLow: quote?.dayLow || 0,
      volume: quote?.volume || 0,
      avgVolume: quote?.avgVolume
    });
    
    console.log('Market data fetched for:', indicesData.map((q: FMPQuote) => q.symbol).join(', '));
    
    return NextResponse.json({
      spy: transformQuote(spyQuote, 'SPY'),
      qqq: transformQuote(qqqQuote, 'QQQ'),
      vix: transformQuote(vixQuote, 'VIX'),
      tlt: transformQuote(tltQuote, 'TLT'),
      iwm: transformQuote(iwmQuote, 'IWM'),
      dxy: transformQuote(dxyQuote, 'DXY'),
      watchlist: Array.isArray(watchlistData) ? watchlistData.map(q => transformQuote(q, q.symbol)) : [],
      news: newsData
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    // Gib Standardwerte zurück, um Fehler auf der Client-Seite zu vermeiden
    return NextResponse.json(
      { 
        spy: { symbol: 'SPY', price: 0, change: 0, changesPercentage: 0, dayHigh: 0, dayLow: 0, volume: 0 },
        qqq: { symbol: 'QQQ', price: 0, change: 0, changesPercentage: 0, dayHigh: 0, dayLow: 0, volume: 0 },
        vix: { symbol: 'VIX', price: 0, change: 0, changesPercentage: 0, dayHigh: 0, dayLow: 0, volume: 0 },
        tlt: { symbol: 'TLT', price: 0, change: 0, changesPercentage: 0, dayHigh: 0, dayLow: 0, volume: 0 },
        iwm: { symbol: 'IWM', price: 0, change: 0, changesPercentage: 0, dayHigh: 0, dayLow: 0, volume: 0 },
        dxy: { symbol: 'DXY', price: 0, change: 0, changesPercentage: 0, dayHigh: 0, dayLow: 0, volume: 0 },
        watchlist: [],
        news: []
      },
      { status: 500 }
    );
  }
}