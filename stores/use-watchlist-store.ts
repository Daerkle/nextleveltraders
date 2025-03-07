import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClientWithAuth } from '@/lib/supabase'
import { type StateCreator } from 'zustand'
import { WatchlistItem } from '@/types/watchlist'
import { supabase } from '@/lib/supabase'

interface WatchlistState {
  items: WatchlistItem[]
  isOpen: boolean
  currentWatchlistId: string | null
  setOpen: (open: boolean) => void
  setWatchlistId: (id: string) => void
  setItems: (items: WatchlistItem[]) => void
  addSymbol: (symbol: string) => Promise<void>
  removeSymbol: (symbol: string) => Promise<void>
}

interface WatchlistDBItem {
  id: string
  watchlist_id: string
  symbol: string
  created_at: string
}

interface WatchlistDB {
  id: string
  name: string
  created_at: string
  updated_at: string
}

type WatchlistStore = StateCreator<
  WatchlistState,
  [],
  [],
  WatchlistState
>

const DEFAULT_WATCHLIST_NAME = "Standard"

const createWatchlistStore: WatchlistStore = (set, get) => ({
  items: [],
  isOpen: false,
  currentWatchlistId: null,
  setOpen: (open: boolean) => set({ isOpen: open }),
  setWatchlistId: (id: string) => set({ currentWatchlistId: id }),
  setItems: (items: WatchlistItem[]) => set({ items }),
  addSymbol: async (symbol: string, token?: string) => {
    const { currentWatchlistId } = get()
    
    try {
      // Nutze den übergebenen Token oder den anonymen Client
      const supabaseClient = token ? createClientWithAuth(token) : supabase;

      // Erstelle eine Standard-Watchlist, wenn keine existiert
      let watchlistId = currentWatchlistId
      if (!watchlistId) {
        const { data: watchlist, error: watchlistError } = await supabaseClient
          .from('watchlists')
          .insert({
            name: DEFAULT_WATCHLIST_NAME
          })
          .select()
          .single()

        if (watchlistError) {
          if (watchlistError.code === 'PGRST116') {
            console.log('Keine Watchlists gefunden - erstelle neue');
          } else {
            console.error('Watchlist Erstellungsfehler:', watchlistError)
            throw watchlistError
          }
        }
        if (!watchlist) throw new Error('Keine Watchlist erstellt')
        
        watchlistId = (watchlist as WatchlistDB).id
        set({ currentWatchlistId: watchlistId })
      }

      // Füge das Symbol zur Watchlist hinzu
      const { data, error } = await supabaseClient
        .from('watchlist_items')
        .insert({ 
          watchlist_id: watchlistId,
          symbol: symbol.toUpperCase()
        })
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Symbol bereits in Watchlist');
          return;
        }
        console.error('Symbol Hinzufügungsfehler:', error)
        throw error
      }
      if (!data) throw new Error('Symbol konnte nicht hinzugefügt werden')

      const newItem = data as WatchlistDBItem

      set((state: WatchlistState) => ({
        items: [...state.items, { 
          symbol: newItem.symbol, 
          price: 0, 
          change: 0 
        }]
      }))
    } catch (error: any) {
      console.error('Fehler beim Hinzufügen des Symbols:', {
        message: error.message,
        code: error.code,
        details: error.details
      })
      // Lokale Aktualisierung trotz Fehler
      set((state: WatchlistState) => ({
        items: [...state.items, { 
          symbol: symbol.toUpperCase(), 
          price: 0, 
          change: 0 
        }]
      }))
    }
  },
  removeSymbol: async (symbol: string, token?: string) => {
    const { currentWatchlistId } = get()
    
    try {
      // Nutze den übergebenen Token oder den anonymen Client
      const supabaseClient = token ? createClientWithAuth(token) : supabase;

      const { error } = await supabaseClient
        .from('watchlist_items')
        .delete()
        .match({ 
          watchlist_id: currentWatchlistId,
          symbol 
        })

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Symbol bereits entfernt');
        } else {
          console.error('Symbol Entfernungsfehler:', error)
          throw error
        }
      }

      // Lokale Aktualisierung in jedem Fall
      set((state: WatchlistState) => ({
        items: state.items.filter((item) => item.symbol !== symbol)
      }))
    } catch (error: any) {
      console.error('Fehler beim Entfernen des Symbols:', {
        message: error.message,
        code: error.code,
        details: error.details
      })
      // Lokale Aktualisierung trotz Fehler
      set((state: WatchlistState) => ({
        items: state.items.filter((item) => item.symbol !== symbol)
      }))
    }
  }
})

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    createWatchlistStore,
    {
      name: 'watchlist-storage',
      partialize: (state) => ({
        items: state.items,
        isOpen: false,
        currentWatchlistId: state.currentWatchlistId
      })
    }
  )
)