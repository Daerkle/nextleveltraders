import { getQuotes, getHistoricalPrices, type TimeInterval } from '@/lib/fmp';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval') as TimeInterval;
  const limit = searchParams.get('limit');

  if (!symbol || !interval) {
    return NextResponse.json(
      { error: 'Symbol and interval parameters are required' },
      { status: 400 }
    );
  }

  try {
    const [quoteData, pricesData] = await Promise.all([
      getQuotes([symbol]),
      getHistoricalPrices(
        symbol,
        interval,
        limit ? parseInt(limit) : interval === 'daily' ? 30 : 100
      )
    ]);

    if (!quoteData[0]) {
      return NextResponse.json(
        { error: 'Symbol not found' },
        { status: 404 }
      );
    }

    if (pricesData.length === 0) {
      return NextResponse.json(
        { error: 'No historical data available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      quote: quoteData[0],
      prices: pricesData
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
