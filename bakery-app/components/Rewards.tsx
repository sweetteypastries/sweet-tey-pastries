const rewards = [
  {
    title: "Earn Points",
    description:
      "Collect Sweet Rewards points every time you order pastries, desserts, or Love Me Tea.",
  },
  {
    title: "Birthday Treat",
    description:
      "Members receive a special birthday reward to celebrate their sweetest day.",
  },
  {
    title: "Double Points",
    description:
      "Tea & Treat Box subscribers earn double rewards on eligible purchases.",
  },
];

export default function Rewards() {
  return (
    <section
      id="rewards"
      className="bg-gradient-to-b from-[#f8e7ec] to-[#fff8f2] px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91]">
            Sweet Rewards
          </p>

          <h2 className="font-serif text-4xl font-bold text-[#4b3428] sm:text-5xl">
            Every Treat Brings You Closer to Another
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6b5548]">
            Join our rewards program and earn points whenever you shop with
            Sweet Tey&apos;s Pastries.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {rewards.map((reward, index) => (
            <article
              key={reward.title}
              className="rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e4e9] font-serif text-2xl font-bold text-[#ed6f91]">
                {index + 1}
              </div>

              <h3 className="mt-6 font-serif text-2xl font-bold text-[#4b3428]">
                {reward.title}
              </h3>

              <p className="mt-4 leading-7 text-[#6b5548]">
                {reward.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            className="rounded-full bg-[#ed6f91] px-10 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#d95f82]"
          >
            Join Sweet Rewards
          </button>

          <p className="mt-4 text-sm text-[#7a6a61]">
            Account registration and points tracking will be connected during
            the customer account setup.
          </p>
        </div>
      </div>
    </section>
  );
}