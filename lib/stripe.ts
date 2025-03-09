import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY ist nicht definiert')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
})

export const MONTHLY_PRICE = 4900 // 49€ in Cents
export const YEARLY_PRICE = Math.floor(MONTHLY_PRICE * 12 * 0.85) // 15% Rabatt

export const PLANS = {
  PRO: {
    name: 'NextLevelTraders Pro',
    description: 'Zugang zu allen Premium-Features',
    price: MONTHLY_PRICE,
    features: [
      'Erweiterte Pivot-Analysen',
      'Vollständige Chart-Funktionen',
      'Echtzeit-Daten',
      'KI-Trading-Assistent',
      'Multi-Timeframe-Analysen',
      'Unbegrenzte Watchlists',
      'Prioritäts-Support'
    ]
  }
}

export async function setupSubscriptionPlans() {
  // Pro Plan Produkt erstellen
  const product = await stripe.products.create({
    name: 'NextLevelTraders Pro',
    description: 'Zugang zu allen Premium-Features',
    metadata: {
      features: [
        'Unbegrenzte API Aufrufe',
        'Alle Trading Tools',
        'Premium Support',
        'Echtzeit-Marktdaten',
        'Erweiterte Analysetools',
        'Technische Indikatoren'
      ].join(',')
    }
  })

  // Monatlicher Preis
  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: MONTHLY_PRICE,
    currency: 'eur',
    recurring: {
      interval: 'month'
    },
    metadata: {
      type: 'monthly'
    }
  })

  // Jährlicher Preis
  const yearlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: YEARLY_PRICE,
    currency: 'eur',
    recurring: {
      interval: 'year'
    },
    metadata: {
      type: 'yearly'
    }
  })

  return {
    product,
    monthlyPrice,
    yearlyPrice
  }
}

export async function getSubscriptionPlans() {
  const prices = await stripe.prices.list({
    active: true,
    type: 'recurring',
    expand: ['data.product']
  })

  const plans = prices.data.map(price => {
    const product = price.product as Stripe.Product
    const features = product.metadata.features?.split(',') || []

    return {
      id: price.id,
      name: product.name,
      description: product.description || '',
      price: price.unit_amount || 0,
      interval: price.recurring?.interval || 'month',
      currency: price.currency,
      features,
      metadata: price.metadata
    }
  })

  return plans
}

interface CreateCheckoutSessionParams {
  customerId: string
  priceId: string
  userId: string
  mode?: Stripe.Checkout.Session.Mode
  successUrl: string
  cancelUrl: string
  trialDays?: number
}

export const createCheckoutSession = async ({
  customerId,
  priceId,
  userId,
  mode = 'subscription',
  successUrl,
  cancelUrl,
  trialDays = 4
}: CreateCheckoutSessionParams) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: trialDays,
      metadata: { userId }
    },
    metadata: { userId }
  })
}

export const createCustomerPortalSession = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  })
  return session
}

export async function getSubscriptionPlan(userId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: userId,
      status: 'active',
      expand: ['data.plan']
    });

    const subscription = subscriptions.data[0];
    const isPro = subscription?.status === 'active';

    return {
      ...subscription,
      isPro
    };
  } catch (error) {
    console.error('Fehler beim Abrufen des Abonnements:', error);
    return {
      isPro: false
    };
  }
}