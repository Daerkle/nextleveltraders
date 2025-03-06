import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalPrices, getQuotes } from '@/lib/fmp';
import { calculateStandardPivots, calculateDeMarkPivots, analyzePivotLevels } from '@/lib/pivots';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    const searchParams = request.nextUrl.searchParams;
    const pivotType = searchParams.get('type') || 'standard';
    const timeframe = searchParams.get('timeframe') || 'daily';
    
    // Get current quote and historical data
    const [quoteData, historicalData] = await Promise.all([
      getQuotes([symbol]),
      getHistoricalPrices(symbol, 'daily', 30) // Get last 30 days for analysis
    ]);

    if (!quoteData.length || !historicalData.length) {
      throw new Error('Failed to fetch market data');
    }

    const quote = quoteData[0];
    const lastCandle = historicalData[0];

    // Calculate pivot points
    const pivots = pivotType === 'demark' 
      ? calculateDeMarkPivots(lastCandle)
      : calculateStandardPivots(lastCandle);

    // Analyze levels
    const levels = analyzePivotLevels(pivots, quote.price, historicalData);

    return NextResponse.json({
      symbol,
      quote,
      pivots: levels,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error calculating pivot points:', error);
    return NextResponse.json(
      { error: 'Failed to calculate pivot points' },
      { status: 500 }
    );
  }
}
