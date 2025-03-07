import { useState, useEffect } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { WatchlistItem } from '@/types/watchlist'
import { useAuth } from '@clerk/nextjs'

interface EditableWatchlistProps {
  initialItems: WatchlistItem[]
  onAddSymbol: (symbol: string) => Promise<void>
  onRemoveSymbol: (symbol: string) => Promise<void>
}

export function EditableWatchlist({ initialItems, onAddSymbol, onRemoveSymbol }: EditableWatchlistProps) {
  const [items, setItems] = useState(initialItems)
  const [newSymbol, setNewSymbol] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const { getToken } = useAuth()

  const handleAdd = async () => {
    if (!newSymbol) return
    
    try {
      setIsAdding(true)
      let token;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (error) {
        console.warn('Auth Token nicht verfügbar:', error);
      }
      await onAddSymbol(newSymbol.toUpperCase(), token)
      setNewSymbol('')
      toast.success('Symbol zur Watchlist hinzugefügt')
    } catch (error) {
      toast.error('Symbol konnte nicht hinzugefügt werden')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (symbol: string) => {
    try {
      let token;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (error) {
        console.warn('Auth Token nicht verfügbar:', error);
      }
      await onRemoveSymbol(symbol, token)
      setItems(items.filter(item => item.symbol !== symbol))
      toast.success('Symbol von der Watchlist entfernt')
    } catch (error) {
      toast.error('Symbol konnte nicht entfernt werden')
    }
  }

  // Synchronisiere Items wenn sich initialItems ändert
  useEffect(() => {
    setItems(initialItems)
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
        {items.map((stock) => (
          <div key={stock.symbol} className="flex justify-between items-center pb-2 border-b group">
            <div className="font-medium">{stock.symbol}</div>
            <div className="flex items-center gap-4">
              {stock.price && stock.change && (
                <div className={stock.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  ${stock.price.toFixed(2)} ({stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%)
                </div>
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
        ))}
      </div>
    </div>
  )
}
