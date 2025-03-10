import { SubscriptionDetails } from "@/components/subscription/subscription-details";
import { TrialCountdown } from "@/components/subscription/trial-countdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

export default async function BillingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Nicht authentifiziert");
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Abonnement & Rechnung</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihr Abonnement und sehen Sie Ihre Rechnungen ein
        </p>
      </div>

      {/* Trial Countdown */}
      <TrialCountdown />

      {/* Subscription Details */}
      <SubscriptionDetails />

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
