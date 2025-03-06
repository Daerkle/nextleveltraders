"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationLinks = [
  {
    title: "Erste Schritte",
    links: [
      { href: "/docs/getting-started", label: "Einführung" },
      { href: "/docs/authentication", label: "Authentifizierung" },
      { href: "/docs/rate-limiting", label: "Rate Limiting" },
    ],
  },
  {
    title: "API Referenz",
    links: [
      { href: "/docs/api/watchlists", label: "Watchlists" },
      { href: "/docs/api/market-data", label: "Marktdaten" },
      { href: "/docs/api/setups", label: "Trading Setups" },
    ],
  },
  {
    title: "Ressourcen",
    links: [
      { href: "/docs/examples", label: "Beispiele" },
      { href: "/docs/faq", label: "FAQ" },
      { href: "/docs/support", label: "Support" },
    ],
  },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Navigation öffnen</span>
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/docs"
                className="font-heading text-xl"
                onClick={() => setIsOpen(false)}
              >
                Dokumentation
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Navigation schließen</span>
              </Button>
            </div>

            <nav className="space-y-6">
              {navigationLinks.map((section) => (
                <div key={section.title}>
                  <h3 className="font-medium text-muted-foreground mb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block px-2 py-1 text-sm transition-colors",
                          pathname === link.href
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/test/rate-limit">
                  API Playground
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}