import { create } from "zustand"
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions"
import type Stripe from "stripe"

type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "inactive";

interface SubscriptionStore {
  plan: typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS]
  isTrialing: boolean
  trialEndsAt: string | null
  status: SubscriptionStatus
  isPro: boolean
  isLoading: boolean
  dataDelay: number
  subscription?: Stripe.Subscription
  setPlan: (plan: typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS]) => void
  setTrialStatus: (isTrialing: boolean, trialEndsAt: string | null) => void
  setStatus: (status: SubscriptionStatus) => void
  setLoading: (isLoading: boolean) => void
  setSubscription: (subscription?: Stripe.Subscription) => void
}

export const useSubscription = create<SubscriptionStore>((set, get) => ({
  plan: SUBSCRIPTION_PLANS.FREE,
  isTrialing: false,
  trialEndsAt: null,
  status: "inactive",
  isPro: false,
  isLoading: true,
  dataDelay: 900, // 15 Minuten Standard-Verzögerung
  subscription: undefined,
  setPlan: (plan) => {
    const isPro = plan === SUBSCRIPTION_PLANS.PRO || get().isTrialing;
    const dataDelay = isPro ? 0 : 900; // 0 für Pro, 15 Minuten für Free
    
    // Setze die Verzögerung für die FMP API
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fmp_data_delay', String(dataDelay));
    }
    
    set({ plan, isPro, dataDelay });
  },
  setTrialStatus: (isTrialing, trialEndsAt) => {
    const isPro = isTrialing || get().plan === SUBSCRIPTION_PLANS.PRO;
    const dataDelay = isPro ? 0 : 900;
    
    // Setze die Verzögerung für die FMP API
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fmp_data_delay', String(dataDelay));
    }
    
    set({ isTrialing, trialEndsAt, isPro, dataDelay });
  },
  setStatus: (status) => set({ status }),
  setLoading: (isLoading) => set({ isLoading }),
  setSubscription: (subscription) => set({ subscription })
}))

// Formatiere das Trial-End-Datum
export function formatTrialEnd(date: string) {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// Berechne die verbleibenden Trial-Tage
export function getRemainingTrialDays(trialEndsAt: string) {
  const now = new Date()
  const endDate = new Date(trialEndsAt)
  const diffTime = Math.abs(endDate.getTime() - now.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Ermittle den Plan-Status Text
export function getPlanStatusText(status: string, isTrialing: boolean, trialEndsAt: string | null) {
  if (isTrialing && trialEndsAt) {
    const daysLeft = getRemainingTrialDays(trialEndsAt)
    return `Trial (noch ${daysLeft} Tage)`
  }

  switch (status) {
    case "active":
      return "Aktiv"
    case "canceled":
      return "Gekündigt"
    case "past_due":
      return "Zahlung überfällig"
    case "trialing":
      return "Trial"
    default:
      return "Inaktiv"
  }
}

// Ermittle die Farbe für den Status Badge
export function getPlanStatusColor(status: string): "default" | "secondary" | "destructive" {
  switch (status) {
    case "active":
      return "default"
    case "trialing":
      return "secondary"
    case "canceled":
    case "past_due":
      return "destructive"
    default:
      return "secondary"
  }
}