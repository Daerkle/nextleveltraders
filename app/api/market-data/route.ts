import { NextResponse } from "next/server";

const FMP_API_KEY = process.env.FMP_API_KEY;

export async function GET() {
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
    let newsData = [];
    try {
      const newsResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${FMP_API_KEY}`
      );
      const responseData = await newsResponse.json();
      
      if (Array.isArray(responseData)) {
        newsData = responseData.slice(0, 5).map(item => ({
          title: `${item.symbol} - ${item.changesPercentage.toFixed(2)}%`,
          text: `Price: $${item.price.toFixed(2)} | Change: ${item.change.toFixed(2)} | Volume: ${item.volume}`,
          symbol: item.symbol,
          publishedDate: new Date().toISOString()
        }));
      } else {
        console.warn('Unexpected market data format:', responseData);
        newsData = [];
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      newsData = [];
    }

    // Transform the data to use correct percentage changes
    const transformQuote = (quote: any) => ({
      ...quote,
      change: quote?.changesPercentage || 0, // Use changesPercentage for percentage change
      price: quote?.price || 0,
      symbol: quote?.symbol || ''
    });

    return NextResponse.json({
      spy: transformQuote(spyData[0] || { changesPercentage: 0 }),
      qqq: transformQuote(qqqData[0] || { changesPercentage: 0 }),
      watchlist: Array.isArray(watchlistData) ? watchlistData.map(transformQuote) : [],
      news: newsData
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}