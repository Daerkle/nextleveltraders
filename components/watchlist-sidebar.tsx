import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useWatchlistStore } from '@/stores/use-watchlist-store'
import { EditableWatchlist } from './editable-watchlist'
import { Button } from './ui/button'

export function WatchlistSidebar() {
  const { isOpen, setOpen, items, addSymbol, removeSymbol } = useWatchlistStore()

  return (
    <motion.div
      className={cn(
        "fixed right-0 top-0 h-screen bg-background border-l",
        "z-50 flex flex-col"
      )}
      initial={{ width: 0 }}
      animate={{
        width: isOpen ? 300 : 48,
        opacity: 1,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => !isOpen && setOpen(true)}
      onHoverEnd={() => isOpen && setOpen(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-4"
        onClick={() => setOpen(!isOpen)}
      >
        <ChevronLeft 
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      <motion.div
        className="p-4 flex-1 overflow-auto"
        animate={{
          opacity: isOpen ? 1 : 0,
          transition: { duration: 0.1 }
        }}
      >
        <h2 className="font-semibold mb-4">Watchlist</h2>
        {isOpen && (
          <EditableWatchlist
            initialItems={items}
            onAddSymbol={addSymbol}
            onRemoveSymbol={removeSymbol}
          />
        )}
      </motion.div>
    </motion.div>
  )
}