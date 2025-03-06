"use client";

import { ErrorHandler } from "@/components/error-handler";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <ErrorHandler error={error} reset={reset} />
        
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Möchten Sie zur Dokumentationsübersicht zurückkehren?
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              asChild
            >
              <Link href="/docs">
                Zur Dokumentation
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <Link href="/">
                Zur Startseite
              </Link>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Falls das Problem weiterhin besteht, kontaktieren Sie bitte unseren{" "}
            <Link
              href="/docs/support"
              className="text-primary hover:underline"
            >
              Support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}