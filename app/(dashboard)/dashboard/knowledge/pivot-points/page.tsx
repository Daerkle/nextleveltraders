"use client";

import { Card } from "@/components/ui/card";

export default function PivotPointsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pivot Points im Trading</h1>
        <p className="text-muted-foreground">
          Verstehe und nutze Pivot-Levels für deine Trading-Entscheidungen
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Standard Pivot Points</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Tägliche Berechnung</h3>
              <p className="text-muted-foreground mb-4">
                Standard Pivot Points werden auf Basis der Vortageswerte berechnet:
              </p>
              <div className="bg-muted p-4 rounded-md space-y-2 font-mono text-sm">
                <p>Pivot = (Hoch + Tief + Schluss) / 3</p>
                <p>R1 = (2 × Pivot) - Tief</p>
                <p>S1 = (2 × Pivot) - Hoch</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Zeitrahmen</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Täglich</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Berechnung jeden Tag</li>
                    <li>Basis: Vortageswerte</li>
                    <li>Häufigste Verwendung</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Wöchentlich</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Berechnung jede Woche</li>
                    <li>Basis: Vorwochenwerte</li>
                    <li>Mittelfristige Planung</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Monatlich</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Berechnung jeden Monat</li>
                    <li>Basis: Vormonatswerte</li>
                    <li>Langfristige Levels</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">DeMark (DM) Pivot Points</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              DeMark Pivot Points berücksichtigen die Marktrichtung des vorherigen Handelstages 
              und bieten dadurch präzisere Unterstützungs- und Widerstandsniveaus.
            </p>
            
            <div>
              <h3 className="font-semibold mb-2">Berechnung</h3>
              <div className="bg-muted p-4 rounded-md space-y-4 font-mono text-sm">
                <div>
                  <p className="font-medium mb-2">Fall 1: Schlusskurs unter Eröffnung</p>
                  <p>DM Pivot = (Hoch + (2 × Tief) + Schluss) / 4</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Fall 2: Schlusskurs über Eröffnung</p>
                  <p>DM Pivot = ((2 × Hoch) + Tief + Schluss) / 4</p>
                </div>
                <div className="mt-4">
                  <p>DM R1 = DM Pivot + (Hoch - Tief)</p>
                  <p>DM S1 = DM Pivot - (Hoch - Tief)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Multi-Timeframe Analyse</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Long Setup Bedingungen</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Kurs muss in mindestens 2 von 3 Zeitrahmen über DM R1 liegen</li>
                <li>SPY/QQQ sollten bullischen Trend zeigen</li>
                <li>Idealerweise Bestätigung durch EMA Cloud</li>
                <li>Risk/Reward mindestens 1:1.5</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Short Setup Bedingungen</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Kurs muss in mindestens 2 von 3 Zeitrahmen unter DM S1 liegen</li>
                <li>SPY/QQQ sollten bärischen Trend zeigen</li>
                <li>Idealerweise Bestätigung durch EMA Cloud</li>
                <li>Risk/Reward mindestens 1:1.5</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Jahres-Pivot R2 Analyse</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Berechnung</h3>
              <div className="bg-muted p-4 rounded-md space-y-2 font-mono text-sm">
                <p>Jahrespivot = (Jahreshoch + Jahrestief + Jahresschluss) / 3</p>
                <p>Jahres-R2 = Jahrespivot + (Jahreshoch - Jahrestief)</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interpretation</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Schnelles Erreichen von R2: Starker Trend</li>
                <li>Langsames Erreichen: Schwächerer Trend</li>
                <li>Wichtiges Level für langfristige Positionierung</li>
                <li>Dient als übergeordneter Trendfilter</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trading-Tipps für Pivot Points</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Einstiegsmöglichkeiten</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Abpraller an Pivot-Levels</li>
                <li>Ausbrüche über R1/unter S1</li>
                <li>Multiframe-Bestätigung abwarten</li>
                <li>Volume als Bestätigung nutzen</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stop-Loss Platzierung</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Knapp unter/über Pivot-Levels</li>
                <li>Außerhalb der Daily Range</li>
                <li>Jenseits wichtiger EMAs</li>
                <li>Risk/Reward beachten</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}