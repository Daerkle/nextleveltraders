'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchSymbol } from '@/components/search-symbol';
import { PriceChart } from '@/components/price-chart';
import { type TimeInterval, type Quote, type HistoricalPrice } from '@/lib/fmp';
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
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [prices, setPrices] = useState<HistoricalPrice[]>([]);
  const [interval, setInterval] = useState<TimeInterval>('1hour');
  const [pivots, setPivots] = useState<StandardPivotLevels>({ r3: 0, r2: 0, r1: 0, pp: 0, s1: 0, s2: 0, s3: 0 });
  const [trendStatus, setTrendStatus] = useState<TrendState>({
    intradayTrend: 'neutral',
    swingTrend: 'neutral',
    positionTrend: 'neutral',
    strength: 0
  });
  
  const symbol = searchParams.get('symbol') || 'AAPL';

  useEffect(() => {
    fetchChartData(symbol, interval);
  }, [symbol, interval]);

  async function fetchChartData(symbol: string, timeInterval: TimeInterval) {
    try {
      // Verwende die aktuelle URL-Basis für API-Aufrufe
      const baseUrl = window.location.origin;
      console.log('Fetching chart data from:', `${baseUrl}/api/chart-data?symbol=${symbol}&interval=${timeInterval}`);
      
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
      console.log('Chart data received:', data);
      
      // Prüfe, ob die Daten gültig sind
      if (data.error) {
        console.error('API returned error:', data.error);
        return;
      }
      
      // Setze Quote nur, wenn es existiert
      if (data.quote) {
        setQuote(data.quote);
      } else {
        console.warn('No quote data received');
      }
      
      // Prüfe, ob prices existiert und ein Array ist
      if (data.prices && Array.isArray(data.prices)) {
        setPrices(data.prices);
        
        if (data.prices.length > 0) {
          const cloud5_12 = calculateEMACloud(data.prices, 5, 12);
          const cloud34_50 = calculateEMACloud(data.prices, 34, 50);
          const newPivots = calculatePivots(data.prices);
          const status = getTrendStatus(cloud5_12, cloud34_50);
          
          // Stelle sicher, dass wir mit dem StandardPivotLevels-Typ arbeiten
          if ('r3' in newPivots) {
            setPivots(newPivots);
          } else {
            // Wenn wir DeMarkPivotLevels haben, konvertiere zu StandardPivotLevels
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
        } else {
          console.warn('Prices array is empty');
        }
      } else {
        console.warn('No prices data received or prices is not an array');
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
          <div className="flex items-center justify-between">
            <CardTitle>EMA Cloud Trend Status</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-8 w-8">
                    <InfoIcon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4">
                  <p className="mb-2">Das EMA Cloud System nutzt Bereiche zwischen zwei exponentiellen gleitenden Durchschnitten (EMAs), die als Support oder Resistance dienen.</p>
                  <p className="mb-2">Die Trendrichtung wird durch die Position des Kurses relativ zu beiden Clouds bestimmt:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li><span className="text-green-600 dark:text-green-400 font-medium">Bullisch</span>: Kurs über beiden Clouds</li>
                    <li><span className="text-yellow-600 dark:text-yellow-400 font-medium">Neutral/Übergang</span>: Kurs zwischen den Clouds</li>
                    <li><span className="text-red-600 dark:text-red-400 font-medium">Bearish</span>: Kurs unter beiden Clouds</li>
                  </ul>
                  <p>Diese Methode kann auf verschiedenen Zeitrahmen eingesetzt werden (10-Min für Day-Trading, 1h/1d für Swing-Trading).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Trend-Indikation basierend auf EMA-Clouds (5-12 & 34-50)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`rounded-lg p-4 ${trendStatus.intradayTrend === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : trendStatus.intradayTrend === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'} border`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Intraday</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-6 w-6">
                        <InfoIcon className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="p-4">
                      <p className="mb-2">Basiert auf der Kombination aus 5-12 und 34-50 EMA Clouds.</p>
                      <ul className="list-disc pl-5">
                        <li><span className="text-green-600 dark:text-green-400 font-medium">Intraday bullisch</span>: Beide Clouds zeigen nach oben (Preis über beiden Clouds)</li>
                        <li><span className="text-yellow-600 dark:text-yellow-400 font-medium">Intraday unentschieden</span>: Clouds zeigen in unterschiedliche Richtungen</li>
                        <li><span className="text-red-600 dark:text-red-400 font-medium">Intraday bearish</span>: Beide Clouds zeigen nach unten (Preis unter beiden Clouds)</li>
                      </ul>
                      <p className="mt-2">Ideal für kurzfristige Day-Trading-Entscheidungen innerhalb eines Handelstages.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Trend-Richtung</span>
                <span className={`text-sm px-2 py-1 rounded-full ${trendStatus.intradayTrend === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : trendStatus.intradayTrend === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                  {trendStatus.intradayTrend === 'bullish' ? 'Bullisch' : trendStatus.intradayTrend === 'bearish' ? 'Bearish' : 'Übergang'}
                </span>
              </div>
            </div>
            <div className={`rounded-lg p-4 ${trendStatus.positionTrend === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : trendStatus.positionTrend === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'} border`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Swing</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-6 w-6">
                        <InfoIcon className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="p-4">
                      <p className="mb-2">Basiert auf der Kombination aus 5-12 und 34-50 EMA Clouds.</p>
                      <ul className="list-disc pl-5 mb-2">
                        <li><span className="text-green-600 dark:text-green-400 font-medium">Swing bullisch</span>: Beide Clouds zeigen nach oben (Preis über beiden Clouds)</li>
                        <li><span className="text-yellow-600 dark:text-yellow-400 font-medium">Swing unentschieden</span>: Clouds zeigen in unterschiedliche Richtungen</li>
                        <li><span className="text-red-600 dark:text-red-400 font-medium">Swing bearish</span>: Beide Clouds zeigen nach unten (Preis unter beiden Clouds)</li>
                      </ul>
                      <p>Geeignet für mittelfristige Handelsentscheidungen über mehrere Tage.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Trend-Richtung</span>
                <span className={`text-sm px-2 py-1 rounded-full ${trendStatus.positionTrend === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : trendStatus.positionTrend === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                  {trendStatus.positionTrend === 'bullish' ? 'Bullisch' : trendStatus.positionTrend === 'bearish' ? 'Bearish' : 'Übergang'}
                </span>
              </div>
            </div>
            
            {/* Position Trading (1d) */}
            <div className={`rounded-lg p-4 ${trendStatus.positionTrend === 'bullish' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : trendStatus.positionTrend === 'bearish' ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'} border`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Position</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-6 w-6">
                        <InfoIcon className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="p-4">
                      <p className="mb-2">Basiert auf der Kombination aus 5-12 und 34-50 EMA Clouds.</p>
                      <ul className="list-disc pl-5 mb-2">
                        <li><span className="text-green-600 dark:text-green-400 font-medium">Position bullisch</span>: Beide Clouds zeigen nach oben (Preis über beiden Clouds)</li>
                        <li><span className="text-yellow-600 dark:text-yellow-400 font-medium">Position unentschieden</span>: Clouds zeigen in unterschiedliche Richtungen</li>
                        <li><span className="text-red-600 dark:text-red-400 font-medium">Position bearish</span>: Beide Clouds zeigen nach unten (Preis unter beiden Clouds)</li>
                      </ul>
                      <p>Ideal für langfristige Handelsentscheidungen über Wochen oder Monate.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Trend-Richtung</span>
                <span className={`text-sm px-2 py-1 rounded-full ${trendStatus.positionTrend === 'bullish' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : trendStatus.positionTrend === 'bearish' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                  {trendStatus.positionTrend === 'bullish' ? 'Bullisch' : trendStatus.positionTrend === 'bearish' ? 'Bearish' : 'Übergang'}
                </span>
              </div>
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