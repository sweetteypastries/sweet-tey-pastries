import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? ""
);

export async function POST(request: NextRequest) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "STRIPE_SECRET_KEY is missing from .env.local.",
      },
      { status: 500 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      {
        error:
          "STRIPE_WEBHOOK_SECRET is missing from .env.local.",
      },
      { status: 500 }
    );
  }

  const signature = request.headers.get(
    "stripe-signature"
  );

  if (!signature) {
    return NextResponse.json(
      {
        error: "Missing Stripe signature.",
      },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Invalid Stripe webhook signature.",
      },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log(
          "Stripe checkout completed:",
          {
            sessionId: session.id,
            customerEmail:
              session.customer_details?.email ??
              session.customer_email,
            paymentStatus: session.payment_status,
            amountTotal: session.amount_total,
            currency: session.currency,
          }
        );

        /*
          Next step:
          Save this paid order to a database.

          Important:
          Make this operation idempotent by using
          session.id as a unique order identifier.
        */

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log(
          "Delayed Stripe payment succeeded:",
          session.id
        );

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.warn(
          "Delayed Stripe payment failed:",
          session.id
        );

        break;
      }

      default: {
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "The webhook was verified but could not be processed.",
      },
      { status: 500 }
    );
  }
}