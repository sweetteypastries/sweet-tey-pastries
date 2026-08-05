const teas = [
  {
    id: "signature-blend",
    name: "Signature Blend",
    description:
      "Our handcrafted loose-leaf blend created to comfort, relax, and enjoy every day.",
  },
  {
    id: "seasonal-collection",
    name: "Seasonal Collection",
    description:
      "Limited-time seasonal flavors inspired by Southern gatherings and the changing seasons.",
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    description:
      "Beautifully packaged tea gift boxes perfect for birthdays, holidays, and thank-you gifts.",
  },
];

export default function LoveMeTea() {
  return (
    <section
      id="tea"
      className="bg-gradient-to-b from-[#fff8f2] to-[#fbe6eb] px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91] shadow-sm">
            Love Me Tea
          </span>

          <h2 className="mt-6 font-serif text-5xl font-bold text-[#4b3428]">
            Hand-Blended Loose Leaf Tea
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#6b5548]">
            Every bag is blended with premium loose-leaf tea and crafted to pair
            beautifully with our Southern desserts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {teas.map((tea) => (
            <article
              key={tea.id}
              className="flex min-h-[360px] flex-col rounded-3xl border border-pink-100 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3f6] text-4xl"
              >
                🍵
              </div>

              <h3 className="mt-6 font-serif text-3xl font-bold text-[#ed6f91]">
                {tea.name}
              </h3>

              <p className="mt-4 flex-1 leading-8 text-[#6b5548]">
                {tea.description}
              </p>

              <a
                href="#contact"
                className="mt-8 block w-full rounded-full bg-[#ed6f91] px-6 py-4 text-center font-bold text-white transition hover:bg-[#d85d80]"
              >
                Shop Tea
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}