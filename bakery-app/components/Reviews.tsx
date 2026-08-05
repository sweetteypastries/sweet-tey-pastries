const reviews = [
  {
    name: "Danielle M.",
    quote:
      "The sweet potato pie tasted homemade in the best possible way. Everyone at our gathering asked where it came from.",
  },
  {
    name: "Monique R.",
    quote:
      "The banana pudding cups were creamy, fresh, and beautifully packaged. Sweet Tey's is now my go-to for celebrations.",
  },
  {
    name: "Ashley T.",
    quote:
      "The pound cake was moist, buttery, and full of flavor. It paired perfectly with Love Me Tea.",
  },
];

export default function Reviews() {
  return (
    <section className="bg-[#fff8f2] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91]">
            Customer Love
          </p>

          <h2 className="font-serif text-4xl font-bold text-[#4b3428] sm:text-5xl">
            Sweet Words From Our Customers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#6b5548]">
            Desserts made for celebrations, gatherings, and moments worth
            remembering.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="mb-5 text-xl tracking-widest text-[#b8873e]"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </div>

              <blockquote className="text-lg leading-8 text-[#6b5548]">
                “{review.quote}”
              </blockquote>

              <p className="mt-6 font-serif text-xl font-bold text-[#ed6f91]">
                — {review.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}