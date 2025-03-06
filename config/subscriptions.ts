export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  PRO: "pro",
} as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];

export const FEATURES = {
  pivotAnalysis: {
    free: "Basis Pivot-Punkt-Analyse",
    pro: "Erweiterte Pivot-Analysen",
  },
  marketData: {
    free: "15-Minuten verzögerte Daten",
    pro: "Echtzeit-Daten",
  },
  aiAssistant: {
    free: false,
    pro: "KI-Trading-Assistent",
  },
  multiTimeframe: {
    free: false,
    pro: "Multi-Timeframe-Analysen",
  },
  watchlists: {
    free: "1 Watchlist",
    pro: "Unbegrenzte Watchlists",
  },
  support: {
    free: "Community Support",
    pro: "Prioritäts-Support",
  },
} as const;

export const PLANS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    name: "Basis",
    description: "Perfekt zum Kennenlernen der Plattform",
    price: 0,
    features: Object.entries(FEATURES).map(([key, value]) => ({
      name: key,
      value: value.free,
    })),
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    name: "Pro",
    description: "Vollständiger Zugriff auf alle Trading-Features",
    price: 2900, // 29.00 EUR
    features: Object.entries(FEATURES).map(([key, value]) => ({
      name: key,
      value: value.pro,
    })),
  },
} as const;

export const LIMITATIONS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    maxWatchlists: 1,
    maxSymbolsPerWatchlist: 10,
    dataDelay: 900, // 15 minutes in seconds
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    maxWatchlists: Infinity,
    maxSymbolsPerWatchlist: Infinity,
    dataDelay: 0, // Real-time
  },
} as const;

export const FEATURE_FLAGS = {
  canAccessRealTimeData: (plan: SubscriptionPlan) => plan === SUBSCRIPTION_PLANS.PRO,
  canAccessAdvancedPivots: (plan: SubscriptionPlan) => plan === SUBSCRIPTION_PLANS.PRO,
  canAccessMultiTimeframe: (plan: SubscriptionPlan) => plan === SUBSCRIPTION_PLANS.PRO,
  canAccessAiAssistant: (plan: SubscriptionPlan) => plan === SUBSCRIPTION_PLANS.PRO,
  canCreateUnlimitedWatchlists: (plan: SubscriptionPlan) => plan === SUBSCRIPTION_PLANS.PRO,
  canAccessApi: (plan: SubscriptionPlan) => plan === SUBSCRIPTION_PLANS.PRO,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;