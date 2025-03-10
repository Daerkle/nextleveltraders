'use client'

import { useUser, UserButton, SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSubscriptionContext } from "@/components/subscription/subscription-provider"
import { SubscriptionDetails } from "@/components/subscription/subscription-details"
import { TrialCountdown } from "@/components/subscription/trial-countdown"
import { useEffect, useState } from "react"

export function UserProfile() {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const { isPro, isTrialing } = useSubscriptionContext()
  const [mounted, setMounted] = useState(false)

  // Nach dem Mount setzen, um Hydration Mismatch zu vermeiden
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-6">
      {/* Profile Card */}
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

      {/* Trial Warning */}
      {isTrialing && <TrialCountdown />}

      {/* Subscription Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Abonnement & Rechnungen</CardTitle>
          <CardDescription>
            Verwalten Sie Ihr Abonnement und sehen Sie Ihre Rechnungen ein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionDetails />
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Einstellungen</CardTitle>
          <CardDescription>
            Passe die App an deine Bedürfnisse an
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Erscheinungsbild</h3>
              <p className="text-sm text-muted-foreground">
                Wähle zwischen Light und Dark Mode
              </p>
            </div>
            {mounted && (
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
            )}
          </div>

          <Separator />

          {/* Pro Badge */}
          {isPro && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Account Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Sie haben Zugriff auf alle Pro-Features
                  </p>
                </div>
                <Badge variant="default" className="text-sm">
                  PRO
                </Badge>
              </div>
              <Separator />
            </>
          )}

          {/* Sign Out Button */}
          <SignOutButton>
            <Button variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </SignOutButton>
        </CardContent>
      </Card>
    </div>
  )
}
