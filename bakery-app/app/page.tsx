export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2] text-[#4b3428]">
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-6 py-16"
        style={{
          backgroundImage: "url('/images/hero-pastries.png')",
        }}
      >
        <div className="absolute inset-0 bg-white/5" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#b8873e]">
            Sausalito, California
          </p>

          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-[#ed6f91] sm:text-7xl lg:text-8xl">
            Sweet Tey&apos;s Pastries
          </h1>

          <p className="mb-6 text-xl font-semibold text-[#4b3428] sm:text-2xl">
            Fresh Pastries • Southern Desserts • Love Me Tea
          </p>

          <div className="mx-auto mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-20 bg-[#ed6f91]" />
            <span className="text-xl text-[#ed6f91]">♥</span>
            <span className="h-px w-20 bg-[#ed6f91]" />
          </div>

          <p className="mx-auto mb-9 max-w-2xl text-lg leading-8 text-[#6b5548]">
            Baked with Love. Steeped with Comfort.
            <br />
            Rooted in Southern Tradition.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#desserts"
              className="rounded-full bg-[#ed6f91] px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#d95f82]"
            >
              Shop Southern Desserts
            </a>

            <a
              href="#tea"
              className="rounded-full bg-[#ed6f91] px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#d95f82]"
            >
              Shop Love Me Tea
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}