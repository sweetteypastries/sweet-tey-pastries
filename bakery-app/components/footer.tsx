const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Southern Desserts", href: "#desserts" },
  { label: "Love Me Tea", href: "#tea" },
  { label: "Tea & Treat Box", href: "#subscription" },
  { label: "Sweet Rewards", href: "#rewards" },
  { label: "Pickup & Delivery", href: "#delivery" },
];

export default function Footer() {
  return (
    <footer className="bg-[#3f2b22] px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#f5bdca]">
            Sweet Tey&apos;s Pastries
          </h2>

          <p className="mt-4 max-w-sm leading-7 text-[#eadbd4]">
            Southern desserts, fresh pastries, and comforting Love Me Tea,
            handcrafted with love in Sausalito, California.
          </p>

          <p className="mt-5 text-sm text-[#cdb8ae]">
            Local pickup and delivery available within 30 miles of Sausalito.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-xl font-bold text-[#f5bdca]">
            Quick Links
          </h3>

          <nav className="mt-5 flex flex-col gap-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="w-fit text-[#eadbd4] transition hover:text-[#ed6f91]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="font-serif text-xl font-bold text-[#f5bdca]">
            Contact
          </h3>

          <div className="mt-5 space-y-3 text-[#eadbd4]">
            <p>Sausalito, California</p>

            <a
              href="mailto:hello@sweetteypastries.com"
              className="block transition hover:text-[#ed6f91]"
            >
              hello@sweetteypastries.com
            </a>

            <p>Nationwide shipping available for Love Me Tea.</p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl font-bold text-[#f5bdca]">
            Join Our Sweet List
          </h3>

          <p className="mt-5 leading-7 text-[#eadbd4]">
            Receive seasonal menu updates, bakery news, and special offers.
          </p>

          <form className="mt-5">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>

            <input
              id="footer-email"
              type="email"
              placeholder="Your email address"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-[#cdb8ae] focus:border-[#ed6f91]"
            />

            <button
              type="submit"
              className="mt-3 w-full rounded-full bg-[#ed6f91] px-5 py-3 font-bold text-white transition hover:bg-[#d95f82]"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-8 text-sm text-[#cdb8ae] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Sweet Tey&apos;s Pastries. All rights
          reserved.
        </p>

        <div className="flex gap-5">
          <a href="#" className="transition hover:text-[#ed6f91]">
            Privacy
          </a>

          <a href="#" className="transition hover:text-[#ed6f91]">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}