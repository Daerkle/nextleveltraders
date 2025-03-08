"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { formatCurrency } from "@/lib/utils"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  interval: string
  currency: string
  features: string[]
}

interface PlanSelectionProps {
  onPlanSelect?: (priceId: string) => void
  className?: string
}

export function PlanSelection({ onPlanSelect, className }: PlanSelectionProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const { isSignedIn } = useUser()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/stripe/plans')
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        console.error('Fehler beim Laden der Pläne:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleSelect = async (priceId: string) => {
    if (!isSignedIn) {
      window.location.href = '/sign-in'
      return
    }

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Fehler beim Erstellen der Checkout-Session:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Lädt Preise...</div>
  }

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
      {plans.map((plan) => (
        <Card key={plan.id} className="relative p-6">
          {plan.interval === 'year' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                15% Rabatt
              </span>
            </div>
          )}

          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">
                  {formatCurrency(plan.price / 100, plan.currency)}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  /{plan.interval}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                4 Tage kostenlose Testphase
              </p>
            </div>

            <div className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <GlowingEffect className="w-full">
                <Button
                  className="w-full"
                  onClick={() => handleSelect(plan.id)}
                >
                  {isSignedIn
                    ? 'Jetzt 4 Tage kostenlos testen'
                    : 'Jetzt registrieren'
                  }
                </Button>
              </GlowingEffect>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}