import { NextResponse } from "next/server";
import { getSubscriptionPlan } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

export interface RequireSubscriptionOptions {
  requirePro?: boolean;
  redirectTo?: string;
}

const defaultOptions: RequireSubscriptionOptions = {
  requirePro: true,
  redirectTo: "/pricing",
};

export async function requireSubscription(
  request: NextRequest,
  options: RequireSubscriptionOptions = defaultOptions
) {
  const { requirePro, redirectTo } = { ...defaultOptions, ...options };
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const subscription = await getSubscriptionPlan(userId);

    if (requirePro && !subscription.isPro) {
      if (redirectTo) {
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }

      return NextResponse.json(
        {
          error: "Pro-Abonnement erforderlich",
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 }
      );
    }

    // Füge Subscription-Informationen zum Request-Header hinzu
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-subscription-plan", subscription.isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE);

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
export function getSubscriptionPlanFromHeaders(headers: Headers): string {
  return headers.get("x-subscription-plan") || SUBSCRIPTION_PLANS.FREE;
}