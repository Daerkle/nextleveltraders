// React imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchSymbol } from '@/components/search-symbol';
import { type HistoricalPrice } from '@/lib/fmp';
import { calculateTimeBasedPivots, calculateDeMarkPivots, type DeMarkPivotLevels, type StandardPivotLevels } from '@/lib/indicators';

// Calculate the number of times a price level was touched
function getTouches(prices: HistoricalPrice[], level: number): string {
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


export default async function PivotsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const params = await Promise.resolve(searchParams);
  const symbolParam = (params.symbol as string) || 'AAPL';

  try {
    // Fetch data from FMP API
    const [quote, historicalData] = await Promise.all([
      // Get current quote
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbolParam}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`)
        .then(res => res.json()),
      // Get historical data - ensure we get enough data for yearly calculations
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbolParam}?timeseries=365&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`)
        .then(res => res.json())
    ]);

    if (!quote || quote.length === 0 || !historicalData?.historical) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Error loading market data</p>
        </div>
      );
    }

  // Historical data comes in reverse chronological order (newest first)
  const prices = historicalData.historical;
  const currentPrice = quote[0].price;
  const currentQuote = quote[0];

  // Calculate pivot levels for different timeframes
  const timeframes = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const;
  const pivotResults = timeframes.map(tf => {
    let relevantPrices;

    // Ensure we have at least 2 days of data
    if (prices.length < 2) {
      return {
        timeframe: tf,
        levels: { r3: 0, r2: 0, r1: 0, pp: 0, s1: 0, s2: 0, s3: 0 } as StandardPivotLevels,
        demark: { x: 0, r1: 0, pp: 0, s1: 0 }
      };
    }

    // Select data based on timeframe
    switch (tf) {
      case 'daily':
        // For daily, use yesterday's data
        relevantPrices = [prices[1]];
        break;
      case 'weekly':
        // For weekly, use last 5 trading days
        relevantPrices = prices.length >= 6 ? prices.slice(1, 6) : [prices[1]];
        break;
      case 'monthly':
        // For monthly, use last 21 trading days
        relevantPrices = prices.length >= 22 ? prices.slice(1, 22) : [prices[1]];
        break;
      case 'quarterly':
        // For quarterly, use last 63 trading days
        relevantPrices = prices.length >= 64 ? prices.slice(1, 64) : [prices[1]];
        break;
      case 'yearly':
        // For yearly, use last 252 trading days
        relevantPrices = prices.length >= 253 ? prices.slice(1, 253) : [prices[1]];
        break;
      default:
        relevantPrices = [prices[1]];
    }

    return {
      timeframe: tf,
      levels: calculateTimeBasedPivots(relevantPrices, tf, 'standard') as StandardPivotLevels,
      demark: calculateDeMarkPivots(relevantPrices.slice(0, 1))
    };
  });

  // Format pivot levels for display
  const formatPivotLevels = (levels: StandardPivotLevels, demarkLevels: DeMarkPivotLevels, prices: HistoricalPrice[]) => {
    const pivots = Object.entries(levels)
      .filter(([key]) => key !== 'pp')
      .map(([level, value]) => ({
        level: level.toUpperCase(),
        value,
        demarkValue: level === 'R1' ? demarkLevels.r1 : 
                     level === 'S1' ? demarkLevels.s1 : null,
        distance: ((value - currentPrice) / currentPrice) * 100,
        isAbove: value > currentPrice,
        touches: getTouches(prices, value)
      }))
      .sort((a, b) => b.value - a.value);

    // Insert PP in the middle
    pivots.splice(Math.floor(pivots.length / 2), 0, {
      level: 'PP',
      value: levels.pp,
      demarkValue: demarkLevels.pp,
      distance: 0,
      isAbove: false,
      touches: getTouches(prices, levels.pp)
    });

    return pivots;
  };

  const pivotsByTimeframe = pivotResults.map(({ timeframe, levels, demark }) => ({
    timeframe,
    pivots: formatPivotLevels(levels, demark, prices)
  }));

  const renderPivotCard = (title: string, pivotLevels: StandardPivotLevels, demarkLevels: { pp: number; r1: number; s1: number }, description: string) => {
    if (!pivotLevels) return null;

    const getPriceClass = (price: number) => {
      if (price === pivotLevels.pp) return 'bg-green-50 dark:bg-green-900/20';
      if (Math.abs(currentPrice - price) < 0.5) return 'bg-blue-50 dark:bg-blue-900/20';
      return '';
    };

    const renderLevel = (label: string, value: number | undefined, colorClass: string) => {
      if (value === undefined) return null;
      return (
        <div className={`flex justify-between items-center p-1.5 rounded-sm ${getPriceClass(value)}`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${colorClass}`}>{label}</span>
            {Math.abs(currentPrice - value) < 0.5 && (
              <span className="text-xs text-blue-500">Current</span>
            )}
          </div>
          <span className={`text-sm ${colorClass}`}>${value.toFixed(2)}</span>
        </div>
      );
    };

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            {currentQuote && (
              <span className={`text-sm ${currentQuote.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${currentQuote.price.toFixed(2)}
              </span>
            )}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {renderLevel('R3', pivotLevels.r3, 'text-red-500')}
            {renderLevel('R2', pivotLevels.r2, 'text-red-400')}
            {renderLevel('R1', pivotLevels.r1, 'text-orange-400')}
            {renderLevel('PP', pivotLevels.pp, 'text-green-600')}
            {renderLevel('S1', pivotLevels.s1, 'text-orange-400')}
            {renderLevel('S2', pivotLevels.s2, 'text-red-400')}
            {renderLevel('S3', pivotLevels.s3, 'text-red-500')}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">DeMark Levels</p>
              {renderLevel('PP (DeMark)', demarkLevels.pp, 'text-green-600')}
              {renderLevel('R1 (DeMark)', demarkLevels.r1, 'text-orange-400')}
              {renderLevel('S1 (DeMark)', demarkLevels.s1, 'text-orange-400')}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Pivot Analysis</h1>
        <p className="text-muted-foreground">
          Multi-Timeframe Pivot Point Analysis
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto">
        <div className="flex flex-col gap-4">
          <SearchSymbol defaultSymbol={symbolParam} />
          {quote && (
            <div className="flex items-center justify-between p-2 bg-card rounded-lg border">
              <div className="space-y-1">
                <p className="text-sm font-medium">{currentQuote.name || symbolParam}</p>
                <p className="text-xs text-muted-foreground">
                  Volume: {currentQuote.volume.toLocaleString()}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-lg font-semibold">
                  ${currentQuote.price.toFixed(2)}
                </p>
                <p className={`text-sm ${currentQuote.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentQuote.change >= 0 ? '+' : ''}{currentQuote.change.toFixed(2)} ({currentQuote.changesPercentage.toFixed(2)}%)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pivotsByTimeframe ? (
          <>
            {pivotsByTimeframe.map(({ timeframe, pivots }) => {
              const result = pivotResults.find(r => r.timeframe === timeframe);
              if (!result) return null;
              
              const descriptions = {
                daily: "Based on the last trading day",
                weekly: "Based on the last 5 trading days",
                monthly: "Based on the last 20 trading days",
                quarterly: "Based on the last 60 trading days",
                yearly: "Based on the last 250 trading days"
              };

              return renderPivotCard(
                `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Pivot Points`,
                result.levels,
                result.demark,
                descriptions[timeframe]
              );
            })}
          </>
        ) : (
          <div className="col-span-3 text-center py-8 text-muted-foreground">
            Loading pivot data...
          </div>
        )}
      </div>

      {quote && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Market Data</CardTitle>
            <CardDescription>
              Current Technical Information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-lg font-medium">${currentQuote.price.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Change</p>
                <p className={`text-lg font-medium ${currentQuote.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentQuote.change > 0 ? '+' : ''}
                  ${currentQuote.change.toFixed(2)} ({currentQuote.changesPercentage.toFixed(1)}%)
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Day High</p>
                <p className="text-lg font-medium">${currentQuote.dayHigh.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Day Low</p>
                <p className="text-lg font-medium">${currentQuote.dayLow.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Volume</p>
                <p className="text-lg font-medium">{(currentQuote.volume / 1000000).toFixed(1)}M</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Volume</p>
                <p className="text-lg font-medium">{(currentQuote.avgVolume / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
  } catch (error) {
    console.error('Error loading pivot data:', error);
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Error loading pivot data: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
