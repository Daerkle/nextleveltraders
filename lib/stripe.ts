import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY ist nicht definiert')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
  typescript: true,
})

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