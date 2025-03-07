'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketChart } from '@/components/market-chart';
import { TooltipHelp } from '@/components/tooltip-help';

interface MarketTrendCardProps {
  title: string;
  symbol: string;
  change: number;
  chartData: { time: string; value: number }[];
  tooltipContent: string;
}

export function MarketTrendCard({ title, symbol, change, chartData, tooltipContent }: MarketTrendCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TooltipHelp content={tooltipContent} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {change > 0 ? 'Bullisch' : 'Bärisch'}
          </div>
          <p className="text-xs text-muted-foreground">
            {change > 0 ? '+' : ''}{change.toFixed(2)}% im Tagesvergleich
          </p>
          <div className="h-[100px] mt-4">
            <MarketChart data={chartData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
