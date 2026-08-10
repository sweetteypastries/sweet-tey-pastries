import Stripe from "stripe";
import { createAdminClient } from "@/components/supabase/admin";

export const runtime = "nodejs";

type CheckoutDetails = {
  id: string;
  customer_email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  birthday: string | null;
  order_type: string | null;
  street_address: string | null;
  city: string | null;
  postal_code: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  special_instructions: string | null;
  occasion: string | null;
  gift_message: string | null;
  delivery_fee_amount: number;
  shipping_fee_amount: number;
  tip_amount: number;
  tip_percent: number;
  join_rewards: boolean;
  email_updates: boolean;
  text_updates: boolean;
};

function getPaymentIntentId(
  paymentIntent:
    | string
    | Stripe.PaymentIntent
    | null
): string | null {
  if (!paymentIntent) {
    return null;
  }

  if (typeof paymentIntent === "string") {
    return paymentIntent;
  }

  return paymentIntent.id;
}

async function loadCheckoutDetails(
  session: Stripe.Checkout.Session
): Promise<CheckoutDetails | null> {
  const supabase = createAdminClient();

  const columns = `
    id,
    customer_email,
    first_name,
    last_name,
    phone,
    birthday,
    order_type,
    street_address,
    city,
    postal_code,
    preferred_date,
    preferred_time,
    special_instructions,
    occasion,
    gift_message,
    delivery_fee_amount,
    shipping_fee_amount,
    tip_amount,
    tip_percent,
    join_rewards,
    email_updates,
    text_updates
  `;

  const checkoutDetailsId =
    session.metadata?.checkout_details_id ?? null;

  if (checkoutDetailsId) {
    const { data, error } = await supabase
      .from("checkout_details")
      .select(columns)
      .eq("id", checkoutDetailsId)
      .maybeSingle();

    if (error) {
      console.error(
        "CHECKOUT_DETAILS_BY_ID_ERROR",
        error
      );
    }

    if (data) {
      console.log(
        "CHECKOUT_DETAILS_FOUND_BY_ID",
        checkoutDetailsId
      );

      return data as CheckoutDetails;
    }
  }

  const { data, error } = await supabase
    .from("checkout_details")
    .select(columns)
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (error) {
    console.error(
      "CHECKOUT_DETAILS_BY_SESSION_ERROR",
      error
    );
  }

  if (data) {
    console.log(
      "CHECKOUT_DETAILS_FOUND_BY_SESSION",
      session.id
    );

    return data as CheckoutDetails;
  }

  console.warn(
    "CHECKOUT_DETAILS_NOT_FOUND",
    session.id
  );

  return null;
}

async function savePaidOrder(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  const supabase = createAdminClient();

  console.log(
    "ORDER_SAVE_BEGIN",
    session.id,
    session.payment_status
  );

  const checkoutDetails =
    await loadCheckoutDetails(session);

  const checkoutDetailsId =
    checkoutDetails?.id ??
    session.metadata?.checkout_details_id ??
    null;

  const lineItems =
    await stripe.checkout.sessions.listLineItems(
      session.id,
      {
        limit: 100,
      }
    );

  const items = lineItems.data.map(
    (item) => ({
      name:
        item.description ??
        "Bakery item",

      description:
        item.description ??
        "Bakery item",

      quantity:
        item.quantity ?? 1,

      amount_subtotal:
        item.amount_subtotal,

      amount_total:
        item.amount_total,

      currency:
        item.currency,
    })
  );

  const firstName =
    checkoutDetails?.first_name?.trim() ?? "";

  const lastName =
    checkoutDetails?.last_name?.trim() ?? "";

  const checkoutName =
    [firstName, lastName]
      .filter(Boolean)
      .join(" ");

  const customerName =
    checkoutName ||
    session.customer_details?.name ||
    null;

  const customerEmail =
    checkoutDetails?.customer_email ||
    session.customer_details?.email ||
    session.customer_email ||
    null;

  const {
    data: existingOrder,
    error: lookupError,
  } = await supabase
    .from("orders")
    .select(
      "id, fulfillment_status"
    )
    .eq(
      "stripe_session_id",
      session.id
    )
    .maybeSingle();

  if (lookupError) {
    console.error(
      "ORDER_LOOKUP_ERROR",
      lookupError
    );

    throw lookupError;
  }

  const fulfillmentStatus =
    existingOrder?.fulfillment_status ??
    "new";

  const orderRecord = {
    stripe_session_id:
      session.id,

    stripe_payment_intent_id:
      getPaymentIntentId(
        session.payment_intent
      ),

    checkout_details_id:
      checkoutDetailsId,

    customer_email:
      customerEmail,

    customer_name:
      customerName,

    customer_phone:
      checkoutDetails?.phone ??
      session.customer_details?.phone ??
      null,

    birthday:
      checkoutDetails?.birthday ??
      null,

    order_type:
      checkoutDetails?.order_type ??
      session.metadata?.order_type ??
      null,

    street_address:
      checkoutDetails?.street_address ??
      null,

    city:
      checkoutDetails?.city ??
      null,

    postal_code:
      checkoutDetails?.postal_code ??
      null,

    preferred_date:
      checkoutDetails?.preferred_date ??
      null,

    preferred_time:
      checkoutDetails?.preferred_time ??
      null,

    special_instructions:
      checkoutDetails?.special_instructions ??
      null,

    occasion:
      checkoutDetails?.occasion ??
      null,

    gift_message:
      checkoutDetails?.gift_message ??
      null,

    delivery_fee_amount:
      checkoutDetails?.delivery_fee_amount ??
      0,

    shipping_fee_amount:
      checkoutDetails?.shipping_fee_amount ??
      0,

    tip_amount:
      checkoutDetails?.tip_amount ??
      0,

    tip_percent:
      checkoutDetails?.tip_percent ??
      0,

    join_rewards:
      checkoutDetails?.join_rewards ??
      false,

    email_updates:
      checkoutDetails?.email_updates ??
      false,

    text_updates:
      checkoutDetails?.text_updates ??
      false,

    amount_total:
      session.amount_total ?? 0,

    currency:
      session.currency ?? "usd",

    payment_status:
      session.payment_status,

    fulfillment_status:
      fulfillmentStatus,

    items,

    paid_at:
      new Date().toISOString(),

    updated_at:
      new Date().toISOString(),
  };

  if (existingOrder) {
    const {
      data: updatedOrder,
      error: updateError,
    } = await supabase
      .from("orders")
      .update(orderRecord)
      .eq(
        "id",
        existingOrder.id
      )
      .select(
        "id, stripe_session_id"
      )
      .single();

    if (
      updateError ||
      !updatedOrder
    ) {
      console.error(
        "ORDER_UPDATE_ERROR",
        updateError
      );

      throw (
        updateError ??
        new Error(
          "Supabase did not confirm the order update."
        )
      );
    }

    console.log(
      "ORDER_UPDATE_OK",
      updatedOrder.id
    );

    return;
  }

  const {
    data: insertedOrder,
    error: insertError,
  } = await supabase
    .from("orders")
    .insert(orderRecord)
    .select(
      "id, stripe_session_id"
    )
    .single();

  if (
    insertError ||
    !insertedOrder
  ) {
    console.error(
      "ORDER_INSERT_ERROR",
      insertError
    );

    throw (
      insertError ??
      new Error(
        "Supabase did not confirm the new order."
      )
    );
  }

  console.log(
    "ORDER_INSERT_OK",
    insertedOrder.id,
    insertedOrder.stripe_session_id
  );
}

export async function POST(
  request: Request
) {
  const stripeSecretKey =
    process.env.STRIPE_SECRET_KEY;

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (
    !stripeSecretKey ||
    !webhookSecret
  ) {
    console.error(
      "WEBHOOK_ENV_MISSING"
    );

    return new Response(
      "Stripe webhook is not configured.",
      {
        status: 500,
      }
    );
  }

  const stripe =
    new Stripe(stripeSecretKey);

  const signature =
    request.headers.get(
      "stripe-signature"
    );

  if (!signature) {
    return new Response(
      "Missing Stripe signature.",
      {
        status: 400,
      }
    );
  }

  const body =
    await request.text();

  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "WEBHOOK_SIGNATURE_ERROR",
      error
    );

    return new Response(
      "Invalid Stripe signature.",
      {
        status: 400,
      }
    );
  }

  console.log(
    "WEBHOOK_EVENT",
    event.id,
    event.type
  );

  try {
    if (
      event.type ===
        "checkout.session.completed" ||
      event.type ===
        "checkout.session.async_payment_succeeded"
    ) {
      const eventSession =
        event.data.object as Stripe.Checkout.Session;

      const session =
        await stripe.checkout.sessions.retrieve(
          eventSession.id
        );

      console.log(
        "WEBHOOK_SESSION",
        session.id,
        "payment_status=",
        session.payment_status
      );

      if (
        session.payment_status !==
        "paid"
      ) {
        console.log(
          "WEBHOOK_SESSION_NOT_PAID",
          session.id
        );

        return new Response(
          "Payment has not completed yet.",
          {
            status: 200,
          }
        );
      }

      await savePaidOrder(
        stripe,
        session
      );

      console.log(
        "WEBHOOK_ORDER_COMPLETE",
        session.id
      );

      return new Response(
        "Order saved.",
        {
          status: 200,
        }
      );
    }

    console.log(
      "WEBHOOK_EVENT_IGNORED",
      event.type
    );

    return new Response(
      "Event ignored.",
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "WEBHOOK_PROCESSING_ERROR",
      error
    );

    return new Response(
      "Webhook processing failed.",
      {
        status: 500,
      }
    );
  }
}
