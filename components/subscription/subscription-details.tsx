"use client";

import { useSubscriptionContext } from "./subscription-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export function SubscriptionDetails() {
  const { 
    isPro, 
    isTrialing, 
    trialEndsAt,
    subscription
  } = useSubscriptionContext();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const getStatusIndicator = () => {
    if (isTrialing) {
      return {
        icon: Clock,
        text: "Testphase",
        color: "text-blue-500"
      };
    }
    
    if (subscription?.cancel_at_period_end) {
      return {
        icon: AlertCircle,
        text: "Wird gekündigt",
        color: "text-yellow-500"
      };
    }
    
    if (isPro) {
      return {
        icon: CheckCircle,
        text: "Aktiv",
        color: "text-green-500"
      };
    }

    return {
      icon: CreditCard,
      text: "Basis",
      color: "text-gray-500"
    };
  };

  const handlePortal = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Fehler beim Öffnen des Portals");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    }
  };

  const status = getStatusIndicator();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center space-x-2">
        <StatusIcon className={`h-5 w-5 ${status.color}`} />
        <div>
          <h3 className="font-medium">
            {isPro ? "NextLevelTraders Pro" : "NextLevelTraders Basis"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {status.text}
          </p>
        </div>
      </div>

      {/* Subscription Details */}
      {isPro && subscription && (
        <>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preis</span>
              <span className="font-medium">
                {formatAmount(subscription.items?.data[0]?.price.unit_amount || 4900)}/
                {subscription.items?.data[0]?.price.recurring?.interval || "Monat"}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nächste Abrechnung</span>
              <span className="font-medium">
                {formatDate(new Date(subscription.current_period_end * 1000))}
              </span>
            </div>
          </div>

          {subscription.cancel_at_period_end && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    Ihr Abonnement wird beendet
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    Der Zugang bleibt bis zum {formatDate(new Date(subscription.current_period_end * 1000))} aktiv.
                    Sie können das Abo jederzeit reaktivieren.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Trial Info */}
      {isTrialing && trialEndsAt && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800">
                Testphase aktiv
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                Ihre Testphase läuft bis zum {formatDate(new Date(trialEndsAt))}. 
                Fügen Sie Ihre Zahlungsdaten hinzu, um unterbrechungsfreien Zugang zu behalten.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handlePortal}
        >
          Zahlungen & Rechnungen verwalten
        </Button>
      </div>
    </div>
  );
}