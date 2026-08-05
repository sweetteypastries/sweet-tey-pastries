import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/components/supabase/admin";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

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

function getRequiredText(
  formData: FormData,
  field: string
) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function getOptionalText(
  formData: FormData,
  field: string
) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

async function updateProduct(formData: FormData) {
  "use server";

  const id = getRequiredText(formData, "id");
  const name = getRequiredText(formData, "name");

  const slug = getRequiredText(formData, "slug")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const category = getRequiredText(
    formData,
    "category"
  );

  const priceValue = Number(
    formData.get("basePrice")
  );

  if (
    !Number.isFinite(priceValue) ||
    priceValue < 0
  ) {
    throw new Error(
      "Base price must be a valid positive number."
    );
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .update({
      slug,
      name,
      category,
      description: getOptionalText(
        formData,
        "description"
      ),
      image_url: getOptionalText(
        formData,
        "imageUrl"
      ),
      base_price: priceValue,
      price_label: getOptionalText(
        formData,
        "priceLabel"
      ),
      badge: getOptionalText(
        formData,
        "badge"
      ),
      button_text:
        getOptionalText(
          formData,
          "buttonText"
        ) ?? "Add to Cart",
      is_available:
        formData.get("isAvailable") === "on",
      is_featured:
        formData.get("isFeatured") === "on",
      is_seasonal:
        formData.get("isSeasonal") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Unable to update product:",
      error
    );

    throw new Error(
      error.code === "23505"
        ? "Another product already uses this slug."
        : "The product could not be updated."
    );
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/");

  redirect("/admin/products");
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        name,
        category,
        description,
        image_url,
        base_price,
        price_label,
        badge,
        button_text,
        is_available,
        is_featured,
        is_seasonal
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load product:",
      error
    );
  }

  if (!data) {
    notFound();
  }

  const product = data as Product;

  const categories = standardCategories.includes(
    product.category
  )
    ? standardCategories
    : [product.category, ...standardCategories];

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
          action={updateProduct}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={product.id}
          />

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
                  Spaces will automatically become
                  hyphens after saving.
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
                  defaultValue={
                    product.description ?? ""
                  }
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
                  defaultValue={
                    product.price_label ?? ""
                  }
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
                  defaultValue={
                    product.badge ?? ""
                  }
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
                    product.button_text ??
                    "Add to Cart"
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
                  defaultValue={
                    product.image_url ?? ""
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
                  {product.image_url ? (
                    <img
                      src={product.image_url}
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
                  defaultChecked={
                    product.is_available
                  }
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
                  defaultChecked={
                    product.is_featured
                  }
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
                  defaultChecked={
                    product.is_seasonal
                  }
                  className="mt-1 h-5 w-5 accent-[#ed6f91]"
                />

                <span>
                  <span className="block font-bold text-[#4b3428]">
                    Seasonal
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-[#6b5548]">
                    Mark this as a limited seasonal
                    item.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="rounded-full border border-pink-200 bg-white px-7 py-4 text-center font-bold text-[#4b3428] transition hover:bg-pink-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-full bg-[#ed6f91] px-8 py-4 font-bold text-white transition hover:bg-[#d95f82]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}