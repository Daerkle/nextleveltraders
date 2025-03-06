'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchSymbol } from '@/components/search-symbol';
import { PriceChart } from '@/components/price-chart';
import { type TimeInterval, type Quote, type HistoricalPrice } from '@/lib/fmp';
import { calculateEMACloud, calculatePivots, getRipsterStatus } from '@/lib/indicators';

type RipsterStatusType = 'bullish' | 'bearish' | 'neutral';

interface RipsterState {
  shortTerm: RipsterStatusType;
  longTerm: RipsterStatusType;
  strength: number;
}

export default function ChartsPage() {
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [prices, setPrices] = useState<HistoricalPrice[]>([]);
  const [interval, setInterval] = useState<TimeInterval>('1hour');
  const [pivots, setPivots] = useState({ r2: 0, r1: 0, pp: 0, s1: 0, s2: 0 });
  const [ripsterStatus, setRipsterStatus] = useState<RipsterState>({
    shortTerm: 'neutral',
    longTerm: 'neutral',
    strength: 0
  });
  
  const symbol = searchParams.get('symbol') || 'AAPL';

  useEffect(() => {
    fetchChartData(symbol, interval);
  }, [symbol, interval]);

  async function fetchChartData(symbol: string, timeInterval: TimeInterval) {
    try {
      const data = await fetch(`/api/chart-data?symbol=${symbol}&interval=${timeInterval}`)
        .then(res => res.json());
      setQuote(data.quote);
      setPrices(data.prices);
      
      if (data.prices.length > 0) {
        const cloud5_12 = calculateEMACloud(data.prices, 5, 12);
        const cloud34_50 = calculateEMACloud(data.prices, 34, 50);
        const newPivots = calculatePivots(data.prices);
        const status = getRipsterStatus(cloud5_12, cloud34_50);
        
        setPivots(newPivots);
        setRipsterStatus(status);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }
  
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
                <div className="w-72">
                  <SearchSymbol defaultSymbol="AAPL" />
                  <CardDescription className="mt-1">
                    {quote?.symbol} - {interval} Interval
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <select 
                    className="rounded-md border p-1.5 text-sm"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value as TimeInterval)}
                  >
                    <option value="1min">1m</option>
                    <option value="5min">5m</option>
                    <option value="15min">15m</option>
                    <option value="1hour">1h</option>
                    <option value="4hour">4h</option>
                    <option value="daily">1D</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <div className="h-[500px]">
              {prices.length > 0 ? (
                <PriceChart data={prices} height={500} />
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/20">
                  <div className="text-center space-y-3">
                    <p className="text-muted-foreground">Chart wird geladen...</p>
                  </div>
                </div>
              )}
            </div>
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
                      <p className="text-lg font-medium">${quote?.price?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Veränderung</p>
                      <p className={`text-lg font-medium ${quote?.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {quote?.change > 0 ? '+' : ''}
                        ${quote?.change?.toFixed(2) || '0.00'} ({quote?.changesPercentage?.toFixed(1) || '0.0'}%)
                      </p>
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
                      <span className="text-sm">${pivots.r2.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">R1</span>
                      <span className="text-sm">${pivots.r1.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-1.5 rounded-sm">
                      <span className="text-sm font-medium">Pivot</span>
                      <span className="text-sm">${pivots.pp.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">S1</span>
                      <span className="text-sm">${pivots.s1.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">S2</span>
                      <span className="text-sm">${pivots.s2.toFixed(2)}</span>
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
                    <div className={`rounded-lg p-3 ${ripsterStatus.shortTerm === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ripsterStatus.shortTerm === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'} border`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Kurzfrist Status</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${ripsterStatus.shortTerm === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : ripsterStatus.shortTerm === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300'}`}>
                          {ripsterStatus.shortTerm === 'bullish' ? 'Bullisch' : ripsterStatus.shortTerm === 'bearish' ? 'Bearish' : 'Neutral'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>EMA 5/12:</span>
                        <span>{ripsterStatus.shortTerm === 'bullish' ? 'Über Crossover' : ripsterStatus.shortTerm === 'bearish' ? 'Unter Crossover' : 'Neutral'}</span>
                      </div>
                    </div>
                    
                    <div className={`rounded-lg p-3 ${ripsterStatus.longTerm === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ripsterStatus.longTerm === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'} border`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Langfrist Status</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${ripsterStatus.longTerm === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : ripsterStatus.longTerm === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300'}`}>
                          {ripsterStatus.longTerm === 'bullish' ? 'Bullisch' : ripsterStatus.longTerm === 'bearish' ? 'Bearish' : 'Neutral'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>EMA 34/50:</span>
                        <span>{ripsterStatus.longTerm === 'bullish' ? 'Über' : ripsterStatus.longTerm === 'bearish' ? 'Unter' : 'Neutral'}</span>
                      </div>
                    </div>
                    
                    <div className={`rounded-lg p-3 ${ripsterStatus.shortTerm === ripsterStatus.longTerm ? (ripsterStatus.shortTerm === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ripsterStatus.shortTerm === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800') : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'} border`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Multi-Frame</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${ripsterStatus.shortTerm === ripsterStatus.longTerm ? (ripsterStatus.shortTerm === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : ripsterStatus.shortTerm === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300') : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                          {ripsterStatus.shortTerm === ripsterStatus.longTerm ? (ripsterStatus.shortTerm === 'bullish' ? 'Setup Bestätigt' : ripsterStatus.shortTerm === 'bearish' ? 'Setup Bestätigt' : 'Neutral') : 'Divergenz'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>Trend-Stärke:</span>
                        <span>{ripsterStatus.strength}/100</span>
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
