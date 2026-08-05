import Link from "next/link";

const summaryCards = [
  {
    label: "Today’s Orders",
    value: "0",
    note: "No orders yet",
  },
  {
    label: "Today’s Revenue",
    value: "$0.00",
    note: "Paid orders",
  },
  {
    label: "Upcoming Pickups",
    value: "0",
    note: "Scheduled today",
  },
  {
    label: "Pending Deliveries",
    value: "0",
    note: "Awaiting fulfillment",
  },
];

const quickLinks = [
  {
    title: "Orders",
    description:
      "Review new orders, update statuses, and manage pickup or delivery details.",
    href: "/admin/orders",
    icon: "📦",
  },
  {
    title: "Products",
    description:
      "Manage desserts, prices, images, seasonal availability, and add-ons.",
    href: "/admin/products",
    icon: "🍰",
  },
  {
    title: "Customers",
    description:
      "View customer details, order history, rewards, and marketing preferences.",
    href: "/admin/customers",
    icon: "👥",
  },
  {
    title: "Analytics",
    description:
      "Track revenue, popular products, order volume, and customer trends.",
    href: "/admin/analytics",
    icon: "📊",
  },
];

const completedSetupItems = [
  "Storefront and products",
  "Shopping cart",
  "Checkout form",
  "Stripe test checkout",
  "Payment success page",
  "Stripe webhook route",
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
            Bakery Overview
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-[#6b5548]">
            Review today&apos;s activity and quickly access the tools you need
            to manage Sweet Tey&apos;s Pastries.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">
            Bakery summary
          </h2>

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
                Manage Your Bakery
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b3428]">
                Quick Access
              </h2>
            </div>

            <p className="max-w-xl leading-7 text-[#6b5548]">
              These sections currently use placeholder data. We&apos;ll connect
              them to saved orders, customers, and products next.
            </p>
          </div>

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
                    <h3 className="font-serif text-2xl font-bold text-[#4b3428] transition group-hover:text-[#ed6f91]">
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

        <section className="mt-12 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
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

            <div className="mt-8 rounded-2xl bg-[#fffaf7] px-6 py-12 text-center">
              <div className="text-4xl">📦</div>

              <h3 className="mt-4 font-serif text-2xl font-bold text-[#4b3428]">
                No orders yet
              </h3>

              <p className="mx-auto mt-3 max-w-lg leading-7 text-[#6b5548]">
                Paid Stripe orders will appear here after we connect the
                webhook to permanent order storage.
              </p>

              <Link
                href="/admin/orders"
                className="mt-6 inline-block rounded-full border border-pink-200 bg-white px-6 py-3 font-bold text-[#4b3428] transition hover:bg-pink-50"
              >
                Open Orders
              </Link>
            </div>
          </article>

          <aside className="rounded-3xl border border-pink-100 bg-[#4b3428] p-7 text-white shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-200">
              Setup Progress
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold">
              Bakery System
            </h2>

            <div className="mt-7 space-y-4">
              {completedSetupItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ed6f91] font-bold">
                    ✓
                  </span>

                  <span className="font-semibold">{item}</span>
                </div>
              ))}

              <div className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                  7
                </span>

                <span className="font-semibold">
                  Database and live order storage
                </span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}