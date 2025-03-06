'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchSymbol } from "@/components/search-symbol";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getQuotes } from '@/lib/fmp';
import { calculateTimeBasedPivots, calculateDeMarkPivots } from '@/lib/indicators';

import { type PivotType, type StandardPivotLevels } from '@/lib/indicators';

type PivotLevels = StandardPivotLevels;

interface PivotAnalysis {
  daily: PivotLevels;
  weekly: PivotLevels;
  monthly: PivotLevels;
}

export default function PivotAnalysisPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pivots, setPivots] = useState<PivotAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const symbol = searchParams.get('symbol') || 'AAPL';

  useEffect(() => {
    fetchPivotData(symbol);
  }, [symbol]);

  async function fetchPivotData(symbol: string) {
    try {
      const [quoteData, historicalData] = await Promise.all([
        // Fetch current market data
        fetch(`/api/chart-data?symbol=${symbol}&interval=1min`)
          .then(res => res.json())
          .catch(() => ({ quote: null })),

        // Fetch historical data for the last 30 days
        fetch(`/api/chart-data?symbol=${symbol}&interval=daily&limit=30`)
          .then(res => res.json())
          .catch(() => ({ prices: [] }))
      ]);

      if (!quoteData.quote) {
        setError('No quote data available');
        setQuote(null);
        setPivots(null);
        return;
      }
      setQuote(quoteData.quote);
      setError(null);

      if (!historicalData.prices || historicalData.prices.length === 0) {
        setError('No historical data available');
        setPivots(null);
        return;
      }

      // Sort data by date (newest first)
      const sortedPrices = [...historicalData.prices].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Calculate pivot points for different timeframes
      const dailyPivots = calculateTimeBasedPivots(
        sortedPrices.slice(0, 1), // Only the last day
        'daily',
        'standard'
      ) as StandardPivotLevels;

      const weeklyPivots = calculateTimeBasedPivots(
        sortedPrices.slice(0, 5), // Last 5 days
        'weekly',
        'standard'
      ) as StandardPivotLevels;

      const monthlyPivots = calculateTimeBasedPivots(
        sortedPrices.slice(0, 20), // Last 20 days
        'monthly',
        'standard'
      ) as StandardPivotLevels;

      // Calculate DeMark values for each timeframe
      const dailyDeMark = calculateDeMarkPivots(sortedPrices.slice(0, 1));
      const weeklyDeMark = calculateDeMarkPivots(sortedPrices.slice(0, 5));
      const monthlyDeMark = calculateDeMarkPivots(sortedPrices.slice(0, 20));

      setPivots({
        daily: { ...dailyPivots, demark: dailyDeMark },
        weekly: { ...weeklyPivots, demark: weeklyDeMark },
        monthly: { ...monthlyPivots, demark: monthlyDeMark }
      });
  } catch (error) {
    console.error('Error fetching pivot data:', error);
    setError('Error loading pivot data');
    setPivots(null);
  }
}

// Calculate the number of times a price level was touched
function getTouches(prices: any[], level: number): string {
  const tolerance = 0.001; // 0.1% tolerance
  let touches = 0;
  let lastTouch = false;

  for (const price of prices) {
    const high = price.high;
    const low = price.low;
    const isTouch = (high >= level * (1 - tolerance) && high <= level * (1 + tolerance)) ||
                   (low >= level * (1 - tolerance) && low <= level * (1 + tolerance));
    
    if (isTouch && !lastTouch) {
      touches++;
    }
    lastTouch = isTouch;
  }

  if (touches === 0) return 'None';
  if (touches === 1) return 'Once';
  if (touches === 2) return 'Twice';
  if (touches === 3) return 'Three times';
  return 'Multiple';
}


  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Pivot Point Analysis</h1>
        <p className="text-muted-foreground">
          Multi-timeframe pivot calculations and analysis for precise trading levels
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{symbol} - Pivot Levels</CardTitle>
                  <CardDescription>{quote?.name}</CardDescription>
                </div>
                <div className="flex space-x-2">


                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Level</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>DeMark</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Touches</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(pivots).map(([timeframe, levels]) => (
                      <React.Fragment key={timeframe}>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={6} className="py-2 font-semibold">
                            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Pivots
                          </TableCell>
                        </TableRow>
                        {Object.entries(levels)
                          .filter(([key]) => key !== 'demark')
                          .map(([level, value]) => {
                            const isAbove = value > quote.price;
                            const distance = ((value - quote.price) / quote.price) * 100;
                            const demarkValue = levels.demark?.[level.toLowerCase()];
                            
                            return (
                              <TableRow key={`${timeframe}-${level}`} className={level === 'pp' ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                                <TableCell className={`font-medium ${isAbove ? 'text-green-600' : 'text-red-600'}`}>
                                  {level.toUpperCase()}
                                </TableCell>
                                <TableCell>${value.toFixed(2)}</TableCell>
                                <TableCell>
                                  {demarkValue ? `$${demarkValue.toFixed(2)}` : '-'}
                                </TableCell>
                                <TableCell>{distance > 0 ? '+' : ''}{distance.toFixed(1)}%</TableCell>
                                <TableCell>
                                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent 
                                    ${level === 'pp' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                                      isAbove ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    {level === 'pp' ? 'At Pivot' : isAbove ? 'Above Price' : 'Below Price'}
                                  </span>
                                </TableCell>
                                <TableCell>{getTouches(sortedPrices, value)}</TableCell>
                              </TableRow>
                            );
                          })}
                      </React.Fragment>
                    ))}



                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pivot Status</CardTitle>
                <CardDescription>
                  Current status across all timeframes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Daily Status:</span>
                      <span className="text-sm font-medium text-green-600">At Pivot (PP)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-green-600" style={{ width: '50%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>S3</span>
                      <span>S2</span>
                      <span>S1</span>
                      <span className="font-bold">PP</span>
                      <span>R1</span>
                      <span>R2</span>
                      <span>R3</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekly Status:</span>
                      <span className="text-sm font-medium text-green-600">Above Pivot (R1)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-green-600" style={{ width: '67%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>S3</span>
                      <span>S2</span>
                      <span>S1</span>
                      <span>PP</span>
                      <span className="font-bold">R1</span>
                      <span>R2</span>
                      <span>R3</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Status:</span>
                      <span className="text-sm font-medium text-red-600">Below Pivot (S1)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-red-600" style={{ width: '33%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>S3</span>
                      <span>S2</span>
                      <span className="font-bold">S1</span>
                      <span>PP</span>
                      <span>R1</span>
                      <span>R2</span>
                      <span>R3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DeMark Pivot Analysis</CardTitle>
                <CardDescription>
                  Status across all timeframes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Daily DM</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        Above DM R1
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      DM R1: $193.50 | DM PP: $191.25 | DM S1: $189.00
                    </p>
                  </div>
                  
                  <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Wochen DM</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        Über DM R1
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      DM R1: $191.75 | DM PP: $190.25 | DM S1: $188.50
                    </p>
                  </div>
                  
                  <div className="rounded-lg p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Monthly DM</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                        Below DM S1
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {/* DeMark pivot levels will be dynamically calculated */}
                    </p>
                  </div>
                  
                  <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Multiframe Status</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        Long Setup Confirmed
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      2/3 timeframes bullish (above DM R1)
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600">SPY und QQQ Trend: Bullisch (ADX {'>'} 25)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Pivot R2 Analysis</CardTitle>
            <CardDescription>
              Long-term resistance levels and their achievement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Yearly PP</TableHead>
                    <TableHead>Yearly R2</TableHead>
                    <TableHead>Distance to R2</TableHead>
                    <TableHead>Time to Reach</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {/* TODO: Implement dynamic yearly pivot data fetching and calculations */}
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Loading yearly pivot data...
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}