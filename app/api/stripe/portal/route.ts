import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createCustomerPortalSession } from "@/lib/stripe";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { returnUrl } = await request.json();

    if (!returnUrl) {
      return NextResponse.json(
        { error: "Return-URL ist erforderlich" },
        { status: 400 }
      );
    }

    // Suche nach dem Stripe-Kunden für diesen Benutzer
    const customers = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: "Kein Stripe-Kunde gefunden" },
        { status: 404 }
      );
    }

    const customer = customers.data[0];

    // Erstelle eine Portal-Session
    const { url } = await createCustomerPortalSession(
      customer.id,
      returnUrl
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Fehler beim Erstellen der Portal-Session:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Suche nach dem Stripe-Kunden für diesen Benutzer
    const customers = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        hasCustomer: false,
      });
    }

    const customer = customers.data[0];

    // Hole aktive Abonnements
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    return NextResponse.json({
      hasCustomer: true,
      customerId: customer.id,
      customer: {
        email: customer.email,
        name: customer.name,
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          defaultPaymentMethod: sub.default_payment_method,
        })),
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Kundeninformationen:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}