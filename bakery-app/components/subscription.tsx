export default function Subscription() {
  return (
    <section
      id="subscription"
      className="bg-[#4b3428] px-6 py-24 text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#f5bdca]">
            Tea & Treat Box
          </p>

          <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
            A Little Southern Comfort, Delivered Every Month
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#f8e9e3]">
            Enjoy a handpicked pastry and a bag of Love Me Tea every month,
            beautifully packaged and prepared with love.
          </p>

          <div className="mt-8 flex items-end gap-3">
            <span className="font-serif text-5xl font-bold text-[#f5bdca]">
              $50
            </span>
            <span className="pb-2 text-lg text-[#f8e9e3]">per month</span>
          </div>

          <ul className="mt-8 space-y-4 text-lg text-[#fff8f2]">
            <li className="flex gap-3">
              <span className="text-[#f5bdca]">♥</span>
              Pastry of the Month
            </li>

            <li className="flex gap-3">
              <span className="text-[#f5bdca]">♥</span>
              One bag of Love Me Tea
            </li>

            <li className="flex gap-3">
              <span className="text-[#f5bdca]">♥</span>
              Double Sweet Rewards points
            </li>

            <li className="flex gap-3">
              <span className="text-[#f5bdca]">♥</span>
              Exclusive seasonal treats
            </li>
          </ul>

          <button
            type="button"
            className="mt-10 rounded-full bg-[#ed6f91] px-10 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#d95f82]"
          >
            Join the Tea & Treat Box
          </button>

          <p className="mt-4 text-sm text-[#dcc8bf]">
            Subscription billing and delivery options will be connected during
            checkout setup.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full bg-[#ed6f91]/30 blur-2xl" />
          <div className="absolute -bottom-5 -right-5 h-32 w-32 rounded-full bg-[#b8873e]/30 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <img
              src="/images/hero-pastries.png"
              alt="Sweet Tey's monthly Tea and Treat Box"
              className="h-[460px] w-full rounded-[1.5rem] object-cover"
            />

            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/90 p-5 text-[#4b3428] shadow-lg backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
                This Month&apos;s Box
              </p>

              <p className="mt-2 font-serif text-2xl font-bold">
                Southern Sweet Surprise
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6b5548]">
                A featured seasonal pastry paired with a comforting Love Me Tea
                blend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}