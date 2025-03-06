"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { RateLimitStatus } from "./subscription/rate-limit-status";
import { SubscriptionError } from "@/lib/errors/subscription-error";

interface ErrorHandlerProps {
  error: Error;
  reset: () => void;
}

export function ErrorHandler({ error, reset }: ErrorHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  // Behandle verschiedene Fehlertypen
  if (error instanceof SubscriptionError) {
    switch (error.code) {
      case "PAYMENT_REQUIRED":
        return (
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  Pro-Abonnement erforderlich
                </h3>
                <p className="text-sm text-muted-foreground max-w-[500px]">
                  Diese Funktion ist nur für Pro-Mitglieder verfügbar.
                </p>
              </div>
              <Button onClick={() => router.push("/pricing")}>
                Upgrade durchführen
              </Button>
            </div>
          </Card>
        );

      case "RATE_LIMIT_EXCEEDED":
        const resetTime = error.data?.resetTime
          ? new Date(error.data.resetTime as string)
          : undefined;

        return (
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-warning/10 rounded-full">
                <RefreshCw className="w-6 h-6 text-warning" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  Anfragelimit erreicht
                </h3>
                <p className="text-sm text-muted-foreground max-w-[500px]">
                  {resetTime
                    ? `Neue Anfragen möglich ab ${resetTime.toLocaleTimeString()}`
                    : "Bitte warten Sie einen Moment, bevor Sie es erneut versuchen."}
                </p>
              </div>
              <RateLimitStatus />
            </div>
          </Card>
        );

      default:
        toast.error(error.message);
    }
  }

  // Standard-Fehlerzustand
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-destructive/10 rounded-full">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Ein Fehler ist aufgetreten
          </h3>
          <p className="text-sm text-muted-foreground max-w-[500px]">
            {error.message || "Bitte versuchen Sie es später erneut."}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => reset()}
            variant="outline"
          >
            Erneut versuchen
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Seite neu laden
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Client Error Boundary Component
export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-10">
      <ErrorHandler error={error} reset={reset} />
    </div>
  );
}