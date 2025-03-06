import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rate Limit Test - NextLevelTraders",
  description: "Test und Demo der Rate Limiting-Funktionalität",
  robots: {
    index: false,
    follow: false,
  },
};

interface RateLimitTestLayoutProps {
  children: React.ReactNode;
}

export default function RateLimitTestLayout({
  children,
}: RateLimitTestLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Header */}
        <div className="border-b">
          <div className="container flex h-16 items-center">
            <div className="mr-4 hidden md:flex">
              <div className="font-heading text-xl">Rate Limit Test</div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-12 items-center">
            <div className="text-sm text-muted-foreground">
              Dashboard / Tests / Rate Limit
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t">
          <div className="container flex h-16 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Test-Seite für Entwicklungszwecke
            </div>
            <div className="text-sm text-muted-foreground">
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                UI von shadcn/ui
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}