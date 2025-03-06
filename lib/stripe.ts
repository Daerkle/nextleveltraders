import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export async function getSubscriptionPlan(userId: string) {
  try {
    // Suche nach Kunden anhand der Metadaten
    const customers = await stripe.customers.search({
      query: `metadata["userId"]:"${userId}"`,
    });

    if (customers.data.length === 0) {
      return {
        hasSubscription: false,
        isPro: false,
      };
    }

    const customer = customers.data[0];

    // Hole aktive Abonnements
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      return {
        hasSubscription: false,
        isPro: false,
      };
    }

    const subscription = subscriptions.data[0];
    const price = subscription.items.data[0].price;
    const isProPlan = price.product === process.env.STRIPE_PRO_PRODUCT_ID;

    return {
      hasSubscription: true,
      isPro: isProPlan,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    };
  } catch (error) {
    console.error('Fehler beim Abrufen des Abonnements:', error);
    return {
      hasSubscription: false,
      isPro: false,
      error: 'Fehler beim Abrufen des Abonnements',
    };
  }
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: portalSession.url };
  } catch (error) {
    console.error('Fehler beim Erstellen der Portal-Session:', error);
    throw new Error('Fehler beim Erstellen der Portal-Session');
  }
}

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  const currencies = {
    USD: 100, // US cents
    EUR: 100, // Euro cents
    GBP: 100, // Penny sterling
    JPY: 1,   // Japanese yen doesn't use decimals
  };

  const multiplier = currencies[currency as keyof typeof currencies] || 100;
  return Math.round(amount * multiplier);
}

export function formatAmountFromStripe(
  amount: number,
  currency: string
): number {
  const currencies = {
    USD: 100,
    EUR: 100,
    GBP: 100,
    JPY: 1,
  };

  const divider = currencies[currency as keyof typeof currencies] || 100;
  return Math.round((amount / divider) * 100) / 100;
}

export const PLANS = {
  PRO: {
    name: 'NextLevelTraders Pro',
    description: 'Vollständiger Zugriff auf alle Trading-Features',
    features: [
      'Erweiterte Pivot-Analysen',
      'Echtzeit-Daten',
      'KI-Trading-Assistent',
      'Multi-Timeframe-Analysen',
      'Unbegrenzte Watchlists',
      'API-Zugang',
      'Prioritäts-Support',
    ],
    price: 29.00,
    interval: 'month' as const,
    currency: 'EUR',
  },
};