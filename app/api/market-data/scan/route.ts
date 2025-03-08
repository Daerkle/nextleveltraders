import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchMarketData } from '@/lib/market-data';
import { analyzeSetup } from '@/lib/gemini';

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
      symbols.map(async (symbol) => {
        const data = await fetchMarketData(symbol);
        return {
          symbol,
          data
        };
      })
    );

    // 2. Setup-Analyse für jedes Symbol durchführen
    const setups = await Promise.all(
      marketData.map(async ({ symbol, data }) => {
        const analysis = await analyzeSetup(symbol, data);
        return {
          symbol,
          ...analysis
        };
      })
    );

    // 3. Nur valide Setups mit gutem R/R zurückgeben
    const validSetups = setups.filter(setup => 
      setup.riskRewardRatio >= 2 && setup.probability > 0.6
    );

    // 4. Setups in Datenbank speichern
    const { error: dbError } = await supabase
      .from('setups')
      .insert(validSetups.map(setup => ({
        symbol: setup.symbol,
        type: setup.type,
        entry_price: setup.entryPrice,
        stop_loss: setup.stopLoss,
        target: setup.target,
        risk_reward_ratio: setup.riskRewardRatio,
        probability: setup.probability,
        created_at: new Date().toISOString()
      })));

    if (dbError) {
      console.error('DB Error:', dbError);
    }

    return NextResponse.json(validSetups);

  } catch (error) {
    console.error('Scan Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Scannen der Setups' },
      { status: 500 }
    );
  }
}
