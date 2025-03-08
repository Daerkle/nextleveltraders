import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalPrices } from '@/lib/fmp';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    
    // Hole historische Daten (30 Tage für Pivot Berechnungen)
    const historicalData = await getHistoricalPrices(symbol, 'daily', 30);
    
    if (!historicalData || historicalData.length === 0) {
      return NextResponse.json(
        { error: 'Keine historischen Daten gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json(historicalData);
  } catch (error) {
    console.error('Fehler beim Abrufen historischer Daten:', error);
    return NextResponse.json(
      { error: 'Interner Server Fehler' },
      { status: 500 }
    );
  }
}