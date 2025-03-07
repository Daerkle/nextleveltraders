"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Tag, Share2 } from "lucide-react"

export default function FedDecisionArticle() {
  return (
    <article className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>7. März 2024</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>5 min Lesezeit</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>Makroökonomie</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Fed Zinsentscheidung: Märkte reagieren positiv
        </h1>
        <p className="text-xl text-muted-foreground">
          Die Federal Reserve hat ihre jüngste Zinspolitik vorgestellt. Eine detaillierte Analyse der 
          Auswirkungen auf verschiedene Marktsegmente.
        </p>
      </div>

      {/* Share Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Teilen
        </Button>
      </div>

      {/* Main Content */}
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Zentrale Punkte der Fed-Entscheidung</h2>
        <ul>
          <li>Leitzins bleibt unverändert im Bereich von 5,25% bis 5,50%</li>
          <li>Fed signalisiert weiterhin vorsichtigen Ansatz</li>
          <li>Inflationsziel von 2% bleibt bestehen</li>
        </ul>

        <h2>Marktreaktionen im Detail</h2>
        <p>
          Die Märkte haben positiv auf die jüngste Zinsentscheidung der Federal Reserve reagiert. 
          Besonders die klare Kommunikation der Fed bezüglich ihres weiteren Vorgehens wurde von 
          den Marktteilnehmern begrüßt.
        </p>

        <Card className="my-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Wichtige Kennzahlen</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-2xl font-bold">5,25-5,50%</div>
                <div className="text-sm text-muted-foreground">Aktuelle Zinsspanne</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2%</div>
                <div className="text-sm text-muted-foreground">Inflationsziel</div>
              </div>
              <div>
                <div className="text-2xl font-bold">3,9%</div>
                <div className="text-sm text-muted-foreground">Aktuelle Inflation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2>Auswirkungen auf verschiedene Sektoren</h2>
        <p>
          Die Entscheidung der Fed hat unterschiedliche Auswirkungen auf verschiedene Marktsektoren. 
          Während Tech-Aktien besonders positiv reagierten, zeigten sich defensive Sektoren 
          verhaltener.
        </p>

        <h3>Technologie-Sektor</h3>
        <p>
          Tech-Unternehmen profitierten besonders von der Aussicht auf stabile Zinsen. Die 
          Finanzierungsbedingungen bleiben günstig, was Investitionen in Wachstum ermöglicht.
        </p>

        <h3>Finanzsektor</h3>
        <p>
          Banken und Finanzdienstleister reagierten gemischt auf die Entscheidung. Während die 
          Stabilität begrüßt wurde, drücken die anhaltend hohen Zinsen auf die Kreditnachfrage.
        </p>

        <h2>Ausblick und Trading-Strategien</h2>
        <p>
          Für Trader ergeben sich aus der Fed-Entscheidung verschiedene Chancen. Besonders 
          interessant sind:
        </p>
        <ul>
          <li>Long-Positionen in wachstumsstarken Tech-Werten</li>
          <li>Beobachtung von Qualitätsaktien mit stabiler Dividende</li>
          <li>Fokus auf Unternehmen mit starker Preissetzungsmacht</li>
        </ul>

        <div className="bg-muted p-6 rounded-lg my-8">
          <h4 className="text-lg font-semibold mb-4">Trading-Tipp</h4>
          <p className="mb-0">
            Achten Sie in den kommenden Wochen besonders auf die Entwicklung der 
            Inflationsdaten. Diese werden maßgeblich die nächsten Entscheidungen der Fed 
            beeinflussen.
          </p>
        </div>
      </div>

      {/* Related Articles */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Verwandte Artikel</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">EZB im Fokus: Europas Zinspolitik</h3>
              <p className="text-sm text-muted-foreground">
                Vergleich der Geldpolitik zwischen Fed und EZB
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Dollar-Index: Technische Analyse</h3>
              <p className="text-sm text-muted-foreground">
                Auswirkungen der Fed-Politik auf den Währungsmarkt
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </article>
  )
}