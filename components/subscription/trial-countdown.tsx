"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useSubscriptionContext } from "./subscription-provider";

export function TrialCountdown() {
  const { isTrialing, trialEndsAt } = useSubscriptionContext();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    if (!isTrialing || !trialEndsAt) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(trialEndsAt).getTime();
      const difference = endTime - now;

      if (difference <= 0) return null;

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (!remaining) {
        clearInterval(timer);
      }
    }, 1000 * 60); // Update jede Minute

    return () => clearInterval(timer);
  }, [isTrialing, trialEndsAt]);

  if (!isTrialing || !timeLeft) return null;

  const isLastDay = timeLeft.days === 0 && timeLeft.hours < 12;

  return (
    <Card className={`p-4 ${isLastDay ? "bg-yellow-50 border-yellow-200" : ""}`}>
      <div className="flex items-start space-x-4">
        {isLastDay && <AlertCircle className="h-5 w-5 text-yellow-500" />}
        <div className="flex-1">
          <h3 className="font-semibold">
            {isLastDay ? "Ihre Testphase läuft bald ab!" : "Testphase aktiv"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {timeLeft.days > 0
              ? `Noch ${timeLeft.days} Tage und ${timeLeft.hours} Stunden`
              : `Noch ${timeLeft.hours} Stunden und ${timeLeft.minutes} Minuten`}
          </p>
          {isLastDay && (
            <p className="mt-2 text-sm text-yellow-700">
              Fügen Sie jetzt Ihre Zahlungsinformationen hinzu, um unterbrechungsfreien
              Zugang zu behalten
            </p>
          )}
        </div>
        {isLastDay && (
          <Button
            onClick={() => window.location.href = "/dashboard/billing"}
            className="shrink-0"
          >
            Jetzt upgraden
          </Button>
        )}
      </div>
    </Card>
  );
}