import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import { Setup } from "@/lib/types/market";

interface SetupTableProps {
  setups: Setup[];
}

export function SetupTable({ setups }: SetupTableProps) {
  if (!setups.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Keine aktiven Setups gefunden
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
            <TableHead>Wahrscheinlichkeit</TableHead>
            <TableHead>Grund</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {setups.map((setup) => (
            <TableRow key={`${setup.symbol}-${setup.timestamp}`}>
              <TableCell className="font-medium">{setup.symbol}</TableCell>
              <TableCell>
                <span className={setup.type === 'LONG' ? 'text-green-500' : 'text-red-500'}>
                  {setup.type}
                </span>
              </TableCell>
              <TableCell>{formatNumber(setup.entryPrice)}</TableCell>
              <TableCell>{formatNumber(setup.stopLoss)}</TableCell>
              <TableCell>{formatNumber(setup.target)}</TableCell>
              <TableCell>{formatNumber(setup.riskRewardRatio)}:1</TableCell>
              <TableCell>{(setup.probability * 100).toFixed(0)}%</TableCell>
              <TableCell className="max-w-md truncate">{setup.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}