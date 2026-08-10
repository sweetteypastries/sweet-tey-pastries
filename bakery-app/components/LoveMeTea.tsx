"use client";

import { useState } from "react";
import { useCart } from "@/components/Cart/CartContext";
import {
  LOVE_ME_TEA_IMAGE,
  loveMeTeaProduct,
} from "@/components/LoveMeTeaData";

export default function LoveMeTea() {
  const { addItem } = useCart();
  const [message, setMessage] = useState("");

  const teaOption = loveMeTeaProduct.flavors[0];

  function addTeaToCart() {
    addItem({
      id: `${loveMeTeaProduct.id}-${teaOption.id}`,
      productId: loveMeTeaProduct.id,
      flavorId: teaOption.id,
      name: loveMeTeaProduct.name,
      option: teaOption.name,
      price: teaOption.price ?? 10.99,
      quantity: 1,
      image: LOVE_ME_TEA_IMAGE,
    });

    setMessage("Love Me Tea has been added to your cart.");
  }

  return (
    <section className="bg-[#fffaf7] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91]">
            Love Me Tea
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold text-[#4b3428] sm:text-5xl">
            Organic Loose Leaf Tea
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#6b5548]">
            A comforting organic, caffeine-free loose leaf tea made
            for slowing down, relaxing, and enjoying something sweet.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <article className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-lg">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-pink-50 to-[#fffaf7] p-10">
                <div className="text-center">
                  <div className="text-8xl" aria-hidden="true">
                    ☕
                  </div>

                  <p className="mt-5 font-serif text-2xl font-bold text-[#4b3428]">
                    Love Me
                  </p>

                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
                    Loose Leaf Tea
                  </p>
                </div>
              </div>

              <div className="flex flex-col p-8 sm:p-10">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f7eee4] px-4 py-2 text-xs font-bold text-[#8a6339]">
                    Organic
                  </span>

                  <span className="rounded-full bg-[#f1f7ec] px-4 py-2 text-xs font-bold text-[#607b52]">
                    Caffeine-Free
                  </span>

                  <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-bold text-[#ed6f91]">
                    Compostable Bag
                  </span>
                </div>

                <h3 className="mt-6 font-serif text-3xl font-bold text-[#4b3428]">
                  Love Me Loose Leaf Tea
                </h3>

                <p className="mt-4 leading-7 text-[#6b5548]">
                  Organic caffeine-free loose leaf tea packaged in a
                  compostable bag. Enjoy it on its own or pair it with
                  your favorite Sweet Tey&apos;s dessert.
                </p>

                <div className="mt-7 rounded-2xl bg-[#fffaf7] p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#7a6a61]">
                        One Bag
                      </p>

                      <p className="mt-1 font-serif text-4xl font-bold text-[#ed6f91]">
                        $10.99
                      </p>
                    </div>

                    <span className="text-4xl" aria-hidden="true">
                      🌿
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-5 text-sm leading-6 text-[#6b5548]">
                  <strong className="text-[#4b3428]">
                    Fulfillment options:
                  </strong>
                  <br />
                  Pickup
                  <br />
                  Marin County local delivery
                  <br />
                  Tea shipping — $8.00
                </div>

                <button
                  type="button"
                  onClick={addTeaToCart}
                  className="mt-7 w-full rounded-full bg-[#ed6f91] px-6 py-4 font-bold text-white transition hover:bg-[#d85d80]"
                >
                  Add Tea to Cart — $10.99
                </button>

                {message && (
                  <p
                    role="status"
                    className="mt-4 text-center text-sm font-bold text-[#607b52]"
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
