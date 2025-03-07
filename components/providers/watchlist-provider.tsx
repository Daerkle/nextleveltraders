"use client"

import { useEffect } from 'react'
import { useWatchlistStore } from '@/stores/use-watchlist-store'
import { supabase, createClientWithAuth } from '@/lib/supabase'
import { WatchlistSidebar } from '@/components/watchlist-sidebar'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'
import { toast } from 'sonner'
import { useAuth } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'

interface WatchlistProviderProps {
  children: React.ReactNode
}

type WatchlistChanges = RealtimePostgresChangesPayload<{
  [key: string]: any
}>

interface WatchlistDBItem {
  id: string
  watchlist_id: string
  symbol: string
  created_at: string
}

const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const store = useWatchlistStore()
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

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

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase ist nicht konfiguriert. Watchlist-Sync deaktiviert.');
      return;
    }

    // Überprüfen der Supabase-Verbindung
    const checkConnection = async () => {
      if (!isSignedIn) {
        console.log('Benutzer ist nicht angemeldet');
        return true; // Erlaube Zugriff auf öffentliche Daten
      }

      try {
        // Hole den aktuellen Clerk Session Token
        let token;
        try {
          token = await getToken({ template: 'supabase' });
        } catch (error) {
          console.warn('Konnte keinen Auth Token abrufen:', error);
          return true; // Erlaube Zugriff auf öffentliche Daten
        }

        // Erstelle einen authentifizierten Client
        const client = token ? createClientWithAuth(token) : supabase;

        // Teste die Verbindung mit einer einfachen Query
        const { data, error } = await client
          .from('watchlists')
          .select('id')
          .limit(1);

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('Keine Watchlists gefunden - das ist OK für neue Benutzer');
            return true;
          }

          console.error('Supabase Verbindungsfehler:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('Supabase Verbindung erfolgreich:', { data });
        return true;
      } catch (error: any) {
        console.error('Supabase Verbindungsfehler:', {
          name: error.name,
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Benutzerfreundliche Fehlermeldung
        let errorMessage = 'Verbindung zur Datenbank fehlgeschlagen';
        if (error.code === '42501') {
          errorMessage = 'Keine Berechtigung für diese Aktion';
        } else if (error.code === '3000') {
          errorMessage = 'Bitte melden Sie sich an';
        }
        
        toast.error(errorMessage);
        return true; // Trotzdem weitermachen, um öffentliche Daten anzuzeigen
      }
    };

    // Lade initiale Watchlist-Daten
    const loadWatchlistData = async () => {
      if (!isSupabaseConfigured) {
        console.warn('Supabase ist nicht konfiguriert');
        store.setItems([]);
        return;
      }

      try {
        // Hole den aktuellen Auth Token nur wenn der Benutzer angemeldet ist
        let token = null;
        if (isSignedIn) {
          try {
            token = await getToken({ template: 'supabase' });
          } catch (error) {
            console.warn('Auth Token nicht verfügbar:', error);
          }
        }

        // Erstelle den Client mit oder ohne Token
        const client = token ? createClientWithAuth(token) : supabase;

        try {
          // Hole die Standard-Watchlist
          const { data: watchlist, error: watchlistError } = await client
            .from('watchlists')
            .select()
            .eq('name', 'Standard')
            .maybeSingle();

          if (watchlistError) {
            console.error('Fehler beim Laden der Watchlist:', watchlistError);
            store.setItems([]);
            return;
          }

          // Wenn keine Watchlist existiert, erstelle eine neue
          if (!watchlist) {
            try {
              const { data: newWatchlist, error: createError } = await client
                .from('watchlists')
                .insert({ name: 'Standard' })
                .select()
                .maybeSingle();

              if (createError || !newWatchlist) {
                console.error('Fehler beim Erstellen der Watchlist:', createError);
                store.setItems([]);
                return;
              }

              store.setWatchlistId(newWatchlist.id);
              store.setItems([]);
              return;
            } catch (error) {
              console.error('Fehler beim Erstellen der Watchlist:', error);
              store.setItems([]);
              return;
            }
          }

          // Setze die existierende Watchlist
          store.setWatchlistId(watchlist.id);

          try {
            // Lade die Items der Watchlist
            const { data: items, error: itemsError } = await client
              .from('watchlist_items')
              .select()
              .eq('watchlist_id', watchlist.id);

            if (itemsError) {
              console.error('Fehler beim Laden der Items:', itemsError);
              store.setItems([]);
              return;
            }

            // Konvertiere die Items in das richtige Format
            store.setItems(
              (items || []).map((item: WatchlistDBItem) => ({
                symbol: item.symbol,
                price: 0,
                change: 0
              }))
            );
          } catch (error) {
            console.error('Fehler beim Laden der Items:', error);
            store.setItems([]);
          }
        } catch (error) {
          console.error('Fehler beim Laden der Watchlist:', error);
          store.setItems([]);
        }
      } catch (error: any) {
        console.error('Unerwarteter Fehler beim Laden der Watchlist:', error);
        store.setItems([]);
      }
    };

    loadWatchlistData();

    // Subscribe to watchlist changes
    let channel: any;

    const setupRealtimeSubscription = async () => {
      let token;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (error) {
        console.warn('Auth Token nicht verfügbar:', error);
      }

      // Erstelle den Client mit oder ohne Token
      const client = token ? createClientWithAuth(token) : supabase;

      channel = client
        .channel('watchlist_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'watchlist_items',
            filter: `watchlist_id=eq.${store.currentWatchlistId}`
          },
          (payload: WatchlistChanges) => {
            console.log('Watchlist Change:', payload);
            if (!payload.new || !store.currentWatchlistId) return;

            switch (payload.eventType) {
              case 'INSERT':
                store.setItems([
                  ...store.items,
                  {
                    symbol: payload.new.symbol,
                    price: 0,
                    change: 0
                  }
                ]);
                break;
              case 'DELETE':
                store.setItems(
                  store.items.filter(item => item.symbol !== payload.old.symbol)
                );
                break;
              default:
                console.log('Unhandled event type:', payload.eventType);
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [store, isSignedIn, getToken]);

  return (
    <>
      {children}
      <WatchlistSidebar />
    </>
  );
}