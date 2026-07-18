export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2]">
      <section className="relative mx-auto min-h-screen w-full overflow-hidden">
        <img
          src="/images/hero-pastries.png"
          alt="Sweet Tey's Pastries — Southern desserts and Love Me Tea"
          className="h-screen w-full object-cover object-center"
        />

        {/* Functional invisible links positioned over the buttons in the image */}
        <div className="absolute left-1/2 top-[61%] flex -translate-x-1/2 gap-5">
          <a
            href="#desserts"
            aria-label="Shop Southern Desserts"
            className="h-16 w-80 rounded-full"
          />

          <a
            href="#tea"
            aria-label="Shop Love Me Tea"
            className="h-16 w-72 rounded-full"
          />
        </div>
      </section>
    </main>
  );
}