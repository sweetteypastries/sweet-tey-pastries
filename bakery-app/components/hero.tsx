export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8f2] to-[#fde9ee] px-6 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-[#b8873e]">
          Sausalito, California
        </p>

        <h1 className="mb-6 font-serif text-6xl font-bold leading-tight text-[#ed6f91] md:text-7xl">
          Sweet Tey&apos;s Pastries
        </h1>

        <h2 className="mb-7 font-serif text-2xl font-semibold text-[#4b3428] md:text-3xl">
          Fresh Pastries • Southern Desserts • Love Me Tea
        </h2>

        <div className="mx-auto mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-20 bg-[#ed6f91]" />
          <span className="text-xl text-[#ed6f91]">♥</span>
          <span className="h-px w-20 bg-[#ed6f91]" />
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-xl leading-8 text-[#6b5548]">
          Baked with Love. Steeped with Comfort.
          <br />
          Rooted in Southern Tradition.
        </p>

        <div className="flex flex-col justify-center gap-5 sm:flex-row">
          <a
            href="#desserts"
            className="rounded-full bg-[#ed6f91] px-10 py-5 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#d95f82]"
          >
            Shop Southern Desserts
          </a>

          <a
            href="#tea"
            className="rounded-full border-2 border-[#ed6f91] px-10 py-5 font-bold text-[#ed6f91] transition hover:bg-[#ed6f91] hover:text-white"
          >
            Shop Love Me Tea
          </a>
        </div>
      </div>
    </section>
  );
}