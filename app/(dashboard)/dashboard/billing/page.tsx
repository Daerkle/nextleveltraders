import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { getSubscriptionPlan } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { SubscriptionActions } from "@/components/subscription/subscription-actions";

export default async function BillingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Nicht authentifiziert");
  }
  
  const plan = await getSubscriptionPlan(userId);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Abonnement & Rechnung</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihr Abonnement und sehen Sie Ihre Rechnungen ein
        </p>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Ihr Plan</CardTitle>
          <CardDescription>
            Sie nutzen derzeit den {plan.isPro ? "Pro" : "Basis"}-Plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plan.isPro ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">NextLevelTraders Pro</p>
                  <p className="text-sm text-muted-foreground">
                    Vollständiger Zugriff auf alle Trading-Features
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">€29,00/Monat</p>
                  {plan.subscription?.cancel_at_period_end && (
                    <p className="text-sm text-muted-foreground">
                      Läuft aus am {formatDate(new Date(plan.subscription.current_period_end * 1000))}
                    </p>
                  )}
                </div>
              </div>

              {plan.subscription?.cancel_at_period_end && (
                <Alert>
                  <AlertTitle>Ihr Abonnement läuft aus</AlertTitle>
                  <AlertDescription>
                    Ihr Pro-Plan läuft am {formatDate(new Date(plan.subscription.current_period_end * 1000))} aus.
                    Sie können Ihr Abonnement jederzeit reaktivieren.
                  </AlertDescription>
                </Alert>
              )}

              <SubscriptionActions 
                isPro={plan.isPro}
                subscription={plan.subscription}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-medium">NextLevelTraders Basis</p>
                <p className="text-sm text-muted-foreground">
                  Kostenloser Plan mit eingeschränkten Funktionen
                </p>
              </div>
              <SubscriptionActions isPro={false} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Verfügbare Features</CardTitle>
          <CardDescription>
            Vergleichen Sie die verfügbaren Features der verschiedenen Pläne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm font-medium">Feature</span>
              <span className="text-sm text-center">Basis</span>
              <span className="text-sm text-center">Pro</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm">Pivot-Punkt-Analyse</span>
              <span className="text-center">Basis</span>
              <span className="text-center text-primary">Erweitert</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm">Marktdaten</span>
              <span className="text-center">15 Min. verzögert</span>
              <span className="text-center text-primary">Echtzeit</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm">KI-Trading-Assistent</span>
              <span className="text-center">-</span>
              <span className="text-center text-primary">✓</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm">Multi-Timeframe-Analyse</span>
              <span className="text-center">-</span>
              <span className="text-center text-primary">✓</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-sm">Watchlists</span>
              <span className="text-center">1</span>
              <span className="text-center text-primary">Unbegrenzt</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help */}
      <Card>
        <CardHeader>
          <CardTitle>Benötigen Sie Hilfe?</CardTitle>
          <CardDescription>
            Wir sind hier, um Ihnen bei allen Fragen zu helfen
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Button
            variant="outline"
            className="flex-1"
            asChild
          >
            <a href="/faq" target="_blank" rel="noopener noreferrer">
              FAQs ansehen
            </a>
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            asChild
          >
            <a href="mailto:support@nextleveltraders.com">
              Support kontaktieren
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
