"use client";

import { useState } from "react";
import { 
  BarChart3Icon, 
  HelpCircleIcon, 
  TrendingDownIcon, 
  TrendingUpIcon, 
  RefreshCwIcon,
  AlertTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { YahooQuote, MarketNewsItem } from "@/lib/yahoo-finance";
import { MarketDataRefresher } from "@/components/market-data-refresher";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Funktion zur Bestimmung der Farbe basierend auf Prozentänderung
function getChangeColor(change: number) {
  if (change > 1.5) return "text-green-600 dark:text-green-400";
  if (change > 0) return "text-green-500 dark:text-green-500";
  if (change > -1.5) return "text-red-500 dark:text-red-500";
  return "text-red-600 dark:text-red-400";
}

// Funktion zur Bestimmung der Hintergrundfarbe basierend auf Prozentänderung
function getChangeBgColor(change: number) {
  if (change > 1.5) return "border-green-400 dark:border-green-700 bg-green-50 dark:bg-green-950";
  if (change > 0) return "border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50";
  if (change > -1.5) return "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/50";
  return "border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950";
}

// Funktion zur Ermittlung des Market-Status basierend auf SPY und QQQ
function getMarketStatus(
  spyChange: number,
  qqqChange: number
): { status: string; description: string; trend: "bullish" | "bearish" | "neutral" } {
  const avgChange = (spyChange + qqqChange) / 2;
  
  if (avgChange > 1.5) {
    return {
      status: "Stark Bullisch",
      description: "Der Markt zeigt starke Aufwärtsdynamik",
      trend: "bullish"
    };
  } else if (avgChange > 0.5) {
    return {
      status: "Bullisch",
      description: "Der Markt tendiert nach oben",
      trend: "bullish"
    };
  } else if (avgChange > -0.5) {
    return {
      status: "Neutral",
      description: "Der Markt zeigt keine klare Richtung",
      trend: "neutral"
    };
  } else if (avgChange > -1.5) {
    return {
      status: "Bärisch",
      description: "Der Markt tendiert nach unten",
      trend: "bearish"
    };
  } else {
    return {
      status: "Stark Bärisch",
      description: "Der Markt zeigt starke Abwärtsdynamik",
      trend: "bearish"
    };
  }
}

interface MarketDashboardProps {
  initialSpy: YahooQuote;
  initialQqq: YahooQuote;
  initialWatchlist: YahooQuote[];
  initialNews: MarketNewsItem[];
}

export function MarketDashboard({ 
  initialSpy, 
  initialQqq, 
  initialWatchlist,
  initialNews
}: MarketDashboardProps) {
  // State für die Marktdaten
  const [spy, setSpy] = useState<YahooQuote>(initialSpy);
  const [qqq, setQqq] = useState<YahooQuote>(initialQqq);
  const [watchlist, setWatchlist] = useState<YahooQuote[]>(initialWatchlist);
  const [news] = useState<MarketNewsItem[]>(initialNews);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Markt-Indikatoren
  const spyChangePercent = spy.regularMarketChangePercent || 0;
  const qqqChangePercent = qqq.regularMarketChangePercent || 0;
  const marketStatus = getMarketStatus(spyChangePercent, qqqChangePercent);

  // Handler für Datenaktualisierungen
  const handleDataUpdate = (data: {
    spy: YahooQuote;
    qqq: YahooQuote;
    watchlist: YahooQuote[];
  }) => {
    setSpy(data.spy);
    setQqq(data.qqq);
    setWatchlist(data.watchlist);
    setLastUpdated(new Date());
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Echtzeit-Marktdaten via Yahoo Finance
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <RefreshCwIcon className="h-4 w-4" />
          <span>Aktualisiert {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Markt-Status-Karte */}
      <Card className={`border-2 ${
        marketStatus.trend === "bullish" 
          ? "border-green-400 dark:border-green-700 bg-green-50/30 dark:bg-green-950/30" 
          : marketStatus.trend === "bearish" 
          ? "border-red-400 dark:border-red-700 bg-red-50/30 dark:bg-red-950/30"
          : "border-orange-400 dark:border-orange-700 bg-orange-50/30 dark:bg-orange-950/30"
      }`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            {marketStatus.trend === "bullish" ? (
              <ArrowUpIcon className="h-5 w-5 text-green-500" />
            ) : marketStatus.trend === "bearish" ? (
              <ArrowDownIcon className="h-5 w-5 text-red-500" />
            ) : (
              <AlertTriangleIcon className="h-5 w-5 text-orange-500" />
            )}
            <span>Markt-Status: {marketStatus.status}</span>
          </CardTitle>
          <CardDescription>{marketStatus.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <span className="font-medium">SPY: </span>
              <span className={getChangeColor(spyChangePercent)}>
                {spyChangePercent > 0 ? "+" : ""}{spyChangePercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">QQQ: </span>
              <span className={getChangeColor(qqqChangePercent)}>
                {qqqChangePercent > 0 ? "+" : ""}{qqqChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TooltipProvider>
          <Card className={getChangeBgColor(spyChangePercent)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">SPY Trend</CardTitle>
              {spyChangePercent > 0 ? (
                <TrendingUpIcon className={`h-4 w-4 ${spyChangePercent > 1.5 ? "text-green-600" : "text-green-500"}`} />
              ) : (
                <TrendingDownIcon className={`h-4 w-4 ${spyChangePercent < -1.5 ? "text-red-600" : "text-red-500"}`} />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getChangeColor(spyChangePercent)}`}>
                {spyChangePercent > 1.5 ? 'Stark Bullisch' : 
                 spyChangePercent > 0 ? 'Bullisch' : 
                 spyChangePercent > -1.5 ? 'Leicht Bärisch' : 'Stark Bärisch'}
              </div>
              <p className="text-xs text-muted-foreground">
                {spyChangePercent > 0 ? '+' : ''}{spyChangePercent.toFixed(2)}% im Tagesvergleich
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ${spy?.regularMarketPrice?.toFixed(2) || '0.00'}
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>
        
        <Card className={getChangeBgColor(qqqChangePercent)}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">QQQ Trend</CardTitle>
            {qqqChangePercent > 0 ? (
              <TrendingUpIcon className={`h-4 w-4 ${qqqChangePercent > 1.5 ? "text-green-600" : "text-green-500"}`} />
            ) : (
              <TrendingDownIcon className={`h-4 w-4 ${qqqChangePercent < -1.5 ? "text-red-600" : "text-red-500"}`} />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getChangeColor(qqqChangePercent)}`}>
              {qqqChangePercent > 1.5 ? 'Stark Bullisch' : 
               qqqChangePercent > 0 ? 'Bullisch' : 
               qqqChangePercent > -1.5 ? 'Leicht Bärisch' : 'Stark Bärisch'}
            </div>
            <p className="text-xs text-muted-foreground">
              {qqqChangePercent > 0 ? '+' : ''}{qqqChangePercent.toFixed(2)}% im Tagesvergleich
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ${qqq?.regularMarketPrice?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Marktvolumen</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(spy?.regularMarketVolume / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              SPY Tagesvolumen
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {spy?.regularMarketVolume > (spy?.averageDailyVolume3Month || 0) ? 'Über' : 'Unter'} Durchschnitt
            </p>
          </CardContent>
        </Card>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Markt-Performance</CardTitle>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  spyChangePercent + qqqChangePercent > 0 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {((spyChangePercent + qqqChangePercent) / 2).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Durchschnitt SPY+QQQ
                </p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Durchschnittliche Änderung von SPY und QQQ</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Marktübersicht</CardTitle>
            <CardDescription>
              Aktuelle Indizes und Marktdaten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="font-medium text-lg">Index</div>
                <div className="font-medium text-lg">Preis</div>
                <div className="font-medium text-lg">Änderung</div>
                <div className="font-medium text-lg">Hoch/Tief</div>
              </div>
              
              <div className="flex justify-between items-center pb-2">
                <div className="font-medium">SPY</div>
                <div>${spy?.regularMarketPrice?.toFixed(2) || '0.00'}</div>
                <div className={getChangeColor(spyChangePercent)}>
                  {spyChangePercent > 0 ? '+' : ''}{spyChangePercent.toFixed(2)}%
                </div>
                <div>
                  ${spy?.regularMarketDayHigh?.toFixed(2) || '0.00'} / ${spy?.regularMarketDayLow?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <div className="flex justify-between items-center pb-2">
                <div className="font-medium">QQQ</div>
                <div>${qqq?.regularMarketPrice?.toFixed(2) || '0.00'}</div>
                <div className={getChangeColor(qqqChangePercent)}>
                  {qqqChangePercent > 0 ? '+' : ''}{qqqChangePercent.toFixed(2)}%
                </div>
                <div>
                  ${qqq?.regularMarketDayHigh?.toFixed(2) || '0.00'} / ${qqq?.regularMarketDayLow?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <div className="mt-4 pt-2 border-t">
                <p className="text-sm text-muted-foreground">Datenquelle: Yahoo Finance (aktualisiert {lastUpdated.toLocaleTimeString()})</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ihre Watchlist</CardTitle>
            <CardDescription>
              Symbole von Yahoo Finance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchlist.map((stock: YahooQuote) => (
                <div key={stock.symbol} className="flex justify-between items-center pb-2 border-b">
                  <div className="font-medium">{stock.symbol}</div>
                  <div className={getChangeColor(stock.regularMarketChangePercent || 0)}>
                    ${stock.regularMarketPrice?.toFixed(2) || '0.00'} ({stock.regularMarketChangePercent > 0 ? '+' : ''}{stock.regularMarketChangePercent?.toFixed(2) || '0.00'}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Aktuelle Marktbewegungen</CardTitle>
            <CardDescription>
              Top-Bewegungen von Yahoo Finance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {news.slice(0, 3).map((article: MarketNewsItem) => (
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
            <CardTitle>Marktanalyse</CardTitle>
            <CardDescription>
              Basierend auf Yahoo-Daten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {spyChangePercent > 0 ? (
              <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">SPY</span>
                <p className="mt-2 font-medium">{spyChangePercent > 1.5 ? 'Stark bullischer Trend' : 'Bullischer Trend'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {spyChangePercent.toFixed(2)}% Tagesgewinn
                </p>
              </div>
            ) : (
              <div className="rounded-lg p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">SPY</span>
                <p className="mt-2 font-medium">{spyChangePercent < -1.5 ? 'Stark bärischer Trend' : 'Bärischer Trend'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {spyChangePercent.toFixed(2)}% Tagesverlust
                </p>
              </div>
            )}
            
            {qqqChangePercent > 0 ? (
              <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">QQQ</span>
                <p className="mt-2 font-medium">{qqqChangePercent > 1.5 ? 'Tech-Sektor stark bullisch' : 'Tech-Sektor bullisch'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {qqqChangePercent.toFixed(2)}% Tagesgewinn
                </p>
              </div>
            ) : (
              <div className="rounded-lg p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">QQQ</span>
                <p className="mt-2 font-medium">{qqqChangePercent < -1.5 ? 'Tech-Sektor stark bärisch' : 'Tech-Sektor bärisch'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {qqqChangePercent.toFixed(2)}% Tagesverlust
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Die nicht sichtbare Komponente, die die Daten alle 10 Sekunden aktualisiert */}
      <MarketDataRefresher
        initialSpy={initialSpy}
        initialQqq={initialQqq}
        initialWatchlist={initialWatchlist}
        onDataUpdate={handleDataUpdate}
        refreshInterval={10000} // 10 Sekunden
      />
    </div>
  );
}