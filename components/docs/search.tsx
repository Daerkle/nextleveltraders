"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocSearchItem {
  title: string;
  href: string;
  description?: string;
  category: string;
}

const searchData: DocSearchItem[] = [
  {
    title: "Rate Limiting",
    href: "/docs/rate-limiting",
    description: "API-Nutzungsbeschränkungen und Rate Limiting",
    category: "API",
  },
  {
    title: "Authentifizierung",
    href: "/docs/authentication",
    description: "API-Authentifizierung und Sicherheit",
    category: "API",
  },
  {
    title: "Watchlists",
    href: "/docs/api/watchlists",
    description: "Watchlist-Management API",
    category: "API",
  },
  {
    title: "Trading Setups",
    href: "/docs/api/setups",
    description: "Trading Setup API und Analysen",
    category: "Trading",
  },
  {
    title: "Marktdaten",
    href: "/docs/api/market-data",
    description: "Echtzeit- und historische Marktdaten",
    category: "Daten",
  },
  {
    title: "API Playground",
    href: "/test/rate-limit",
    description: "Interaktiver API-Tester",
    category: "Tools",
  },
];

export function DocSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Dokumentation durchsuchen...</span>
        <span className="inline-flex lg:hidden">Suchen...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Dokumentation durchsuchen..." />
        <CommandList>
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
          {Object.entries(
            searchData.reduce<Record<string, DocSearchItem[]>>((acc, item) => {
              if (!acc[item.category]) {
                acc[item.category] = [];
              }
              acc[item.category].push(item);
              return acc;
            }, {})
          ).map(([category, items]) => (
            <CommandGroup key={category} heading={category}>
              {items.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => runCommand(() => router.push(item.href))}
                >
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/docs"))}
            >
              Zur Dokumentationsübersicht
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/test/rate-limit"))}
            >
              API Playground öffnen
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}