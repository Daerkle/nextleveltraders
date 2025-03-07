import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WatchlistTable } from "@/components/watchlists/watchlist-table";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getQuotes } from "@/lib/fmp";
import { Quote, Watchlist, WatchlistWithQuotes } from "@/types/watchlist";

async function getWatchlistData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watchlists`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch watchlists');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    return [];
  }
}

export default async function WatchlistsPage() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Nicht authentifiziert</h2>
          <p className="text-muted-foreground">Bitte melden Sie sich an, um Ihre Watchlists zu sehen.</p>
        </div>
      </div>
    );
  }

  let watchlists: Watchlist[] = [];
  let quotes: Quote[] = [];
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      // Fetch watchlists
      watchlists = await prisma.watchlist.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { updatedAt: 'desc' }
      });

      // Get unique symbols from all watchlists
      const symbols = Array.from(new Set(watchlists.flatMap(w => w.items.map(item => item.symbol))));
      
      // Fetch quotes if we have symbols
      if (symbols.length > 0) {
        quotes = await getQuotes(symbols);
      }
      
      // If we get here, the operation was successful
      break;
    } catch (error) {
      console.error(`Error fetching data (attempt ${retryCount + 1}/${maxRetries}):`, error);
      retryCount++;
      
      if (retryCount === maxRetries) {
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Fehler beim Laden der Daten</h2>
              <p className="text-muted-foreground">Es konnte keine Verbindung zur Datenbank hergestellt werden. Bitte versuchen Sie es später erneut.</p>
            </div>
          </div>
        );
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 5000)));
    }
  }

  const quotesMap = new Map(quotes.map(quote => [quote.symbol, quote]));

  // Füge Marktdaten zu den Watchlists hinzu
  const watchlistsWithQuotes: WatchlistWithQuotes[] = watchlists.map(watchlist => ({
    ...watchlist,
    items: watchlist.items.map(item => ({
      ...item,
      quote: quotesMap.get(item.symbol)
    }))
  }));

  // Wähle die erste Watchlist oder erstelle eine leere
  const activeWatchlist = watchlistsWithQuotes[0] || { id: '', name: '', items: [] };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Watchlisten</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre beobachteten Wertpapiere
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ihre Watchlists</CardTitle>
              <CardDescription>
                Organisieren Sie Ihre Trading-Beobachtungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  className="pl-8 text-sm"
                  placeholder="Suchen..."
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>

              <div className="space-y-1">
                {watchlistsWithQuotes.map((list) => (
                  <div 
                    key={list.id}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                      list.id === activeWatchlist.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className="flex-1 truncate">{list.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {list.items.length} Symbole
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button className="w-full text-sm" variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Neue Watchlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex-1">
                <CardTitle>{activeWatchlist.name || 'Watchlist'}</CardTitle>
                <CardDescription>
                  Ihre Watchlist mit wichtigen Wertpapieren
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-60">
                  <Input
                    className="pl-8 text-sm"
                    placeholder="Symbol hinzufügen..."
                  />
                  <PlusIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <Button>Hinzufügen</Button>
              </div>
            </CardHeader>
            <CardContent>
              <WatchlistTable 
                watchlistId={activeWatchlist.id} 
                items={activeWatchlist.items} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}