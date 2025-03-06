import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuotes, getHistoricalPrices, type TimeInterval } from '@/lib/fmp';

async function getChartData(symbol: string = 'AAPL', interval: TimeInterval = 'daily') {
  try {
    const [quoteData, pricesData] = await Promise.all([
      getQuotes([symbol]),
      getHistoricalPrices(symbol, interval)
    ]);

    return {
      quote: quoteData[0],
      prices: pricesData
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return {
      quote: null,
      prices: []
    };
  }
}

export default async function ChartsPage() {
  const { quote, prices } = await getChartData();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Chart-Analyse</h1>
        <p className="text-muted-foreground">
          Fortschrittliche Charts und technische Analysen
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AAPL - Apple Inc.</CardTitle>
                  <CardDescription>
                    NASDAQ: AAPL - 1D Interval
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <select className="rounded-md border p-1.5 text-sm">
                    <option value="1m">1m</option>
                    <option value="5m">5m</option>
                    <option value="15m">15m</option>
                    <option value="1h">1h</option>
                    <option value="4h">4h</option>
                    <option value="1d" selected>1D</option>
                    <option value="1w">1W</option>
                  </select>
                  <select className="rounded-md border p-1.5 text-sm">
                    <option>Indicators</option>
                    <option>EMA</option>
                    <option>SMA</option>
                    <option>MACD</option>
                    <option>RSI</option>
                    <option>Bollinger Bands</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-3">
                  <p className="text-muted-foreground">Chart wird geladen...</p>
                  <p className="text-xs text-muted-foreground">Lightweight Charts wird hier implementiert</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Marktdaten</CardTitle>
                <CardDescription>
                  Aktuelle technische Informationen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Aktuell</p>
                      <p className="text-lg font-medium">$192.75</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Veränderung</p>
                      <p className="text-lg font-medium text-green-600">+$1.53 (0.8%)</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Tageshoch</p>
                      <p className="text-lg font-medium">${quote?.dayHigh?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Tagestief</p>
                      <p className="text-lg font-medium">${quote?.dayLow?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Volumen</p>
                      <p className="text-lg font-medium">{(quote?.volume / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Durchschnitt Vol.</p>
                      <p className="text-lg font-medium">{(quote?.avgVolume / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Niveau-Indikatoren</CardTitle>
                <CardDescription>
                  Wichtige Support- und Resistance-Levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">R2</span>
                      <span className="text-sm">$196.50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">R1</span>
                      <span className="text-sm">$194.25</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-1.5 rounded-sm">
                      <span className="text-sm font-medium">Pivot</span>
                      <span className="text-sm">$192.75</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">S1</span>
                      <span className="text-sm">$190.50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">S2</span>
                      <span className="text-sm">$188.25</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>EMA Cloud Status</CardTitle>
                <CardDescription>
                  Trend-Indikation basierend auf EMA-Clouds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">10-Min Status</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          Bullisch
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>EMA 5/12:</span>
                        <span>Über Crossover</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">1-Std Status</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          Bullisch
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>EMA 34/50:</span>
                        <span>Über</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Multi-Frame</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          Setup Bestätigt
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>Trend-Stärke:</span>
                        <span>82/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}