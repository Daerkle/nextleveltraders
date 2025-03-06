"use client";

import { ErrorHandler } from "@/components/error-handler";
import Link from "next/link";

export default function RateLimitTestError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <ErrorHandler error={error} reset={reset} />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Sie können auch versuchen, die{" "}
            <Link
              href="/dashboard"
              className="text-primary hover:underline"
            >
              Dashboard-Seite
            </Link>{" "}
            zu besuchen oder zur{" "}
            <Link
              href="/"
              className="text-primary hover:underline"
            >
              Startseite
            </Link>{" "}
            zurückzukehren.
          </p>
        </div>
      </div>
    </div>
  );
}