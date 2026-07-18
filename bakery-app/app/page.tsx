const collections = [
  {
    title: "Southern Desserts",
    description:
      "Classic Southern favorites, handmade with care and rooted in tradition.",
    items: "Banana pudding, peach cobbler, sweet potato pie, cakes and more.",
  },
  {
    title: "Fresh Pastries",
    description:
      "Freshly prepared pastries available for pickup and local delivery.",
    items: "Croissants, cinnamon rolls, muffins and cookies.",
  },
  {
    title: "Love Me Tea",
    description:
      "Our exclusive loose-leaf tea collection, available for nationwide shipping.",
    items: "Signature blends, seasonal teas and gift sets.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2] text-[#4b3428]">
      <header className="sticky top-0 z-50 border-b border-pink-100 bg-[#fff8f2]/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="#home"
            className="font-serif text-2xl font-bold text-[#ed6f91]"
          >
            Sweet Tey&apos;s Pastries
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <a className="hover:text-[#ed6f91]" href="#home">
              Home
            </a>
            <a className="hover:text-[#ed6f91]" href="#desserts">
              Southern Desserts
            </a>
            <a className="hover:text-[#ed6f91]" href="#tea">
              Love Me Tea
            </a>
            <a className="hover:text-[#ed6f91]" href="#picks">
              Tey&apos;s Picks
            </a>
            <a className="hover:text-[#ed6f91]" href="#rewards">
              Rewards
            </a>
            <a className="hover:text-[#ed6f91]" href="#subscription">
              Tea &amp; Treat Box
            </a>
            <a className="hover:text-[#ed6f91]" href="#about">
              About
            </a>
            <a className="hover:text-[#ed6f91]" href="#contact">
              Contact
            </a>
          </nav>

          <a
            href="#account"
            className="rounded-full bg-[#ed6f91] px-5 py-2 text-sm font-bold text-white hover:bg-[#d95f82]"
          >
            My Account
          </a>
        </div>
      </header>

      <section id="home" className="relative">
        <img
          src="/images/hero-pastries.png"
          alt="Sweet Tey's Pastries, Southern desserts and Love Me Tea"
          className="h-auto w-full object-cover"
        />

        <div className="absolute left-1/2 top-[60%] flex -translate-x-1/2 gap-5">
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

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91]">
              Explore Our Creations
            </p>

            <h2 className="font-serif text-4xl font-bold sm:text-5xl">
              Southern Comfort, Made With Love
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#6b5548]">
              From scratch-made Southern desserts to our hand-blended teas,
              every offering is created to bring joy to your day.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {collections.map((collection) => (
              <article
                key={collection.title}
                className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 text-4xl text-[#ed6f91]">♥</div>

                <h3 className="mb-3 font-serif text-2xl font-bold text-[#ed6f91]">
                  {collection.title}
                </h3>

                <p className="mb-4 leading-7 text-[#6b5548]">
                  {collection.description}
                </p>

                <p className="mb-7 text-sm leading-6 text-[#7a6a61]">
                  {collection.items}
                </p>

                <a
                  href={
                    collection.title === "Love Me Tea"
                      ? "#tea"
                      : collection.title === "Southern Desserts"
                        ? "#desserts"
                        : "#pastries"
                  }
                  className="inline-flex rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white hover:bg-[#d95f82]"
                >
                  Explore Collection
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="subscription"
        className="bg-[#fbe6eb] px-6 py-20 text-center"
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91]">
            Monthly Tea &amp; Treat Box
          </p>

          <h2 className="font-serif text-4xl font-bold sm:text-5xl">
            Southern Comfort Delivered Monthly
          </h2>

          <p className="mx-auto my-6 max-w-2xl text-lg leading-8 text-[#6b5548]">
            Receive the pastry of the month and a fresh bag of Love Me Tea
            delivered to your doorstep for $50 per month.
          </p>

          <a
            href="#join"
            className="inline-flex rounded-full bg-[#ed6f91] px-9 py-4 font-bold text-white shadow-lg hover:bg-[#d95f82]"
          >
            Join for $50 Monthly
          </a>
        </div>
      </section>

      <footer id="contact" className="bg-[#4b3428] px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#f5a0b8]">
              Sweet Tey&apos;s Pastries
            </h2>
            <p className="leading-7 text-white/75">
              Baked with love. Steeped with comfort. Rooted in Southern
              tradition.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-[#f5a0b8]">Fulfillment</h3>
            <p className="text-white/75">Pickup in Sausalito</p>
            <p className="text-white/75">Delivery within 30 miles</p>
            <p className="text-white/75">Nationwide tea shipping</p>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-[#f5a0b8]">Sweet Rewards</h3>
            <p className="text-white/75">Earn 1 point for every $1 spent.</p>
            <a className="mt-3 inline-block underline" href="#rewards">
              Join Sweet Rewards
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
