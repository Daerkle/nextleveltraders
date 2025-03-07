import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSubscription } from './use-subscription';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

export function useRateLimit() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const isLoading = subscriptionLoading || !rateLimitInfo;

  const parseRateLimitHeaders = useCallback((headers: Headers): RateLimitInfo => {
    return {
      limit: parseInt(headers.get('x-ratelimit-limit') || '0', 10),
      remaining: parseInt(headers.get('x-ratelimit-remaining') || '0', 10),
      reset: new Date(headers.get('x-ratelimit-reset') || Date.now()),
      retryAfter: headers.get('retry-after')
        ? parseInt(headers.get('retry-after') || '0', 10)
        : undefined,
    };
  }, []);

  const handleRateLimit = useCallback((headers: Headers) => {
    const info = parseRateLimitHeaders(headers);
    setRateLimitInfo(info);

    if (info.remaining <= 5) {
      toast.warning(
        `Nur noch ${info.remaining} Anfragen übrig. Reset in ${Math.ceil(
          (info.reset.getTime() - Date.now()) / 1000
        )} Sekunden.`
      );
    }

    if (info.remaining === 0) {
      setIsBlocked(true);
      const resetTime = new Date(info.reset).toLocaleTimeString();
      toast.error(
        `Rate Limit erreicht. Neue Anfragen möglich ab ${resetTime}.`,
        {
          duration: info.retryAfter ? info.retryAfter * 1000 : 5000,
        }
      );

      // Automatisch zurücksetzen, wenn die Sperrzeit abgelaufen ist
      setTimeout(() => {
        setIsBlocked(false);
      }, info.retryAfter ? info.retryAfter * 1000 : 0);
    }
  }, [parseRateLimitHeaders]);

  const withRateLimit = useCallback(
    async <T,>(
      fetcher: () => Promise<Response>,
      errorMessage = 'Ein Fehler ist aufgetreten'
    ): Promise<T> => {
      if (isBlocked) {
        const remainingTime = rateLimitInfo?.reset
          ? Math.ceil((rateLimitInfo.reset.getTime() - Date.now()) / 1000)
          : 60;
        throw new Error(
          `Rate Limit erreicht. Bitte warten Sie ${remainingTime} Sekunden.`
        );
      }

      try {
        const response = await fetcher();
        handleRateLimit(response.headers);

        if (!response.ok) {
          if (response.status === 429) {
            const data = await response.json();
            throw new Error(data.error || 'Rate Limit überschritten');
          }
          throw new Error(errorMessage);
        }

        return await response.json();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(errorMessage);
        }
        throw error;
      }
    },
    [handleRateLimit, isBlocked, rateLimitInfo]
  );

  return {
    withRateLimit,
    rateLimitInfo,
    isBlocked,
    isPro,
    isLoading,
    currentLimit: isLoading ? 0 : rateLimitInfo?.limit || (isPro ? 1000 : 100),
    remainingRequests: isLoading ? 0 : rateLimitInfo?.remaining || 0,
    resetTime: rateLimitInfo?.reset,
    retryAfter: rateLimitInfo?.retryAfter,
  };
}