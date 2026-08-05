import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const SALES_TAX_RATE = 0.0925;
const MAX_LINE_ITEMS = 99;

interface CheckoutItem {
  id: string;
  name: string;
  option?: string;
  price: number;
  quantity: number;
}

interface CheckoutRequestBody {
  items?: CheckoutItem[];
  customerEmail?: string;
}

function isValidItem(item: CheckoutItem): boolean {
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    Number.isFinite(item.price) &&
    item.price > 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= 99
  );
}

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local.",
        },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const body = (await request.json()) as CheckoutRequestBody;
    const items = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (items.length > MAX_LINE_ITEMS) {
      return NextResponse.json(
        { error: "Your cart contains too many separate items." },
        { status: 400 }
      );
    }

    if (!items.every(isValidItem)) {
      return NextResponse.json(
        { error: "One or more cart items are invalid." },
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        const description = item.option?.trim();

        return {
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: item.name.slice(0, 120),
              ...(description
                ? {
                    description: description.slice(0, 500),
                  }
                : {}),
            },
          },
        };
      });

    const subtotalInCents = items.reduce(
      (total, item) =>
        total + Math.round(item.price * 100) * item.quantity,
      0
    );

    const taxInCents = Math.round(
      subtotalInCents * SALES_TAX_RATE
    );

    if (taxInCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: taxInCents,
          product_data: {
            name: "Sales Tax (9.25%)",
          },
        },
      });
    }

    const origin =
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const customerEmail =
      typeof body.customerEmail === "string" &&
      body.customerEmail.trim().length > 0
        ? body.customerEmail.trim()
        : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      customer_email: customerEmail,
      billing_address_collection: "auto",
      allow_promotion_codes: false,
      metadata: {
        bakery: "Sweet Tey's Pastries",
        subtotal_in_cents: String(subtotalInCents),
        tax_in_cents: String(taxInCents),
        sales_tax_rate: "9.25%",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      {
        error:
          "We could not start Stripe Checkout. Please try again.",
      },
      { status: 500 }
    );
  }
}