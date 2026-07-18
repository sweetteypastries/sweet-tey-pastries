export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8F2] text-[#4B3428]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#B8873E]">
          Sausalito, California
        </p>

        <h1 className="mb-6 text-5xl font-bold sm:text-7xl">
          Sweet Tey&apos;s Pastries
        </h1>

        <p className="mb-4 text-xl font-semibold sm:text-2xl">
          Fresh Pastries • Southern Desserts • Love Me Tea™
        </p>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-[#6B5548]">
          Baked with Love. Steeped with Comfort. Rooted in Southern Tradition.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-[#728667] px-8 py-4 font-bold text-white">
            Shop Southern Desserts
          </button>

          <button className="rounded-full bg-[#B8873E] px-8 py-4 font-bold text-white">
            Shop Love Me Tea™
          </button>
        </div>

      </section>
    </main>
  );
}