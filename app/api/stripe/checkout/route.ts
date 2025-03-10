import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe, createCheckoutSession } from "@/lib/stripe";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authData = await auth();
    const user = await currentUser();

    if (!authData.userId || !user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (plan !== SUBSCRIPTION_PLANS.PRO) {
      return NextResponse.json(
        { error: "Ungültiger Plan" },
        { status: 400 }
      );
    }

    // Suche existierenden Customer oder erstelle einen neuen
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: user.emailAddresses[0]?.emailAddress,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
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

    // Hole den aktiven Preis für den Pro Plan
    const prices = await stripe.prices.list({
      lookup_keys: ['pro_monthly'],
      active: true,
      limit: 1,
    });

    const priceId = prices.data[0]?.id;

    if (!priceId) {
      return NextResponse.json(
        { error: "Kein aktiver Preis gefunden" },
        { status: 400 }
      );
    }

    // Erstelle Checkout Session
    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      userId: authData.userId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      trialDays: 4,
      collectPaymentMethod: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Checkout-Session" },
      { status: 500 }
    );
  }
}