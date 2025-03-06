import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateWatchlistDialog } from "@/components/watchlists/create-watchlist-dialog";
import { WatchlistTable } from "@/components/watchlists/watchlist-table";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getQuotes } from "@/lib/fmp";

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

  let watchlists = [];
  let quotes = [];
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
      const symbols = [...new Set(watchlists.flatMap(w => w.items.map(item => item.symbol)))];
      
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
  const watchlistsWithQuotes = watchlists.map(watchlist => ({
    ...watchlist,
    items: watchlist.items.map(item => ({
      ...item,
      quote: quotesMap.get(item.symbol)
    }))
  }));
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
              <CardTitle>Ihre Watchlisten</CardTitle>
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
                <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-primary">
                  <span className="flex-1 truncate">Standard</span>
                  <span className="text-xs text-muted-foreground">4 Symbole</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50">
                  <span className="flex-1 truncate">Tech-Werte</span>
                  <span className="text-xs text-muted-foreground">8 Symbole</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50">
                  <span className="flex-1 truncate">Dividenden</span>
                  <span className="text-xs text-muted-foreground">5 Symbole</span>
                </div>
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
                <CardTitle>Standard-Watchlist</CardTitle>
                <CardDescription>
                  Ihre Haupt-Watchlist mit wichtigen Wertpapieren
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
                watchlistId={watchlist.id} 
                items={watchlist.items} 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Marktübersicht</CardTitle>
            <CardDescription>
              Wichtige Indizes und Marktbewegungen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">S&P 500</span>
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full px-2 py-0.5">
                      +0.65%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">5,187.58</p>
                </div>
                <div className="flex h-10 w-24 items-center justify-center text-xs text-muted-foreground">
                  Chart-Visualisierung
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">NASDAQ</span>
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full px-2 py-0.5">
                      +0.93%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">16,315.70</p>
                </div>
                <div className="flex h-10 w-24 items-center justify-center text-xs text-muted-foreground">
                  Chart-Visualisierung
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">DOW JONES</span>
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full px-2 py-0.5">
                      +0.37%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">38,797.38</p>
                </div>
                <div className="flex h-10 w-24 items-center justify-center text-xs text-muted-foreground">
                  Chart-Visualisierung
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Bewegungen</CardTitle>
            <CardDescription>
              Größte Gewinner und Verlierer des Tages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">Gewinner</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">META</span>
                    <span className="text-sm text-muted-foreground">Meta Platforms</span>
                  </div>
                  <span className="text-green-600">+4.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">AMD</span>
                    <span className="text-sm text-muted-foreground">Advanced Micro</span>
                  </div>
                  <span className="text-green-600">+3.7%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium">Verlierer</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">NFLX</span>
                    <span className="text-sm text-muted-foreground">Netflix</span>
                  </div>
                  <span className="text-red-600">-2.6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">INTC</span>
                    <span className="text-sm text-muted-foreground">Intel Corp</span>
                  </div>
                  <span className="text-red-600">-1.9%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setup-Empfehlungen</CardTitle>
            <CardDescription>
              Basierend auf Ihren Watchlisten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium">AAPL</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                    Long Setup
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  2/3 Zeitrahmen bullisch - Über DM R1 im Tageschart
                </p>
              </div>
              <div className="rounded-lg p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium">NFLX</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                    Short Setup
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  3/3 Zeitrahmen bärisch - Unter DM S1 in allen Zeitrahmen
                </p>
              </div>
              <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium">MSFT</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                    Long Setup
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  EMA Cloud Crossover im H1-Chart, positiver Trend
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}