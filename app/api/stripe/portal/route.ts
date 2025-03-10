import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe, createCustomerPortalSession } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const authData = await auth();
    const user = await currentUser();

    if (!authData.userId || !user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Suche existierenden Customer oder erstelle einen neuen
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: user.emailAddresses[0]?.emailAddress,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Erstelle neuen Customer
      customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName || undefined,
        metadata: {
          clerkUserId: authData.userId,
        },
      });
    }

    const session = await createCustomerPortalSession(customer.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Portal-Session" },
      { status: 500 }
    );
  }
}