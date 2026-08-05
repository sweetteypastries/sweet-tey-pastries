const options = [
  {
    title: "Local Pickup",
    description:
      "Place your order online and select a convenient pickup time in Sausalito.",
    detail: "Available for pastries, desserts, and Love Me Tea.",
    icon: "♡",
  },
  {
    title: "Local Delivery",
    description:
      "Fresh desserts and pastries can be delivered within 30 miles of Sausalito.",
    detail: "Delivery availability and fees will be confirmed at checkout.",
    icon: "⌂",
  },
  {
    title: "Nationwide Tea Shipping",
    description:
      "Love Me Tea can be packaged and shipped to customers throughout the United States.",
    detail: "Pastries and desserts are not available for nationwide shipping.",
    icon: "✦",
  },
];

export default function DeliveryInfo() {
  return (
    <section
      id="delivery"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91]">
            Pickup, Delivery & Shipping
          </p>

          <h2 className="font-serif text-4xl font-bold text-[#4b3428] sm:text-5xl">
            Sweet Treats, Your Way
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6b5548]">
            Choose local pickup, local delivery, or nationwide shipping for
            eligible Love Me Tea products.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {options.map((option) => (
            <article
              key={option.title}
              className="rounded-3xl border border-pink-100 bg-[#fffaf7] p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e4e9] text-3xl text-[#ed6f91]">
                {option.icon}
              </div>

              <h3 className="mt-6 font-serif text-2xl font-bold text-[#4b3428]">
                {option.title}
              </h3>

              <p className="mt-4 leading-7 text-[#6b5548]">
                {option.description}
              </p>

              <p className="mt-4 text-sm font-semibold leading-6 text-[#b8873e]">
                {option.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-[#4b3428] px-8 py-10 text-center text-white">
          <h3 className="font-serif text-3xl font-bold">
            Planning a Celebration?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#f8e9e3]">
            Contact Sweet Tey&apos;s Pastries for larger orders, parties,
            showers, weddings, corporate gatherings, and custom dessert
            requests.
          </p>

          <a
            href="mailto:hello@sweetteypastries.com"
            className="mt-7 inline-block rounded-full bg-[#ed6f91] px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#d95f82]"
          >
            Contact Sweet Tey&apos;s
          </a>
        </div>
      </div>
    </section>
  );
}