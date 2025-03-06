"use client";

import { ErrorHandler } from "@/components/error-handler";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RateLimitingDocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <ErrorHandler error={error} reset={reset} />
      
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Alternative Ressourcen</h2>
          <p className="text-muted-foreground">
            Während wir das Problem beheben, können Sie diese alternativen Ressourcen nutzen:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/docs/api/market-data" className="text-primary hover:underline">
                Marktdaten API Dokumentation
              </Link>
            </li>
            <li>
              <Link href="/docs/examples" className="text-primary hover:underline">
                Code-Beispiele und Best Practices
              </Link>
            </li>
            <li>
              <Link href="/test/rate-limit" className="text-primary hover:underline">
                Rate Limit Test-Tool
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-6 pt-6 border-t flex flex-col items-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Sie können auch direkt zum Rate Limit Test navigieren:
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              asChild
            >
              <Link href="/test/rate-limit">
                Rate Limit Tester
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <Link href="/docs">
                Zur Dokumentation
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Benötigen Sie weitere Hilfe? Kontaktieren Sie unseren{" "}
          <Link href="/docs/support" className="text-primary hover:underline">
            Support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}