"use client"

import Image from "next/image"
import { Button } from "../button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"

export default function TechnischeAnalysePage() {
  return (
    <article className="container mx-auto py-8 max-w-4xl">
      {/* Hero Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Technische Analyse im Trading
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Verstehe die Grundlagen der technischen Analyse und verbessere deine Trading-Entscheidungen
        </p>
      </header>

      {/* Hauptbild */}
      <div className="relative w-full h-[400px] mb-12 rounded-lg overflow-hidden">
        <Image
          src="/images/trading/technical-analysis.jpg"
          alt="Technische Analyse Übersicht"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Inhaltsübersicht */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Inhaltsverzeichnis</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            <a href="#einfuehrung" className="block text-blue-600 hover:underline">1. Einführung in die technische Analyse</a>
            <a href="#grundlagen" className="block text-blue-600 hover:underline">2. Die wichtigsten Grundlagen</a>
            <a href="#charttypen" className="block text-blue-600 hover:underline">3. Verschiedene Charttypen</a>
            <a href="#indikatoren" className="block text-blue-600 hover:underline">4. Technische Indikatoren</a>
            <a href="#praxis" className="block text-blue-600 hover:underline">5. Praktische Anwendung</a>
          </nav>
        </CardContent>
      </Card>

      {/* Hauptinhalt */}
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <section id="einfuehrung" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">1. Einführung in die technische Analyse</h2>
          <p className="mb-4">
            Die technische Analyse ist eine Methode zur Vorhersage von Kursbewegungen basierend auf 
            der systematischen Analyse von Marktdaten, insbesondere Preis- und Volumenbewegungen.
          </p>
          <Card className="my-6">
            <CardHeader>
              <CardTitle>Wichtig zu wissen</CardTitle>
              <CardDescription>Kernprinzipien der technischen Analyse</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Der Markt diskontiert alles</li>
                <li>Preise bewegen sich in Trends</li>
                <li>Geschichte wiederholt sich</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="grundlagen" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">2. Die wichtigsten Grundlagen</h2>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Unterstützung</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ein Preisniveau, an dem die Nachfrage stark genug ist, um einen fallenden Kurs aufzufangen.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Widerstand</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ein Preisniveau, an dem das Angebot stark genug ist, um einen steigenden Kurs zu stoppen.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="charttypen" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">3. Verschiedene Charttypen</h2>
          <div className="space-y-4">
            <p>
              Die Wahl des richtigen Charttyps ist entscheidend für eine effektive technische Analyse.
              Hier sind die wichtigsten Typen:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Liniencharts - Einfach und übersichtlich</li>
              <li>Candlestick-Charts - Detaillierte Preisinformationen</li>
              <li>Bar-Charts - Klassische Darstellung</li>
              <li>Renko-Charts - Fokus auf Preisbewegungen</li>
            </ul>
          </div>
        </section>

        <section id="indikatoren" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">4. Technische Indikatoren</h2>
          <div className="space-y-6">
            <p>
              Technische Indikatoren sind mathematische Berechnungen basierend auf Preis und/oder Volumen,
              die Trader bei ihren Analysen unterstützen.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Trend-Indikatoren</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    <li>Gleitende Durchschnitte</li>
                    <li>MACD</li>
                    <li>ADX</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Momentum-Indikatoren</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    <li>RSI</li>
                    <li>Stochastik</li>
                    <li>CCI</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="praxis" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">5. Praktische Anwendung</h2>
          <p className="mb-6">
            Die erfolgreiche Anwendung der technischen Analyse erfordert Übung und Erfahrung.
            Hier sind einige praktische Tipps für den Einstieg:
          </p>
          <div className="bg-muted p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Praxis-Tipps</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Beginne mit einfachen Chartmustern</li>
              <li>Nutze zunächst nur wenige Indikatoren</li>
              <li>Führe ein Trading-Tagebuch</li>
              <li>Übe mit einem Demo-Konto</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Bereit für den nächsten Schritt?</CardTitle>
              <CardDescription>
                Vertiefe dein Wissen mit unseren weiterführenden Artikeln
              </CardDescription>
            </CardHeader>
            <CardContent className="space-x-4">
              <Button variant="default">Zu den Chartmustern</Button>
              <Button variant="outline">Mehr über Indikatoren</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </article>
  )
}