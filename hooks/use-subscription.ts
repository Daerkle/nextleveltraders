import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type SubscriptionStatus = {
  hasSubscription: boolean;
  isPro: boolean;
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  };
  isLoading: boolean;
  error?: string;
};

export function useSubscription() {
  const { user } = useUser();
  const [status, setStatus] = useState<SubscriptionStatus>({
    hasSubscription: false,
    isPro: false,
    isLoading: true,
  });

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setStatus(s => ({ ...s, isLoading: false }));
        return;
      }

      try {
        const response = await fetch("/api/stripe/customer");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Fehler beim Laden des Abonnement-Status");
        }

        setStatus({
          hasSubscription: data.hasSubscription,
          isPro: data.isPro,
          subscription: data.subscription ? {
            id: data.subscription.id,
            status: data.subscription.status,
            currentPeriodEnd: new Date(data.subscription.currentPeriodEnd),
            cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd,
          } : undefined,
          isLoading: false,
        });
      } catch (error) {
        setStatus(s => ({
          ...s,
          isLoading: false,
          error: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten",
        }));
      }
    }

    checkSubscription();
  }, [user]);

  const openPortal = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnUrl: window.location.origin + "/dashboard/billing",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Öffnen des Kundenportals");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Fehler beim Öffnen des Kundenportals:", error);
      throw error;
    }
  };

  const createCheckoutSession = async (plan: string) => {
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          returnUrl: window.location.origin + "/dashboard/billing",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Erstellen der Checkout-Session");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Fehler beim Erstellen der Checkout-Session:", error);
      throw error;
    }
  };

  return {
    ...status,
    openPortal,
    createCheckoutSession,
  };
}

// Hook für Feature-Flags basierend auf dem Abonnement-Status
export function useSubscriptionFeatures(isPro: boolean, isLoading: boolean) {
  return {
    isLoading,
    features: {
      canAccessRealTimeData: isPro,
      canAccessAdvancedPivots: isPro,
      canAccessMultiTimeframe: isPro,
      canAccessAiAssistant: isPro,
      canCreateUnlimitedWatchlists: isPro,
      canAccessApi: isPro,
    },
  };
}