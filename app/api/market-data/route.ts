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
  watchlist: FMPQuote[];
  news: MarketNewsItem[];
}

export async function GET(): Promise<NextResponse<MarketDataResponse>> {
  try {
    // Fetch SPY and QQQ data
    const [spyResponse, qqqResponse] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/quote/SPY?apikey=${FMP_API_KEY}`),
      fetch(`https://financialmodelingprep.com/api/v3/quote/QQQ?apikey=${FMP_API_KEY}`)
    ]);

    const [spyData, qqqData] = await Promise.all([
      spyResponse.json(),
      qqqResponse.json()
    ]);

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
            text: `Price: $${item.price.toFixed(2)} | Change: ${item.change.toFixed(2)} | Volume: ${item.volume}`,
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
    const transformQuote = (quote: Partial<FMPQuote>): FMPQuote => ({
      symbol: quote?.symbol || '',
      name: quote?.name,
      price: quote?.price || 0,
      change: quote?.change || 0,
      changesPercentage: quote?.changesPercentage || 0,
      dayHigh: quote?.dayHigh || 0,
      dayLow: quote?.dayLow || 0,
      volume: quote?.volume || 0,
      avgVolume: quote?.avgVolume
    });

    return NextResponse.json({
      spy: transformQuote(spyData?.[0] || {}),
      qqq: transformQuote(qqqData?.[0] || {}),
      watchlist: Array.isArray(watchlistData) ? watchlistData.map(transformQuote) : [],
      news: newsData
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { 
        spy: {} as FMPQuote,
        qqq: {} as FMPQuote,
        watchlist: [],
        news: []
      },
      { status: 500 }
    );
  }
}