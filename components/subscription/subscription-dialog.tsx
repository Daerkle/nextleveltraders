"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { FEATURES, PLANS, SUBSCRIPTION_PLANS } from "@/config/subscriptions"
import { useSubscription } from "@/hooks/use-subscription"
import { toast } from "sonner"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price / 100)
}

interface SubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { plan, isTrialing, trialEndsAt } = useSubscription()

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
          trial_days: 4, // 4-Tage Trial
        }),
      })
      
      if (!response.ok) {
        throw new Error('Checkout-Session konnte nicht erstellt werden')
      }
      
      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error("Fehler beim Erstellen der Checkout-Session:", error)
      toast.error("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Wähle deinen Plan</DialogTitle>
        </DialogHeader>
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
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={plan === SUBSCRIPTION_PLANS.FREE}
              >
                {plan === SUBSCRIPTION_PLANS.FREE ? 'Aktueller Plan' : 'Downgrade'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative overflow-hidden border-primary">
            {!isTrialing && plan !== SUBSCRIPTION_PLANS.PRO && (
              <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-sm">
                4 Tage kostenlos testen
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pro Plan</CardTitle>
                  <CardDescription>Vollständiger Zugriff auf alle Trading-Features</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatPrice(PLANS.pro.price)}</div>
                  <div className="text-sm text-muted-foreground">pro Monat</div>
                  {isTrialing && trialEndsAt && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Trial endet am {new Date(trialEndsAt).toLocaleDateString('de-DE')}
                    </div>
                  )}
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
                disabled={isLoading || (plan === SUBSCRIPTION_PLANS.PRO && !isTrialing)}
              >
                {isLoading ? "Wird verarbeitet..." : 
                 plan === SUBSCRIPTION_PLANS.PRO ? "Aktueller Plan" :
                 isTrialing ? "Jetzt upgraden" : "4 Tage kostenlos testen"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}