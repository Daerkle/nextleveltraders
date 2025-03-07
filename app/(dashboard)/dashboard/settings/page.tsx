'use client'

import { UserProfile } from "./profile"
import { SettingsDialog } from "./settings-dialog"

export default function SettingsPage() {
  return (
    <div className="container max-w-3xl mx-auto py-6">
      <UserProfile />
    </div>
  )
}
