"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { WatchlistWithQuotes } from "@/types/watchlist";

interface WatchlistTableProps {
  watchlistId: string;
  items: WatchlistWithQuotes['items'];
}

export function WatchlistTable({ watchlistId, items }: WatchlistTableProps) {
  const [newSymbol, setNewSymbol] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const router = useRouter();

  const addSymbol = async () => {
    if (!newSymbol) return;

    setIsAdding(true);
    try {
      const response = await fetch(`/api/watchlists/${watchlistId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: newSymbol.toUpperCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Hinzufügen des Symbols");
      }

      toast.success("Symbol erfolgreich hinzugefügt");
      setNewSymbol("");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsAdding(false);
    }
  };

  const removeSymbol = async (symbol: string) => {
    setIsRemoving(symbol);
    try {
      const response = await fetch(
        `/api/watchlists/${watchlistId}/items?symbol=${symbol}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Fehler beim Entfernen des Symbols");
      }

      toast.success("Symbol erfolgreich entfernt");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsRemoving(null);
    }
  };

  const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return "0.00";
    return price.toFixed(2);
  };

  const formatPercentage = (value?: number) => {
    if (typeof value !== 'number') return "0.00";
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
  };

  const formatVolume = (volume?: number) => {
    if (typeof volume !== 'number') return "-";
    return `${(volume / 1000000).toFixed(1)}M`;
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            className="pl-8"
            placeholder="Symbol hinzufügen (z.B. AAPL)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newSymbol) {
                e.preventDefault();
                addSymbol();
              }
            }}
          />
          <PlusIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button 
          onClick={addSymbol} 
          disabled={!newSymbol || isAdding}
        >
          {isAdding ? "Wird hinzugefügt..." : "Hinzufügen"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Letzter Preis</TableHead>
            <TableHead className="text-right">Änderung %</TableHead>
            <TableHead className="text-right">Volumen</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.symbol}>
              <TableCell className="font-medium">{item.symbol}</TableCell>
              <TableCell>{item.quote?.name || item.symbol}</TableCell>
              <TableCell className="text-right">
                ${formatPrice(item.quote?.price)}
              </TableCell>
              <TableCell
                className={`text-right ${
                  (item.quote?.changesPercentage ?? 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatPercentage(item.quote?.changesPercentage)}%
              </TableCell>
              <TableCell className="text-right">
                {formatVolume(item.quote?.volume)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeSymbol(item.symbol)}
                  disabled={isRemoving === item.symbol}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Löschen</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Keine Symbole in dieser Watchlist
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
