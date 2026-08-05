"use client";

import { useState } from "react";
import CartDrawer from "@/components/Cart/CartDrawer";
import { useCart } from "@/components/Cart/CartContext";

const links = [
  { label: "Home", href: "#home" },
  { label: "Southern Desserts", href: "#desserts" },
  { label: "Cupcakes", href: "#cupcakes" },
  { label: "Cookies", href: "#cookies" },
  { label: "Macarons", href: "#macarons" },
  { label: "Chocolate Strawberries", href: "#strawberries" },
  { label: "Love Me Tea", href: "#tea" },
  { label: "Tea & Treat Box", href: "#subscription" },
  { label: "Rewards", href: "#rewards" },
  { label: "About", href: "#about" },
  { label: "Delivery", href: "#delivery" },
];

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-pink-200 bg-[#fff1f5]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-5 py-3">
          <a
            href="#home"
            aria-label="Sweet Tey's Pastries home"
            className="shrink-0"
            onClick={closeMenu}
          >
            <img
              src="/images/sweet-teys-logo.png"
              alt="Sweet Tey's Pastries"
              className="h-20 w-auto object-contain"
            />
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-x-4 lg:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-xs font-bold text-[#4b3428] transition hover:text-[#ed6f91] 2xl:text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 font-bold text-[#4b3428] transition hover:bg-pink-50 lg:hidden"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white transition hover:bg-[#d95f82]"
            >
              🛒 Cart

              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-[#ed6f91] shadow">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`border-t border-pink-200 bg-[#fff1f5] px-5 transition-all lg:hidden ${
            isMenuOpen
              ? "max-h-[700px] py-5 opacity-100"
              : "max-h-0 overflow-hidden py-0 opacity-0"
          }`}
        >
          <nav className="mx-auto grid max-w-2xl gap-2 sm:grid-cols-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 font-bold text-[#4b3428] transition hover:bg-white hover:text-[#ed6f91]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}