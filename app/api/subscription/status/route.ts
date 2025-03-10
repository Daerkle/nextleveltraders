import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe, getSubscriptionPlan } from "@/lib/stripe";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authData = await auth();
    const user = await currentUser();

    if (!authData.userId || !user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Suche existierenden Customer oder erstelle einen neuen
    let customer;
    const customers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${authData.userId}'`,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      // Erstelle neuen Customer
      customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName || undefined,
        metadata: {
          clerkUserId: authData.userId,
        },
      });
    }

    // Hole Subscription Details
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      expand: ['data.default_payment_method', 'data.plan']
    });

    // Finde aktive oder trial Subscription
    const subscription = subscriptions.data.find(sub => 
      sub.status === 'active' || 
      sub.status === 'trialing'
    );

    const isPro = !!subscription && (
      subscription.status === 'active' || 
      (subscription.status === 'trialing' && 
       subscription.trial_end != null && 
       subscription.trial_end * 1000 > Date.now())
    );

    return NextResponse.json({
      plan: isPro ? SUBSCRIPTION_PLANS.PRO : SUBSCRIPTION_PLANS.FREE,
      status: subscription?.status || "inactive",
      isTrialing: subscription?.status === "trialing",
      trialEndsAt: subscription?.trial_end 
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      subscription,
      customerId: customer.id
    });
  } catch (error) {
    console.error("Subscription Status Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen des Subscription-Status" },
      { status: 500 }
    );
  }
}
