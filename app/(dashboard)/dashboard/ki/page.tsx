"use client";

import { useEffect, useState } from 'react';
import { Setup } from '@/lib/gemini';
import { SetupTable } from '@/components/setup-table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
const SCAN_INTERVAL = 300000; // 5 Minuten
const WATCHLIST_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD', 'TSLA'];

export default function KIAnalysePage() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSetups = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/market-data/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbols: WATCHLIST_SYMBOLS
        })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Laden der Setups');
      }

      const data = await response.json();
      setSetups(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Fehler:', err);
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSetups();

    // Setup interval for automatic updates
    const intervalId = setInterval(fetchSetups, SCAN_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">KI Trading Analyse</h1>
          <p className="text-muted-foreground">
            Automatische Setup-Erkennung mit Pivot-Level Analyse
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">
              Letztes Update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Badge variant="outline">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `${setups.length} Setups gefunden`
            )}
          </Badge>
        </div>
      </div>

      {error ? (
        <Card className="p-4 mb-6 border-destructive">
          <p className="text-destructive">{error}</p>
        </Card>
      ) : (
        <SetupTable setups={setups} />
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Hinweise</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          <li>Setups werden alle 5 Minuten automatisch aktualisiert</li>
          <li>Die Wahrscheinlichkeit basiert auf historischen Daten und Marktausrichtung</li>
          <li>Berücksichtige immer den übergeordneten Markttrend (SPY/QQQ)</li>
          <li>Setups mit Risk/Reward unter 1:2 werden automatisch gefiltert</li>
        </ul>
      </div>
    </div>
  );
}