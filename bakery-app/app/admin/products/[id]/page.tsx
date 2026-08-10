"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  base_price: number | string | null;
  price_label: string | null;
  badge: string | null;
  button_text: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_seasonal: boolean;
};

const standardCategories = [
  "Southern Desserts",
  "Cupcakes",
  "Cookies",
  "Macarons",
  "Chocolate Strawberries",
  "Tea",
  "Gift Boxes",
  "Other",
];

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      try {
        const response = await fetch(
          `/api/products/${encodeURIComponent(id)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = (await response.json()) as {
          product?: Product;
          error?: string;
        };

        if (!response.ok || !result.product) {
          throw new Error(
            result.error ?? "The product could not be loaded."
          );
        }

        if (isActive) {
          setProduct(result.product);
          setImageUrl(result.product.image_url ?? "");
        }
      } catch (error) {
        if (isActive) {
          setMessage(
            error instanceof Error
              ? error.message
              : "The product could not be loaded."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      void loadProduct();
    }

    return () => {
      isActive = false;
    };
  }, [id]);

  const categories = useMemo(() => {
    if (!product) {
      return standardCategories;
    }

    return standardCategories.includes(product.category)
      ? standardCategories
      : [product.category, ...standardCategories];
  }, [product]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!product) {
      return;
    }

    setMessage("");
    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch(
        `/api/products/${encodeURIComponent(product.id)}`,
        {
          method: "PUT",
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
        }
      );

      const result = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "The product could not be updated."
        );
      }

      router.replace("/admin/products");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The product could not be updated."
      );
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-pink-100 bg-white p-8 text-[#4b3428] shadow-sm">
          Loading product…
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-3xl font-bold text-[#4b3428]">
            Product could not be loaded
          </h1>

          <p className="mt-4 text-red-700">
            {message || "The product was not found."}
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-flex rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white"
          >
            Return to products
          </Link>
        </div>
      </main>
    );
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
              Edit Product
            </h1>

            <p className="mt-2 leading-7 text-[#6b5548]">
              Update {product.name}&apos;s information,
              pricing, image, and availability.
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
        <form
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
                  defaultValue={product.name}
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
                  defaultValue={product.slug}
                  pattern="[a-zA-Z0-9 -]+"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />

                <span className="mt-2 block text-xs leading-5 text-[#7a6a61]">
                  Spaces will automatically become hyphens after
                  saving.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Category
                </span>

                <select
                  name="category"
                  required
                  defaultValue={product.category}
                  className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                >
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
                  defaultValue={product.description ?? ""}
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
                    defaultValue={Number(
                      product.base_price ?? 0
                    )}
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
                  defaultValue={product.price_label ?? ""}
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
                  defaultValue={product.badge ?? ""}
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
                  defaultValue={
                    product.button_text ?? "Add to Cart"
                  }
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#4b3428]">
                  Image URL
                </span>

                <input
                  name="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(event) =>
                    setImageUrl(event.target.value)
                  }
                  placeholder="/images/product-name.jpg"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100"
                />
              </label>

              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-bold text-[#4b3428]">
                  Current image
                </p>

                <div className="h-64 overflow-hidden rounded-2xl border border-pink-100 bg-pink-50">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl">
                      🍰
                    </div>
                  )}
                </div>
              </div>
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
                  defaultChecked={product.is_available}
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
                  defaultChecked={product.is_featured}
                  className="mt-1 h-5 w-5 accent-[#ed6f91]"
                />

                <span>
                  <span className="block font-bold text-[#4b3428]">
                    Featured
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-[#6b5548]">
                    Highlight this product in featured areas.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pink-100 bg-[#fffaf7] p-4">
                <input
                  name="isSeasonal"
                  type="checkbox"
                  defaultChecked={product.is_seasonal}
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
            <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {message}
            </p>
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
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}