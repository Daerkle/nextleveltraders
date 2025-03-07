import { createContext, useContext, ReactNode, useEffect } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { useSubscriptionFeatures } from "@/hooks/use-subscription-features";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { useUser } from "@clerk/nextjs";
import { LIMITATIONS } from "@/config/subscriptions";

type SubscriptionContextType = ReturnType<typeof useSubscription> & {
  features: ReturnType<typeof useSubscriptionFeatures>["features"];
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptionContext muss innerhalb eines SubscriptionProviders verwendet werden"
    );
  }
  return context;
}

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const subscription = useSubscription();
  
  // Bestimme, ob der Benutzer Pro-Features hat
  const isPro = subscription.plan === SUBSCRIPTION_PLANS.PRO || 
                subscription.isTrialing;
  
  // Lade die Features basierend auf dem Pro-Status
  const { features } = useSubscriptionFeatures(isPro, !isUserLoaded);

  // Setze die API-Verzögerung basierend auf dem Plan
  useEffect(() => {
    const delay = isPro ? LIMITATIONS[SUBSCRIPTION_PLANS.PRO].dataDelay : LIMITATIONS[SUBSCRIPTION_PLANS.FREE].dataDelay;
    // Setze die Verzögerung für die FMP API
    window.localStorage.setItem('fmp_data_delay', String(delay));
  }, [isPro]);

  // Synchronisiere den Subscription-Status wenn der User geladen ist
  useEffect(() => {
    if (!isUserLoaded) return;

    const loadSubscriptionData = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        
        subscription.setPlan(data.plan || SUBSCRIPTION_PLANS.FREE);
        subscription.setTrialStatus(data.isTrialing || false, data.trialEndsAt);
        subscription.setStatus(data.status || 'inactive');
      } catch (error) {
        console.error('Fehler beim Laden des Subscription-Status:', error);
      }
    };

    if (user) {
      loadSubscriptionData();
    } else {
      // Reset auf Free Plan wenn kein User
      subscription.setPlan(SUBSCRIPTION_PLANS.FREE);
      subscription.setTrialStatus(false, null);
      subscription.setStatus('inactive');
    }
  }, [isUserLoaded, user]);

  const value = {
    ...subscription,
    features,
    isPro,
    isLoading: !isUserLoaded,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Helper-Hook für Zugriffsprüfung
export function useHasAccess(feature: keyof ReturnType<typeof useSubscriptionFeatures>["features"]) {
  const { features, isLoading } = useSubscriptionContext();
  return {
    hasAccess: features[feature],
    isLoading,
  };
}