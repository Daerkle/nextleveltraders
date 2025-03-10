import { UserProfile } from "./profile"

export const metadata = {
  title: "Einstellungen | NextLevelTraders",
  description: "Verwalten Sie Ihr Profil und Abonnement",
}

export default function SettingsPage() {
  return (
    <div className="container max-w-6xl py-6">
      <UserProfile />
    </div>
  )
}
