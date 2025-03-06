'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/lib/hooks';

interface SearchResult {
  symbol: string;
  name: string;
  exchangeShortName: string;
}

export function SearchSymbol({ defaultSymbol = 'AAPL' }: { defaultSymbol?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultSymbol);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [displayValue, setDisplayValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Debounce die Suchanfragen
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const symbol = searchParams.get('symbol') || defaultSymbol;
    if (symbol) {
      setValue(symbol);
      fetchSymbolDetails(symbol);
    }
  }, [searchParams, defaultSymbol]);

  // Führe die Suche aus, wenn sich der debounced Wert ändert
  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const fetchSymbolDetails = useCallback(async (symbol: string) => {
    if (!symbol) return;
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(symbol)}`);
      if (!response.ok) throw new Error('Failed to fetch symbol details');
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setDisplayValue(`${data[0].symbol} - ${data[0].name}`);
      } else {
        setDisplayValue(symbol);
      }
    } catch (error) {
      console.error('Error fetching symbol details:', error);
      setDisplayValue(symbol);
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search symbols');
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching symbols:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = useCallback((item: SearchResult) => {
    if (!item || !item.symbol) return;
    
    setValue(item.symbol);
    setDisplayValue(`${item.symbol} - ${item.name}`);
    setOpen(false);
    setSearchQuery('');
    
    // URL aktualisieren und Seite neu laden
    const currentPath = window.location.pathname;
    const params = new URLSearchParams(searchParams.toString());
    params.set('symbol', item.symbol);
    router.push(`${currentPath}?${params.toString()}`);
  }, [router, searchParams]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    setDisplayValue(value);
    setSearchQuery(value);
    
    if (value) {
      setOpen(true);
    }
  }, []);

  const handleCommandInputChange = useCallback((value: string) => {
    if (value === undefined) return;
    setSearchQuery(value);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={displayValue}
          onChange={handleInputChange}
          onClick={() => setOpen(true)}
          placeholder="Symbol suchen..."
          className="w-full"
        />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Symbol oder Firmenname eingeben..." 
            value={searchQuery}
            onValueChange={handleCommandInputChange}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Suche läuft...</CommandEmpty>
            ) : searchResults.length === 0 ? (
              <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
            ) : (
              <CommandGroup>
                {searchResults.map((item) => (
                  <CommandItem
                    key={item.symbol}
                    value={`${item.symbol} ${item.name}`}
                    onSelect={() => handleSelect(item)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.symbol}</span>
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    {item.exchangeShortName && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {item.exchangeShortName}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}