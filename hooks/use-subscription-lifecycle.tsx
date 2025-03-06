import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from "@/config/subscriptions";

interface SubscriptionInfo {
  id?: string;
  status?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  isCanceled?: boolean;
}

interface SubscriptionLifecycleState {
  isLoading: boolean;
  error: Error | null;
  plan: SubscriptionPlan;
  subscription: SubscriptionInfo | null;
}

export function useSubscriptionLifecycle() {
  const { user } = useUser();
  const router = useRouter();
  const [state, setState] = useState<SubscriptionLifecycleState>({
    isLoading: true,
    error: null,
    plan: SUBSCRIPTION_PLANS.FREE,
    subscription: null,
  });

  // Fetch subscription status
  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch("/api/stripe/customer");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch subscription details");
      }

      setState({
        isLoading: false,
        error: null,
        plan: data.isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE,
        subscription: data.subscription || null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("An unknown error occurred"),
      }));
    }
  }, []);

  // Initiate checkout process
  const initiateCheckout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: SUBSCRIPTION_PLANS.PRO,
          returnUrl: window.location.origin + "/dashboard/billing",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Checkout failed"),
      }));
      toast.error("Fehler beim Erstellen der Checkout-Session");
    }
  }, []);

  // Open customer portal
  const openCustomerPortal = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: window.location.origin + "/dashboard/billing",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to open customer portal");
      }

      window.location.href = data.url;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Failed to open portal"),
      }));
      toast.error("Fehler beim Öffnen des Kundenportals");
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/stripe/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast.success("Abonnement erfolgreich gekündigt");
      await fetchSubscriptionStatus();
      router.refresh();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Failed to cancel"),
      }));
      toast.error("Fehler beim Kündigen des Abonnements");
    }
  }, [fetchSubscriptionStatus, router]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/stripe/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reactivate" }),
      });

      if (!response.ok) {
        throw new Error("Failed to reactivate subscription");
      }

      toast.success("Abonnement erfolgreich reaktiviert");
      await fetchSubscriptionStatus();
      router.refresh();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Failed to reactivate"),
      }));
      toast.error("Fehler beim Reaktivieren des Abonnements");
    }
  }, [fetchSubscriptionStatus, router]);

  // Fetch subscription status on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    } else {
      setState({
        isLoading: false,
        error: null,
        plan: SUBSCRIPTION_PLANS.FREE,
        subscription: null,
      });
    }
  }, [user, fetchSubscriptionStatus]);

  return {
    ...state,
    isPro: state.plan === SUBSCRIPTION_PLANS.PRO,
    isSubscriptionActive: state.subscription?.status === "active",
    actions: {
      initiateCheckout,
      openCustomerPortal,
      cancelSubscription,
      reactivateSubscription,
      refreshStatus: fetchSubscriptionStatus,
    },
  };
}