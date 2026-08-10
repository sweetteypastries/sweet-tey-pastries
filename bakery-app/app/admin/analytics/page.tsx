import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";

type OrderItem = {
  name?: string;
  quantity?: number;
  amount_total?: number;
  currency?: string;
};

type Order = {
  id: string;
  customer_email: string | null;
  amount_total: number;
  currency: string;
  payment_status: string;
  fulfillment_status: string;
  items: OrderItem[];
  created_at: string;
};

type ProductStat = {
  name: string;
  quantity: number;
  revenue: number;
};

function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AdminAnalyticsPage() {
  if (!(await requireAdmin())) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        customer_email,
        amount_total,
        currency,
        payment_status,
        fulfillment_status,
        items,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load analytics:", error);
  }

  const orders = (data ?? []) as Order[];

  const paidOrders = orders.filter(
    (order) => order.payment_status === "paid"
  );

  const totalRevenue = paidOrders.reduce(
    (total, order) => total + order.amount_total,
    0
  );

  const averageOrderValue =
    paidOrders.length > 0
      ? Math.round(totalRevenue / paidOrders.length)
      : 0;

  const uniqueCustomers = new Set(
    paidOrders
      .map((order) => order.customer_email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email))
  );

  const productMap = new Map<string, ProductStat>();

  for (const order of paidOrders) {
    const items = Array.isArray(order.items) ? order.items : [];

    for (const item of items) {
      const name = item.name || "Bakery item";
      const quantity = item.quantity ?? 1;
      const revenue = item.amount_total ?? 0;

      const existing = productMap.get(name);

      if (existing) {
        existing.quantity += quantity;
        existing.revenue += revenue;
      } else {
        productMap.set(name, {
          name,
          quantity,
          revenue,
        });
      }
    }
  }

  const topProducts = Array.from(productMap.values()).sort(
    (a, b) => {
      if (b.quantity !== a.quantity) {
        return b.quantity - a.quantity;
      }

      return b.revenue - a.revenue;
    }
  );

  const maxQuantity = Math.max(
    1,
    ...topProducts.map((product) => product.quantity)
  );

  const fulfillmentStatuses = [
    "new",
    "baking",
    "ready",
    "completed",
    "cancelled",
  ];

  const fulfillmentCounts = fulfillmentStatuses.map((status) => ({
    status,
    count: paidOrders.filter(
      (order) => order.fulfillment_status === status
    ).length,
  }));

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Bakery Performance
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
              Analytics
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-[#6b5548]">
              Revenue, order volume, best sellers, and customer
              performance from your paid orders.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center justify-center rounded-full border border-pink-200 bg-white px-6 py-3 font-bold text-[#4b3428] transition hover:bg-pink-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-7 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
            Analytics could not be loaded. Check the server terminal for
            details.
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Total Revenue
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {formatMoney(totalRevenue)}
            </p>

            <p className="mt-2 text-sm text-[#6b5548]">
              From paid orders
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Paid Orders
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {paidOrders.length}
            </p>

            <p className="mt-2 text-sm text-[#6b5548]">
              Successful payments
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Average Order
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {formatMoney(averageOrderValue)}
            </p>

            <p className="mt-2 text-sm text-[#6b5548]">
              Average paid order value
            </p>
          </article>

          <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
              Customers
            </p>

            <p className="mt-3 font-serif text-4xl font-bold text-[#4b3428]">
              {uniqueCustomers.size}
            </p>

            <p className="mt-2 text-sm text-[#6b5548]">
              Unique paid customers
            </p>
          </article>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Product Performance
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b3428]">
              Best Sellers
            </h2>

            {topProducts.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-[#fffaf7] px-6 py-12 text-center">
                <div className="text-4xl">🍰</div>

                <p className="mt-4 font-bold text-[#4b3428]">
                  No product sales yet
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-7">
                {topProducts.map((product, index) => {
                  const width =
                    (product.quantity / maxQuantity) * 100;

                  return (
                    <div key={product.name}>
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-[#ed6f91]">
                            #{index + 1}
                          </p>

                          <p className="mt-1 font-bold text-[#4b3428]">
                            {product.name}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-[#4b3428]">
                            {product.quantity} sold
                          </p>

                          <p className="text-sm text-[#6b5548]">
                            {formatMoney(product.revenue)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-pink-50">
                        <div
                          className="h-full rounded-full bg-[#ed6f91]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Fulfillment
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b3428]">
              Order Status
            </h2>

            <div className="mt-7 space-y-4">
              {fulfillmentCounts.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between rounded-2xl bg-[#fffaf7] px-5 py-4"
                >
                  <span className="font-bold text-[#4b3428]">
                    {formatStatus(item.status)}
                  </span>

                  <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-pink-100 px-3 font-bold text-[#9c4865]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
            Summary
          </p>

          <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b3428]">
            Bakery Snapshot
          </h2>

          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#fffaf7] p-5">
              <p className="text-sm text-[#6b5548]">
                Products Sold
              </p>

              <p className="mt-2 text-2xl font-bold text-[#4b3428]">
                {topProducts.reduce(
                  (total, product) =>
                    total + product.quantity,
                  0
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fffaf7] p-5">
              <p className="text-sm text-[#6b5548]">
                Completed Orders
              </p>

              <p className="mt-2 text-2xl font-bold text-[#4b3428]">
                {
                  fulfillmentCounts.find(
                    (item) => item.status === "completed"
                  )?.count ?? 0
                }
              </p>
            </div>

            <div className="rounded-2xl bg-[#fffaf7] p-5">
              <p className="text-sm text-[#6b5548]">
                Products Ordered
              </p>

              <p className="mt-2 text-2xl font-bold text-[#4b3428]">
                {topProducts.length}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
