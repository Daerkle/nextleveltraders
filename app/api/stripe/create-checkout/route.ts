import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions"
import { getURL } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const plan = SUBSCRIPTION_PLANS.PRO

    // Supabase Client erstellen
    const supabase = createClient(req)

    // Aktuellen Benutzer holen
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Prüfen ob bereits ein aktives Abonnement besteht
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (subscription?.status === "active") {
      return new NextResponse("Already subscribed", { status: 400 })
    }

    // Stripe Customer ID aus der Datenbank holen oder neu erstellen
    let { data: customer } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!customer?.stripe_customer_id) {
      // Neuen Stripe Customer erstellen
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })

      // Customer in der Datenbank speichern
      await supabase.from("customers").insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomer.id,
      })

      customer = { stripe_customer_id: stripeCustomer.id }
    }

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      customer: customer.stripe_customer_id,
      mode: "subscription",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
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