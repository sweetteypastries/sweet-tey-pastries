import Link from "next/link";

const orderStatuses = [
  "All",
  "New",
  "Baking",
  "Ready",
  "Completed",
  "Cancelled",
];

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-[#fff8f8]">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Sweet Tey&apos;s Pastries
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
              Orders
            </h1>

            <p className="mt-2 text-[#6b5548]">
              Review paid orders and manage fulfillment.
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
        <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {orderStatuses.map((status, index) => (
                <button
                  key={status}
                  type="button"
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    index === 0
                      ? "bg-[#ed6f91] text-white"
                      : "border border-pink-200 bg-white text-[#4b3428] hover:bg-pink-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <input
                type="search"
                placeholder="Search orders..."
                className="w-full rounded-full border border-pink-200 px-5 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100 sm:min-w-72"
              />

              <select className="rounded-full border border-pink-200 bg-white px-5 py-3 font-bold text-[#4b3428] outline-none transition focus:border-[#ed6f91]">
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Highest total</option>
                <option>Lowest total</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-7 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
          <div className="hidden grid-cols-[1fr_1.4fr_1fr_1fr_1fr_1fr] gap-4 border-b border-pink-100 bg-[#fffaf7] px-6 py-4 text-sm font-bold uppercase tracking-wide text-[#7a6a61] lg:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Fulfillment</span>
            <span>Status</span>
            <span>Total</span>
            <span>Action</span>
          </div>

          <div className="px-6 py-16 text-center">
            <div className="text-5xl">📦</div>

            <h2 className="mt-5 font-serif text-3xl font-bold text-[#4b3428]">
              No paid orders yet
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6b5548]">
              Orders will appear here after we connect Stripe&apos;s
              payment-completion webhook and save each paid order to a
              database.
            </p>

            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-pink-50 px-5 py-4 text-left">
              <span className="text-2xl">🔒</span>

              <p className="text-sm leading-6 text-[#6b5548]">
                We will only create an order after Stripe verifies that the
                payment succeeded.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}