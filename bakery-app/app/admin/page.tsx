import Link from "next/link";
import { redirect } from "next/navigation";
import AdminSignOutButton from "@/components/AdminSignOutButton";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";

type Order = {
  id: string;
  stripe_session_id: string;
  customer_email: string | null;
  amount_total: number;
  currency: string;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
};

function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const quickLinks = [
  {
    title: "Orders",
    description:
      "Review paid orders and update fulfillment status.",
    href: "/admin/orders",
    icon: "📦",
  },
  {
    title: "Products",
    description:
      "Manage desserts, prices, images, and availability.",
    href: "/admin/products",
    icon: "🍰",
  },
  {
    title: "Customers",
    description:
      "Customer information and order history.",
    href: "/admin/customers",
    icon: "👥",
  },
  {
    title: "Analytics",
    description:
      "Revenue, order volume, and product performance.",
    href: "/admin/analytics",
    icon: "📊",
  },
];

export default async function AdminDashboardPage() {
  if (!(await requireAdmin())) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        stripe_session_id,
        customer_email,
        amount_total,
        currency,
        payment_status,
        fulfillment_status,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load dashboard orders:", error);
  }

  const orders = (data ?? []) as Order[];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter(
    (order) => new Date(order.created_at) >= startOfToday
  );

  const todaysPaidOrders = todaysOrders.filter(
    (order) => order.payment_status === "paid"
  );

  const todaysRevenue = todaysPaidOrders.reduce(
    (total, order) => total + order.amount_total,
    0
  );

  const newOrders = orders.filter(
    (order) => order.fulfillment_status === "new"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.fulfillment_status === "completed"
  ).length;

  const recentOrders = orders.slice(0, 5);

  const summaryCards = [
    {
      label: "Today's Orders",
      value: String(todaysOrders.length),
      note: "Orders received today",
    },
    {
      label: "Today's Revenue",
      value: formatMoney(todaysRevenue),
      note: "Paid orders today",
    },
    {
      label: "New Orders",
      value: String(newOrders),
      note: "Awaiting fulfillment",
    },
    {
      label: "Completed Orders",
      value: String(completedOrders),
      note: "Fulfilled orders",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Bakery Overview
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
              Dashboard
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-[#6b5548]">
              Review Sweet Tey&apos;s Pastries orders, revenue, and
              fulfillment activity.
            </p>
          </div>

          <AdminSignOutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
            Dashboard order information could not be loaded.
          </div>
        )}

        <section>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <article
                key={card.label}
                className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold uppercase tracking-wide text-[#7a6a61]">
                  {card.label}
                </p>

                <p className="mt-4 font-serif text-4xl font-bold text-[#4b3428]">
                  {card.value}
                </p>

                <p className="mt-2 text-sm text-[#6b5548]">
                  {card.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
            Manage Your Bakery
          </p>

          <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b3428]">
            Quick Access
          </h2>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-3xl border border-pink-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-3xl">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#4b3428] group-hover:text-[#ed6f91]">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-[#6b5548]">
                      {item.description}
                    </p>

                    <span className="mt-5 inline-block font-bold text-[#ed6f91]">
                      Open {item.title} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
                Recent Activity
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b3428]">
                Recent Orders
              </h2>
            </div>

            <Link
              href="/admin/orders"
              className="font-bold text-[#ed6f91] hover:underline"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-7 rounded-2xl bg-[#fffaf7] px-6 py-12 text-center">
              <div className="text-4xl">📦</div>

              <p className="mt-4 font-bold text-[#4b3428]">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="mt-7 divide-y divide-pink-100">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold text-[#4b3428]">
                      {order.customer_email || "Customer"}
                    </p>

                    <p className="mt-1 text-sm text-[#7a6a61]">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-[#9c4865]">
                      {formatStatus(order.fulfillment_status)}
                    </span>

                    <span className="font-serif text-xl font-bold text-[#4b3428]">
                      {formatMoney(
                        order.amount_total,
                        order.currency
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
