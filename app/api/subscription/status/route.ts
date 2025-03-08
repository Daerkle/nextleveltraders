import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from 'stripe';
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
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

    // Search for customer by userId in metadata
    const customers = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
    });

    // If no customer found
    if (customers.data.length === 0) {
      return NextResponse.json({
        plan: SUBSCRIPTION_PLANS.FREE,
        isTrialing: false,
        trialEndsAt: null,
        status: "inactive",
      });
    }

    const customer = customers.data[0];

    // Get active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
    });

    // If no active subscriptions found
    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        plan: SUBSCRIPTION_PLANS.FREE,
        isTrialing: false,
        trialEndsAt: null,
        status: "inactive",
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0]?.price.id;

    return NextResponse.json({
      plan: priceId === SUBSCRIPTION_PLANS.PRO ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE,
      isTrialing: subscription.trial_end ? new Date(subscription.trial_end * 1000) > new Date() : false,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
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
