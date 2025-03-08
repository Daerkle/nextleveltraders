import { useState, useEffect } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { WatchlistItem } from '@/types/watchlist'
import { useWatchlistStore } from '@/stores/use-watchlist-store'

interface EditableWatchlistProps {
  initialItems: WatchlistItem[]
  onAddSymbol: (symbol: string) => Promise<void>
  onRemoveSymbol: (symbol: string) => Promise<void>
}

export function EditableWatchlist({ initialItems, onAddSymbol, onRemoveSymbol }: EditableWatchlistProps) {
  const [items, setItems] = useState<WatchlistItem[]>(initialItems || [])
  const [newSymbol, setNewSymbol] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  
  // Debug-Ausgabe
  useEffect(() => {
    console.log('EditableWatchlist: initialItems aktualisiert', initialItems);
  }, [initialItems])

  const handleAdd = async () => {
    if (!newSymbol) return
    
    try {
      setIsAdding(true)
      
      // Direkter Zugriff auf den Store, um das Symbol hinzuzufügen
      console.log('Füge Symbol direkt zum Store hinzu:', newSymbol.toUpperCase());
      const store = useWatchlistStore.getState();
      store.addItem({ symbol: newSymbol.toUpperCase() });
      
      // Trotzdem die onAddSymbol-Funktion aufrufen, um die API zu aktualisieren
      await onAddSymbol(newSymbol.toUpperCase());
      
      setNewSymbol('')
      toast.success(`${newSymbol.toUpperCase()} zur Watchlist hinzugefügt`)
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Symbols:', error)
      toast.error(`Symbol ${newSymbol.toUpperCase()} konnte nicht hinzugefügt werden`)
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (symbol: string) => {
    try {
      await onRemoveSymbol(symbol)
      setItems(items.filter(item => item.symbol !== symbol))
      toast.success('Symbol von der Watchlist entfernt')
    } catch (error) {
      toast.error('Symbol konnte nicht entfernt werden')
    }
  }

  // Synchronisiere Items wenn sich initialItems ändert
  useEffect(() => {
    if (Array.isArray(initialItems)) {
      console.log('Setze items auf:', initialItems.length, 'Elemente', initialItems);
      // Stelle sicher, dass wir eine neue Referenz erstellen, damit React die Änderung erkennt
      setItems([...initialItems]);
    } else {
      console.warn('initialItems ist kein Array:', initialItems);
      setItems([]);
    }
    
    // Debug: Zeige den aktuellen Zustand des Stores
    const storeItems = useWatchlistStore.getState().items;
    console.log('Store items:', storeItems.length, 'Elemente', storeItems);
  }, [initialItems])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Symbol hinzufügen..."
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="uppercase"
        />
        <Button 
          onClick={handleAdd} 
          size="icon" 
          variant="outline"
          disabled={isAdding || !newSymbol}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">
            Keine Symbole in der Watchlist
          </div>
        ) : (
          items.map((stock) => (
            <div key={stock.symbol} className="flex justify-between items-center pb-2 border-b group">
              <div className="font-medium">{stock.symbol}</div>
              <div className="flex items-center gap-4">
                {stock.price !== undefined ? (
                  <div className={stock.changesPercentage && stock.changesPercentage > 0 ? 'text-green-600' : 'text-red-600'}>
                    ${stock.price.toFixed(2)} ({stock.changesPercentage && stock.changesPercentage > 0 ? '+' : ''}{(stock.changesPercentage || 0).toFixed(2)}%)
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Lade Daten...</div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(stock.symbol)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
