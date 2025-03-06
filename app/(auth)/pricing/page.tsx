import { PLANS } from "@/lib/stripe";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="container flex flex-col items-center py-10">
      <div className="mx-auto mb-10 max-w-[58rem] text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Einfache, transparente Preise
        </h2>
        <p className="mt-6 text-muted-foreground">
          Wählen Sie den Plan, der am besten zu Ihnen passt
        </p>
      </div>

      <div className="grid w-full max-w-5xl gap-6 px-4 sm:grid-cols-2">
        {/* Free Plan */}
        <Card className="flex flex-col p-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold">Basis</h3>
            <p className="mt-2 text-muted-foreground">
              Perfekt zum Kennenlernen der Plattform
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold">€0</span>
              <span className="text-muted-foreground">/Monat</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Basis Pivot-Punkt-Analyse</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Begrenzte Chart-Funktionen</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>15-Minuten verzögerte Daten</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Eine Watchlist</span>
              </li>
            </ul>
          </div>
          <Button className="mt-6" variant="outline">
            Kostenlos starten
          </Button>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col p-6 border-primary bg-primary/5">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{PLANS.PRO.name}</h3>
              <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                Beliebt
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">
              {PLANS.PRO.description}
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold">€{PLANS.PRO.price / 100}</span>
              <span className="text-muted-foreground">/Monat</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Erweiterte Pivot-Analysen</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Vollständige Chart-Funktionen</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Echtzeit-Daten</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>KI-Trading-Assistent</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Multi-Timeframe-Analysen</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Unbegrenzte Watchlists</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Prioritäts-Support</span>
              </li>
            </ul>
          </div>
          <Button className="mt-6">Pro-Version wählen</Button>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto mt-20 max-w-[58rem]">
        <h3 className="text-2xl font-bold text-center mb-10">
          Häufig gestellte Fragen
        </h3>
        <div className="grid gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Kann ich den Plan jederzeit wechseln?
            </h4>
            <p className="text-muted-foreground">
              Ja, Sie können jederzeit zwischen den Plänen wechseln. Bei einem Upgrade haben Sie sofort Zugriff auf alle Pro-Features.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Gibt es eine Mindestlaufzeit?
            </h4>
            <p className="text-muted-foreground">
              Nein, Sie können das Pro-Abonnement jederzeit kündigen. Die Zahlung erfolgt monatlich.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Welche Zahlungsmethoden werden akzeptiert?
            </h4>
            <p className="text-muted-foreground">
              Wir akzeptieren alle gängigen Kredit- und Debitkarten (Visa, Mastercard, American Express).
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Kann ich die Pro-Version testen?
            </h4>
            <p className="text-muted-foreground">
              Nach dem Upgrade haben Sie 14 Tage Zeit, die Pro-Version zu testen. Wenn Sie nicht zufrieden sind, erstatten wir Ihnen den vollen Betrag.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}