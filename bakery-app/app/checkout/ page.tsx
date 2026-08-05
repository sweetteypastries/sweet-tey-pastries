"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useCart } from "@/components/Cart/CartContext";

const taxRate = 0.0925;

const pickupTimes = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const occasions = [
  "Birthday",
  "Baby Shower",
  "Wedding",
  "Anniversary",
  "Graduation",
  "Holiday",
  "Just Because",
  "Other",
];

type OrderType = "pickup" | "delivery";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [orderType, setOrderType] =
    useState<OrderType>("pickup");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [joinRewards, setJoinRewards] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [textUpdates, setTextUpdates] = useState(false);

  const [subscriptionMessage, setSubscriptionMessage] =
    useState("");

  const [isStartingPayment, setIsStartingPayment] =
    useState(false);
  const [paymentError, setPaymentError] = useState("");

  const minimumDate = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailUpdates && !textUpdates && !joinRewards) {
      setSubscriptionMessage(
        "Choose Sweet Rewards, email updates, or text updates first."
      );
      return;
    }

    if ((emailUpdates || joinRewards) && !email.trim()) {
      setSubscriptionMessage(
        "Enter your email address to receive email updates or join Sweet Rewards."
      );
      return;
    }

    if (textUpdates && !phone.trim()) {
      setSubscriptionMessage(
        "Enter your phone number to receive promotional text messages."
      );
      return;
    }

    setSubscriptionMessage(
      "Your Sweet Tey’s preferences have been saved for checkout."
    );
  }

  async function handlePayment() {
    if (items.length === 0) {
      setPaymentError("Your cart is empty.");
      return;
    }

    if (!email.trim()) {
      setPaymentError(
        "Enter your email address before continuing to payment."
      );
      return;
    }

    setIsStartingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            option: item.option,
            price: item.price,
            quantity: item.quantity,
          })),
          customerEmail: email.trim(),
        }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(
          data.error ??
            "We could not start Stripe Checkout. Please try again."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "We could not start Stripe Checkout. Please try again."
      );
      setIsStartingPayment(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
            Checkout
          </p>

          <h1 className="mt-3 font-serif text-5xl font-bold text-[#4b3428]">
            Complete Your Order
          </h1>

          <p className="mt-4 text-lg text-[#6b5548]">
            We&apos;re excited to bake something special for you!
          </p>
        </div>

        {items.length === 0 ? (
          <section className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
            <div className="text-5xl">🛒</div>

            <h2 className="mt-5 font-serif text-3xl font-bold text-[#4b3428]">
              Your cart is empty
            </h2>

            <p className="mt-4 leading-7 text-[#6b5548]">
              Add a few Sweet Tey&apos;s favorites before continuing
              to checkout.
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-full bg-[#ed6f91] px-7 py-4 font-bold text-white transition hover:bg-[#d85d80]"
            >
              Return to the Bakery
            </Link>
          </section>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-8">
              {/* Customer information */}
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  Customer Information
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      First name
                    </span>

                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      required
                      className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      Last name
                    </span>

                    <input
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      required
                      className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      Email address
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      Phone number
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      autoComplete="tel"
                      required
                      className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      Birthday
                      <span className="ml-1 font-normal text-[#7a6a61]">
                        (optional)
                      </span>
                    </span>

                    <input
                      type="date"
                      name="birthday"
                      autoComplete="bday"
                      className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    />
                  </label>
                </div>
              </div>

              {/* Pickup or delivery */}
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  Pickup or Delivery
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setOrderType("pickup")}
                    className={`rounded-2xl border px-5 py-5 text-left transition ${
                      orderType === "pickup"
                        ? "border-[#ed6f91] bg-pink-50"
                        : "border-pink-100 hover:bg-pink-50"
                    }`}
                  >
                    <span className="block font-bold text-[#4b3428]">
                      Pickup
                    </span>

                    <span className="mt-1 block text-sm text-[#6b5548]">
                      Pick up your order at the arranged location.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType("delivery")}
                    className={`rounded-2xl border px-5 py-5 text-left transition ${
                      orderType === "delivery"
                        ? "border-[#ed6f91] bg-pink-50"
                        : "border-pink-100 hover:bg-pink-50"
                    }`}
                  >
                    <span className="block font-bold text-[#4b3428]">
                      Local Delivery
                    </span>

                    <span className="mt-1 block text-sm text-[#6b5548]">
                      Delivery availability and fees are confirmed at
                      checkout.
                    </span>
                  </button>
                </div>

                {orderType === "delivery" && (
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                        Street address
                      </span>

                      <input
                        type="text"
                        name="streetAddress"
                        autoComplete="street-address"
                        required
                        className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                        City
                      </span>

                      <input
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        required
                        className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                        ZIP code
                      </span>

                      <input
                        type="text"
                        name="postalCode"
                        autoComplete="postal-code"
                        required
                        className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Scheduling */}
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  {orderType === "pickup"
                    ? "Pickup Details"
                    : "Delivery Details"}
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      Preferred date
                    </span>

                    <input
                      type="date"
                      name="orderDate"
                      min={minimumDate}
                      required
                      className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      Preferred time
                    </span>

                    <select
                      name="orderTime"
                      required
                      defaultValue=""
                      className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="" disabled>
                        Choose a time
                      </option>

                      {pickupTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                    Special instructions
                  </span>

                  <textarea
                    rows={5}
                    name="specialInstructions"
                    placeholder="Allergies, colors, event details, or other requests..."
                    className="w-full resize-none rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition placeholder:text-[#a89589] focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                  />
                </label>
              </div>

              {/* Gift options */}
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  Gift Options
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                      Occasion
                    </span>

                    <select
                      name="occasion"
                      defaultValue=""
                      className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="">No occasion selected</option>

                      {occasions.map((occasion) => (
                        <option key={occasion} value={occasion}>
                          {occasion}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                    Gift message
                  </span>

                  <textarea
                    rows={5}
                    name="giftMessage"
                    placeholder="Write a sweet message..."
                    className="w-full resize-none rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition placeholder:text-[#a89589] focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                  />
                </label>
              </div>

              {/* Rewards and subscriptions */}
              <form
                onSubmit={handleSubscribe}
                className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-8 shadow-lg"
              >
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
                  Stay Connected
                </p>

                <h2 className="mt-3 font-serif text-3xl font-bold text-[#4b3428]">
                  Sweet Rewards &amp; Sweet Updates
                </h2>

                <p className="mt-3 leading-7 text-[#6b5548]">
                  Receive seasonal menu announcements, holiday preorder
                  reminders, special offers, birthday surprises, and
                  exclusive Sweet Tey&apos;s promotions.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pink-100 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={joinRewards}
                      onChange={(event) =>
                        setJoinRewards(event.target.checked)
                      }
                      className="mt-1 h-5 w-5 accent-[#ed6f91]"
                    />

                    <span>
                      <span className="block font-bold text-[#4b3428]">
                        Join Sweet Rewards
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-[#6b5548]">
                        Earn rewards, receive birthday surprises, and get
                        early access to seasonal desserts.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pink-100 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={emailUpdates}
                      onChange={(event) =>
                        setEmailUpdates(event.target.checked)
                      }
                      className="mt-1 h-5 w-5 accent-[#ed6f91]"
                    />

                    <span>
                      <span className="block font-bold text-[#4b3428]">
                        Email me promotions and bakery updates
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-[#6b5548]">
                        Receive new menu announcements, seasonal flavors,
                        flash sales, and event updates.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pink-100 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={textUpdates}
                      onChange={(event) =>
                        setTextUpdates(event.target.checked)
                      }
                      className="mt-1 h-5 w-5 accent-[#ed6f91]"
                    />

                    <span>
                      <span className="block font-bold text-[#4b3428]">
                        Text me promotional updates
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-[#6b5548]">
                        Receive limited-time offers, preorder reminders,
                        and special announcements by text.
                      </span>
                    </span>
                  </label>
                </div>

                <p className="mt-5 text-xs leading-5 text-[#7a6a61]">
                  Email and text marketing are optional and are not
                  required to place an order. By selecting text updates,
                  you agree to receive recurring promotional messages from
                  Sweet Tey&apos;s Pastries. Message and data rates may
                  apply. Reply STOP to unsubscribe.
                </p>

                <button
                  type="submit"
                  className="mt-6 rounded-full bg-[#4b3428] px-7 py-4 font-bold text-white transition hover:bg-[#5b4135]"
                >
                  Subscribe to Sweet Updates
                </button>

                {subscriptionMessage && (
                  <p
                    role="status"
                    className="mt-4 text-sm font-bold text-[#6b8a64]"
                  >
                    {subscriptionMessage}
                  </p>
                )}
              </form>
            </section>

            {/* Order summary */}
            <aside className="sticky top-24 h-fit rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                Order Summary
              </h2>

              <div className="mt-7 space-y-5">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="border-b border-pink-100 pb-5 last:border-b-0"
                  >
                    <div className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-pink-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[#4b3428]">
                          {item.name}
                        </h3>

                        {item.option && (
                          <p className="mt-1 text-sm leading-5 text-[#7a6a61]">
                            {item.option}
                          </p>
                        )}

                        <div className="mt-2 flex items-center justify-between gap-4">
                          <span className="text-sm text-[#6b5548]">
                            Qty {item.quantity}
                          </span>

                          <span className="font-bold text-[#4b3428]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 space-y-4 border-t border-pink-100 pt-6">
                <div className="flex justify-between gap-4">
                  <span className="text-[#6b5548]">
                    Subtotal
                  </span>

                  <span className="font-bold text-[#4b3428]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#6b5548]">
                    Estimated tax (9.25%)
                  </span>

                  <span className="font-bold text-[#4b3428]">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#6b5548]">
                    {orderType === "pickup"
                      ? "Pickup"
                      : "Delivery"}
                  </span>

                  <span className="font-bold text-[#4b3428]">
                    {orderType === "pickup"
                      ? "Free"
                      : "Calculated later"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-t border-pink-100 pt-4 text-2xl font-bold text-[#ed6f91]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isStartingPayment || items.length === 0}
                className="mt-8 w-full rounded-full bg-[#ed6f91] py-4 text-lg font-bold text-white transition hover:bg-[#d85d80] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStartingPayment
                  ? "Opening Secure Payment..."
                  : "Continue to Payment"}
              </button>

              {paymentError && (
                <p
                  role="alert"
                  className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700"
                >
                  {paymentError}
                </p>
              )}

              <p className="mt-5 text-center text-sm text-[#6b5548]">
                You&apos;ll be redirected to Stripe&apos;s secure payment page.
              </p>

              <Link
                href="/"
                className="mt-4 block text-center text-sm font-bold text-[#ed6f91] hover:underline"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}