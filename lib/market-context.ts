import { getQuotes, getHistoricalPrices, getTechnicalIndicator } from './fmp';

export async function getMarketContext(symbol: string) {
  try {
    const [quote, historicalData, ema5, ema12] = await Promise.all([
      getQuotes([symbol]),
      getHistoricalPrices(symbol, 'daily', 5),
      getTechnicalIndicator(symbol, 'ema', 5),
      getTechnicalIndicator(symbol, 'ema', 12)
    ]);

    const currentPrice = quote[0]?.price;
    const priceChange = quote[0]?.change;
    const changePercent = quote[0]?.changesPercentage;
    
    // Calculate price trend
    const trend = ema5[0]?.value > ema12[0]?.value ? 'bullisch' : 'bärisch';
    
    // Calculate volatility (using 5-day high-low range)
    const volatility = historicalData.reduce((acc, curr) => {
      const range = ((curr.high - curr.low) / curr.low) * 100;
      return acc + range;
    }, 0) / historicalData.length;

    return {
      currentPrice: currentPrice?.toFixed(2),
      priceChange: priceChange?.toFixed(2),
      changePercent: changePercent?.toFixed(2),
      trend,
      volatility: volatility.toFixed(2),
      volume: quote[0]?.volume,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting market context:', error);
    return null;
  }
}
