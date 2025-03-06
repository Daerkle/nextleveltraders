"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { AlertCircle, RefreshCw } from "lucide-react";

interface RateLimitStatusProps {
  showProgress?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function RateLimitStatus({
  showProgress = true,
  showBadge = true,
  className = "",
}: RateLimitStatusProps) {
  const {
    currentLimit,
    remainingRequests,
    resetTime,
    isBlocked,
    isPro,
  } = useRateLimit();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!resetTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const reset = new Date(resetTime).getTime();
      const diff = Math.max(0, Math.ceil((reset - now) / 1000));
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [resetTime]);

  const usagePercentage = Math.max(
    0,
    Math.min(
      100,
      ((currentLimit - remainingRequests) / currentLimit) * 100
    )
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {showBadge && (
        <div className="flex items-center space-x-2">
          {isBlocked ? (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Limitiert
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <RefreshCw className="h-3 w-3" />
              {isPro ? 'Pro' : 'Basic'} Rate Limit
            </Badge>
          )}
        </div>
      )}

      {showProgress && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {remainingRequests} von {currentLimit} verbleibend
            </span>
            {timeLeft !== null && (
              <span>Reset in {timeLeft}s</span>
            )}
          </div>
          <Progress
            value={usagePercentage}
            className="h-1"
            indicatorClassName={
              isBlocked
                ? "bg-destructive"
                : remainingRequests < currentLimit * 0.2
                ? "bg-warning"
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
