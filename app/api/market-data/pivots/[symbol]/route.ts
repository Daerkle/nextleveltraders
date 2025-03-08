import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalPrices } from '@/lib/fmp';
import { calculateStandardPivots, calculateDeMarkPivots } from '@/lib/pivots';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    
    // Hole die letzten Kursdaten für Pivot-Berechnung
    const historicalData = await getHistoricalPrices(symbol, 'daily', 1);
    
    if (!historicalData || historicalData.length === 0) {
      return NextResponse.json(
        { error: 'Keine Kursdaten gefunden' },
        { status: 404 }
      );
    }

    const latestPrice = historicalData[0];
    
    // Berechne beide Pivot-Typen
    const standardPivots = calculateStandardPivots(latestPrice);
    const demarkPivots = calculateDeMarkPivots(latestPrice);
    
    return NextResponse.json({
      standard: standardPivots,
      demark: demarkPivots,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Fehler bei der Pivot-Berechnung:', error);
    return NextResponse.json(
      { error: 'Interner Server Fehler' },
      { status: 500 }
    );
  }
}