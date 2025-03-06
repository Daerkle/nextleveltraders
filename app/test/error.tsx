"use client";

import { ErrorHandler } from "@/components/error-handler";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestError({
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

        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold">
              Möchten Sie zu anderen Test-Bereichen navigieren?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/test/rate-limit">
                  Rate Limiting Test
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/test/code-blocks">
                  Code Block Demo
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">
                  Zurück zur Dokumentation
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Dies ist eine Testseite. Wenn der Fehler weiterhin besteht,
            kontaktieren Sie bitte unseren{" "}
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