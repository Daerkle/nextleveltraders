"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionActionsProps {
  isPro: boolean;
  isLoading?: boolean;
  subscription?: {
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date;
  };
}

export function SubscriptionActions({
  isPro,
  isLoading,
  subscription,
}: SubscriptionActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    try {
      setLoading(true);
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
        throw new Error(data.error || "Ein Fehler ist aufgetreten");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: "PRO",
          returnUrl: window.location.origin + "/dashboard/billing",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ein Fehler ist aufgetreten");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "cancel",
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Kündigen des Abonnements");
      }

      toast.success("Abonnement erfolgreich gekündigt");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reactivate",
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Reaktivieren des Abonnements");
      }

      toast.success("Abonnement erfolgreich reaktiviert");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isPro) {
    return (
      <Button
        onClick={handleUpgrade}
        disabled={loading || isLoading}
        className="w-full"
      >
        Auf Pro upgraden
      </Button>
    );
  }

  if (subscription?.cancelAtPeriodEnd) {
    return (
      <Button
        onClick={handleReactivate}
        disabled={loading || isLoading}
        className="w-full"
      >
        Abonnement reaktivieren
      </Button>
    );
  }

  return (
    <div className="flex items-start space-x-4">
      <Button
        variant="outline"
        className="flex-1"
        onClick={handlePortal}
        disabled={loading || isLoading}
      >
        Abonnement verwalten
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={handleCancel}
        disabled={loading || isLoading}
      >
        Plan kündigen
      </Button>
    </div>
  );
}