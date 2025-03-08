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

interface SetupTableProps {
  setups: Setup[];
}

export function SetupTable({ setups }: SetupTableProps) {
  if (!setups.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Keine Setups gefunden.
      </div>
    );
  }

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
            <TableHead>Probability</TableHead>
            <TableHead>Grund</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {setups.map((setup) => (
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
              <TableCell>{formatPercent(setup.probability)}</TableCell>
              <TableCell>{setup.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}