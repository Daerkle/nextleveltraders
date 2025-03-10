"use client";

import { useEffect, useState } from "react";
import { YahooQuote } from "@/lib/yahoo-finance";

interface MarketDataRefresherProps {
  initialSpy: YahooQuote;
  initialQqq: YahooQuote;
  initialWatchlist: YahooQuote[];
  onDataUpdate: (data: {
    spy: YahooQuote;
    qqq: YahooQuote;
    watchlist: YahooQuote[];
  }) => void;
  refreshInterval?: number; // in milliseconds
}

export function MarketDataRefresher({
  initialSpy,
  initialQqq,
  initialWatchlist,
  onDataUpdate,
  refreshInterval = 10000, // 10 Sekunden als Standard
}: MarketDataRefresherProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Funktion zum Abrufen der aktuellen Marktdaten
  const fetchMarketData = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/market-data?t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch market data");
      }

      const data = await res.json();
      
      // Debug-Ausgabe
      console.log("Aktualisierte Marktdaten erhalten:", new Date().toLocaleTimeString());
      
      // Callback mit aktualisierten Daten
      onDataUpdate({
        spy: data.spy,
        qqq: data.qqq,
        watchlist: data.watchlist,
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Fehler beim Abrufen der Marktdaten:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Einrichten des Intervalls für regelmäßige Aktualisierungen
  useEffect(() => {
    // Sofort beim Laden aktualisieren
    fetchMarketData();

    // Intervall für regelmäßige Aktualisierungen
    const intervalId = setInterval(fetchMarketData, refreshInterval);

    // Cleanup beim Unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Rendert keine UI-Elemente
  return null;
}