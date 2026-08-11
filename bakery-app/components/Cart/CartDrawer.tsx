"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({
  isOpen,
  onClose,
}: CartDrawerProps) {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <button
        type="button"
        aria-label="Close shopping cart"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-pink-100 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ed6f91]">
              Your Cart
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-[#4b3428]">
              Sweet Selections
            </h2>

            <p className="mt-1 text-sm text-[#7a6a61]">
              {items.length === 0
                ? "Your cart is waiting."
                : `${totalQuantity} item${
                    totalQuantity === 1
                      ? ""
                      : "s"
                  } selected`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-200 text-xl font-bold text-[#4b3428] transition hover:bg-pink-50"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-4xl">
                🛒
              </div>

              <h3 className="mt-6 font-serif text-2xl font-bold text-[#4b3428]">
                Your cart is empty
              </h3>

              <p className="mt-3 max-w-sm leading-7 text-[#6b5548]">
                Add your favorite Southern desserts,
                cupcakes, cookies, macarons,
                strawberries, or tea to begin your
                order.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-7 rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white transition hover:bg-[#d95f82]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5 px-5 py-6 sm:px-6">
              <div className="rounded-2xl border border-pink-100 bg-[#fffaf7] p-4 text-center">
                <p className="font-bold text-[#4b3428]">
                  Pickup, delivery & shipping
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6b5548]">
                  Choose your fulfillment option
                  during checkout. Pickup is free.
                  Eligible delivery and tea shipping
                  fees are calculated securely at
                  checkout.
                </p>
              </div>

              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-pink-100 bg-[#fffaf7] p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-pink-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg font-bold leading-6 text-[#4b3428]">
                            {item.name}
                          </h3>

                          {item.option && (
                            <p className="mt-1 text-sm leading-5 text-[#7a6a61]">
                              {item.option}
                            </p>
                          )}

                          <p className="mt-2 text-sm font-semibold text-[#ed6f91]">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="shrink-0 text-sm font-bold text-[#ed6f91] transition hover:text-[#c94f70] hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center overflow-hidden rounded-full border border-pink-200 bg-white">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="px-4 py-2 text-lg font-bold text-[#4b3428] transition hover:bg-pink-50"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center font-bold text-[#4b3428]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="px-4 py-2 text-lg font-bold text-[#4b3428] transition hover:bg-pink-50"
                          >
                            +
                          </button>
                        </div>

                        <p className="font-serif text-xl font-bold text-[#4b3428]">
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-pink-100 bg-[#fffaf7] px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#4b3428]">
              Merchandise Subtotal
            </span>

            <span className="font-serif text-3xl font-bold text-[#ed6f91]">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 rounded-2xl border border-pink-100 bg-white px-4 py-4">
            <p className="text-sm font-bold text-[#4b3428]">
              Final total calculated at checkout
            </p>

            <p className="mt-1 text-sm leading-6 text-[#7a6a61]">
              Tax, delivery or shipping fees, and
              your optional tip are calculated
              during secure checkout.
            </p>
          </div>

          {items.length > 0 ? (
            <Link
              href="/checkout"
              onClick={onClose}
              className="mt-5 flex w-full items-center justify-center rounded-full bg-[#ed6f91] px-6 py-4 font-bold text-white transition hover:bg-[#d95f82]"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-5 w-full cursor-not-allowed rounded-full bg-[#ed6f91] px-6 py-4 font-bold text-white opacity-50"
            >
              Proceed to Checkout
            </button>
          )}

          {items.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-pink-200 px-4 py-3 text-sm font-bold text-[#6b5548] transition hover:bg-white"
              >
                Keep Shopping
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="rounded-full border border-pink-200 px-4 py-3 text-sm font-bold text-[#6b5548] transition hover:bg-white"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
