"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  type FormEvent,
} from "react";
import ImageUploader from "@/components/ImageUploader";

const categories = [
  "Southern Desserts",
  "Cupcakes",
  "Cookies",
  "Macarons",
  "Chocolate Strawberries",
  "Tea",
  "Gift Boxes",
  "Other",
];

type ApiResponse = {
  error?: string;
  message?: string;
  id?: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSaving(true);
    setMessage("");
    setHasError(false);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          slug: formData.get("slug"),
          category: formData.get("category"),
          description: formData.get("description"),
          imageUrl: formData.get("imageUrl"),
          basePrice: formData.get("basePrice"),
          priceLabel: formData.get("priceLabel"),
          badge: formData.get("badge"),
          buttonText: formData.get("buttonText"),
          isAvailable:
            formData.get("isAvailable") === "on",
          isFeatured:
            formData.get("isFeatured") === "on",
          isSeasonal:
            formData.get("isSeasonal") === "on",
        }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        throw new Error(
          result.error || "The product could not be saved."
        );
      }

      setMessage("Product saved successfully.");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Product submission failed:", error);

      setHasError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "The product could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Product Management
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
              Add Product
            </h1>

            <p className="mt-2 leading-7 text-[#6b5548]">
              Add a new dessert, tea, seasonal item,
              or gift box to your database.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="inline-flex w-fit items-center justify-center rounded-full border border-pink-200 bg-white px-6 py-3 font-bold text-[#4b3428] transition hover:bg-pink-50"
          >
            Cancel
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <form noValidate
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
              Basic Information
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Product name
                </span>

                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Peach Cobbler Cheesecake"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Slug
                </span>

                <input
                  name="slug"
                  type="text"
                  required
                  placeholder="peach-cobbler-cheesecake"
                  pattern="[a-zA-Z0-9 -]+"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />

                <span className="mt-2 block text-xs leading-5 text-[#7a6a61]">
                  Use a unique name. Spaces are converted
                  to hyphens.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Category
                </span>

                <select
                  name="category"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                >
                  <option value="" disabled>
                    Choose a category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Description
                </span>

                <textarea
                  name="description"
                  rows={5}
                  placeholder="Describe the product, texture, flavor, and ideal occasion..."
                  className="w-full resize-none rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition placeholder:text-[#a89589] focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
              Price and Display
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Base price
                </span>

                <div className="flex overflow-hidden rounded-xl border border-pink-200 bg-white focus-within:border-[#ed6f91] focus-within:ring-2 focus-within:ring-pink-100">
                  <span className="flex items-center border-r border-pink-200 px-4 font-bold text-[#6b5548]">
                    $
                  </span>

                  <input
                    name="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="45.00"
                    className="min-w-0 flex-1 px-4 py-3 text-[#4b3428] outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Price label
                  <span className="ml-1 font-normal text-[#7a6a61]">
                    (optional)
                  </span>
                </span>

                <input
                  name="priceLabel"
                  type="text"
                  placeholder="From $45.00"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Badge
                  <span className="ml-1 font-normal text-[#7a6a61]">
                    (optional)
                  </span>
                </span>

                <input
                  name="badge"
                  type="text"
                  placeholder="Best Seller"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Button text
                </span>

                <input
                  name="buttonText"
                  type="text"
                  defaultValue="Add to Cart"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />
              </label>

              <ImageUploader />
            </div>
          </section>

          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-[#4b3428]">
              Availability
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pink-100 bg-[#fffaf7] p-4">
                <input
                  name="isAvailable"
                  type="checkbox"
                  defaultChecked
                  className="mt-1 h-5 w-5 accent-[#ed6f91]"
                />

                <span>
                  <span className="block font-bold text-[#4b3428]">
                    Available
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-[#6b5548]">
                    Show this product as available.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pink-100 bg-[#fffaf7] p-4">
                <input
                  name="isFeatured"
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-[#ed6f91]"
                />

                <span>
                  <span className="block font-bold text-[#4b3428]">
                    Featured
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-[#6b5548]">
                    Highlight this product in featured
                    areas.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pink-100 bg-[#fffaf7] p-4">
                <input
                  name="isSeasonal"
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-[#ed6f91]"
                />

                <span>
                  <span className="block font-bold text-[#4b3428]">
                    Seasonal
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-[#6b5548]">
                    Mark this as a limited seasonal item.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {message && (
            <div
              role="status"
              className={`rounded-2xl border px-5 py-4 font-bold ${
                hasError
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="rounded-full border border-pink-200 bg-white px-7 py-4 text-center font-bold text-[#4b3428] transition hover:bg-pink-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-[#ed6f91] px-8 py-4 font-bold text-white transition hover:bg-[#d95f82] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving Product..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}