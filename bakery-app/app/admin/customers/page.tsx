export default function AdminCustomersPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
            Customer Management
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
            Customers
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-[#6b5548]">
            Customer profiles, rewards, order history, and marketing
            preferences will appear here.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-3xl border border-pink-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="text-5xl">👥</div>

          <h2 className="mt-5 font-serif text-3xl font-bold text-[#4b3428]">
            No customers yet
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6b5548]">
            Customer records will appear here after orders and subscriptions
            are saved to the database.
          </p>
        </section>
      </div>
    </main>
  );
}