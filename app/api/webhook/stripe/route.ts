import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export async function POST(request: Request) {
  const body = await request.text();
  const headerList = request.headers;
  const signature = headerList.get('stripe-signature');

  if (!signature) {
    return new Response('Keine Stripe-Signatur vorhanden', { status: 400 });
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Stripe Webhook Secret ist nicht konfiguriert');
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Speichere die Subscription-Informationen
        // Hier können wir z.B. die Pro-Features für den Benutzer aktivieren
        console.log(
          `Checkout completed for customer ${customerId}, subscription ${subscriptionId}`
        );
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        // Aktualisiere den Zahlungsstatus
        console.log(`Invoice paid for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        // Behandle fehlgeschlagene Zahlungen
        console.log(`Payment failed for customer ${customerId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Deaktiviere Pro-Features für den Benutzer
        console.log(`Subscription cancelled for customer ${customerId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        
        // Aktualisiere den Abonnement-Status
        console.log(
          `Subscription updated for customer ${customerId}, status: ${status}`
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response('Webhook verarbeitet', { status: 200 });
  } catch (error) {
    console.error('Fehler bei der Webhook-Verarbeitung:', error);

    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      return new Response('Ungültige Signatur', { status: 400 });
    }

    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}