import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY ist nicht definiert')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Free',
    description: 'Grundlegende Features für Einsteiger',
    price: 0,
    features: [
      'Basis Marktdaten',
      'Limitierte API Aufrufe',
      'Grundlegende Analyse Tools'
    ],
    priceId: process.env.STRIPE_FREE_PRICE_ID,
  },
  PRO: {
    name: 'Pro',
    description: 'Erweiterte Features für aktive Trader',
    price: 29.99,
    features: [
      'Erweiterte Marktdaten',
      'Unbegrenzte API Aufrufe',
      'Alle Analyse Tools',
      'Premium Support'
    ],
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  }
}

export const getStripeCustomer = async ({
  stripe,
  userId,
  email,
}: {
  stripe: Stripe
  userId: string
  email?: string
}) => {
  // Suche nach Kunden mit der entsprechenden user_id in den Metadaten
  const customers = await stripe.customers.search({
    query: `metadata['user_id']:'${userId}'`,
    limit: 1,
  })

  let customer = customers.data[0]

  if (!customer && email) {
    // Erstelle einen neuen Kunden, wenn keiner gefunden wurde
    customer = await stripe.customers.create({
      email,
      metadata: {
        user_id: userId,
      },
    })
  }

  return customer
}

export const getStripeSubscription = async ({
  stripe,
  subscriptionId,
}: {
  stripe: Stripe
  subscriptionId: string
}) => {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price'],
  })
}

export type StripeSubscriptionWithPrice = Awaited<
  ReturnType<typeof getStripeSubscription>
>

export const formatStripePrice = (price: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price / 100)
}

export const getSubscriptionPlan = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

export const createCustomerPortalSession = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  })
  return session
}