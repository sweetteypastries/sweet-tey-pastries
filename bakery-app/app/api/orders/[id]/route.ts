import { NextResponse } from "next/server";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";
import {
  escapeHtml,
  sendTransactionalEmail,
} from "@/lib/email";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses = new Set([
  "new",
  "baking",
  "ready",
  "completed",
  "cancelled",
]);

function getStatusMessage(
  status: string,
  orderType: string | null
) {
  if (status === "baking") {
    return {
      subject:
        "Your Sweet Tey's order is being prepared",
      heading: "We're working on your order 💕",
      message:
        "Your order is now being prepared by Sweet Tey's Pastries.",
    };
  }

  if (status === "ready") {
    if (orderType === "pickup") {
      return {
        subject:
          "Your Sweet Tey's order is ready for pickup",
        heading: "Your order is ready! 🎉",
        message:
          "Your Sweet Tey's order is ready for pickup.",
      };
    }

    if (orderType === "shipping") {
      return {
        subject:
          "Your Sweet Tey's order is ready to ship",
        heading: "Your order is ready 📦",
        message:
          "Your order is ready for the next step in shipping.",
      };
    }

    return {
      subject:
        "Your Sweet Tey's order is ready",
      heading: "Your order is ready! 🎉",
      message:
        "Your order is ready for the next step in delivery.",
    };
  }

  if (status === "completed") {
    return {
      subject:
        "Your Sweet Tey's order is complete",
      heading: "Order complete 💕",
      message:
        "Your Sweet Tey's order has been marked complete. Thank you for supporting our bakery!",
    };
  }

  if (status === "cancelled") {
    return {
      subject:
        "Update about your Sweet Tey's order",
      heading: "Your order was cancelled",
      message:
        "Your Sweet Tey's order has been marked cancelled. Please contact us if you have any questions.",
    };
  }

  return null;
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    const body = (await request.json()) as {
      fulfillmentStatus?: unknown;
    };

    if (
      typeof body.fulfillmentStatus !== "string" ||
      !allowedStatuses.has(body.fulfillmentStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid fulfillment status." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .update({
        fulfillment_status:
          body.fulfillmentStatus,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        id,
        fulfillment_status,
        customer_email,
        customer_name,
        order_type,
        preferred_date,
        preferred_time
      `)
      .single();

    if (error) {
      console.error(
        "Unable to update order status:",
        error
      );

      return NextResponse.json(
        {
          error:
            "The order status could not be updated.",
        },
        { status: 500 }
      );
    }

    const statusMessage =
      getStatusMessage(
        data.fulfillment_status,
        data.order_type
      );

    if (
      statusMessage &&
      data.customer_email
    ) {
      try {
        const safeName =
          escapeHtml(
            data.customer_name ||
              "Sweet Tey's customer"
          );

        const scheduleParts = [
          data.preferred_date,
          data.preferred_time,
        ].filter(Boolean);

        const scheduleHtml =
          scheduleParts.length > 0
            ? `
              <p style="margin:8px 0 0;">
                <strong>Requested date/time:</strong>
                ${escapeHtml(scheduleParts.join(" · "))}
              </p>
            `
            : "";

        const emailId =
          await sendTransactionalEmail({
            to: data.customer_email,
            subject:
              statusMessage.subject,
            idempotencyKey:
              `order-status-${data.id}-${data.fulfillment_status}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#4b3428;">
                <h1 style="color:#ed6f91;">
                  ${escapeHtml(statusMessage.heading)}
                </h1>

                <p>Hi ${safeName},</p>

                <p>
                  ${escapeHtml(statusMessage.message)}
                </p>

                <div style="margin:24px 0;padding:18px;border:1px solid #f4c8d5;border-radius:14px;">
                  <p style="margin:0;">
                    <strong>Order:</strong>
                    ${escapeHtml(data.id)}
                  </p>

                  ${scheduleHtml}
                </div>

                <p>
                  With love,<br />
                  <strong>Sweet Tey's Pastries</strong>
                </p>
              </div>
            `,
          });

        console.log(
          "ORDER_STATUS_EMAIL_SENT",
          data.id,
          data.fulfillment_status,
          emailId
        );
      } catch (emailError) {
        console.error(
          "ORDER_STATUS_EMAIL_ERROR",
          data.id,
          data.fulfillment_status,
          emailError
        );
      }
    }

    return NextResponse.json({
      order: {
        id: data.id,
        fulfillment_status:
          data.fulfillment_status,
      },
      message: "Order status updated.",
    });
  } catch (error) {
    console.error(
      "Order status route failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "The order status could not be updated.",
      },
      { status: 500 }
    );
  }
}
