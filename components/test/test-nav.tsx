"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TestPage } from "@/types/test";
import { Activity, Code, Zap, Settings } from "lucide-react";

export const testPages: TestPage[] = [
  {
    title: "Rate Limiting",
    description: "API Rate Limiting System Test und Demo",
    href: "/test/rate-limit",
    icon: Activity,
    tags: ["API", "Performance", "Security"],
  },
  {
    title: "Code Blocks",
    description: "Code Block Komponenten und Syntax Highlighting",
    href: "/test/code-blocks",
    icon: Code,
    tags: ["UI", "Komponenten"],
  },
  {
    title: "API Playground",
    description: "Interaktiver API Playground und Test-Tools",
    href: "/test/playground",
    icon: Zap,
    tags: ["API", "Development"],
    comingSoon: true,
  },
  {
    title: "Settings Demo",
    description: "Einstellungen und Konfigurationskomponenten",
    href: "/test/settings",
    icon: Settings,
    tags: ["UI", "Konfiguration"],
    comingSoon: true,
  },
];

interface TestNavProps {
  showTags?: boolean;
  showIcons?: boolean;
  variant?: "horizontal" | "vertical" | "grid";
  className?: string;
}

export function TestNav({
  showTags = true,
  showIcons = true,
  variant = "vertical",
  className,
}: TestNavProps) {
  const pathname = usePathname();

  const containerClasses = {
    horizontal: "flex space-x-4 overflow-x-auto pb-2",
    vertical: "space-y-4",
    grid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  };

  const itemClasses = {
    horizontal: "flex-shrink-0 w-64",
    vertical: "",
    grid: "",
  };

  return (
    <nav className={cn(containerClasses[variant], className)}>
      {testPages.map((page) => {
        const Icon = page.icon;
        const isActive = pathname === page.href;
        const isDisabled = page.comingSoon;

        return (
          <Link
            key={page.href}
            href={isDisabled ? "#" : page.href}
            className={cn(itemClasses[variant], "block")}
          >
            <Card
              className={cn(
                "p-4 transition-colors hover:bg-muted/50",
                isActive && "border-primary bg-muted/50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {showIcons && Icon && (
                    <div className="p-1.5 bg-primary/10 rounded">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-sm">
                      {page.title}
                      {isDisabled && (
                        <span className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {page.description}
                    </p>
                  </div>
                </div>

                {showTags && page.tags && page.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {page.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-muted px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </Link>
        );
      })}
    </nav>
  );
}