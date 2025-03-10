// React imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchSymbol } from '@/components/search-symbol';
import { type HistoricalPrice } from '@/lib/fmp';
import { PivotCalculator } from '@/lib/pivots/calculator';
import { type PivotPoints } from '@/lib/pivots/types';

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

  // Initialize pivot calculator
  const calculator = new PivotCalculator();
  
  // Map UI timeframes to calculator configurations
  const timeframeConfig = {
    'daily': {
      timeframe: '1d',
      lookback: 1,
      method: 'standard' as const
    },
    'weekly': {
      timeframe: '1d',
      lookback: 5,
      method: 'standard' as const
    },
    'monthly': {
      timeframe: '1d',
      lookback: 21,
      method: 'standard' as const
    },
    'quarterly': {
      timeframe: '1d',
      lookback: 63,
      method: 'standard' as const
    },
    'yearly': {
      timeframe: '1d',
      lookback: 252,
      method: 'standard' as const
    }
  } as const;

  // Calculate pivot levels for different timeframes
  const timeframes = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const;
  const pivotResults = timeframes.map(tf => {
    const config = timeframeConfig[tf];
    
    // Validiere und selektiere Preisdaten
    const historicalData = (() => {
      if (prices.length < 2) return [];
      if (prices.length < (config.lookback + 1)) return [prices[1]];
      return prices.slice(1, config.lookback + 1);
    })();

    // Berechne Pivot-Levels
    return {
      timeframe: tf,
      levels: calculator.calculate(historicalData, config.timeframe, {
        method: config.method,
        levels: 5
      }),
      demark: calculator.calculate(historicalData, config.timeframe, {
        method: 'demark',
        levels: 3
      })
    };
  });

  // Format pivot levels for display
  const formatPivotLevels = (levels: PivotPoints, demarkLevels: PivotPoints, prices: HistoricalPrice[]) => {
    const pivots = Object.entries(levels)
      .filter(([key]) => key !== 'pp')
      .map(([level, value]) => ({
        level: level.toUpperCase(),
        value: value as number,
        demarkValue: level === 'r1' ? demarkLevels.r1 :
                     level === 's1' ? demarkLevels.s1 : null,
        distance: ((value as number - currentPrice) / currentPrice) * 100,
        isAbove: (value as number) > currentPrice,
        touches: getTouches(prices, value as number)
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

  const renderPivotCard = (title: string, pivotLevels: PivotPoints, demarkLevels: PivotPoints, description: string) => {
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
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">Pivot Analysis</h1>
        <p className="text-muted-foreground">
          Multi-Timeframe Pivot Point Analysis
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col gap-4 mx-auto">
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

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {pivotsByTimeframe ? (
          <>
            {pivotsByTimeframe.map(({ timeframe, pivots }) => {
              const result = pivotResults.find(r => r.timeframe === timeframe);
              if (!result) return null;
              
              const descriptions = {
                daily: "Based on the previous trading day's data",
                weekly: "Based on the last 5 trading days (rolling week)",
                monthly: "Based on the last 21 trading days (rolling month)",
                quarterly: "Based on the last 63 trading days (rolling quarter)",
                yearly: "Based on the last 252 trading days (rolling year)"
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
            <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
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
