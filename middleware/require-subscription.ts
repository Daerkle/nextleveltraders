import { NextResponse } from "next/server";
import { getSubscriptionPlan } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

export interface RequireSubscriptionOptions {
  requirePro?: boolean;
  redirectTo?: string;
  allowTrial?: boolean;
}

const defaultOptions: RequireSubscriptionOptions = {
  requirePro: true,
  redirectTo: "/pricing",
  allowTrial: true,
};

export async function requireSubscription(
  request: NextRequest,
  options: RequireSubscriptionOptions = defaultOptions
) {
  const { requirePro, redirectTo, allowTrial } = { ...defaultOptions, ...options };
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const subscriptionData = await getSubscriptionPlan(userId);
    const { subscription, isPro } = subscriptionData;

    // Prüfe Trial-Status
    const isTrialing = subscription?.status === 'trialing';
    const trialEnded = subscription?.trial_end && subscription.trial_end * 1000 < Date.now();
    const hasPaymentMethod = subscription?.default_payment_method != null;

    // Wenn Trial beendet ist und keine Zahlungsmethode hinterlegt ist
    if (trialEnded && !hasPaymentMethod && request.nextUrl.pathname !== '/dashboard/billing') {
      return NextResponse.redirect(new URL('/dashboard/billing', request.url));
    }

    // Wenn Pro erforderlich ist
    if (requirePro) {
      // Erlaube Zugriff wenn:
      // 1. User ist Pro, oder
      // 2. Trial ist aktiv und erlaubt
      const hasAccess = isPro || (allowTrial && isTrialing && !trialEnded);

      if (!hasAccess) {
        if (redirectTo) {
          const redirectUrl = new URL(redirectTo, request.url);
          // Füge Query-Parameter für besseres UX hinzu
          if (trialEnded) {
            redirectUrl.searchParams.set('reason', 'trial_ended');
          } else if (!isPro) {
            redirectUrl.searchParams.set('reason', 'requires_pro');
          }
          return NextResponse.redirect(redirectUrl);
        }

        return NextResponse.json(
          {
            error: trialEnded ? "Trial-Zeitraum abgelaufen" : "Pro-Abonnement erforderlich",
            code: trialEnded ? "TRIAL_ENDED" : "SUBSCRIPTION_REQUIRED",
          },
          { status: 403 }
        );
      }
    }

    // Füge Subscription-Informationen zum Request-Header hinzu
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-subscription-plan", isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE);
    requestHeaders.set("x-subscription-trial", isTrialing ? "true" : "false");
    if (subscription?.trial_end) {
      requestHeaders.set("x-trial-end", subscription.trial_end.toString());
    }

    // Gib modifizierten Request mit Subscription-Informationen zurück
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Fehler beim Überprüfen des Abonnements:", error);
    
    return NextResponse.json(
      {
        error: "Fehler beim Überprüfen des Abonnements",
        code: "SUBSCRIPTION_CHECK_FAILED",
      },
      { status: 500 }
    );
  }
}

// Helper zum Extrahieren des Plans aus den Headers
export function getSubscriptionPlanFromHeaders(headers: Headers): {
  plan: string;
  isTrialing: boolean;
  trialEnd?: number;
} {
  return {
    plan: headers.get("x-subscription-plan") || SUBSCRIPTION_PLANS.FREE,
    isTrialing: headers.get("x-subscription-trial") === "true",
    trialEnd: headers.has("x-trial-end") 
      ? parseInt(headers.get("x-trial-end") || "0", 10)
      : undefined
  };
}