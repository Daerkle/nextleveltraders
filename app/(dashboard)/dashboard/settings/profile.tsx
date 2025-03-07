'use client'

import { useUser, UserButton, SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, LogOut, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubscriptionDialog } from "@/components/subscription/subscription-dialog"
import { Badge } from "@/components/ui/badge"
import { useSubscription, getPlanStatusText, getPlanStatusColor } from "@/hooks/use-subscription"
import { PLANS, SUBSCRIPTION_PLANS } from "@/config/subscriptions"

export function UserProfile() {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false)
  const { plan, status, isTrialing, trialEndsAt } = useSubscription()

  const statusText = getPlanStatusText(status, isTrialing, trialEndsAt)
  const statusColor = getPlanStatusColor(status)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Profil Einstellungen</CardTitle>
          <CardDescription>
            Verwalte dein Profil und Einstellungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-16 h-16"
                }
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">
                {user?.fullName || 'Kein Name'}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {user?.emailAddresses?.[0]?.emailAddress || 'Keine E-Mail'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>
            Dein aktuelles Abonnement und Optionen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{PLANS[plan].name}</h3>
              <p className="text-sm text-muted-foreground">
                {isTrialing && trialEndsAt ? 
                  `Trial endet am ${new Date(trialEndsAt).toLocaleDateString('de-DE')}` : 
                  'Dein aktuelles Abonnement'
                }
              </p>
            </div>
            <Badge variant={statusColor}>
              {statusText}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Enthaltene Features:</p>
            <ul className="list-disc list-inside space-y-1">
              {PLANS[plan].features.map(feature => (
                <li key={feature.name}>{feature.value}</li>
              ))}
            </ul>
          </div>

          <Button 
            variant="outline" 
            className="w-full group"
            onClick={() => setIsSubscriptionDialogOpen(true)}
          >
            {plan === SUBSCRIPTION_PLANS.PRO ? 'Abonnement verwalten' : 'Upgrade auf Pro'}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Einstellungen</CardTitle>
          <CardDescription>
            Passe die App an deine Bedürfnisse an
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Erscheinungsbild</h3>
              <p className="text-sm text-muted-foreground">
                Wähle zwischen Light und Dark Mode
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          <Separator />

          {/* Sign Out Button */}
          <SignOutButton>
            <Button variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </SignOutButton>
        </CardContent>
      </Card>

      {/* Subscription Dialog */}
      <SubscriptionDialog 
        open={isSubscriptionDialogOpen} 
        onOpenChange={setIsSubscriptionDialogOpen} 
      />
    </div>
  )
}
