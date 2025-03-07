import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/server";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        {
          plan: SUBSCRIPTION_PLANS.FREE,
          isTrialing: false,
          trialEndsAt: null,
          status: "inactive",
        },
        { status: 401 }
      );
    }

    const supabase = createClient();

    // Hole den Customer für den User
    const { data: customer } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (!customer?.stripe_customer_id) {
      return NextResponse.json({
        plan: SUBSCRIPTION_PLANS.FREE,
        isTrialing: false,
        trialEndsAt: null,
        status: "inactive",
      });
    }

    // Hole das aktive Abonnement
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("customer_id", customer.stripe_customer_id)
      .eq("status", "active")
      .single();

    if (!subscription) {
      return NextResponse.json({
        plan: SUBSCRIPTION_PLANS.FREE,
        isTrialing: false,
        trialEndsAt: null,
        status: "inactive",
      });
    }

    return NextResponse.json({
      plan: subscription.price_id === SUBSCRIPTION_PLANS.PRO ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE,
      isTrialing: subscription.trial_end ? new Date(subscription.trial_end) > new Date() : false,
      trialEndsAt: subscription.trial_end,
      status: subscription.status,
    });
  } catch (error) {
    console.error("Fehler beim Laden des Subscription-Status:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}
