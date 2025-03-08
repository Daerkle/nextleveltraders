import { Suspense } from "react";
import { HelpCircleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getMarketData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market-data`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch market data');
    }
    
    const data = await res.json();
    
    // Validate data structure
    if (!data.spy || !data.qqq || !data.watchlist || !data.news) {
      throw new Error('Invalid data structure from API');
    }
    
    return {
      spy: data.spy,
      qqq: data.qqq,
      watchlist: data.watchlist,
      news: data.news
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Return fallback data
    return {
      spy: { change: 0 },
      qqq: { change: 0 },
      watchlist: [],
      news: []
    };
  }
}

export default async function DashboardPage() {
  const { spy, qqq, watchlist, news } = await getMarketData();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Ihr Trading-Überblick und aktuelle Marktentwicklungen
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SPY Trend</CardTitle>
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {spy && spy.changesPercentage > 0 ? 'Bullisch' : 'Bärisch'}
            </div>
            <p className="text-xs text-muted-foreground">
              {spy && spy.changesPercentage > 0 ? '+' : ''}{spy && spy.changesPercentage ? spy.changesPercentage.toFixed(2) : '0.00'}% im Tagesvergleich
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">QQQ Trend</CardTitle>
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qqq && qqq.changesPercentage > 0 ? 'Bullisch' : 'Bärisch'}
            </div>
            <p className="text-xs text-muted-foreground">
              {qqq && qqq.changesPercentage > 0 ? '+' : ''}{qqq && qqq.changesPercentage ? qqq.changesPercentage.toFixed(2) : '0.00'}% im Tagesvergleich
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktive Setups</CardTitle>
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 neue in den letzten 24h
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.1%</div>
            <p className="text-xs text-muted-foreground">
              Diese Woche
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Marktübersicht</CardTitle>
            <CardDescription>
              Ausgewählte Indizes und Aktien-Charts
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20">
            <p className="text-sm text-muted-foreground">Chart wird geladen...</p>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ihre Watchlist</CardTitle>
            <CardDescription>
              Symbole, die Sie beobachten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><p className="text-sm text-muted-foreground">Wird geladen...</p></div>}>
              <div className="space-y-4">
                {watchlist.map((stock: any) => (
                  <div key={stock.symbol} className="flex justify-between items-center pb-2 border-b">
                    <div className="font-medium">{stock.symbol}</div>
                    <div className={stock.changesPercentage > 0 ? 'text-green-600' : 'text-red-600'}>
                      ${stock.price ? stock.price.toFixed(2) : '0.00'} ({stock.changesPercentage > 0 ? '+' : ''}{stock.changesPercentage ? stock.changesPercentage.toFixed(2) : '0.00'}%)
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Aktuelle News</CardTitle>
            <CardDescription>
              Wichtige Marktnachrichten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {news.slice(0, 2).map((article: any) => (
                <div key={article.title} className="space-y-2">
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {article.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(article.publishedDate).toLocaleString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>KI-Setup-Analyse</CardTitle>
            <CardDescription>
              Aktuelle KI-generierte Setups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">Long Setup</span>
              <p className="mt-2 font-medium">AAPL über DM R1</p>
              <p className="text-xs text-muted-foreground mt-1">2/3 Zeitrahmen bullisch</p>
            </div>
            <div className="rounded-lg p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">Short Setup</span>
              <p className="mt-2 font-medium">NFLX unter DM S1</p>
              <p className="text-xs text-muted-foreground mt-1">3/3 Zeitrahmen bärisch</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}