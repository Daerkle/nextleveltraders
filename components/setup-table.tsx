"use client";

import { type Setup } from "@/lib/gemini";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { PivotDisplay } from "@/lib/pivots/types";

interface SetupTableProps {
  setups: Setup[];
  pivotLevels?: PivotDisplay[];
}

// Helfer-Funktion zum Formatieren der Pivot-Distanz
const formatPivotDistance = (distance: number): string => {
  const formatted = formatPercent(Math.abs(distance));
  return `${distance > 0 ? '+' : '-'}${formatted}`;
};

export function SetupTable({ setups, pivotLevels = [] }: SetupTableProps) {
  if (!setups.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Keine Setups gefunden.
      </div>
    );
  }

  // Finde nächste Pivot-Level für jedes Setup
  const getClosestPivots = (price: number) => {
    if (!pivotLevels?.length) return null;

    // Sortiere Levels nach Abstand zum Preis
    const sorted = [...pivotLevels].sort((a, b) => 
      Math.abs(a.distance) - Math.abs(b.distance)
    );

    // Finde nächsten Support und Resistance
    const resistance = sorted.find(p => p.signal === 'resistance');
    const support = sorted.find(p => p.signal === 'support');

    return { resistance, support };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Stop Loss</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>R/R</TableHead>
            <TableHead>Support</TableHead>
            <TableHead>Resistance</TableHead>
            <TableHead>Probability</TableHead>
            <TableHead>Grund</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {setups.map((setup) => {
            const pivots = getClosestPivots(setup.entryPrice);
            
            return (
              <TableRow key={`${setup.symbol}-${setup.type}-${setup.entryPrice}`}>
                <TableCell className="font-medium">{setup.symbol}</TableCell>
                <TableCell>
                  <Badge
                    variant={setup.type === "LONG" ? "default" : "destructive"}
                  >
                    {setup.type}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(setup.entryPrice)}</TableCell>
                <TableCell>{formatCurrency(setup.stopLoss)}</TableCell>
                <TableCell>{formatCurrency(setup.target)}</TableCell>
                <TableCell>{setup.riskRewardRatio.toFixed(2)}</TableCell>
                <TableCell>
                  {pivots?.support ? (
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {pivots.support.level}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatPivotDistance(pivots.support.distance)}
                      </span>
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  {pivots?.resistance ? (
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {pivots.resistance.level}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatPivotDistance(pivots.resistance.distance)}
                      </span>
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell>{formatPercent(setup.probability)}</TableCell>
                <TableCell>{setup.reason}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}