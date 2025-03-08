"use client";

import { Card } from "@/components/ui/card";

export default function ChartmusterPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chartmuster erkennen</h1>
        <p className="text-muted-foreground">
          Die wichtigsten Chartmuster und ihre Bedeutung für Trading-Entscheidungen
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Was sind Chartmuster?</h2>
          <p className="text-muted-foreground mb-4">
            Chartmuster sind wiederkehrende Formationen im Kursverlauf, die sich aus vielen einzelnen 
            Candlesticks zusammensetzen. Sie können sich über verschiedene Zeiträume (Minuten bis Monate) 
            ausbilden und helfen dabei, potenzielle Kursbewegungen vorherzusagen.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Bullische Muster</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Double Bottom</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ein W-förmiges Muster, das sich bildet, wenn ein Asset zweimal das gleiche 
                Tief testet und dann nach oben ausbricht. Signalisiert eine Trendwende nach oben.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cup and Handle</h3>
              <p className="text-sm text-muted-foreground mb-4">
                U-förmige Konsolidierung (Cup) gefolgt von einer kleineren Abwärtsbewegung (Handle). 
                Nach Ausbruch oft starke Aufwärtsbewegung.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bull Flag</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Konsolidierungsmuster nach starkem Anstieg. Parallele Abwärtstrendlinien 
                bilden eine "Flagge". Ausbruch nach oben wahrscheinlich.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ascending Triangle</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Horizontaler Widerstand mit steigenden Tiefs. Zeigt akkumulierenden Kaufdruck 
                und führt oft zu Ausbruch nach oben.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Bärische Muster</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Double Top</h3>
              <p className="text-sm text-muted-foreground mb-4">
                M-förmiges Muster, bei dem ein Asset zweimal das gleiche Hoch testet und dann 
                nach unten ausbricht. Signalisiert eine Trendwende nach unten.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Head and Shoulders</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drei Hochs, wobei das mittlere (Head) höher ist als die beiden äußeren (Shoulders). 
                Durchbruch der Nackenlinie signalisiert Trendwende.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bear Flag</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Konsolidierungsmuster nach starkem Abwärtstrend. Parallele Aufwärtstrendlinien 
                bilden eine "Flagge". Ausbruch nach unten wahrscheinlich.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Descending Triangle</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Horizontaler Support mit fallenden Hochs. Zeigt zunehmenden Verkaufsdruck 
                und führt oft zu Durchbruch nach unten.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Bestimmung der Musterstärke</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Zeitrahmen-Übereinstimmung</h3>
              <p className="text-sm text-muted-foreground">
                Je mehr Zeitrahmen das gleiche Muster zeigen (Intraday, Daily, Weekly), 
                desto verlässlicher ist das Signal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Support/Resistance Alignment</h3>
              <p className="text-sm text-muted-foreground">
                Muster sind stärker, wenn sie mit wichtigen Support- und Resistance-Levels 
                zusammenfallen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Volumen-Bestätigung</h3>
              <p className="text-sm text-muted-foreground">
                Ausbrüche aus Mustern sollten von erhöhtem Handelsvolumen begleitet werden, 
                um die Bewegung zu bestätigen.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trading-Tipps</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Warte auf Bestätigung des Musters durch Ausbruch</li>
            <li>Beachte das Volumen beim Ausbruch</li>
            <li>Setze Stop-Loss knapp unter/über wichtige Chartmarken</li>
            <li>Berücksichtige den übergeordneten Markttrend</li>
            <li>Kombiniere Chartmuster mit anderen technischen Indikatoren</li>
            <li>Practice makes perfect - übe das Erkennen in verschiedenen Zeitrahmen</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}