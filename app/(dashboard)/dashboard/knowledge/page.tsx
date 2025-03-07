"use client"

import { Gallery6 } from "./gallery6"
import { tradingBasicsData } from "./data/artikel-1"

export default function KnowledgePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Trading-Wissen</h1>
        <p className="text-muted-foreground">
          Entdecke umfassendes Trading-Wissen und verbessere deine Fähigkeiten
        </p>
      </div>

      {/* Trading Grundlagen Gallery */}
      <Gallery6 {...tradingBasicsData} />
    </div>
  )
}