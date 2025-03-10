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
    lookup_key: 'pro_monthly',
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
    lookup_key: 'pro_yearly',
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
  collectPaymentMethod?: boolean
}

export const createCheckoutSession = async ({
  customerId,
  priceId,
  userId,
  mode = 'subscription',
  successUrl,
  cancelUrl,
  trialDays = 4,
  collectPaymentMethod = true
}: CreateCheckoutSessionParams) => {
  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    trial_period_days: trialDays,
    metadata: { userId }
  };

  if (collectPaymentMethod) {
    subscriptionData.trial_settings = {
      end_behavior: {
        missing_payment_method: 'cancel'
      }
    };
  }

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_collection: collectPaymentMethod ? 'always' : 'if_required',
    subscription_data: subscriptionData,
    metadata: { userId }
  };

  return await stripe.checkout.sessions.create(sessionConfig);
}

export const createCustomerPortalSession = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })
  return session
}

interface SubscriptionPlan {
  isPro: boolean;
  subscription?: Stripe.Subscription;
}

export async function getSubscriptionPlan(userId: string): Promise<SubscriptionPlan> {
  try {
    // Suche Customer anhand der Clerk User ID
    const customers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${userId}'`,
      expand: ['data.subscriptions']
    });

    const customer = customers.data[0];
    
    if (!customer) {
      return {
        isPro: false,
        subscription: undefined
      };
    }

    // Finde aktive oder trial Subscription
    const subscription = customer.subscriptions?.data.find(sub => 
      sub.status === 'active' || 
      sub.status === 'trialing'
    );

    const isPro = !!subscription && (
      subscription.status === 'active' || 
      (subscription.status === 'trialing' && 
       subscription.trial_end != null && 
       subscription.trial_end * 1000 > Date.now())
    );

    return {
      isPro,
      subscription: subscription || undefined
    };
  } catch (error) {
    console.error('Fehler beim Abrufen des Abonnements:', error);
    return {
      isPro: false,
      subscription: undefined
    };
  }
}