import { createContext, useContext, ReactNode } from "react";
import { useSubscription, useSubscriptionFeatures } from "@/hooks/use-subscription";

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
  const subscription = useSubscription();
  const { features } = useSubscriptionFeatures(subscription.isPro, subscription.isLoading);

  const value = {
    ...subscription,
    features,
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