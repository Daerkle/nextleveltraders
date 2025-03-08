"use client"

import { UserProfile } from "./profile"

export default function SettingsPage() {
  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground text-lg">
          Verwalte dein Profil und Abonnement
        </p>
      </div>

      <UserProfile />
    </div>
  )
}
