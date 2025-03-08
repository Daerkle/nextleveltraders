"use client"

import { useEffect, useRef } from 'react'
import { useWatchlistStore } from '@/stores/use-watchlist-store'
import { WatchlistSidebar } from '@/components/watchlist-sidebar'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

interface WatchlistItem {
  symbol: string;
  price?: number;
  change?: number;
  [key: string]: any;
}

interface WatchlistProviderProps {
  children: React.ReactNode
}

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const store = useWatchlistStore()
  const { isSignedIn } = useUser();

  // Verwende useRef, um die vorherigen Symbole zu speichern und Endlosschleifen zu vermeiden
  const previousSymbolsRef = useRef<string>('');
  const storeRef = useRef(store);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMountRef = useRef(true);
  
  // Aktualisiere storeRef, wenn sich store ändert
  useEffect(() => {
    storeRef.current = store;
  }, [store]);
  
  // Lade Marktdaten für die Watchlist-Symbole - nur einmal beim Mounten und wenn sich die Anzahl der Items ändert
  useEffect(() => {
    // Debug-Ausgabe: Zeige die aktuelle Anzahl der Elemente in der Watchlist
    console.log('WatchlistProvider: items aktualisiert, Anzahl:', store.items.length);
    
    // Funktion, die die aktuellen Symbole abruft
    const getCurrentSymbols = () => {
      // Wichtig: Wir holen die aktuellen Items direkt aus dem Store-State
      // und nicht aus der store-Referenz, um immer die neuesten Daten zu haben
      const items = useWatchlistStore.getState().items;
      
      if (!items || items.length === 0) {
        console.log('Keine Items in der Watchlist');
        return '';
      }
      
      return items
        .filter(item => item.symbol && typeof item.symbol === 'string')
        .map(item => item.symbol)
        .sort() // Sortieren für konsistente Reihenfolge
        .join(',');
    };
    
    // Marktdaten abrufen
    const fetchMarketData = async () => {
      try {
        const currentSymbols = getCurrentSymbols();
        
        // Wenn keine Symbole vorhanden sind, nichts tun
        if (!currentSymbols) {
          console.log('Keine Symbole zum Laden vorhanden');
          return;
        }
        
        // Vermeide unnötige API-Aufrufe, wenn sich die Symbole nicht geändert haben
        // und es nicht der erste Aufruf ist
        if (!isInitialMountRef.current && currentSymbols === previousSymbolsRef.current) {
          console.log('Symbole unverändert, kein neuer API-Aufruf nötig');
          return;
        }
        
        console.log('Lade Marktdaten für Symbole:', currentSymbols);
        previousSymbolsRef.current = currentSymbols;
        isInitialMountRef.current = false;
        
        // Verwende die aktuelle URL-Basis für API-Aufrufe
        const baseUrl = window.location.origin;
        console.log('Lade Marktdaten von:', `${baseUrl}/api/market-data/quotes?symbols=${currentSymbols}`);
        
        const response = await fetch(`${baseUrl}/api/market-data/quotes?symbols=${currentSymbols}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          credentials: 'include' // Wichtig für Authentifizierung
        });
        
        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Marktdaten: ${response.status}`);
        }
  
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.warn('Unerwartetes Datenformat von der API:', data);
          return;
        }
        
        console.log('Marktdaten erhalten:', data.length, 'Einträge');
  
        // Aktualisiere die Items mit den aktuellen Marktdaten
        // Wichtig: Wir verwenden getState().updateItemsWithMarketData, um direkt auf die Methode zuzugreifen
        // ohne einen erneuten Render auszulösen
        useWatchlistStore.getState().updateItemsWithMarketData(data);
      } catch (error) {
        console.error('Fehler beim Laden der Marktdaten:', error);
      }
    };
    
    // Initial laden
    fetchMarketData();
    
    // Alle 60 Sekunden aktualisieren
    intervalRef.current = setInterval(fetchMarketData, 60000);
    
    // Aufräumen beim Unmount oder wenn sich die Anzahl der Items ändert
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [store.items.length]); // Aktualisieren, wenn sich die Anzahl der Items ändert

  // Lade die Watchlist aus der API
  useEffect(() => {
    const loadWatchlist = async () => {
      if (!isSignedIn) {
        console.log('Benutzer ist nicht angemeldet, keine Watchlist geladen');
        return;
      }

      try {
        // Verwende die aktuelle URL-Basis für API-Aufrufe, um Probleme mit unterschiedlichen Ports zu vermeiden
        const baseUrl = window.location.origin;
        console.log('Lade Watchlist von:', `${baseUrl}/api/watchlist`);
        
        const response = await fetch(`${baseUrl}/api/watchlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          credentials: 'include' // Wichtig für Authentifizierung
        });
        
        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Watchlist: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Watchlist API-Antwort erhalten:', data);
        
        if (data && Array.isArray(data.items)) {
          // Validiere jedes Item in der Watchlist
          const validItems = data.items.filter((item: any) => 
            item && 
            typeof item === 'object' && 
            item.symbol && 
            typeof item.symbol === 'string'
          ) as WatchlistItem[];
          
          // Prüfe, ob wir ungültige Items gefiltert haben
          if (validItems.length !== data.items.length) {
            console.warn(`Watchlist enthielt ${data.items.length - validItems.length} ungültige Items, die gefiltert wurden`);
          }
          
          // Verwende getState().setItems, um direkt auf die Methode zuzugreifen
          useWatchlistStore.getState().setItems(validItems);
          console.log('Watchlist erfolgreich geladen:', validItems.length, 'Symbole');
        } else {
          console.log('Keine Watchlist-Daten gefunden oder leere Watchlist', data);
          // Verwende getState().setItems, um direkt auf die Methode zuzugreifen
          useWatchlistStore.getState().setItems([]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Watchlist:', error);
        // Stelle sicher, dass wir trotz Fehler eine leere Watchlist haben
        useWatchlistStore.getState().setItems([]);
        toast.error('Fehler beim Laden der Watchlist');
      }
    };

    // Nur laden, wenn der Benutzer angemeldet ist
    if (isSignedIn) {
      loadWatchlist();
    }
  }, [isSignedIn]); // Entferne store aus den Abhängigkeiten, um unnötige Rerenders zu vermeiden

  // Speichere Änderungen an der Watchlist
  useEffect(() => {
    // Speichere nur, wenn der Benutzer angemeldet ist und sich die Items geändert haben
    const saveWatchlist = async () => {
      if (!isSignedIn) {
        console.log('Benutzer ist nicht angemeldet, Watchlist wird nicht gespeichert');
        return;
      }
      
      // Verhindere unnötiges Speichern, wenn die Watchlist leer ist
      if (store.items.length === 0) {
        console.log('Watchlist ist leer, kein Speichern erforderlich');
        return;
      }
      
      try {
        // Verwende die aktuelle URL-Basis für API-Aufrufe
        const baseUrl = window.location.origin;
        
        // Stelle sicher, dass jedes Item ein gültiges Symbol hat und entferne Duplikate
        const uniqueSymbols = new Set<string>();
        const validItems = store.items.filter((item: WatchlistItem) => {
          if (!item.symbol || typeof item.symbol !== 'string') return false;
          
          // Prüfe auf Duplikate (case-insensitive)
          const normalizedSymbol = item.symbol.toUpperCase();
          if (uniqueSymbols.has(normalizedSymbol)) return false;
          
          uniqueSymbols.add(normalizedSymbol);
          return true;
        });
        
        // Prüfe, ob Items gefiltert wurden
        if (validItems.length !== store.items.length) {
          console.warn(`${store.items.length - validItems.length} ungültige oder doppelte Items wurden vor dem Speichern entfernt`);
        }
        
        // Reduziere die Anzahl der Log-Ausgaben
        if (validItems.length > 0) {
          console.log('Speichere Watchlist mit', validItems.length, 'Symbolen');
        }
        
        console.log('Speichere Watchlist an:', `${baseUrl}/api/watchlist`, 'mit', validItems.length, 'Symbolen');
        
        const response = await fetch(`${baseUrl}/api/watchlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify({ items: validItems }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server-Antwort:', errorText);
          throw new Error(`Fehler beim Speichern der Watchlist: ${response.status}`);
        }
      } catch (error) {
        console.error('Fehler beim Speichern der Watchlist:', error);
        toast.error('Fehler beim Speichern der Watchlist');
      }
    };

    // Debounce-Funktion mit längerer Verzögerung, um weniger häufig zu speichern
    const debouncedSave = setTimeout(saveWatchlist, 2000);
    
    return () => clearTimeout(debouncedSave);
  }, [isSignedIn, store.items]);

  // Funktion zum Entfernen eines Symbols aus der Watchlist
  const removeFromWatchlist = async (symbol: string) => {
    if (!symbol) {
      console.error('Kein Symbol zum Entfernen angegeben');
      return;
    }
    
    // Entferne das Symbol lokal
    store.removeItem(symbol);
    toast.success(`${symbol} aus der Watchlist entfernt`);

    if (isSignedIn) {
      try {
        console.log(`Lösche Symbol ${symbol} aus der Watchlist auf dem Server`);
        const response = await fetch(`/api/watchlist?symbol=${symbol}`, {
          method: 'DELETE',
          credentials: 'include', // Wichtig: Credentials mitschicken
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Fehler beim Entfernen aus der Watchlist: ${response.status}`, errorText);
          // Kein Toast hier, da das Symbol bereits lokal entfernt wurde
        } else {
          console.log(`Symbol ${symbol} erfolgreich aus der Watchlist entfernt`);
        }
      } catch (error) {
        console.error('Fehler beim Entfernen aus der Watchlist:', error);
      }
    } else {
      console.log('Benutzer nicht angemeldet, Symbol nur lokal entfernt');
    }
  };

  return (
    <>
      <WatchlistSidebar onRemove={removeFromWatchlist} />
      {children}
    </>
  );
}