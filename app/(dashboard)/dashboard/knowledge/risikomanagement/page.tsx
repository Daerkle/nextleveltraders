"use client";

import { Card } from "@/components/ui/card";

export default function RisikomanagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Risikomanagement</h1>
        <p className="text-muted-foreground">
          Strategien zur Kontrolle und Minimierung von Handelsrisiken
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Position Sizing</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Grundregeln</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Maximal 3-10% des Accounts pro Trade (je nach Kontogröße)</li>
                <li>Kleinere Konten: Bis zu 10% möglich für effektives Wachstum</li>
                <li>Größere Konten: Maximal 3% pro Trade</li>
                <li>Position nie größer als emotional tragbar</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Warnsignale für zu große Positionen</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Sofortige Nervosität nach Einstieg</li>
                <li>Zu frühes Ausstoppen (20-25%)</li>
                <li>Übermäßige Euphorie bei Gewinnen</li>
                <li>Depression bei Verlusten</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Stop-Loss Strategien</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Arten von Stops</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Prozentuale Stops</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>30-50% für Optionen</li>
                    <li>1-2% für Aktien</li>
                    <li>Abhängig von Volatilität</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Technische Stops</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Unter/über Support/Resistance</li>
                    <li>Unter/über Moving Averages</li>
                    <li>ATR-basierte Stops</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Gewinn-Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Systematische Gewinnmitnahmen</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Prozentuale Methode</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>25% bei erstem Ziel</li>
                    <li>50% bei zweitem Ziel</li>
                    <li>75% bei drittem Ziel</li>
                    <li>100% bei finalem Ziel</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Technische Methode</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>An wichtigen Widerständen</li>
                    <li>Bei überkauften Indikatoren</li>
                    <li>Bei Chart-Pattern Completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Risk/Reward Verhältnis</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Das Risk/Reward Verhältnis (R/R) ist entscheidend für langfristigen Erfolg. Es beschreibt das Verhältnis zwischen 
              möglichem Verlust und potenziellem Gewinn.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Berechnung</h3>
              <code className="block bg-muted p-4 rounded-md">
                R/R = (Target - Entry) / (Entry - Stop Loss)
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Empfehlungen</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Mindestens 1:2 Risk/Reward</li>
                <li>Optimal 1:3 oder besser</li>
                <li>Position größer bei besserem R/R</li>
                <li>Berücksichtige Trefferquote</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Account-Schutz</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Tägliche Limits</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Maximaler Tagesverlust festlegen</li>
                <li>Maximale Anzahl Trades pro Tag</li>
                <li>Mindest-R/R pro Trade</li>
                <li>Cash ist auch eine Position</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Zu vermeiden</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Averaging Down bei Verlusten</li>
                <li>Übertrading aus FOMO</li>
                <li>Revenge Trading nach Verlusten</li>
                <li>Zu große Einzelpositionen</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Checkliste vor jedem Trade</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Positionsgröße berechnet und angemessen?</li>
            <li>Stop-Loss definiert?</li>
            <li>Gewinnziele festgelegt?</li>
            <li>Risk/Reward mindestens 1:2?</li>
            <li>Einstieg an technisch sinnvoller Stelle?</li>
            <li>Marktumfeld beachtet?</li>
            <li>Emotionen unter Kontrolle?</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}