import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SUBSCRIPTION_PLANS, type SubscriptionPlan, FEATURE_FLAGS, type FeatureFlag } from "@/config/subscriptions";

interface SubscriptionInfo {
  id?: string;
  status?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  subscription: SubscriptionInfo | null;
  isLoading: boolean;
  error: Error | null;
  checkFeatureAccess: (feature: FeatureFlag) => boolean;
  openBillingPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS.FREE);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    async function fetchSubscriptionDetails() {
      if (!isUserLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/stripe/customer');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch subscription details');
        }

        setPlan(data.isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE);
        setSubscription(data.subscription || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriptionDetails();
  }, [user, isUserLoaded]);

  const checkFeatureAccess = (feature: FeatureFlag) => {
    return FEATURE_FLAGS[feature](plan);
  };

  const openBillingPortal = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.origin + '/dashboard/billing',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to open billing portal'));
      throw err;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        subscription,
        isLoading,
        error,
        checkFeatureAccess,
        openBillingPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);

  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  return context;
}

export function useFeatureAccess(feature: FeatureFlag) {
  const { checkFeatureAccess, isLoading } = useSubscription();
  return {
    hasAccess: checkFeatureAccess(feature),
    isLoading,
  };
}

export function withSubscriptionAccess(feature: FeatureFlag) {
  return function withSubscriptionAccessHOC<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function SubscriptionAccessComponent(props: P) {
      const { hasAccess, isLoading } = useFeatureAccess(feature);

      if (isLoading) {
        return <div>Loading...</div>;
      }

      if (!hasAccess) {
        return (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Diese Funktion ist nur für Pro-Mitglieder verfügbar.
            </p>
          </div>
        );
      }

      return <WrappedComponent {...props} />;
    };
  };
}