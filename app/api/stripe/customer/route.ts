import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
  typescript: true,
});

const PRO_PRODUCT_ID = process.env.STRIPE_PRO_PRODUCT_ID;

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Suche nach Kunden anhand der Metadaten
    const customers = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
    });

    // Wenn kein Kunde gefunden wurde
    if (customers.data.length === 0) {
      return NextResponse.json({
        hasSubscription: false,
        subscriptionStatus: null,
        currentPeriodEnd: null,
      });
    }

    const customer = customers.data[0];

    // Hole alle aktiven Abonnements des Kunden
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    // Wenn keine aktiven Abonnements gefunden wurden
    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        customerId: customer.id,
        hasSubscription: false,
        subscriptionStatus: null,
        currentPeriodEnd: null,
      });
    }

    const subscription = subscriptions.data[0];
    const price = subscription.items.data[0].price;
    
    // Überprüfe, ob es sich um ein Pro-Abonnement handelt
    const isProSubscription = price.product === PRO_PRODUCT_ID;

    return NextResponse.json({
      customerId: customer.id,
      hasSubscription: true,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      isPro: isProSubscription,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      paymentMethod: subscription.default_payment_method,
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Kundeninformationen:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    // Suche nach Kunden anhand der Metadaten
    const customers = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'Kunde nicht gefunden' },
        { status: 404 }
      );
    }

    const customer = customers.data[0];
    
    // Hole aktive Abonnements
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'Kein aktives Abonnement gefunden' },
        { status: 404 }
      );
    }

    const subscription = subscriptions.data[0];

    switch (action) {
      case 'cancel': {
        // Kündige das Abonnement zum Ende der Periode
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        });
        break;
      }
      case 'reactivate': {
        // Reaktiviere ein gekündigtes Abonnement
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: false,
        });
        break;
      }
      default:
        return NextResponse.json(
          { error: 'Ungültige Aktion' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: 'Abonnement erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Abonnements:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}