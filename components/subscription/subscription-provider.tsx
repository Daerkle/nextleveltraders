import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { useSubscriptionFeatures } from "@/hooks/use-subscription-features";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { useUser } from "@clerk/nextjs";
import { LIMITATIONS } from "@/config/subscriptions";
import type Stripe from "stripe";

type SubscriptionContextType = ReturnType<typeof useSubscription> & {
  features: ReturnType<typeof useSubscriptionFeatures>["features"];
  isPro: boolean;
  isLoading: boolean;
  isTrialing: boolean;
  trialEndsAt: string | null;
  subscription?: Stripe.Subscription;
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Bestimme, ob der Benutzer Pro-Features hat
  const isPro = subscription.plan === SUBSCRIPTION_PLANS.PRO || 
                subscription.isTrialing;
  
  // Lade die Features basierend auf dem Pro-Status
  const { features } = useSubscriptionFeatures(isPro, !isUserLoaded);

  // Setze die API-Verzögerung basierend auf dem Plan
  useEffect(() => {
    if (!isUserLoaded) return;
    
    const delay = isPro ? LIMITATIONS[SUBSCRIPTION_PLANS.PRO].dataDelay : LIMITATIONS[SUBSCRIPTION_PLANS.FREE].dataDelay;
    window.localStorage.setItem('fmp_data_delay', String(delay));
  }, [isPro, isUserLoaded]);

  // Lade initial den Subscription-Status
  useEffect(() => {
    if (!isUserLoaded || !user || !isInitialLoad) return;

    const loadSubscriptionData = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        
        if (response.ok) {
          subscription.setPlan(data.plan || SUBSCRIPTION_PLANS.FREE);
          subscription.setTrialStatus(data.isTrialing || false, data.trialEndsAt);
          subscription.setStatus(data.status || 'inactive');
          subscription.setSubscription(data.subscription);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Subscription-Status:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadSubscriptionData();
  }, [isUserLoaded, user, isInitialLoad]);

  // Reset wenn kein User
  useEffect(() => {
    if (!isUserLoaded || user) return;
    
    subscription.setPlan(SUBSCRIPTION_PLANS.FREE);
    subscription.setTrialStatus(false, null);
    subscription.setStatus('inactive');
    subscription.setSubscription(undefined);
  }, [isUserLoaded, user]);

  const value = {
    ...subscription,
    features,
    isPro,
    isLoading: !isUserLoaded || isInitialLoad,
    isTrialing: subscription.isTrialing,
    trialEndsAt: subscription.trialEndsAt,
    subscription: subscription.subscription
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