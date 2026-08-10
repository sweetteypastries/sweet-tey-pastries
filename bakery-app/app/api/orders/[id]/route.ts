import { NextResponse } from "next/server";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";

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
        fulfillment_status: body.fulfillmentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, fulfillment_status")
      .single();

    if (error) {
      console.error("Unable to update order status:", error);

      return NextResponse.json(
        { error: "The order status could not be updated." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order: data,
      message: "Order status updated.",
    });
  } catch (error) {
    console.error("Order status route failed:", error);

    return NextResponse.json(
      { error: "The order status could not be updated." },
      { status: 500 }
    );
  }
}
