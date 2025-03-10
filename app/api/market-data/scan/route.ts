import { NextRequest, NextResponse } from 'next/server';
import { fetchMarketData } from '@/lib/market-data';
import { analyzeSetup } from '@/lib/gemini';
import { getRedisClient, redisSet } from '@/lib/redis';
import { Setup, MarketData } from '@/lib/types/market';

const SETUP_EXPIRATION = 24 * 60 * 60; // 24 Stunden in Sekunden

interface MarketDataResult {
  symbol: string;
  data: MarketData | null;
  error: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'Ungültige Symbole' },
        { status: 400 }
      );
    }

    // 1. Marktdaten für alle Symbole abrufen
    const marketData = await Promise.all(
      symbols.map(async (symbol): Promise<MarketDataResult> => {
        try {
          const data = await fetchMarketData(symbol);
          return {
            symbol,
            data,
            error: null
          };
        } catch (error) {
          console.error(`Fehler beim Abrufen der Marktdaten für ${symbol}:`, error);
          return {
            symbol,
            data: null,
            error: `Marktdaten nicht verfügbar für ${symbol}`
          };
        }
      })
    );

    // Filtern der erfolgreichen Marktdaten-Abrufe und type guard für MarketData
    const validMarketData = marketData.filter((item): item is MarketDataResult & { data: MarketData } => 
      item.error === null && item.data !== null
    );

    // 2. Setup-Analyse für jedes Symbol durchführen
    const analyzedSetups = await Promise.all(
      validMarketData.map(async ({ symbol, data }) => {
        try {
          return await analyzeSetup(symbol, data);
        } catch (error) {
          console.error(`Analyse-Fehler für ${symbol}:`, error);
          return null;
        }
      })
    );

    // 3. Nur valide Setups mit gutem R/R filtern
    const validSetups = analyzedSetups.filter((setup): setup is Setup => 
      setup !== null && setup.riskRewardRatio >= 2 && setup.probability > 0.6
    );

    // 4. Setups in Redis speichern
    const redis = getRedisClient();
    await Promise.all(
      validSetups.map(async (setup) => {
        const setupKey = `setups:${setup.symbol}:${Date.now()}`;
        try {
          await redisSet(setupKey, JSON.stringify(setup));
          await redis.expire(setupKey, SETUP_EXPIRATION);
        } catch (error) {
          console.error(`Redis Speicherfehler für ${setup.symbol}:`, error);
        }
      })
    );

    // 5. Fehlermeldungen sammeln
    const errors = marketData
      .filter((item): item is MarketDataResult & { error: string } => 
        item.error !== null
      )
      .map(item => ({
        symbol: item.symbol,
        error: item.error
      }));

    // 6. Antwort zusammenstellen
    return NextResponse.json({
      setups: validSetups,
      errors: errors.length > 0 ? errors : undefined,
      scannedSymbols: symbols.length,
      validSetups: validSetups.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scan Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Scannen der Setups' },
      { status: 500 }
    );
  }
}
