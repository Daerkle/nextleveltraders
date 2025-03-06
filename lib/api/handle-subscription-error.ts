import { NextResponse } from "next/server";
import { SubscriptionError, isSubscriptionError } from "../errors/subscription-error";
import { ZodError } from "zod";
import { Stripe } from "stripe";

export function handleSubscriptionError(error: unknown) {
  console.error("Subscription error:", error);

  // Handle known subscription errors
  if (isSubscriptionError(error)) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Ungültige Anfragedaten",
        details: error.errors,
      },
      { status: 400 }
    );
  }

  // Handle Stripe errors
  if (error instanceof Stripe.errors.StripeError) {
    const status = error.statusCode || 500;
    let message = "Ein Fehler ist bei der Zahlungsverarbeitung aufgetreten";

    if (error instanceof Stripe.errors.StripeCardError) {
      message = "Die Kreditkarte wurde abgelehnt";
    } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      message = "Die Zahlungsdaten sind ungültig";
    } else if (error instanceof Stripe.errors.StripeRateLimitError) {
      message = "Zu viele Anfragen. Bitte versuchen Sie es später erneut";
    } else if (error instanceof Stripe.errors.StripeAuthenticationError) {
      message = "Authentifizierungsfehler bei der Zahlungsverarbeitung";
    } else if (error instanceof Stripe.errors.StripeAPIError) {
      message = "Ein Fehler ist bei der Zahlungsverarbeitung aufgetreten";
    }

    return NextResponse.json(
      {
        error: message,
        code: error.code,
      },
      { status }
    );
  }

  // Handle Clerk errors
  if (error instanceof Error && error.name === "ClerkError") {
    return NextResponse.json(
      {
        error: "Authentifizierungsfehler",
        message: error.message,
      },
      { status: 401 }
    );
  }

  // Handle unknown errors
  console.error("Unhandled error:", error);
  return NextResponse.json(
    {
      error: "Ein unerwarteter Fehler ist aufgetreten",
    },
    { status: 500 }
  );
}

export function createErrorResponse(error: SubscriptionError) {
  return NextResponse.json(
    {
      error: error.message,
      code: error.code,
      data: error.data,
    },
    { status: error.status }
  );
}

export function createSuccessResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}