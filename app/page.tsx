"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronRightIcon, 
  SparklesIcon, 
  StarIcon, 
  TrendingUpIcon, 
  CheckIcon 
} from "lucide-react";
import Link from "next/link";
import { FooterSection } from "@/components/footer";
import { FaDiscord } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
}

// Komponente für den Zähleffekt
const CountUp = ({ value, duration = 500, decimals = 0 }: CountUpProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const endValue = Number(value);
    const startTime = performance.now();
    const startValue = displayValue; // Capture current value
    
    let frameId: number;
    const updateValue = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setDisplayValue(endValue);
        return;
      }
      
      const progress = elapsedTime / duration;
      const nextValue = startValue + (endValue - startValue) * progress;
      setDisplayValue(nextValue);
      frameId = requestAnimationFrame(updateValue);
    };
    
    frameId = requestAnimationFrame(updateValue);
    
    // Cleanup
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]); // displayValue absichtlich ausgelassen, um Endlos-Loop zu vermeiden
  
  return decimals === 0 
    ? Math.round(displayValue) 
    : displayValue.toFixed(decimals);
};

export default function HomePage() {
  const [isYearly, setIsYearly] = useState(false);
  
  // Preisberechnung
  const monthlyPrice = 49;
  const yearlyPrice = 500; // 49 * 12 * 0.85 gerundet
  const yearlyMonthlyPrice = Math.round(yearlyPrice / 12);
  
  // Aktueller Preis basierend auf Abrechnungszeitraum
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const priceLabel = isYearly ? "/Jahr" : "/Monat";
  const monthlyPriceLabel = isYearly ? `(${yearlyMonthlyPrice}€/Monat)` : "";

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
            Nutzen Sie fortschrittliche technische Analyseabilities, KI-gestützte Entscheidungshilfen 
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
            Entdecken Sie unsere leistungsstarken Trading-Abilities und Analysen.
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

      {/* Pricing Section mit verbesserten Cards */}
      <section
        id="pricing"
        className="container space-y-6 py-8 md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Preise
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Testen Sie alle Features 4 Tage kostenlos, dann entscheiden Sie sich.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Label htmlFor="billing-toggle" className="text-sm font-medium">Monatlich</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              {isYearly && (
                <span className="ml-2 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-medium px-2 py-0.5 rounded">
                  15% Rabatt
                </span>
              )}
            </div>
            <Label htmlFor="billing-toggle" className="text-sm font-medium">Jährlich</Label>
          </div>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
          {/* Free Card mit Hover-Effekt */}
          <Card className="flex flex-col p-6 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
            <div className="flex-1 space-y-4">
              <h3 className="font-bold">Free</h3>
              <div className="text-3xl font-bold">€0</div>
              <p className="text-sm text-muted-foreground">
                Voller Funktionsumfang für 4 Tage
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Erweiterte Pivot-Analysen
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Vollständige Chart-Funktionen
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Echtzeit-Daten
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  KI-Trading-Assistent
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Multi-Timeframe-Analysen
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-auto">
              <Link href="/sign-up">
                <Button className="w-full transition-colors duration-300 hover:bg-primary/90">
                  Kostenlos testen
                </Button>
              </Link>
            </div>
          </Card>
          
          {/* Pro Card mit Hover-Effekt und Highlight */}
          <Card className="flex flex-col p-6 border-primary relative overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br hover:from-primary/5 hover:to-transparent">
            {/* Theme-angepasstes Empfohlen-Badge */}
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
              Empfohlen
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="font-bold">Pro</h3>
              <div className="text-3xl font-bold h-14 flex items-center">
                €<CountUp value={currentPrice} duration={800} />
                <span className="text-lg font-normal text-muted-foreground ml-1">{priceLabel}</span>
              </div>
              {isYearly && (
                <p className="text-sm text-muted-foreground -mt-2">
                  {monthlyPriceLabel}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Nach Ablauf der Testphase
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Erweiterte Pivot-Analysen
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Vollständige Chart-Funktionen
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Echtzeit-Daten
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  KI-Trading-Assistent
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Multi-Timeframe-Analysen
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-auto">
              <Link href={`/sign-up?plan=pro&billing=${isYearly ? 'yearly' : 'monthly'}`}>
                <Button className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300">
                  Pro-Version wählen
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section mit Accordion */}
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
        <div className="mx-auto md:max-w-[58rem]">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium">
                Was macht NextLevelTraders besonders?
              </AccordionTrigger>
              <AccordionContent>
                Wir kombinieren fortschrittliche technische Analyse mit KI-gestützter Entscheidungsfindung. 
                Unsere Plattform bietet einzigartige Features wie DeMark-Pivot-Analysen, Multi-Timeframe-Bestätigungen 
                und einen KI-Assistenten für fundierte Trading-Entscheidungen.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium">
                Wie genau sind die Pivot-Punkt-Berechnungen?
              </AccordionTrigger>
              <AccordionContent>
                Unsere Pivot-Punkte werden nach dem DeMark-Algorithmus berechnet, der sich besonders in 
                trendbehafteten Märkten bewährt hat. Die Berechnungen basieren auf historischen Daten 
                und werden in Echtzeit aktualisiert.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-medium">
                Kann ich die Plattform kostenlos testen?
              </AccordionTrigger>
              <AccordionContent>
                Ja, mit unserem kostenlosen Basis-Plan können Sie die grundlegenden Funktionen der Plattform 
                kennenlernen. Für Zugriff auf alle Features empfehlen wir den Pro-Plan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-medium">
                Welche Märkte werden unterstützt?
              </AccordionTrigger>
              <AccordionContent>
                Wir unterstützen eine breite Palette von Märkten, darunter Aktien, ETFs und Kryptowährungen. 
                Die Daten werden in Echtzeit bereitgestellt (Pro-Plan) oder mit 15 Minuten Verzögerung (Basis-Plan).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-medium">
                Gibt es Rabatte bei jährlicher Zahlung?
              </AccordionTrigger>
              <AccordionContent>
                Ja, bei jährlicher Zahlung erhalten Sie einen Rabatt von 15% gegenüber der monatlichen Zahlungsweise. 
                Dies entspricht einer Ersparnis von 88€ pro Jahr.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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