"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { TestContainerOptions } from "@/types/test";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface TestContainerProps extends Partial<TestContainerOptions> {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export function TestContainer({
  children,
  sidebar,
  className,
  footer,
  title,
  description,
  showEnvironmentInfo = true,
  debug = false,
}: TestContainerProps) {
  const pathname = usePathname();
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      name: segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      href: `/${segment}`,
    }));

  // Update document title and description
  useEffect(() => {
    if (title) {
      document.title = `${title} - NextLevelTraders Test`;
    }
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }
    }
  }, [title, description]);

  // Log debug information
  useEffect(() => {
    if (debug) {
      console.group("Test Container Debug Info");
      console.log("Path:", pathname);
      console.log("Segments:", pathSegments);
      console.log("Environment:", process.env.NODE_ENV);
      console.groupEnd();
    }
  }, [debug, pathname, pathSegments]);

  return (
    <div className="container py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <HomeIcon className="h-4 w-4" />
        </Link>
        <span>/</span>
        {pathSegments.map((segment, index) => (
          <div key={segment.href} className="flex items-center">
            <Link
              href={segment.href}
              className={cn(
                "hover:text-foreground transition-colors",
                index === pathSegments.length - 1 && "text-foreground font-medium"
              )}
            >
              {segment.name}
            </Link>
            {index < pathSegments.length - 1 && <span className="mx-1">/</span>}
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <main className={cn("flex-1 space-y-6", className)}>
          <Card className="p-6">
            {children}
          </Card>
          {footer && (
            <div className="mt-6">
              {footer}
            </div>
          )}
        </main>

        {/* Optional Sidebar */}
        {sidebar && (
          <aside className="lg:w-80 space-y-6 mt-6 lg:mt-0">
            {sidebar}
          </aside>
        )}
      </div>

      {/* Debug Information */}
      {debug && (
        <Card className="p-4 mt-6 bg-muted/50">
          <details>
            <summary className="cursor-pointer text-sm font-medium">
              Debug Information
            </summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(
                {
                  path: pathname,
                  segments: pathSegments,
                  env: process.env.NODE_ENV,
                  options: {
                    title,
                    description,
                    showEnvironmentInfo,
                  },
                },
                null,
                2
              )}
            </pre>
          </details>
        </Card>
      )}
    </div>
  );
}

export * from "./environment-info";