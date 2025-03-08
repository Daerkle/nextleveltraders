import { FEATURES } from "@/config/subscriptions"

export type FeatureKey =
  | 'watchlistLimit'
  | 'realTimeData'
  | 'aiAssistant'
  | 'technicalAnalysis'
  | 'pivotAnalysis'
  | 'newsAccess'
  | 'basicCharts'
  | 'ai_analysis';

export function useSubscriptionFeatures(isPro: boolean = false, isLoading: boolean = false) {
  const features = {
    watchlistLimit: isPro ? "Unbegrenzt" : "5 Symbole",
    realTimeData: isPro,
    aiAssistant: isPro,
    technicalAnalysis: isPro,
    pivotAnalysis: isPro,
    newsAccess: true,
    basicCharts: true,
    ai_analysis: isPro
  };

  const hasFeature = (key: FeatureKey): boolean => {
    if (key === 'watchlistLimit') {
      return true; // Always has a limit, just different values
    }
    return features[key] === true;
  };

  return {
    features,
    isLoading,
    hasFeature
  };
}
