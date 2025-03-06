"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionaler Error-Logger
    console.error(error);
  }, [error]);

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Ein Fehler ist aufgetreten
          </h3>
          <p className="text-sm text-muted-foreground max-w-[500px]">
            {error.message || "Es gab ein Problem beim Laden der Abrechnungsinformationen."}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={reset}
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