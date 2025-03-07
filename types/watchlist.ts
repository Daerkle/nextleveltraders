import { Quote as FMPQuote } from '@/lib/fmp'

export interface WatchlistItem {
  symbol: string
  price?: number
  change?: number
}

export interface Quote extends FMPQuote {}

export interface WatchlistDBItem {
  id: string
  watchlistId: string
  symbol: string
  createdAt: Date
}

export interface Watchlist {
  id: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
  items: WatchlistDBItem[]
}

export interface WatchlistWithQuotes extends Watchlist {
  items: (WatchlistDBItem & {
    quote?: FMPQuote
  })[]
}