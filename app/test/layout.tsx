"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TestEnvironmentInfo } from "@/components/test/environment-info";
import { cn } from "@/lib/utils";

const testPages = [
  {
    title: "Rate Limiting",
    description: "API Rate Limiting Test und Demo",
    href: "/test/rate-limit",
  },
  {
    title: "Code Blocks",
    description: "Code Block Komponenten und Syntax Highlighting",
    href: "/test/code-blocks",
  },
];

interface TestLayoutProps {
  children: React.ReactNode;
}

export default function TestLayout({ children }: TestLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link
              href="/docs"
              className="flex items-center space-x-2 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Zurück zur Dokumentation</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link
              href="https://github.com/yourusername/nextleveltraders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-20 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Test & Demo</h2>
                <div className="grid gap-4">
                  {testPages.map((page) => (
                    <Link key={page.href} href={page.href}>
                      <Card className={cn(
                        "p-4 hover:bg-muted/50 transition-colors",
                        pathname === page.href && "border-primary bg-muted/50"
                      )}>
                        <h3 className="font-medium">{page.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {page.description}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Environment Info in Sidebar */}
              <div className="hidden lg:block">
                <TestEnvironmentInfo />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:max-w-3xl mt-8 lg:mt-0">
            {children}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block xl:w-1/4">
            <div className="sticky top-20 space-y-6">
              <Card className="p-4">
                <h3 className="font-medium mb-2">Hinweis</h3>
                <p className="text-sm text-muted-foreground">
                  Diese Seiten dienen der Demonstration und dem Test von Komponenten
                  und Features. Sie sind nicht Teil der Produktionsumgebung.
                </p>
              </Card>

              <div className="text-sm text-muted-foreground">
                <p>
                  Haben Sie Fragen oder Feedback?{" "}
                  <Link href="/docs/support" className="text-primary hover:underline">
                    Kontaktieren Sie uns
                  </Link>
                  .
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Environment Info */}
      <div className="lg:hidden container pb-8">
        <TestEnvironmentInfo />
      </div>
    </div>
  );
}