"use client";

import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function OptionsPage() {
  return (
    <div className="py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Optionstrading Grundlagen</h1>
        <p className="text-muted-foreground">
          Umfassender Guide für das Trading mit Optionen
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Was sind Optionen?</h2>
          <p className="text-muted-foreground mb-4">
            Optionen sind Hebelprodukte, mit denen man auf die zukünftige Wertentwicklung von Aktien, 
            ETFs und Indizes spekulieren kann. Ein Optionskontrakt entspricht dabei 100 Aktien, 
            wodurch sich der Hebel-Effekt ergibt.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Call Optionen</h3>
              <p className="text-sm text-muted-foreground">
                - Recht zum Kauf zu einem bestimmten Preis<br/>
                - Gewinnen an Wert bei steigenden Kursen<br/>
                - Delta zwischen 0 und 1
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Put Optionen</h3>
              <p className="text-sm text-muted-foreground">
                - Recht zum Verkauf zu einem bestimmten Preis<br/>
                - Gewinnen an Wert bei fallenden Kursen<br/>
                - Delta zwischen 0 und -1
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Die Griechen</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="delta">
              <AccordionTrigger>Delta</AccordionTrigger>
              <AccordionContent>
                - Beschreibt die Veränderung im Gewinn/Verlust für eine 1$ Veränderung des Kurses<br/>
                - Zwischen 0 und 1 für Calls<br/>
                - Zwischen 0 und -1 für Puts<br/>
                - Je tiefer ITM, desto größer das Delta
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="gamma">
              <AccordionTrigger>Gamma</AccordionTrigger>
              <AccordionContent>
                - Zeigt die Veränderung des Deltas bei 1$ Kursbewegung<br/>
                - Höheres Gamma bedeutet schnellere Delta-Änderung<br/>
                - Besonders wichtig bei ATM Optionen
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vega">
              <AccordionTrigger>Vega</AccordionTrigger>
              <AccordionContent>
                - Misst den Einfluss der impliziten Volatilität (IV) auf den Optionspreis<br/>
                - Höhere IV = höhere Premien<br/>
                - Premium Expansion bei steigender IV
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="theta">
              <AccordionTrigger>Theta</AccordionTrigger>
              <AccordionContent>
                - Zeitlicher Wertverlust pro Tag<br/>
                - Besonders wichtig bei Weeklys<br/>
                - Beschleunigt sich nahe dem Verfallstag
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Strikepreis und Moneyness</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">ITM (In the Money)</h3>
              <p className="text-sm text-muted-foreground">
                - Aktueller Kurs über (Call) oder unter (Put) Strike<br/>
                - Hat intrinsischen Wert + Zeitwert<br/>
                - Höheres Delta
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">ATM (At the Money)</h3>
              <p className="text-sm text-muted-foreground">
                - Aktueller Kurs nahe am Strike<br/>
                - Nur Zeitwert<br/>
                - Delta ca. 0.50
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">OTM (Out of the Money)</h3>
              <p className="text-sm text-muted-foreground">
                - Aktueller Kurs unter (Call) oder über (Put) Strike<br/>
                - Nur Zeitwert<br/>
                - Geringeres Delta
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trading-Psychologie & Regeln</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Die 10 goldenen Regeln</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li><span className="font-medium">Trading als Business:</span> Respektiere dein Kapital, zahle dich selbst aus, fokussiere dich auf langfristigen Erfolg</li>
                <li><span className="font-medium">Nie Verlustpositionen aufstocken:</span> Verhindert das &quot;Averaging Down&quot; und schützt vor Totalverlusten</li>
                <li><span className="font-medium">Ohne Bias handeln:</span> Folge dem Preis, nicht deiner vorgefassten Meinung</li>
                <li><span className="font-medium">Systematisch Gewinne mitnehmen:</span> Nimm Gewinne bei 30%, 50%, 75%, 100% mit</li>
                <li><span className="font-medium">Kapital schützen:</span> Maximal 5-10% Risiko pro Trade</li>
                <li><span className="font-medium">Geerdet bleiben:</span> Schätze jeden Gewinn, vergleiche dich nicht mit anderen</li>
                <li><span className="font-medium">Cash ist eine Position:</span> Nicht jeden Tag handeln müssen</li>
                <li><span className="font-medium">Stop-Loss respektieren:</span> Verluste begrenzen bevor sie zu groß werden</li>
                <li><span className="font-medium">Plan erstellen und folgen:</span> Vorbereitung ist alles</li>
                <li><span className="font-medium">Journaling:</span> Dokumentiere und analysiere jeden Trade</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Warnsignale für zu hohes Risiko</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Sofortige Nervosität nach Positionseröffnung</li>
                <li>Zu frühes Ausstoppen (20-25%)</li>
                <li>Übermäßige Euphorie bei Gewinnen</li>
                <li>Depression bei Verlusten</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tägliche Routine aufbauen</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Vor dem Handel:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Meditation (30min)</li>
                    <li>Marktüberblick</li>
                    <li>Top 3-5 Setups identifizieren</li>
                    <li>Gesundes Frühstück</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">Nach dem Handel:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Journal führen</li>
                    <li>Trades analysieren</li>
                    <li>Charts für morgen vorbereiten</li>
                    <li>Meditation (30min)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Positionsgrößen</h3>
              <p className="text-muted-foreground mb-4">
                Empfohlene Positionsgrößen nach Account-Größe:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Kleines Konto ($5.000): Maximal $500 (10%) pro Trade</li>
                <li>Größeres Konto ($100.000):
                  <ul className="ml-6 list-disc">
                    <li>Volle Position = $3.000 (3%)</li>
                    <li>Mittlere Position = $2.000 (2%)</li>
                    <li>Kleine Position = $1.000 (1%)</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Wachstumsstrategie</h3>
              <p className="text-muted-foreground">
                Beispiel für das Wachstum eines $5.000 Kontos:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>5-10 qualitativ hochwertige Trades pro Woche</li>
                <li>$250-350 pro Trade mit 3:1 Risk/Reward</li>
                <li>Bei 60-70% Erfolgsquote: $750-1.000 pro Woche</li>
                <li>Nach 2-3 Monaten ca. $15.000</li>
                <li>Mit mehr Kapital: Fokus auf bewährte Setups (80% Erfolgsquote)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tägliches Ziel (250 Handelstage)</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>$100/Tag = $25.000/Jahr</p>
                  <p>$200/Tag = $50.000/Jahr</p>
                  <p>$400/Tag = $100.000/Jahr</p>
                </div>
                <div>
                  <p>$500/Tag = $125.000/Jahr</p>
                  <p>$1.000/Tag = $250.000/Jahr</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trade-Stärke & Binary Events</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Faktoren für starke Trades</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Positive Indikatoren</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Dips werden über Support gekauft</li>
                    <li>Widerstände werden leicht gebrochen</li>
                    <li>Stärker als Index-Performance</li>
                    <li>Positive Analysten-Upgrades</li>
                    <li>Gute Quartalszahlen</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Negative Indikatoren</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Tiefere Hochs im Chart</li>
                    <li>Support-Brüche</li>
                    <li>Abverkauf nach Earnings</li>
                    <li>Analysten-Downgrades</li>
                    <li>Insider-Verkäufe</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Binary Events vermeiden</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Besonders für Anfänger risikoreiche Events meiden:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Earnings Reports (Quartalszahlen)</li>
                <li>FED Meetings (Zinsentscheidungen)</li>
                <li>FDA Approvals (Medikamentenzulassungen)</li>
                <li>Wichtige Reden/Ankündigungen</li>
                <li>Overnight/Weekend Holding (Zeitverfall)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Risk/Reward Berechnung</h3>
              <p className="text-sm text-muted-foreground">
                Beispiel: Stock XYZ bei $97, Resistance bei $100, nächstes Level $109
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Entry über $100</li>
                <li>Stop Loss bei $97 (3 Punkte Risiko)</li>
                <li>Target $109 (9 Punkte Reward)</li>
                <li>Risk/Reward = 1:3 (akzeptabel)</li>
                <li>Minimum 2-3X Risk/Reward anstreben</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">✨ Trading Akronyme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <ul className="space-y-1">
                <li><span className="font-semibold">b/t:</span> Backtest</li>
                <li><span className="font-semibold">b/e:</span> Breakeven</li>
                <li><span className="font-semibold">b/o:</span> Breakout</li>
                <li><span className="font-semibold">r/g:</span> Red to green</li>
                <li><span className="font-semibold">g/r:</span> Green to red</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li><span className="font-semibold">moc:</span> Market on close</li>
                <li><span className="font-semibold">SL:</span> Stoploss</li>
                <li><span className="font-semibold">ATH:</span> All time high</li>
                <li><span className="font-semibold">HOD:</span> High of day</li>
                <li><span className="font-semibold">LOD:</span> Low of day</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li><span className="font-semibold">PM:</span> Premarket</li>
                <li><span className="font-semibold">PH:</span> Power hour</li>
                <li><span className="font-semibold">AH:</span> After hour</li>
                <li><span className="font-semibold">PA:</span> Price Action</li>
                <li><span className="font-semibold">PT:</span> Price Target</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li><span className="font-semibold">HH:</span> Higher High</li>
                <li><span className="font-semibold">HL:</span> Higher Low</li>
                <li><span className="font-semibold">LH:</span> Lower High</li>
                <li><span className="font-semibold">LL:</span> Lower Low</li>
                <li><span className="font-semibold">R/R:</span> Risk/Reward</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}