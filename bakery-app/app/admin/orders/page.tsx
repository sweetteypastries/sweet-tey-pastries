import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";
import OrderStatusControls from "@/components/OrderStatusControls";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type OrderItem = {
  name?: string;
  description?: string;
  quantity?: number;
  amount_subtotal?: number;
  amount_total?: number;
  currency?: string;
};

type Order = {
  id: string;
  stripe_session_id: string;

  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;

  amount_total: number;
  currency: string;
  payment_status: string;
  fulfillment_status: string;

  items: OrderItem[] | null;

  order_type: string | null;
  street_address: string | null;
  city: string | null;
  postal_code: string | null;

  preferred_date: string | null;
  preferred_time: string | null;

  special_instructions: string | null;
  occasion: string | null;
  gift_message: string | null;

  delivery_fee_amount: number | null;
  shipping_fee_amount: number | null;
  tip_amount: number | null;
  tip_percent: number | null;

  paid_at: string | null;
  created_at: string;
};

function formatMoney(
  amount: number | null | undefined,
  currency = "usd"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((amount ?? 0) / 100);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string) {
  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(
    new Date(
      year,
      month - 1,
      day
    )
  );
}

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function fulfillmentLabel(
  orderType: string | null
) {
  if (orderType === "delivery") {
    return "Marin County Delivery";
  }

  if (orderType === "shipping") {
    return "Tea Shipping";
  }

  if (orderType === "pickup") {
    return "Pickup";
  }

  return "Not specified";
}

function getItemName(
  item: OrderItem
) {
  return (
    item.description ||
    item.name ||
    "Bakery item"
  );
}

function isFeeOrTipLineItem(
  item: OrderItem
) {
  const name =
    getItemName(item)
      .trim()
      .toLowerCase();

  return (
    name.startsWith("optional tip") ||
    name.startsWith("local delivery") ||
    name.startsWith("love me tea shipping") ||
    name === "tea shipping"
  );
}

export default async function AdminOrdersPage() {
  if (!(await requireAdmin())) {
    redirect("/admin/login");
  }

  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select(`
      id,
      stripe_session_id,
      customer_email,
      customer_name,
      customer_phone,
      amount_total,
      currency,
      payment_status,
      fulfillment_status,
      items,
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
      paid_at,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      "Unable to load orders:",
      error
    );
  }

  const orders =
    (data ?? []) as Order[];

  const paidOrders =
    orders.filter(
      (order) =>
        order.payment_status ===
        "paid"
    );

  const totalRevenue =
    paidOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.amount_total ?? 0
        ),
      0
    );

  const newOrders =
    orders.filter(
      (order) =>
        order.fulfillment_status ===
        "new"
    ).length;

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Sweet Tey&apos;s Pastries
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
              Orders
            </h1>

            <p className="mt-2 text-[#6b5548]">
              Review paid orders,
              customer details,
              fulfillment information,
              fees, and tips.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white transition hover:bg-[#d85d80]"
            >
              Refresh Orders
            </Link>

            <Link
              href="/admin"
              className="inline-flex w-fit items-center justify-center rounded-full border border-pink-200 bg-white px-6 py-3 font-bold text-[#4b3428] transition hover:bg-pink-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-5 sm:grid-cols-3">
          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Total Orders
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {orders.length}
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              New Orders
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {newOrders}
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Paid Revenue
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {formatMoney(
                totalRevenue
              )}
            </p>
          </article>
        </section>

        {error ? (
          <section className="mt-7 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p className="font-bold">
              Orders could not be loaded.
            </p>

            <p className="mt-2 text-sm">
              Check the website terminal
              for the Supabase error.
            </p>
          </section>
        ) : orders.length === 0 ? (
          <section className="mt-7 rounded-3xl border border-pink-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">
              📦
            </div>

            <h2 className="mt-5 font-serif text-3xl font-bold text-[#4b3428]">
              No orders yet
            </h2>
          </section>
        ) : (
          <section className="mt-7 space-y-6">
            {orders.map(
              (order) => {
                const allItems =
                  Array.isArray(
                    order.items
                  )
                    ? order.items
                    : [];

                const merchandiseItems =
                  allItems.filter(
                    (item) =>
                      !isFeeOrTipLineItem(
                        item
                      )
                  );

                const hasAddress =
                  (
                    order.order_type ===
                      "delivery" ||
                    order.order_type ===
                      "shipping"
                  ) &&
                  Boolean(
                    order.street_address
                  );

                const deliveryFee =
                  Number(
                    order.delivery_fee_amount ??
                      0
                  );

                const shippingFee =
                  Number(
                    order.shipping_fee_amount ??
                      0
                  );

                const tipAmount =
                  Number(
                    order.tip_amount ??
                      0
                  );

                const tipPercent =
                  Number(
                    order.tip_percent ??
                      0
                  );

                return (
                  <article
                    key={order.id}
                    className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm"
                  >
                    <div className="flex flex-col gap-4 border-b border-pink-100 bg-[#fffaf7] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ed6f91]">
                          Order
                        </p>

                        <p className="mt-1 font-mono text-sm font-bold text-[#4b3428]">
                          {order.stripe_session_id
                            ? order.stripe_session_id.slice(
                                -12
                              )
                            : order.id.slice(
                                -12
                              )}
                        </p>

                        <p className="mt-1 text-sm text-[#7a6a61]">
                          {formatDateTime(
                            order.created_at
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                          {formatStatus(
                            order.payment_status
                          )}
                        </span>

                        <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-[#9c4865]">
                          {formatStatus(
                            order.fulfillment_status
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="border-b border-pink-100 px-6 py-4">
                      <OrderStatusControls
                        orderId={
                          order.id
                        }
                        currentStatus={
                          order.fulfillment_status
                        }
                      />
                    </div>

                    <div className="grid gap-8 px-6 py-7 lg:grid-cols-3">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                          Customer
                        </p>

                        <p className="mt-3 text-lg font-bold text-[#4b3428]">
                          {order.customer_name ||
                            "Customer"}
                        </p>

                        <p className="mt-1 break-all text-sm text-[#6b5548]">
                          {order.customer_email ||
                            "No email"}
                        </p>

                        {order.customer_phone && (
                          <p className="mt-1 text-sm text-[#6b5548]">
                            📞{" "}
                            {
                              order.customer_phone
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                          Fulfillment
                        </p>

                        <p className="mt-3 text-lg font-bold text-[#4b3428]">
                          {fulfillmentLabel(
                            order.order_type
                          )}
                        </p>

                        {order.preferred_date && (
                          <p className="mt-2 text-sm text-[#6b5548]">
                            📅{" "}
                            {formatDate(
                              order.preferred_date
                            )}
                          </p>
                        )}

                        {order.preferred_time && (
                          <p className="mt-1 text-sm text-[#6b5548]">
                            🕐{" "}
                            {
                              order.preferred_time
                            }
                          </p>
                        )}

                        {hasAddress && (
                          <div className="mt-3 text-sm leading-6 text-[#6b5548]">
                            <p className="font-bold text-[#4b3428]">
                              {order.order_type ===
                              "shipping"
                                ? "Shipping Address"
                                : "Delivery Address"}
                            </p>

                            <p>
                              {
                                order.street_address
                              }
                            </p>

                            <p>
                              {[
                                order.city,
                                order.postal_code,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="lg:text-right">
                        <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                          Total Paid
                        </p>

                        <p className="mt-3 font-serif text-3xl font-bold text-[#ed6f91]">
                          {formatMoney(
                            order.amount_total,
                            order.currency
                          )}
                        </p>

                        {deliveryFee > 0 && (
                          <p className="mt-3 text-sm text-[#6b5548]">
                            Delivery fee:{" "}
                            <strong>
                              {formatMoney(
                                deliveryFee,
                                order.currency
                              )}
                            </strong>
                          </p>
                        )}

                        {shippingFee > 0 && (
                          <p className="mt-2 text-sm text-[#6b5548]">
                            Tea shipping:{" "}
                            <strong>
                              {formatMoney(
                                shippingFee,
                                order.currency
                              )}
                            </strong>
                          </p>
                        )}

                        {tipAmount > 0 && (
                          <p className="mt-2 text-sm text-[#6b5548]">
                            Tip
                            {tipPercent > 0
                              ? ` (${tipPercent}%)`
                              : " (Custom)"}
                            :{" "}
                            <strong>
                              {formatMoney(
                                tipAmount,
                                order.currency
                              )}
                            </strong>
                          </p>
                        )}

                        {order.paid_at && (
                          <p className="mt-3 text-xs text-[#7a6a61]">
                            Paid{" "}
                            {formatDateTime(
                              order.paid_at
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-pink-100 px-6 py-7">
                      <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                        Bakery Items
                      </p>

                      <div className="mt-4 space-y-3">
                        {merchandiseItems.length >
                        0 ? (
                          merchandiseItems.map(
                            (
                              item,
                              index
                            ) => {
                              const itemName =
                                getItemName(
                                  item
                                );

                              return (
                                <div
                                  key={`${order.id}-${index}`}
                                  className="flex items-start justify-between gap-5 rounded-2xl bg-[#fffaf7] px-5 py-4"
                                >
                                  <div>
                                    <p className="font-bold text-[#4b3428]">
                                      {
                                        itemName
                                      }
                                    </p>

                                    <p className="mt-1 text-sm text-[#6b5548]">
                                      Qty{" "}
                                      {item.quantity ??
                                        1}
                                    </p>
                                  </div>

                                  {typeof item.amount_total ===
                                    "number" && (
                                    <p className="font-bold text-[#4b3428]">
                                      {formatMoney(
                                        item.amount_total,
                                        item.currency ??
                                          order.currency
                                      )}
                                    </p>
                                  )}
                                </div>
                              );
                            }
                          )
                        ) : (
                          <p className="text-sm text-[#6b5548]">
                            No bakery item details
                            available.
                          </p>
                        )}
                      </div>
                    </div>

                    {(order.special_instructions ||
                      order.occasion ||
                      order.gift_message) && (
                      <div className="border-t border-pink-100 bg-pink-50/40 px-6 py-7">
                        <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                          Order Notes
                        </p>

                        <div className="mt-4 grid gap-5 md:grid-cols-3">
                          {order.special_instructions && (
                            <div className="rounded-2xl bg-white p-5">
                              <p className="text-xs font-bold uppercase tracking-wide text-[#ed6f91]">
                                Special Instructions
                              </p>

                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4b3428]">
                                {
                                  order.special_instructions
                                }
                              </p>
                            </div>
                          )}

                          {order.occasion && (
                            <div className="rounded-2xl bg-white p-5">
                              <p className="text-xs font-bold uppercase tracking-wide text-[#ed6f91]">
                                Occasion
                              </p>

                              <p className="mt-2 font-bold text-[#4b3428]">
                                {
                                  order.occasion
                                }
                              </p>
                            </div>
                          )}

                          {order.gift_message && (
                            <div className="rounded-2xl bg-white p-5">
                              <p className="text-xs font-bold uppercase tracking-wide text-[#ed6f91]">
                                Gift Message
                              </p>

                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4b3428]">
                                {
                                  order.gift_message
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </section>
        )}
      </div>
    </main>
  );
}
