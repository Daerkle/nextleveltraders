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

      {/* EMA Cloud Status über dem Chart */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ripster EMA Cloud Status</CardTitle>
          <CardDescription>Trend-Indikation basierend auf Ripster EMA-Clouds (5-12 & 34-50)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-lg p-4 ${ripsterStatus.shortTerm === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ripsterStatus.shortTerm === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'} border`}>
              <h3 className="text-lg font-semibold mb-2">Kurzfrist Status (5-12 EMA Cloud)</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Trend-Richtung</span>
                <span className={`text-sm px-2 py-1 rounded-full ${ripsterStatus.shortTerm === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : ripsterStatus.shortTerm === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300'}`}>
                  {ripsterStatus.shortTerm === 'bullish' ? 'Bullisch' : ripsterStatus.shortTerm === 'bearish' ? 'Bearish' : 'Neutral'}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Die 5-12 EMA Cloud dient als flüssige Trendlinie für Intraday-Trades. Preis über der Cloud ist bullisch, unter der Cloud bearish.
              </p>
            </div>
            <div className={`rounded-lg p-4 ${ripsterStatus.longTerm === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ripsterStatus.longTerm === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'} border`}>
              <h3 className="text-lg font-semibold mb-2">Langfrist Status (34-50 EMA Cloud)</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Trend-Richtung</span>
                <span className={`text-sm px-2 py-1 rounded-full ${ripsterStatus.longTerm === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : ripsterStatus.longTerm === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300'}`}>
                  {ripsterStatus.longTerm === 'bullish' ? 'Bullisch' : ripsterStatus.longTerm === 'bearish' ? 'Bearish' : 'Neutral'}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Die 34-50 EMA Cloud bestätigt die bullische oder bearische Tendenz für jeden Zeitrahmen. Diese Cloud dient als wichtiger Support/Resistance-Bereich.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="h-[600px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="w-72">
              <SearchSymbol defaultSymbol={symbol} />
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

      {/* Marktdaten und Niveau-Indikatoren nebeneinander */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Marktdaten</CardTitle>
            <CardDescription>Aktuelle technische Informationen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Aktuell</p>
                  <p className="text-lg font-medium">${quote?.price?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Veränderung</p>
                  <p className={`text-lg font-medium ${quote?.change && quote.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quote?.change && quote.change > 0 ? '+' : ''}
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
                  <p className="text-lg font-medium">{quote?.volume ? (quote.volume / 1000000).toFixed(1) : '0.0'}M</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Durchschnitt Vol.</p>
                  <p className="text-lg font-medium">{quote?.avgVolume ? (quote.avgVolume / 1000000).toFixed(1) : '0.0'}M</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pivot-Levels</CardTitle>
            <CardDescription>Wichtige Support- und Resistance-Levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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
      </div>
    </div>
  );
}