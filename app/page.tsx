import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRightIcon, SparklesIcon, StarIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { FooterSection } from "@/components/footer";
import { FaDiscord } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Header */}
      <header className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="NextLevelTraders Logo" className="h-10 w-auto object-contain" />
          <div className="flex items-baseline">
            <span className="font-heading font-bold text-xl">Next</span>
            <span className="font-heading font-light text-xl">Level</span>
            <span className="font-heading font-bold text-xl">Traders</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="https://discord.gg/6AGuBbsnFR" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                    <FaDiscord className="h-5 w-5" />
                    <span className="sr-only">Discord</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Join us on Discord</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
         
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Trading auf einem{" "}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              neuen Level
            </span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Nutzen Sie fortschrittliche technische Analysetools, KI-gestützte Entscheidungshilfen 
            und professionelle Charting-Funktionen für Ihren Handelserfolg.
          </p>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button size="lg" className="gap-2">
                Jetzt starten
                <ChevronRightIcon size={16} />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Features entdecken
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Entdecken Sie unsere leistungsstarken Trading-Tools und Analysen.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex h-[180px] flex-col justify-between p-6">
            <TrendingUpIcon className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">Pivot-Punkt-Analyse</h3>
              <p className="text-sm text-muted-foreground">
                Präzise Unterstützungs- und Widerstandsniveaus mit DeMark-Pivots.
              </p>
            </div>
          </Card>
          <Card className="flex h-[180px] flex-col justify-between p-6">
            <SparklesIcon className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">KI-Trading-Assistent</h3>
              <p className="text-sm text-muted-foreground">
                Setup-Analyse und Markteinschätzungen durch modernste KI-Technologie.
              </p>
            </div>
          </Card>
          <Card className="flex h-[180px] flex-col justify-between p-6">
            <StarIcon className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="font-bold">Multi-Timeframe-Bestätigung</h3>
              <p className="text-sm text-muted-foreground">
                Trading-Setups durch EMA-Cloud-Analysen in verschiedenen Zeitrahmen.
              </p>
            </div>
          </Card>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">Und vieles mehr...</p>
        </div>
      </section>

 {/* Pricing Section */}
 <section
        id="pricing"
        className="container space-y-6 py-8 md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Preise
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Wählen Sie den Plan, der am besten zu Ihnen passt.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3">
          <Card className="flex flex-col p-6">
            <div className="flex-1 space-y-4">
              <h3 className="font-bold">Basis</h3>
              <div className="text-3xl font-bold">€0</div>
              <p className="text-sm text-muted-foreground">
                Perfekt zum Kennenlernen der Plattform
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Basis Pivot-Punkt-Analyse</li>
                <li>✓ Begrenzte Chart-Funktionen</li>
                <li>✓ 15-Minuten verzögerte Daten</li>
              </ul>
            </div>
            <div className="pt-4">
              <Link href="/sign-up">
                <Button className="w-full">Kostenlos starten</Button>
              </Link>
            </div>
          </Card>
          <Card className="flex flex-col p-6 border-primary">
            <div className="flex-1 space-y-4">
              <h3 className="font-bold">Pro</h3>
              <div className="text-3xl font-bold">€29</div>
              <p className="text-sm text-muted-foreground">
                Ideal für aktive Trader
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Erweiterte Pivot-Analysen</li>
                <li>✓ Vollständige Chart-Funktionen</li>
                <li>✓ Echtzeit-Daten</li>
                <li>✓ KI-Trading-Assistent</li>
                <li>✓ Multi-Timeframe-Analysen</li>
              </ul>
            </div>
            <div className="pt-4">
              <Link href="/sign-up">
                <Button className="w-full">Pro-Version wählen</Button>
              </Link>
            </div>
          </Card>
          <Card className="flex flex-col p-6">
            <div className="flex-1 space-y-4">
              <h3 className="font-bold">Enterprise</h3>
              <div className="text-3xl font-bold">Individuell</div>
              <p className="text-sm text-muted-foreground">
                Maßgeschneiderte Lösungen für Institutionen
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Alle Pro-Features</li>
                <li>✓ API-Zugang</li>
                <li>✓ Dedizierter Support</li>
                <li>✓ Custom Integrationen</li>
              </ul>
            </div>
            <div className="pt-4">
              <Link href="/contact">
                <Button variant="outline" className="w-full">Kontakt aufnehmen</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            FAQ
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Häufig gestellte Fragen
          </p>
        </div>
        <div className="mx-auto grid gap-4 md:max-w-[58rem]">
          <Card className="p-6">
            <h3 className="font-bold">Was macht NextLevelTraders besonders?</h3>
            <p className="mt-2 text-muted-foreground">
              Wir kombinieren fortschrittliche technische Analyse mit KI-gestützter Entscheidungsfindung. 
              Unsere Plattform bietet einzigartige Features wie DeMark-Pivot-Analysen, Multi-Timeframe-Bestätigungen 
              und einen KI-Assistenten für fundierte Trading-Entscheidungen.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold">Wie genau sind die Pivot-Punkt-Berechnungen?</h3>
            <p className="mt-2 text-muted-foreground">
              Unsere Pivot-Punkte werden nach dem DeMark-Algorithmus berechnet, der sich besonders in 
              trendbehafteten Märkten bewährt hat. Die Berechnungen basieren auf historischen Daten 
              und werden in Echtzeit aktualisiert.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold">Kann ich die Plattform kostenlos testen?</h3>
            <p className="mt-2 text-muted-foreground">
              Ja, mit unserem kostenlosen Basis-Plan können Sie die grundlegenden Funktionen der Plattform 
              kennenlernen. Für Zugriff auf alle Features empfehlen wir den Pro-Plan.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold">Welche Märkte werden unterstützt?</h3>
            <p className="mt-2 text-muted-foreground">
              Wir unterstützen eine breite Palette von Märkten, darunter Aktien, ETFs und Kryptowährungen. 
              Die Daten werden in Echtzeit bereitgestellt (Pro-Plan) oder mit 15 Minuten Verzögerung (Basis-Plan).
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Bereit für den nächsten Level?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Starten Sie noch heute mit NextLevelTraders und verbessern Sie Ihre Trading-Ergebnisse.
          </p>
          <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Jetzt registrieren
                <ChevronRightIcon size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}


