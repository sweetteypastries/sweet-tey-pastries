"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Promotion = {
  code: string;
  label: string;
  type: "percentage" | "fixed";
  amount: number;
};

type FulfillmentMethod = "pickup" | "delivery";

const promotions: Promotion[] = [
  {
    code: "SWEET10",
    label: "10% off your order",
    type: "percentage",
    amount: 10,
  },
  {
    code: "WELCOME5",
    label: "$5 off your order",
    type: "fixed",
    amount: 5,
  },
];

const taxRate = 0.0925;
const freeDeliveryMinimum = 75;

export default function CartDrawer({
  isOpen,
  onClose,
}: CartDrawerProps) {
  const router = useRouter();

  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] =
    useState<Promotion | null>(null);
  const [promoMessage, setPromoMessage] = useState("");

  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>("pickup");
  const [giftMessage, setGiftMessage] = useState("");
  const [specialInstructions, setSpecialInstructions] =
    useState("");

  const discount = appliedPromotion
    ? appliedPromotion.type === "percentage"
      ? subtotal * (appliedPromotion.amount / 100)
      : Math.min(appliedPromotion.amount, subtotal)
    : 0;

  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;

  const amountUntilFreeDelivery = Math.max(
    freeDeliveryMinimum - discountedSubtotal,
    0
  );

  const deliveryProgress = Math.min(
    (discountedSubtotal / freeDeliveryMinimum) * 100,
    100
  );

  function applyPromoCode() {
    const normalizedCode = promoCode.trim().toUpperCase();

    if (!normalizedCode) {
      setPromoMessage("Enter a promotional code.");
      return;
    }

    const promotion = promotions.find(
      (item) => item.code === normalizedCode
    );

    if (!promotion) {
      setAppliedPromotion(null);
      setPromoMessage("That promotional code is not valid.");
      return;
    }

    setAppliedPromotion(promotion);
    setPromoCode(promotion.code);
    setPromoMessage(`${promotion.label} has been applied.`);
  }

  function removePromotion() {
    setAppliedPromotion(null);
    setPromoCode("");
    setPromoMessage("");
  }

  function handleClearCart() {
    clearCart();
    removePromotion();
    setGiftMessage("");
    setSpecialInstructions("");
    setFulfillmentMethod("pickup");
  }

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
          isOpen ? "translate-x-0" : "translate-x-full"
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
                : `${items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )} item${
                    items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    ) === 1
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
                Add your favorite Southern desserts, cupcakes, cookies,
                macarons, strawberries, or tea to begin your order.
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
              <div className="rounded-2xl border border-pink-100 bg-[#fffaf7] p-4">
                {fulfillmentMethod === "delivery" ? (
                  amountUntilFreeDelivery > 0 ? (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold text-[#4b3428]">
                          Free delivery progress
                        </p>

                        <p className="text-sm font-bold text-[#ed6f91]">
                          ${amountUntilFreeDelivery.toFixed(2)} to go
                        </p>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-pink-100">
                        <div
                          className="h-full rounded-full bg-[#ed6f91] transition-all duration-300"
                          style={{
                            width: `${deliveryProgress}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#6b5548]">
                        Add ${amountUntilFreeDelivery.toFixed(2)} more to
                        unlock free delivery.
                      </p>
                    </>
                  ) : (
                    <p className="text-center font-bold text-[#6b8a64]">
                      🎉 You have unlocked free delivery!
                    </p>
                  )
                ) : (
                  <p className="text-center text-sm font-semibold text-[#6b5548]">
                    Pickup is always free.
                  </p>
                )}
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
                          onClick={() => removeItem(item.id)}
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
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-3xl border border-pink-100 bg-white p-5">
                <p className="font-bold text-[#4b3428]">
                  How would you like your order?
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFulfillmentMethod("pickup")
                    }
                    className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${
                      fulfillmentMethod === "pickup"
                        ? "border-[#ed6f91] bg-pink-50 text-[#ed6f91]"
                        : "border-pink-100 bg-white text-[#4b3428] hover:bg-pink-50"
                    }`}
                  >
                    Pickup
                    <span className="mt-1 block text-xs font-medium">
                      Free
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFulfillmentMethod("delivery")
                    }
                    className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${
                      fulfillmentMethod === "delivery"
                        ? "border-[#ed6f91] bg-pink-50 text-[#ed6f91]"
                        : "border-pink-100 bg-white text-[#4b3428] hover:bg-pink-50"
                    }`}
                  >
                    Delivery
                    <span className="mt-1 block text-xs font-medium">
                      Calculated later
                    </span>
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-pink-100 bg-white p-5">
                <label
                  htmlFor="gift-message"
                  className="block font-bold text-[#4b3428]"
                >
                  Gift message
                </label>

                <textarea
                  id="gift-message"
                  value={giftMessage}
                  onChange={(event) =>
                    setGiftMessage(event.target.value)
                  }
                  rows={3}
                  maxLength={200}
                  placeholder="Add a sweet note for the recipient..."
                  className="mt-2 w-full resize-none rounded-2xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition placeholder:text-[#a89589] focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />

                <p className="mt-1 text-right text-xs text-[#7a6a61]">
                  {giftMessage.length}/200
                </p>

                <label
                  htmlFor="special-instructions"
                  className="mt-5 block font-bold text-[#4b3428]"
                >
                  Special instructions
                </label>

                <textarea
                  id="special-instructions"
                  value={specialInstructions}
                  onChange={(event) =>
                    setSpecialInstructions(event.target.value)
                  }
                  rows={3}
                  maxLength={300}
                  placeholder="Allergies, colors, event details, or other requests..."
                  className="mt-2 w-full resize-none rounded-2xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition placeholder:text-[#a89589] focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />

                <p className="mt-1 text-right text-xs text-[#7a6a61]">
                  {specialInstructions.length}/300
                </p>
              </div>

              <div className="rounded-3xl border border-pink-100 bg-white p-5">
                <label
                  htmlFor="promo-code"
                  className="block font-bold text-[#4b3428]"
                >
                  Promotional or discount code
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoCode}
                    disabled={Boolean(appliedPromotion)}
                    onChange={(event) => {
                      setPromoCode(event.target.value);
                      setPromoMessage("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        applyPromoCode();
                      }
                    }}
                    placeholder="Enter code"
                    className="min-w-0 flex-1 rounded-full border border-pink-200 bg-white px-4 py-3 uppercase text-[#4b3428] outline-none placeholder:normal-case focus:border-[#ed6f91]"
                  />

                  {appliedPromotion ? (
                    <button
                      type="button"
                      onClick={removePromotion}
                      className="rounded-full border border-pink-200 px-5 py-3 font-bold text-[#6b5548] transition hover:bg-pink-50"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      className="rounded-full bg-[#4b3428] px-5 py-3 font-bold text-white transition hover:bg-[#5b4135]"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {promoMessage && (
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      appliedPromotion
                        ? "text-[#6b8a64]"
                        : "text-[#c94f70]"
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-pink-100 bg-[#fffaf7] px-5 py-5 sm:px-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#4b3428]">
                Subtotal
              </span>

              <span className="font-serif text-xl font-bold text-[#4b3428]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {appliedPromotion && (
              <div className="flex items-center justify-between text-[#6b8a64]">
                <span className="font-bold">
                  Discount ({appliedPromotion.code})
                </span>

                <span className="font-serif text-xl font-bold">
                  −${discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="font-bold text-[#4b3428]">
                Estimated tax
              </span>

              <span className="font-serif text-xl font-bold text-[#4b3428]">
                ${tax.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-[#4b3428]">
                {fulfillmentMethod === "pickup"
                  ? "Pickup"
                  : "Delivery"}
              </span>

              <span className="font-bold text-[#6b5548]">
                {fulfillmentMethod === "pickup"
                  ? "Free"
                  : discountedSubtotal >= freeDeliveryMinimum
                    ? "Free"
                    : "Calculated at checkout"}
              </span>
            </div>

            <div className="border-t border-pink-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#4b3428]">
                  Total
                </span>

                <span className="font-serif text-3xl font-bold text-[#ed6f91]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#7a6a61]">
            Final delivery fees and availability will be confirmed during
            checkout.
          </p>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              router.push("/checkout");
            }}
            className="mt-5 w-full rounded-full bg-[#ed6f91] px-6 py-4 font-bold text-white transition hover:bg-[#d95f82] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed to Checkout
          </button>

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
                onClick={handleClearCart}
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