"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useCart } from "@/components/Cart/CartContext";

const DELIVERY_FEE = 10;
const TEA_SHIPPING_FEE = 8;
const TEA_PRODUCT_ID =
  "love-me-loose-leaf-tea";

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

type OrderType =
  | "pickup"
  | "delivery"
  | "shipping";

type TipChoice =
  | 0
  | 10
  | 15
  | 20
  | "custom";

export default function CheckoutPage() {
  const { items, subtotal } =
    useCart();

  const [orderType, setOrderType] =
    useState<OrderType>("pickup");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [birthday, setBirthday] =
    useState("");

  const [
    streetAddress,
    setStreetAddress,
  ] = useState("");

  const [city, setCity] =
    useState("");

  const [postalCode, setPostalCode] =
    useState("");

  const [
    preferredDate,
    setPreferredDate,
  ] = useState("");

  const [
    preferredTime,
    setPreferredTime,
  ] = useState("");

  const [
    specialInstructions,
    setSpecialInstructions,
  ] = useState("");

  const [occasion, setOccasion] =
    useState("");

  const [
    giftMessage,
    setGiftMessage,
  ] = useState("");

  /*
   * 15% is selected automatically.
   * Customers can switch to:
   * No Tip / 10% / 15% / 20% / Custom
   */
  const [
    tipChoice,
    setTipChoice,
  ] = useState<TipChoice>(15);

  const [
    customTipInput,
    setCustomTipInput,
  ] = useState("");

  /*
   * Requested defaults:
   * Rewards = selected
   * Email = selected
   * Text = not selected
   */
  const [
    joinRewards,
    setJoinRewards,
  ] = useState(true);

  const [
    emailUpdates,
    setEmailUpdates,
  ] = useState(true);

  const [
    textUpdates,
    setTextUpdates,
  ] = useState(false);

  const [
    subscriptionMessage,
    setSubscriptionMessage,
  ] = useState("");

  const [
    isStartingPayment,
    setIsStartingPayment,
  ] = useState(false);

  const [
    paymentError,
    setPaymentError,
  ] = useState("");

  const minimumDate =
    useMemo(() => {
      return new Date()
        .toISOString()
        .split("T")[0];
    }, []);

  const hasTea =
    items.some(
      (item) =>
        item.productId ===
        TEA_PRODUCT_ID
    );

  const hasNonTea =
    items.some(
      (item) =>
        item.productId !==
        TEA_PRODUCT_ID
    );

  const teaShippingEligible =
    items.length > 0 &&
    hasTea &&
    !hasNonTea;

  const deliveryPromoDateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const deliveryPromoDatePart = (type: string) =>
    deliveryPromoDateParts.find((part) => part.type === type)?.value ?? "";

  const deliveryPromoToday =
    `${deliveryPromoDatePart("year")}-${deliveryPromoDatePart("month")}-${deliveryPromoDatePart("day")}`;

  const deliveryPromoMarinZips = new Set(["94901", "94903", "94904", "94920", "94924", "94925", "94929", "94930", "94933", "94937", "94938", "94939", "94940", "94941", "94942", "94945", "94946", "94947", "94948", "94949", "94950", "94956", "94957", "94960", "94963", "94964", "94965", "94966", "94970", "94971", "94973", "94998"]);

  const deliveryPromoZip =
    postalCode.match(/\d{5}/)?.[0] ?? "";

  const thanksgivingDeliveryWeek =
    preferredDate >= "2026-11-23" &&
    preferredDate < "2026-11-30";

  const thanksgivingFreeDelivery =
    thanksgivingDeliveryWeek &&
    deliveryPromoMarinZips.has(deliveryPromoZip);

  const deliveryFee =
    orderType === "delivery" && !thanksgivingFreeDelivery
      ? DELIVERY_FEE
      : 0;

  const shippingFee =
    orderType === "shipping"
      ? TEA_SHIPPING_FEE
      : 0;

  const parsedCustomTip =
    Number(customTipInput);

  const customTipAmount =
    tipChoice === "custom" &&
    Number.isFinite(
      parsedCustomTip
    ) &&
    parsedCustomTip >= 0
      ? parsedCustomTip
      : 0;

  const tipAmount =
    tipChoice === "custom"
      ? customTipAmount
      : subtotal *
        (tipChoice / 100);

  const tipPercent =
    tipChoice === "custom"
      ? 0
      : tipChoice;

  const totalBeforeTax =
    subtotal +
    deliveryFee +
    shippingFee +
    tipAmount;

  function handleSubscribe(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !joinRewards &&
      !emailUpdates &&
      !textUpdates
    ) {
      setSubscriptionMessage(
        "All Sweet Rewards and marketing preferences are currently turned off."
      );

      return;
    }

    if (
      (
        joinRewards ||
        emailUpdates
      ) &&
      !email.trim()
    ) {
      setSubscriptionMessage(
        "Enter your email address to use Sweet Rewards or receive email updates."
      );

      return;
    }

    if (
      textUpdates &&
      !phone.trim()
    ) {
      setSubscriptionMessage(
        "Enter your phone number to receive text updates."
      );

      return;
    }

    setSubscriptionMessage(
      "Your Sweet Rewards and communication preferences are ready for checkout."
    );
  }

  async function handlePayment() {
    if (items.length === 0) {
      setPaymentError(
        "Your cart is empty."
      );

      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setPaymentError(
        "Enter your first and last name."
      );

      return;
    }

    if (!email.trim()) {
      setPaymentError(
        "Enter your email address."
      );

      return;
    }

    if (!phone.trim()) {
      setPaymentError(
        "Enter your phone number."
      );

      return;
    }

    if (
      orderType ===
        "shipping" &&
      !teaShippingEligible
    ) {
      setPaymentError(
        "Shipping is available only for Love Me Tea orders."
      );

      return;
    }

    if (
      orderType !==
        "shipping" &&
      (
        !preferredDate ||
        !preferredTime
      )
    ) {
      setPaymentError(
        "Choose your preferred date and time."
      );

      return;
    }

    if (
      (
        orderType ===
          "delivery" ||
        orderType ===
          "shipping"
      ) &&
      (
        !streetAddress.trim() ||
        !city.trim() ||
        !postalCode.trim()
      )
    ) {
      setPaymentError(
        orderType ===
          "shipping"
          ? "Enter your tea shipping address."
          : "Enter your Marin County delivery address."
      );

      return;
    }

    if (
      tipChoice === "custom"
    ) {
      if (
        !customTipInput.trim()
      ) {
        setPaymentError(
          "Enter your custom tip amount, or choose No Tip."
        );

        return;
      }

      const customAmount =
        Number(
          customTipInput
        );

      if (
        !Number.isFinite(
          customAmount
        ) ||
        customAmount < 0
      ) {
        setPaymentError(
          "Enter a valid custom tip amount."
        );

        return;
      }
    }

    setIsStartingPayment(
      true
    );

    setPaymentError("");

    try {
      const response =
        await fetch(
          "/api/checkout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              items:
                items.map(
                  (item) => ({
                    productId:
                      item.productId,

                    flavorId:
                      item.flavorId,

                    sizeId:
                      item.sizeId,

                    addonIds:
                      item.addonIds,

                    quantity:
                      item.quantity,
                  })
                ),

              customerEmail:
                email
                  .trim()
                  .toLowerCase(),

              checkoutDetails: {
                firstName:
                  firstName.trim(),

                lastName:
                  lastName.trim(),

                phone:
                  phone.trim(),

                birthday:
                  birthday || null,

                orderType,

                streetAddress:
                  orderType ===
                  "pickup"
                    ? null
                    : streetAddress.trim(),

                city:
                  orderType ===
                  "pickup"
                    ? null
                    : city.trim(),

                postalCode:
                  orderType ===
                  "pickup"
                    ? null
                    : postalCode.trim(),

                preferredDate:
                  orderType ===
                  "shipping"
                    ? null
                    : preferredDate,

                preferredTime:
                  orderType ===
                  "shipping"
                    ? null
                    : preferredTime,

                specialInstructions:
                  specialInstructions.trim() ||
                  null,

                occasion:
                  occasion ||
                  null,

                giftMessage:
                  giftMessage.trim() ||
                  null,

                tipPercent,

                customTipAmount:
                  tipChoice ===
                  "custom"
                    ? customTipInput.trim()
                    : null,

                joinRewards,
                emailUpdates,
                textUpdates,
              },
            }),
          }
        );

      const data =
        (await response.json()) as {
          url?: string;
          error?: string;
        };

      if (
        !response.ok ||
        !data.url
      ) {
        throw new Error(
          data.error ??
            "We could not start Stripe Checkout."
        );
      }

      window.location.href =
        data.url;
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "We could not start Stripe Checkout."
      );

      setIsStartingPayment(
        false
      );
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
            We&apos;re excited to
            prepare something special
            for you!
          </p>
        </div>

        {items.length === 0 ? (
          <section className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
            <div className="text-5xl">
              🛒
            </div>

            <h2 className="mt-5 font-serif text-3xl font-bold text-[#4b3428]">
              Your cart is empty
            </h2>

            <Link
              href="/"
              className="mt-7 inline-block rounded-full bg-[#ed6f91] px-7 py-4 font-bold text-white"
            >
              Return to the Bakery
            </Link>
          </section>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-8">
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  Customer Information
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block font-bold text-[#4b3428]">
                      First Name
                    </span>

                    <input
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(
                          event.target.value
                        )
                      }
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-pink-200 px-4 py-3"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block font-bold text-[#4b3428]">
                      Last Name
                    </span>

                    <input
                      value={lastName}
                      onChange={(event) =>
                        setLastName(
                          event.target.value
                        )
                      }
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-pink-200 px-4 py-3"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block font-bold text-[#4b3428]">
                      Email
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      autoComplete="email"
                      className="w-full rounded-xl border border-pink-200 px-4 py-3"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block font-bold text-[#4b3428]">
                      Phone
                    </span>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      autoComplete="tel"
                      className="w-full rounded-xl border border-pink-200 px-4 py-3"
                    />
                  </label>

                  <label className="md:col-span-2">
                    <span className="mb-2 block font-bold text-[#4b3428]">
                      Birthday{" "}
                      <span className="font-normal text-[#7a6a61]">
                        (optional)
                      </span>
                    </span>

                    <input
                      type="date"
                      value={birthday}
                      onChange={(event) =>
                        setBirthday(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-pink-200 px-4 py-3"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  Fulfillment
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() =>
                      setOrderType(
                        "pickup"
                      )
                    }
                    className={`rounded-2xl border p-5 text-left ${
                      orderType ===
                      "pickup"
                        ? "border-[#ed6f91] bg-pink-50"
                        : "border-pink-100"
                    }`}
                  >
                    <strong className="block text-[#4b3428]">
                      Pickup
                    </strong>

                    <span className="text-sm text-[#6b5548]">
                      Free
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setOrderType(
                        "delivery"
                      )
                    }
                    className={`rounded-2xl border p-5 text-left ${
                      orderType ===
                      "delivery"
                        ? "border-[#ed6f91] bg-pink-50"
                        : "border-pink-100"
                    }`}
                  >
                    <strong className="block text-[#4b3428]">
                      Marin Delivery
                    </strong>

                    <span className="text-sm text-[#6b5548]">
                      {thanksgivingFreeDelivery
                        ? "Free — Thanksgiving Week"
                        : "$10.00"}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={
                      !teaShippingEligible
                    }
                    onClick={() =>
                      setOrderType(
                        "shipping"
                      )
                    }
                    className={`rounded-2xl border p-5 text-left ${
                      orderType ===
                      "shipping"
                        ? "border-[#ed6f91] bg-pink-50"
                        : "border-pink-100"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    <strong className="block text-[#4b3428]">
                      Tea Shipping
                    </strong>

                    <span className="text-sm text-[#6b5548]">
                      $8.00
                    </span>
                  </button>
                </div>

                {!teaShippingEligible &&
                  hasTea &&
                  hasNonTea && (
                    <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                      Shipping is available
                      for tea-only orders.
                      Mixed bakery orders
                      require pickup or
                      Marin delivery.
                    </p>
                  )}

                {orderType !==
                  "pickup" && (
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <label className="md:col-span-2">
                      <span className="mb-2 block font-bold text-[#4b3428]">
                        Street Address
                      </span>

                      <input
                        value={
                          streetAddress
                        }
                        onChange={(event) =>
                          setStreetAddress(
                            event.target.value
                          )
                        }
                        autoComplete="street-address"
                        className="w-full rounded-xl border border-pink-200 px-4 py-3"
                      />
                    </label>

                    <label>
                      <span className="mb-2 block font-bold text-[#4b3428]">
                        {orderType ===
                        "shipping"
                          ? "City / State"
                          : "City"}
                      </span>

                      <input
                        value={city}
                        onChange={(event) =>
                          setCity(
                            event.target.value
                          )
                        }
                        placeholder={
                          orderType ===
                          "shipping"
                            ? "San Rafael, CA"
                            : "Marin County city"
                        }
                        className="w-full rounded-xl border border-pink-200 px-4 py-3"
                      />
                    </label>

                    <label>
                      <span className="mb-2 block font-bold text-[#4b3428]">
                        ZIP Code
                      </span>

                      <input
                        value={
                          postalCode
                        }
                        onChange={(event) =>
                          setPostalCode(
                            event.target.value
                          )
                        }
                        autoComplete="postal-code"
                        className="w-full rounded-xl border border-pink-200 px-4 py-3"
                      />
                    </label>
                  </div>
                )}
              </div>

              {orderType !==
                "shipping" && (
                <div className="rounded-3xl bg-white p-8 shadow-lg">
                  <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                    {orderType ===
                    "pickup"
                      ? "Pickup Details"
                      : "Delivery Details"}
                  </h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <label>
                      <span className="mb-2 block font-bold text-[#4b3428]">
                        Preferred Date
                      </span>

                      <input
                        type="date"
                        min={minimumDate}
                        value={
                          preferredDate
                        }
                        onChange={(event) =>
                          setPreferredDate(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-pink-200 px-4 py-3"
                      />
                    </label>

                    <label>
                      <span className="mb-2 block font-bold text-[#4b3428]">
                        Preferred Time
                      </span>

                      <select
                        value={
                          preferredTime
                        }
                        onChange={(event) =>
                          setPreferredTime(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3"
                      >
                        <option value="">
                          Choose a time
                        </option>

                        {pickupTimes.map(
                          (time) => (
                            <option
                              key={
                                time
                              }
                              value={
                                time
                              }
                            >
                              {time}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  </div>
                </div>
              )}

              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                  Order Notes
                </h2>

                <label className="mt-6 block">
                  <span className="mb-2 block font-bold text-[#4b3428]">
                    Special Instructions
                  </span>

                  <textarea
                    rows={4}
                    value={
                      specialInstructions
                    }
                    onChange={(event) =>
                      setSpecialInstructions(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-pink-200 px-4 py-3"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block font-bold text-[#4b3428]">
                    Occasion
                  </span>

                  <select
                    value={occasion}
                    onChange={(event) =>
                      setOccasion(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3"
                  >
                    <option value="">
                      No occasion selected
                    </option>

                    {occasions.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block font-bold text-[#4b3428]">
                    Gift Message
                  </span>

                  <textarea
                    rows={3}
                    value={giftMessage}
                    onChange={(event) =>
                      setGiftMessage(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-pink-200 px-4 py-3"
                  />
                </label>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
                  Optional
                </p>

                <h2 className="mt-2 font-serif text-3xl font-bold text-[#4b3428]">
                  Add a Tip
                </h2>

                <p className="mt-3 text-[#6b5548]">
                  15% is selected
                  automatically. You can
                  change or remove your tip
                  before payment.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {(
                    [
                      0,
                      10,
                      15,
                      20,
                    ] as const
                  ).map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setTipChoice(
                            value
                          )
                        }
                        className={`rounded-2xl border px-4 py-4 font-bold ${
                          tipChoice ===
                          value
                            ? "border-[#ed6f91] bg-[#ed6f91] text-white"
                            : "border-pink-200 text-[#4b3428]"
                        }`}
                      >
                        {value === 0
                          ? "No Tip"
                          : `${value}%`}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setTipChoice(
                        "custom"
                      )
                    }
                    className={`rounded-2xl border px-4 py-4 font-bold ${
                      tipChoice ===
                      "custom"
                        ? "border-[#ed6f91] bg-[#ed6f91] text-white"
                        : "border-pink-200 text-[#4b3428]"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {tipChoice ===
                  "custom" && (
                  <label className="mt-5 block max-w-sm">
                    <span className="mb-2 block font-bold text-[#4b3428]">
                      Custom Tip Amount
                    </span>

                    <div className="flex items-center rounded-xl border border-pink-200 bg-white px-4">
                      <span className="font-bold text-[#4b3428]">
                        $
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={
                          customTipInput
                        }
                        onChange={(event) =>
                          setCustomTipInput(
                            event.target.value
                          )
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-3 outline-none"
                      />
                    </div>
                  </label>
                )}

                <p className="mt-5 font-bold text-[#6b5548]">
                  Tip: $
                  {tipAmount.toFixed(
                    2
                  )}
                  {tipChoice ===
                    "custom"
                    ? " (Custom)"
                    : tipChoice > 0
                      ? ` (${tipChoice}%)`
                      : ""}
                </p>
              </div>

              <form
                onSubmit={
                  handleSubscribe
                }
                className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-8 shadow-lg"
              >
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
                  Stay Connected
                </p>

                <h2 className="mt-3 font-serif text-3xl font-bold text-[#4b3428]">
                  Sweet Rewards &amp;
                  Sweet Updates
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6b5548]">
                  Rewards and email
                  updates are selected.
                  You may uncheck either
                  option before placing
                  your order.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer gap-3 rounded-2xl border border-pink-100 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={
                        joinRewards
                      }
                      onChange={(event) =>
                        setJoinRewards(
                          event.target.checked
                        )
                      }
                      className="mt-1 h-5 w-5 accent-[#ed6f91]"
                    />

                    <span className="font-bold text-[#4b3428]">
                      Join Sweet Rewards
                    </span>
                  </label>

                  <label className="flex cursor-pointer gap-3 rounded-2xl border border-pink-100 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={
                        emailUpdates
                      }
                      onChange={(event) =>
                        setEmailUpdates(
                          event.target.checked
                        )
                      }
                      className="mt-1 h-5 w-5 accent-[#ed6f91]"
                    />

                    <span className="font-bold text-[#4b3428]">
                      Email me promotions
                      and bakery updates
                    </span>
                  </label>

                  <label className="flex cursor-pointer gap-3 rounded-2xl border border-pink-100 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={
                        textUpdates
                      }
                      onChange={(event) =>
                        setTextUpdates(
                          event.target.checked
                        )
                      }
                      className="mt-1 h-5 w-5 accent-[#ed6f91]"
                    />

                    <span className="font-bold text-[#4b3428]">
                      Text me promotional
                      updates
                    </span>
                  </label>
                </div>

                <p className="mt-5 text-xs leading-5 text-[#7a6a61]">
                  These selections are
                  optional and are not
                  required to place an
                  order.
                </p>

                <button
                  type="submit"
                  className="mt-6 rounded-full bg-[#4b3428] px-7 py-4 font-bold text-white"
                >
                  Save Preferences
                </button>

                {subscriptionMessage && (
                  <p className="mt-4 text-sm font-bold text-[#6b8a64]">
                    {
                      subscriptionMessage
                    }
                  </p>
                )}
              </form>
            </section>

            <aside className="sticky top-24 h-fit rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
                Order Summary
              </h2>

              <div className="mt-6 space-y-5">
                {items.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="border-b border-pink-100 pb-4"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-bold text-[#4b3428]">
                            {
                              item.name
                            }
                          </p>

                          {item.option && (
                            <p className="mt-1 text-sm text-[#7a6a61]">
                              {
                                item.option
                              }
                            </p>
                          )}

                          <p className="mt-1 text-sm text-[#6b5548]">
                            Qty{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                        <strong className="text-[#4b3428]">
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(
                            2
                          )}
                        </strong>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-7 space-y-3">
                <div className="flex justify-between">
                  <span>
                    Merchandise
                  </span>

                  <strong>
                    $
                    {subtotal.toFixed(
                      2
                    )}
                  </strong>
                </div>

                {orderType === "delivery" && (
                  <div className="flex justify-between">
                    <span>
                      Marin Delivery
                    </span>

                    <strong>
                      {thanksgivingFreeDelivery
                        ? "Free — Thanksgiving Week"
                        : "$10.00"}
                    </strong>
                  </div>
                )}

                {shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Tea Shipping
                    </span>

                    <strong>
                      $8.00
                    </strong>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    Tip
                    {tipChoice ===
                    "custom"
                      ? " (Custom)"
                      : tipChoice > 0
                        ? ` (${tipChoice}%)`
                        : ""}
                  </span>

                  <strong>
                    $
                    {tipAmount.toFixed(
                      2
                    )}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>
                    Tax
                  </span>

                  <strong>
                    Calculated at payment
                  </strong>
                </div>

                <div className="flex justify-between border-t border-pink-100 pt-4 text-xl font-bold text-[#ed6f91]">
                  <span>
                    Before Tax
                  </span>

                  <span>
                    $
                    {totalBeforeTax.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handlePayment
                }
                disabled={
                  isStartingPayment
                }
                className="mt-8 w-full rounded-full bg-[#ed6f91] py-4 text-lg font-bold text-white disabled:opacity-60"
              >
                {isStartingPayment
                  ? "Opening Secure Payment..."
                  : "Continue to Payment"}
              </button>

              {paymentError && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm font-bold text-red-700">
                  {paymentError}
                </p>
              )}

              <Link
                href="/"
                className="mt-5 block text-center font-bold text-[#ed6f91]"
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
