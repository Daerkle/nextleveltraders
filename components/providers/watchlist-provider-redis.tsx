"use client"

import { useEffect, useState } from 'react'
import { useWatchlistStore } from '@/stores/use-watchlist-store'
import { WatchlistSidebar } from '@/components/watchlist-sidebar'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

interface WatchlistProviderProps {
  children: React.ReactNode
}

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const store = useWatchlistStore()
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Lade Marktdaten für die Watchlist-Symbole
  useEffect(() => {
    if (!store.items.length) return;

    const fetchMarketData = async () => {
      try {
        const symbols = store.items.map(item => item.symbol).join(',');
        const response = await fetch(`/api/market-data/quotes?symbols=${symbols}`);
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Marktdaten');
        }

        const data = await response.json();
        if (!Array.isArray(data)) return;

        // Aktualisiere die Items mit den aktuellen Marktdaten
        store.setItems(
          store.items.map(item => {
            const quote = data.find(q => q.symbol === item.symbol);
            return {
              ...item,
              price: quote?.price || 0,
              change: quote?.changesPercentage || 0
            };
          })
        );
      } catch (error) {
        console.error('Fehler beim Laden der Marktdaten:', error);
      }
    };

    // Initial laden
    fetchMarketData();

    // Alle 60 Sekunden aktualisieren
    const interval = setInterval(fetchMarketData, 60000);

    return () => clearInterval(interval);
  }, [store, store.items]);

  // Lade die Watchlist aus der API
  useEffect(() => {
    const loadWatchlist = async () => {
      if (!isSignedIn) {
        console.log('Benutzer ist nicht angemeldet, keine Watchlist geladen');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/watchlist');
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Watchlist');
        }

        const data = await response.json();
        
        if (data && Array.isArray(data.items)) {
          store.setItems(data.items);
          console.log('Watchlist erfolgreich geladen:', data.items.length, 'Symbole');
        } else {
          console.log('Keine Watchlist-Daten gefunden oder leere Watchlist');
          store.setItems([]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Watchlist:', error);
        toast.error('Fehler beim Laden der Watchlist');
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, [isSignedIn, store]);

  // Speichere Änderungen an der Watchlist
  useEffect(() => {
    const saveWatchlist = async () => {
      if (!isSignedIn || !store.items.length) return;

      try {
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: store.items }),
        });

        if (!response.ok) {
          throw new Error('Fehler beim Speichern der Watchlist');
        }

        console.log('Watchlist erfolgreich gespeichert');
      } catch (error) {
        console.error('Fehler beim Speichern der Watchlist:', error);
        toast.error('Fehler beim Speichern der Watchlist');
      }
    };

    // Debounce-Funktion, um nicht bei jeder Änderung sofort zu speichern
    const debouncedSave = setTimeout(saveWatchlist, 1000);
    
    return () => clearTimeout(debouncedSave);
  }, [isSignedIn, store.items]);

  // Funktion zum Entfernen eines Symbols aus der Watchlist
  const removeFromWatchlist = async (symbol: string) => {
    if (!symbol) return;
    
    // Entferne das Symbol lokal
    store.removeItem(symbol);
    toast.success(`${symbol} aus der Watchlist entfernt`);

    if (isSignedIn) {
      try {
        const response = await fetch(`/api/watchlist?symbol=${symbol}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          console.error('Fehler beim Entfernen aus der Watchlist auf dem Server');
        }
      } catch (error) {
        console.error('Fehler beim Entfernen aus der Watchlist:', error);
      }
    }
  };

  return (
    <>
      <WatchlistSidebar onRemove={removeFromWatchlist} />
      {children}
    </>
  );
}
