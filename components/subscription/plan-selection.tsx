"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { FEATURES, PLANS, SUBSCRIPTION_PLANS } from "@/config/subscriptions"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price / 100)
}

export function PlanSelection() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: SUBSCRIPTION_PLANS.PRO,
        }),
      })
      
      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error("Fehler beim Erstellen der Checkout-Session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Basis Plan</CardTitle>
                <CardDescription>Perfekt zum Kennenlernen der Plattform</CardDescription>
              </div>
              <Badge variant="secondary" className="ml-2">
                Kostenlos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(FEATURES).map(([key, value]) => (
                <li key={key} className="flex items-center">
                  {value.free ? (
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 mr-2 text-red-500" />
                  )}
                  <span>{typeof value.free === "string" ? value.free : "Nicht verfügbar"}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Aktueller Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative overflow-hidden border-primary">
          <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-sm">
            4 Tage kostenlos testen
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pro Plan</CardTitle>
                <CardDescription>Vollständiger Zugriff auf alle Trading-Features</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatPrice(PLANS.pro.price)}</div>
                <div className="text-sm text-muted-foreground">pro Monat</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(FEATURES).map(([key, value]) => (
                <li key={key} className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>{value.pro}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading ? "Wird verarbeitet..." : "Jetzt upgraden"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Häufig gestellte Fragen</h2>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wie funktioniert die 4-tägige Testphase?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Nach dem Upgrade auf Pro kannst du alle Premium-Features 4 Tage lang kostenlos testen. 
                 Wenn du nicht zufrieden bist, kannst du jederzeit vor Ablauf der Testphase kündigen.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wann wird mir der Betrag berechnet?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Die erste Zahlung wird erst nach Ablauf der 4-tägigen Testphase fällig. 
                 Danach wird der Betrag monatlich automatisch abgebucht.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wie kann ich kündigen?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Du kannst dein Pro-Abonnement jederzeit in den Einstellungen oder über den Support kündigen. 
                 Nach der Kündigung behältst du noch bis zum Ende des bezahlten Zeitraums Zugriff auf alle Pro-Features.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}