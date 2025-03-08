import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type StateCreator } from 'zustand'
import { WatchlistItem } from '@/types/watchlist'

interface WatchlistState {
  items: WatchlistItem[]
  isOpen: boolean
  setOpen: (open: boolean) => void
  setItems: (items: WatchlistItem[]) => void
  addItem: (item: WatchlistItem) => void
  removeItem: (symbol: string) => void
  updateItemsWithMarketData: (marketData: any[]) => void
}

type WatchlistStore = StateCreator<
  WatchlistState,
  [],
  [['zustand/persist', unknown]],
  WatchlistState
>

const createWatchlistStore: WatchlistStore = (set, get) => ({
  items: [],
  isOpen: false,
  setOpen: (open: boolean) => set({ isOpen: open }),
  setItems: (items: WatchlistItem[]) => set({ items }),
  addItem: (item: WatchlistItem) => {
    set((state: WatchlistState) => {
      // Prüfe, ob das Symbol bereits in der Watchlist ist
      const exists = state.items.some(existingItem => 
        existingItem.symbol === item.symbol
      );
      
      // Wenn es bereits existiert, nicht erneut hinzufügen
      if (exists) return state;
      
      return {
        items: [...state.items, {
          ...item,
          // Stelle sicher, dass das Symbol immer in Großbuchstaben ist
          symbol: item.symbol.toUpperCase()
        }]
      };
    });
  },
  removeItem: (symbol: string) => {
    set((state: WatchlistState) => ({
      items: state.items.filter((item) => item.symbol !== symbol)
    }))
  },
  // Neue Methode zum Aktualisieren der Marktdaten ohne die gesamte Liste neu zu setzen
  updateItemsWithMarketData: (marketData: any[]) => {
    if (!Array.isArray(marketData) || !marketData.length) return;
    
    // Aktualisiere nur die Preisdaten, ohne die Liste selbst zu ändern
    const currentItems = [...get().items];
    let hasChanges = false;
    
    for (let i = 0; i < currentItems.length; i++) {
      const item = currentItems[i];
      const quote = marketData.find(q => q.symbol === item.symbol);
      
      if (quote) {
        // Nur aktualisieren, wenn sich die Daten geändert haben
        const newPrice = quote.price || item.price || 0;
        const newChange = quote.change || item.change || 0;
        const newChangesPercentage = quote.changesPercentage || item.changesPercentage || 0;
        
        if (item.price !== newPrice || item.change !== newChange || item.changesPercentage !== newChangesPercentage) {
          currentItems[i] = {
            ...item,
            price: newPrice,
            change: newChange,
            changesPercentage: newChangesPercentage
          };
          hasChanges = true;
        }
      }
    }
    
    // Nur aktualisieren, wenn es tatsächliche Änderungen gab
    if (hasChanges) {
      console.log('Marktdaten aktualisiert für', marketData.length, 'Symbole');
      set({ items: currentItems });
    }
  }
})

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    createWatchlistStore,
    {
      name: 'watchlist-storage',
      partialize: (state) => ({
        // Speichere nur gültige Items mit Symbol
        items: state.items.filter(item => 
          item.symbol && typeof item.symbol === 'string'
        ),
        isOpen: false
      }),
      // Verhindere Speichern während Hydration, um Konflikte zu vermeiden
      skipHydration: true
    }
  )
)