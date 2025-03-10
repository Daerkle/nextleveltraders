"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSubscription, getPlanStatusText, getPlanStatusColor } from "@/hooks/use-subscription";
import { PLANS } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function BillingTab() {
  const { plan, status, isTrialing, trialEndsAt, isPro } = useSubscription();
  
  const statusText = getPlanStatusText(status, isTrialing, trialEndsAt);
  const statusColor = getPlanStatusColor(status);

  return (
    <div className="space-y-8">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Ihr Plan</CardTitle>
          <CardDescription className="flex items-center gap-2">
            Sie nutzen derzeit den {plan === 'pro' ? "Pro" : "Basis"}-Plan
            <Badge variant={statusColor}>{statusText}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">NextLevelTraders {plan === 'pro' ? 'Pro' : 'Basis'}</p>
                <p className="text-sm text-muted-foreground">
                  {isTrialing && trialEndsAt ? 
                    `Trial endet am ${new Date(trialEndsAt).toLocaleDateString('de-DE')}` : 
                    'Dein aktuelles Abonnement'
                  }
                </p>
              </div>
              <div className="text-right">
                {plan === 'pro' && (
                  <p className="font-medium">€49,00/Monat</p>
                )}
              </div>
            </div>

            {status === 'canceled' && (
              <Alert>
                <AlertTitle>Ihr Abonnement läuft aus</AlertTitle>
                <AlertDescription>
                  Sie können Ihr Abonnement jederzeit reaktivieren.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <Link href="/dashboard/billing">
                {isPro ? 'Abonnement verwalten' : 'Auf Pro upgraden'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Rechnungen</CardTitle>
            <CardDescription>
              Sehen Sie Ihre Rechnungshistorie ein
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/billing">
                Rechnungen & Zahlungen verwalten
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
