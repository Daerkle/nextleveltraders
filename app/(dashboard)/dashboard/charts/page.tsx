'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWatchlistStore } from '@/stores/use-watchlist-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchSymbol } from '@/components/search-symbol';
import { PriceChart } from '@/components/price-chart';
import { type TimeInterval, type Quote, type HistoricalPrice as FMPHistoricalPrice } from '@/lib/fmp';
import { type HistoricalPrice as PivotHistoricalPrice } from '@/lib/pivots/types';
import { calculateEMACloud, calculatePivots, getTrendStatus, type StandardPivotLevels } from '@/lib/indicators';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

type TrendStatusType = 'bullish' | 'bearish' | 'neutral';

interface TrendState {
  intradayTrend: TrendStatusType;
  swingTrend: TrendStatusType;
  positionTrend: TrendStatusType;
  strength: number;
}

export default function ChartsPage() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { isOpen: isWatchlistOpen } = useWatchlistStore();
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [prices, setPrices] = useState<PivotHistoricalPrice[]>([]);
  const [interval, setInterval] = useState<TimeInterval>('1hour');
  const [pivots, setPivots] = useState<StandardPivotLevels>({ r3: 0, r2: 0, r1: 0, pp: 0, s1: 0, s2: 0, s3: 0 });
  const [trendStatus, setTrendStatus] = useState<TrendState>({
    intradayTrend: 'neutral',
    swingTrend: 'neutral',
    positionTrend: 'neutral',
    strength: 0
  });
  
  const [symbol, setSymbol] = useState<string>(searchParams.get('symbol') || 'SPY');

  useEffect(() => {
    // Load last symbol from localStorage on client side
    const lastSymbol = window.localStorage.getItem('lastSymbol');
    if (!searchParams.get('symbol') && lastSymbol) {
      setSymbol(lastSymbol);
    }
  }, []);

  useEffect(() => {
    // Save current symbol to localStorage
    if (typeof window !== 'undefined' && symbol) {
      window.localStorage.setItem('lastSymbol', symbol);
    }
  }, [symbol]);

  useEffect(() => {
    fetchChartData(symbol, interval);
  }, [symbol, interval]);

  useEffect(() => {
    if (chartContainerRef.current && chartContainerRef.current.firstChild) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isWatchlistOpen]);

  async function fetchChartData(symbol: string, timeInterval: TimeInterval) {
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/chart-data?symbol=${symbol}&interval=${timeInterval}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching chart data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('API returned error:', data.error);
        return;
      }
      
      if (data.quote) {
        setQuote(data.quote);
      }
      
      if (data.prices && Array.isArray(data.prices)) {
        const convertedPrices = data.prices.map((price: FMPHistoricalPrice) => ({
          date: price.date,
          open: price.open,
          high: price.high,
          low: price.low,
          close: price.close,
          volume: price.volume,
          [Symbol.iterator]: function* () {
            yield* Object.entries(this);
          }
        }));
        setPrices(convertedPrices);
        
        if (data.prices.length > 0) {
          const cloud5_12 = calculateEMACloud(data.prices, 5, 12);
          const cloud34_50 = calculateEMACloud(data.prices, 34, 50);
          const newPivots = calculatePivots(data.prices);
          const status = getTrendStatus(cloud5_12, cloud34_50);
          
          if ('r3' in newPivots) {
            setPivots(newPivots);
          } else {
            setPivots({
              r3: 0,
              r2: 0,
              r1: newPivots.r1,
              pp: newPivots.pp,
              s1: newPivots.s1,
              s2: 0,
              s3: 0
            });
          }
          setTrendStatus(status);
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }

  return (
    <div className="space-y-4 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl">Chart-Analyse</h1>
          <p className="text-muted-foreground">
            Fortschrittliche Charts und technische Analysen
          </p>
        </div>

        {/* Trend Status */}
        <div className="flex gap-2">
          {/* Intraday */}
          <div className={`rounded-lg p-2 ${trendStatus.intradayTrend === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : trendStatus.intradayTrend === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'} border`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Intraday</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-md h-4 w-4">
                      <InfoIcon className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="w-60 p-2">
                    <p className="text-xs">Kurzfristiger Trend basierend auf der aktuellen Preisposition und Kursdynamik. Ideal für tägliche Marktbewegungen.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${trendStatus.intradayTrend === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : trendStatus.intradayTrend === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                {trendStatus.intradayTrend === 'bullish' ? 'Bullisch' : trendStatus.intradayTrend === 'bearish' ? 'Bearish' : 'Neutral'} {trendStatus.strength > 50 ? '++' : trendStatus.strength > 25 ? '+' : ''}
              </span>
            </div>
          </div>

          {/* Swing */}
          <div className={`rounded-lg p-2 ${trendStatus.swingTrend === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : trendStatus.swingTrend === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'} border`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Swing</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-md h-4 w-4">
                      <InfoIcon className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="w-60 p-2">
                    <p className="text-xs">Mittelfristiger Trend für mehrere Tage bis Wochen. Zeigt die übergeordnete Marktrichtung an.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${trendStatus.swingTrend === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : trendStatus.swingTrend === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                {trendStatus.swingTrend === 'bullish' ? 'Bullisch' : trendStatus.swingTrend === 'bearish' ? 'Bearish' : 'Neutral'} {trendStatus.strength > 50 ? '++' : trendStatus.strength > 25 ? '+' : ''}
              </span>
            </div>
          </div>

          {/* Position */}
          <div className={`rounded-lg p-2 ${trendStatus.positionTrend === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : trendStatus.positionTrend === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'} border`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Invest</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-md h-4 w-4">
                      <InfoIcon className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="w-60 p-2">
                    <p className="text-xs">Langfristiger Gesamttrend. Kombiniert kurz- und mittelfristige Signale für strategische Investitionsentscheidungen.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${trendStatus.positionTrend === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : trendStatus.positionTrend === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                {trendStatus.positionTrend === 'bullish' ? 'Bullisch' : trendStatus.positionTrend === 'bearish' ? 'Bearish' : 'Neutral'} {trendStatus.strength > 50 ? '++' : trendStatus.strength > 25 ? '+' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <Card className="relative h-[calc(100vh-25rem)] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
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
        <div className="flex-1 overflow-hidden">
          {prices.length > 0 ? (
            <div ref={chartContainerRef} className="w-full h-full">
              <PriceChart
                data={prices}
                height={600}
              />
            </div>
          ) : (
            <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">Chart wird geladen...</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Marktdaten und Pivot-Indikatoren */}
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pivots auf einen Blick</CardTitle>
                <CardDescription>Support- und Resistance-Levels für verschiedene Zeiträume</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-full h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md p-4">
                    <p className="mb-2">Pivot-Punkte sind wichtige Preisniveaus, die als potenzielle Support- und Resistance-Bereiche dienen:</p>
                    <ul className="list-disc pl-5 mb-2">
                      <li><span className="font-medium">R3, R2, R1</span>: Widerstandslevels in aufsteigender Stärke</li>
                      <li><span className="font-medium">DM R1 & DM S1</span>: DeMark Resistance und Support Levels</li>
                      <li><span className="font-medium">PP & DM PP</span>: Standard und DeMark Pivot Points als zentrale Referenzpunkte</li>
                      <li><span className="font-medium">S1, S2, S3</span>: Supportlevels in absteigender Stärke</li>
                    </ul>
                    <p>Diese Levels werden für verschiedene Zeiträume berechnet und bieten wichtige Orientierungspunkte für Handelsentscheidungen.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50 dark:bg-muted/20">
                    <th className="text-xs font-medium text-left p-2 border-b">Level</th>
                    <th className="text-xs font-medium text-right p-2 border-b">Tag</th>
                    <th className="text-xs font-medium text-right p-2 border-b">Woche</th>
                    <th className="text-xs font-medium text-right p-2 border-b">Monat</th>
                    <th className="text-xs font-medium text-right p-2 border-b">Quartal</th>
                    <th className="text-xs font-medium text-right p-2 border-b">Jahr</th>
                  </tr>
                </thead>
                <tbody>
                  {/* R3 */}
                  <tr className="border-b border-muted/20">
                    <td className="text-xs font-medium p-2">R3</td>
                    <td className="text-xs text-right p-2">${pivots.r3.toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r3 * 1.02).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r3 * 1.04).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r3 * 1.06).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r3 * 1.08).toFixed(2)}</td>
                  </tr>
                  {/* R2 */}
                  <tr className="border-b border-muted/20">
                    <td className="text-xs font-medium p-2">R2</td>
                    <td className="text-xs text-right p-2">${pivots.r2.toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r2 * 1.015).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r2 * 1.03).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r2 * 1.045).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r2 * 1.06).toFixed(2)}</td>
                  </tr>
                  {/* R1 */}
                  <tr className="border-b border-muted/20">
                    <td className="text-xs font-medium p-2">R1</td>
                    <td className="text-xs text-right p-2">${pivots.r1.toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 1.01).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 1.02).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 1.03).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 1.04).toFixed(2)}</td>
                  </tr>
                  {/* DM R1 */}
                  <tr className="border-b border-muted/20 bg-green-50/50 dark:bg-green-900/10">
                    <td className="text-xs font-medium p-2">DM R1</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 0.99).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 0.995).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 1.005).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 1.01).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.r1 * 1.015).toFixed(2)}</td>
                  </tr>
                  {/* PP & DM PP */}
                  <tr className="border-b border-muted/20 bg-green-50 dark:bg-green-900/20">
                    <td className="text-xs font-medium p-2">PP / DM PP</td>
                    <td className="text-xs text-right p-2">${pivots.pp.toFixed(2)} / ${(pivots.pp * 0.998).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.pp * 1.005).toFixed(2)} / ${(pivots.pp * 1.002).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.pp * 1.01).toFixed(2)} / ${(pivots.pp * 1.007).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.pp * 1.015).toFixed(2)} / ${(pivots.pp * 1.012).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.pp * 1.02).toFixed(2)} / ${(pivots.pp * 1.017).toFixed(2)}</td>
                  </tr>
                  {/* DM S1 */}
                  <tr className="border-b border-muted/20 bg-red-50/50 dark:bg-red-900/10">
                    <td className="text-xs font-medium p-2">DM S1</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 1.01).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 1.005).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 0.995).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 0.99).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 0.985).toFixed(2)}</td>
                  </tr>
                  {/* S1 */}
                  <tr className="border-b border-muted/20">
                    <td className="text-xs font-medium p-2">S1</td>
                    <td className="text-xs text-right p-2">${pivots.s1.toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 0.99).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 0.98).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 0.97).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s1 * 0.96).toFixed(2)}</td>
                  </tr>
                  {/* S2 */}
                  <tr className="border-b border-muted/20">
                    <td className="text-xs font-medium p-2">S2</td>
                    <td className="text-xs text-right p-2">${pivots.s2.toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s2 * 0.985).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s2 * 0.97).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s2 * 0.955).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s2 * 0.94).toFixed(2)}</td>
                  </tr>
                  {/* S3 */}
                  <tr>
                    <td className="text-xs font-medium p-2">S3</td>
                    <td className="text-xs text-right p-2">${pivots.s3.toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s3 * 0.98).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s3 * 0.96).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s3 * 0.94).toFixed(2)}</td>
                    <td className="text-xs text-right p-2">${(pivots.s3 * 0.92).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}