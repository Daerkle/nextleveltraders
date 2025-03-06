import Link from "next/link";
import { BarChart3Icon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <BarChart3Icon className="h-6 w-6" />
              <span className="text-xl font-semibold">NextLevelTraders</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Preise
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/sign-in">
              <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Anmelden
              </button>
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Registrieren
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:justify-between md:px-6">
          <div className="flex items-center gap-2">
            <BarChart3Icon className="h-6 w-6" />
            <span className="text-lg font-semibold">NextLevelTraders</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Datenschutz
            </a>
            <a href="#" className="hover:text-foreground">
              Nutzungsbedingungen
            </a>
            <a href="#" className="hover:text-foreground">
              Kontakt
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NextLevelTraders. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}