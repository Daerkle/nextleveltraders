import { FEATURES } from "@/config/subscriptions"

export function useSubscriptionFeatures(isPro: boolean, isLoading: boolean) {
  const features = {
    watchlistLimit: isPro ? "Unbegrenzt" : "5 Symbole",
    realTimeData: isPro,
    aiAssistant: isPro,
    technicalAnalysis: isPro,
    pivotAnalysis: isPro,
    newsAccess: true,
    basicCharts: true,
  }

  return {
    features,
    isLoading,
  }
}
