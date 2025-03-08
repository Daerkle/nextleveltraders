import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalPrices } from '@/lib/fmp';
import { calculateStandardPivots, analyzePivotLevels, PivotPoints } from '@/lib/pivots';
import { getQuotes } from '@/lib/fmp';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    
    // Hole aktuelle Quote für den aktuellen Kurs
    const quotes = await getQuotes([symbol]);
    if (!quotes || quotes.length === 0) {
      return NextResponse.json(
        { error: 'Keine Quote gefunden' },
        { status: 404 }
      );
    }
    const currentPrice = quotes[0].price;

    // Hole historische Daten für Pivot-Berechnung und Analyse
    const historicalData = await getHistoricalPrices(symbol, 'daily', 30);
    if (!historicalData || historicalData.length === 0) {
      return NextResponse.json(
        { error: 'Keine historischen Daten gefunden' },
        { status: 404 }
      );
    }

    // Berechne Pivot-Punkte
    const pivots = calculateStandardPivots(historicalData[0]);
    
    // Analysiere die Pivot-Level (Distanz zum Kurs, Berührungspunkte etc.)
    const pivotLevels = analyzePivotLevels(
      pivots,
      currentPrice,
      historicalData
    );

    return NextResponse.json({
      levels: pivotLevels,
      currentPrice,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Fehler bei der Pivot-Level Analyse:', error);
    return NextResponse.json(
      { error: 'Interner Server Fehler' },
      { status: 500 }
    );
  }
}