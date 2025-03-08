"use client";

import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function IndikatorenPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Technische Indikatoren</h1>
        <p className="text-muted-foreground">
          Die wichtigsten technischen Indikatoren für deine Trading-Analyse
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trend-Indikatoren</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ma">
              <AccordionTrigger>Moving Averages (MA)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Gleitende Durchschnitte zeigen den durchschnittlichen Preis über einen bestimmten Zeitraum.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>SMA (Simple): Einfacher Durchschnitt aller Preise</li>
                    <li>EMA (Exponential): Gewichtet neuere Preise stärker</li>
                    <li>Häufige Zeiträume: 9, 20, 50, 200 Tage</li>
                    <li>Kreuzen von MAs signalisiert Trendwechsel</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="macd">
              <AccordionTrigger>MACD (Moving Average Convergence Divergence)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Zeigt Momentum und Trendrichtung durch Vergleich von EMAs.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>MACD-Linie = 12 EMA - 26 EMA</li>
                    <li>Signal-Linie = 9 EMA des MACD</li>
                    <li>Histogramm zeigt Differenz</li>
                    <li>Kreuzen der Linien gibt Handelssignale</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Momentum-Indikatoren</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="rsi">
              <AccordionTrigger>Relative Strength Index (RSI)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Misst die Geschwindigkeit und Veränderung von Preisbewegungen.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Wertebereich 0-100</li>
                    <li>Über 70: Überkauft</li>
                    <li>Unter 30: Überverkauft</li>
                    <li>Divergenzen zeigen mögliche Trendwenden</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stoch">
              <AccordionTrigger>Stochastic Oscillator</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Vergleicht den aktuellen Schlusskurs mit der Preisspanne über Zeit.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>%K und %D Linien</li>
                    <li>Über 80: Überkauft</li>
                    <li>Unter 20: Überverkauft</li>
                    <li>Kreuzen der Linien gibt Signale</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Volumen-Indikatoren</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="obv">
              <AccordionTrigger>On-Balance-Volume (OBV)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Zeigt Beziehung zwischen Volumen und Preisentwicklung.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Kumuliert Volumen basierend auf Preisrichtung</li>
                    <li>Steigendes OBV = Kaufdruck</li>
                    <li>Fallendes OBV = Verkaufsdruck</li>
                    <li>Divergenzen sind wichtige Signale</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vwap">
              <AccordionTrigger>Volume Weighted Average Price (VWAP)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Durchschnittspreis gewichtet nach Handelsvolumen.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Wichtige Referenz für institutionelle Händler</li>
                    <li>Über VWAP = starke Aktie</li>
                    <li>Unter VWAP = schwache Aktie</li>
                    <li>Guter Indikator für Entry/Exit</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Volatilitäts-Indikatoren</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bb">
              <AccordionTrigger>Bollinger Bands</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Zeigt Volatilität und mögliche Über-/Untertreibungen.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Mittleres Band = 20 SMA</li>
                    <li>Oberes/Unteres Band = 2 Standardabweichungen</li>
                    <li>Enge Bänder = niedrige Volatilität</li>
                    <li>Weite Bänder = hohe Volatilität</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="atr">
              <AccordionTrigger>Average True Range (ATR)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Misst die durchschnittliche Handelsspanne über Zeit.</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Höherer ATR = mehr Volatilität</li>
                    <li>Niedriger ATR = weniger Volatilität</li>
                    <li>Gut für Stop-Loss Bestimmung</li>
                    <li>Hilft bei Positionsgrößen-Berechnung</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trading-Tipps für Indikatoren</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Kombiniere mehrere Indikatoren für bessere Signale</li>
            <li>Beachte den übergeordneten Trend</li>
            <li>Suche nach Bestätigungen durch Preis und Volumen</li>
            <li>Vermeide zu viele Indikatoren gleichzeitig</li>
            <li>Teste Indikatoren zuerst im Paper Trading</li>
            <li>Verstehe die Berechnung hinter jedem Indikator</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}