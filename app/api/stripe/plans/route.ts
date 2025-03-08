import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  try {
    const prices = await stripe.prices.list({
      active: true,
      type: 'recurring',
      limit: 10,
      expand: ['data.product']
    })

    const plans = prices.data.map(price => {
      const product = price.product as { name: string, description: string, metadata: Record<string, string> }
      const features = (product.metadata.features || '').split(',').filter(Boolean)
      
      return {
        id: price.id,
        name: product.name,
        description: product.description,
        price: price.unit_amount || 0,
        currency: price.currency,
        interval: price.recurring?.interval || 'month',
        features: features,
      }
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching stripe plans:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}