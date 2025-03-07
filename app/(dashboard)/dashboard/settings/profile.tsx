'use client'

import { useUser, UserButton, SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, LogOut, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function UserProfile() {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()

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
              <h3 className="font-medium">Basic Plan</h3>
              <p className="text-sm text-muted-foreground">
                Dein aktuelles Abonnement
              </p>
            </div>
            <span className="text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 rounded-full px-2 py-1">
              Aktiv
            </span>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Enthaltene Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Basis Marktanalysen</li>
              <li>Watchlist (max. 5 Symbole)</li>
              <li>Tägliche News</li>
            </ul>
          </div>

          <Link href="/subscription" className="block">
            <Button variant="outline" className="w-full group">
              Abo verwalten
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
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
    </div>
  )
}
