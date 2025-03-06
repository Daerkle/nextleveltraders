import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalPrices, getQuotes, getTechnicalIndicator, type TimeInterval } from '@/lib/fmp';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    const searchParams = request.nextUrl.searchParams;
    const interval = (searchParams.get('interval') || 'daily') as TimeInterval;
    const indicators = searchParams.get('indicators')?.split(',') || [];

    // Fetch data in parallel
    const [quote, prices, ...indicatorData] = await Promise.all([
      getQuotes([symbol]),
      getHistoricalPrices(symbol, interval),
      ...indicators.map(ind => {
        const [name, period] = ind.split(':');
        return getTechnicalIndicator(
          symbol,
          name as 'ema' | 'sma' | 'rsi' | 'macd',
          Number(period) || 20,
          interval
        );
      })
    ]);

    return NextResponse.json({
      quote: quote[0] || null,
      prices,
      indicators: indicators.map((ind, index) => ({
        name: ind.split(':')[0],
        data: indicatorData[index]
      }))
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
