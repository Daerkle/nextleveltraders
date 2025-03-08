"use client";

import { Card } from "@/components/ui/card";

export default function PsychologiePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Trading-Psychologie</h1>
        <p className="text-muted-foreground">
          Mentale Stärke und emotionale Kontrolle im Trading
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Die Great Eight - Häufige Trading-Fallen</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">1. Frank FOMO</h3>
              <p className="text-sm text-muted-foreground">
                Die Angst, etwas zu verpassen (Fear of Missing Out) führt zu übereilten, 
                unkalkulierten Trades. Erscheint oft durch Langeweile oder Aktionismus.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Andi Abweicher</h3>
              <p className="text-sm text-muted-foreground">
                Weicht vom ursprünglichen Trading-Plan ab. Oft durch FOMO oder 
                mangelnde Disziplin verursacht.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Steffen Sturkopf</h3>
              <p className="text-sm text-muted-foreground">
                Handelt stur gegen den Trend und ignoriert offensichtliche Marktsignale 
                aufgrund von Voreingenommenheit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Lisa ohne Limit</h3>
              <p className="text-sm text-muted-foreground">
                Wählt zu große Positionen und riskiert zu viel. Verdoppelt oft 
                Verlustpositionen statt sie zu begrenzen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5. Zara Zocker</h3>
              <p className="text-sm text-muted-foreground">
                Handelt ohne klaren Plan und verlässt sich auf Glück statt Analyse. 
                Hoffnung ersetzt Strategie.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">6. Sarah Selbstvertrauen</h3>
              <p className="text-sm text-muted-foreground">
                Mangelndes Selbstvertrauen verhindert das Ausführen guter Setups oder 
                führt zu verfrühtem Ausstieg.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">7. Gina Gier</h3>
              <p className="text-sm text-muted-foreground">
                Will zu schnell reich werden und vernachlässigt Risikomanagement. 
                Setzt zu viel Kapital ein.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">8. Uwe Ungeduld</h3>
              <p className="text-sm text-muted-foreground">
                Kann keine Konsolidierungsphasen aushalten und handelt aus Langeweile. 
                Ignoriert No-Trade-Zonen.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Emotionskontrolle</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Die zwei Hauptemotionen</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Gier</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Zu große Positionen</li>
                    <li>Ignorieren von Risiken</li>
                    <li>Übertriebene Gewinnerwartungen</li>
                    <li>FOMO-getriebene Entscheidungen</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Angst</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Zu früher Ausstieg bei Gewinnen</li>
                    <li>Verzögerter Ausstieg bei Verlusten</li>
                    <li>Übermäßiges Absichern</li>
                    <li>Vermeiden guter Setups</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Tägliche Trading-Routine</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Vor dem Handel</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Meditation (30 Minuten)</li>
                <li>Marktübersicht erstellen</li>
                <li>Top 3-5 Setups identifizieren</li>
                <li>Trading-Plan aufstellen</li>
                <li>Mentale Vorbereitung</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Nach dem Handel</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Trading-Journal führen</li>
                <li>Trades analysieren</li>
                <li>Emotionen reflektieren</li>
                <li>Verbesserungen identifizieren</li>
                <li>Meditation (30 Minuten)</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Mentales Reset</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Nach Verlusten oder emotionalen Trades ist ein mentales Reset wichtig, um wieder 
              klar und regelbasiert handeln zu können.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Nach Verlusten</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Trading-Pause einlegen</li>
                  <li>Verlust akzeptieren und analysieren</li>
                  <li>Position halbieren beim Wiedereinstieg</li>
                  <li>Fokus auf Prozess statt Ergebnis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Nach Gewinnen</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Nicht übermütig werden</li>
                  <li>Position gleich groß lassen</li>
                  <li>Weiter strikt nach Plan handeln</li>
                  <li>Erfolge systematisch analysieren</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Mindset-Entwicklung</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Langfristiger Fokus</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Trading als Marathon, nicht Sprint sehen</li>
                <li>Auf den Prozess statt Ergebnisse fokussieren</li>
                <li>Kleine Gewinne zu großen aufbauen</li>
                <li>Kontinuierliches Lernen priorisieren</li>
                <li>Erfolgsjournal führen</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Positive Gewohnheiten</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Regelmäßige Meditation</li>
                <li>Gesunde Work-Life-Balance</li>
                <li>Sport und Bewegung</li>
                <li>Ausreichend Schlaf</li>
                <li>Soziale Kontakte pflegen</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}