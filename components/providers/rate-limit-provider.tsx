"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { RateLimitStatus } from "@/components/subscription/rate-limit-status";

interface RateLimitProviderProps {
  children: ReactNode;
  showStatus?: boolean;
}

const RateLimitContext = createContext<ReturnType<typeof useRateLimit> | undefined>(
  undefined
);

export function RateLimitProvider({ children, showStatus = false }: RateLimitProviderProps) {
  const rateLimitState = useRateLimit();

  return (
    <RateLimitContext.Provider value={rateLimitState}>
      <div className="relative">
        {children}
        {showStatus && (
          <div className="fixed bottom-4 right-4 z-50">
            <RateLimitStatus />
          </div>
        )}
      </div>
    </RateLimitContext.Provider>
  );
}

export function useRateLimitContext() {
  const context = useContext(RateLimitContext);
  if (context === undefined) {
    throw new Error("useRateLimitContext must be used within a RateLimitProvider");
  }
  return context;
}

// HOC to protect components with rate limiting
export function withRateLimit<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithRateLimit(props: P) {
    const { isBlocked, remainingRequests } = useRateLimitContext();

    if (isBlocked) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Zu viele Anfragen. Bitte warten Sie einen Moment.
          </p>
          <RateLimitStatus className="mt-2" />
        </div>
      );
    }

    if (remainingRequests === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Rate Limit erreicht. Bitte warten Sie, bis neue Anfragen möglich sind.
          </p>
          <RateLimitStatus className="mt-2" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Example usage:
/*
// In your app layout:
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <RateLimitProvider showStatus>
      {children}
    </RateLimitProvider>
  );
}

// In your components:
function MyComponent() {
  const { withRateLimit, remainingRequests } = useRateLimitContext();

  // Use the rate-limited fetch wrapper
  const fetchData = async () => {
    try {
      const data = await withRateLimit(
        () => fetch('/api/data'),
        'Failed to fetch data'
      );
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <span>Remaining requests: {remainingRequests}</span>
    </div>
  );
}

// Or use the HOC:
const MyRateLimitedComponent = withRateLimit(MyComponent);
*/