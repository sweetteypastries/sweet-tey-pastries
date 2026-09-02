import Stripe from "stripe";
import { createAdminClient } from "@/components/supabase/admin";
import {
  escapeHtml,
  sendTransactionalEmail,
} from "@/lib/email";

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


  async function awardRewards(orderId: string) {
    if (!customerEmail) {
      return 0;
    }

    const normalizedEmail =
      customerEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      return 0;
    }

    let isRewardsMember =
      checkoutDetails?.join_rewards === true;

    if (!isRewardsMember) {
      const {
        data: existingRewardAccount,
        error: rewardAccountError,
      } = await supabase
        .from("reward_accounts")
        .select("email")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (rewardAccountError) {
        console.error(
          "REWARD_ACCOUNT_LOOKUP_ERROR",
          rewardAccountError
        );

        throw rewardAccountError;
      }

      isRewardsMember =
        Boolean(existingRewardAccount);
    }

    if (!isRewardsMember) {
      return 0;
    }

    const eligibleSubtotalCents =
      Math.max(
        0,
        (session.amount_subtotal ?? 0) -
          Number(
            checkoutDetails?.delivery_fee_amount ?? 0
          ) -
          Number(
            checkoutDetails?.shipping_fee_amount ?? 0
          ) -
          Number(
            checkoutDetails?.tip_amount ?? 0
          )
      );

    const points =
      Math.floor(
        eligibleSubtotalCents / 100
      );

    if (points <= 0) {
      return 0;
    }

    const {
      data: pointsAwarded,
      error: rewardError,
    } = await supabase.rpc(
      "award_purchase_points",
      {
        p_email: normalizedEmail,
        p_customer_name:
          customerName ?? "",
        p_order_id: orderId,
        p_stripe_session_id:
          session.id,
        p_points: points,
      }
    );

    if (rewardError) {
      console.error(
        "REWARDS_AWARD_ERROR",
        rewardError
      );

      throw rewardError;
    }

    console.log(
      pointsAwarded
        ? "REWARDS_AWARDED"
        : "REWARDS_ALREADY_AWARDED",
      normalizedEmail,
      points
    );

    return points;
  }

  async function sendPaymentConfirmation(
    orderId: string,
    pointsEarned: number
  ) {
    if (!customerEmail) {
      return;
    }

    const safeName = escapeHtml(
      customerName || "Sweet Tey's customer"
    );

    const totalPaid = new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: (
          session.currency ?? "usd"
        ).toUpperCase(),
      }
    ).format(
      (session.amount_total ?? 0) / 100
    );

    const rewardsSection =
      pointsEarned > 0
        ? `
          <div style="margin-top:24px;padding:18px;border-radius:14px;background:#fff1f5;">
            <strong style="color:#4b3428;">Sweet Rewards</strong>
            <p style="margin:8px 0 0;color:#6b5548;">
              You earned <strong>${pointsEarned}</strong> Sweet Rewards points from this purchase.
            </p>
          </div>
        `
        : "";

    try {
      const emailId =
        await sendTransactionalEmail({
          to: customerEmail,
          subject:
            "Payment received — Sweet Tey's Pastries",
          idempotencyKey:
            `payment-confirmation-${session.id}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#4b3428;">
              <h1 style="color:#ed6f91;">Payment received 💕</h1>

              <p>Hi ${safeName},</p>

              <p>
                Thank you for your order from Sweet Tey's Pastries.
                Your payment was received successfully and your order is now in our system.
              </p>

              <div style="margin:24px 0;padding:18px;border:1px solid #f4c8d5;border-radius:14px;">
                <p style="margin:0 0 8px;">
                  <strong>Order:</strong> ${escapeHtml(orderId)}
                </p>

                <p style="margin:0;">
                  <strong>Total paid:</strong> ${escapeHtml(totalPaid)}
                </p>
              </div>

              ${rewardsSection}

              <p style="margin-top:24px;">
                We'll send another email when your order status changes.
              </p>

              <p>
                With love,<br />
                <strong>Sweet Tey's Pastries</strong>
              </p>
            </div>
          `,
        });

      console.log(
        "PAYMENT_CONFIRMATION_EMAIL_SENT",
        orderId,
        emailId
      );
    } catch (error) {
      console.error(
        "PAYMENT_CONFIRMATION_EMAIL_ERROR",
        orderId,
        error
      );
    }
  }

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

    const pointsEarned =
      await awardRewards(
        updatedOrder.id
      );

    await sendPaymentConfirmation(
      updatedOrder.id,
      pointsEarned
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

  const pointsEarned =
    await awardRewards(
      insertedOrder.id
    );

  await sendPaymentConfirmation(
    insertedOrder.id,
    pointsEarned
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
