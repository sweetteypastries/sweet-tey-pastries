export default function AdminAnalyticsPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
            Bakery Performance
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
            Analytics
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-[#6b5548]">
            Revenue, order volume, best sellers, and customer trends will
            appear here.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-3xl border border-pink-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="text-5xl">📊</div>

          <h2 className="mt-5 font-serif text-3xl font-bold text-[#4b3428]">
            Analytics are coming next
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6b5548]">
            This dashboard will populate after paid orders are stored in
            Supabase.
          </p>
        </section>
      </div>
    </main>
  );
}