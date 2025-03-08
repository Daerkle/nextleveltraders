import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getURL } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()
    
    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 })
    }

    // Supabase Client erstellen
    const supabase = createClient(req) as any
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Preis überprüfen
    const price = await stripe.prices.retrieve(priceId)
    if (!price.active) {
      return new NextResponse("Price not available", { status: 400 })
    }

    // Customer finden oder erstellen
    const { data: customers } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let stripeCustomerId = customers?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })

      await supabase
        .from('customers')
        .insert({
          user_id: user.id,
          stripe_customer_id: customer.id,
        })

      stripeCustomerId = customer.id
    }

    // Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        user_id: user.id,
      },
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 4,
        metadata: {
          user_id: user.id,
        },
      },
      success_url: `${getURL()}/dashboard/settings?success=true`,
      cancel_url: `${getURL()}/dashboard/settings?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}