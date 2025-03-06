import { Metadata } from "next";
import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/breadcrumb";
import { MobileNav } from "@/components/docs/mobile-nav";
import { DocSearch } from "@/components/docs/search";

export const metadata: Metadata = {
  title: "Dokumentation - NextLevelTraders",
  description: "Technische Dokumentation und Anleitungen für NextLevelTraders",
};

const sidebarLinks = [
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

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 w-64 hidden lg:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="space-y-6 p-6">
          <div className="flex items-center space-x-2">
            <Link href="/docs" className="font-heading text-xl hover:text-primary transition-colors">
              Dokumentation
            </Link>
          </div>
          <div className="relative">
            <DocSearch />
          </div>
          <div className="space-y-6">
            {sidebarLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-medium text-muted-foreground mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-2 py-1 text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center gap-4">
            <MobileNav />
            <DocsBreadcrumb />
            <div className="hidden md:flex items-center ml-auto space-x-4">
              <div className="w-64">
                <DocSearch />
              </div>
              <Link
                href="/test/rate-limit"
                className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                API Playground
              </Link>
            </div>
          </div>
        </div>
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}