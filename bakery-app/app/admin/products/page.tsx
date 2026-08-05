import Link from "next/link";
import { createClient } from "@/components/supabase/server";

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

function formatPrice(product: Product) {
  if (product.price_label?.trim()) {
    return product.price_label;
  }

  const numericPrice = Number(product.base_price ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
}

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const {
    data: products,
    error,
  } = await supabase
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load products:", error);
  }

  const productList = (products ?? []) as Product[];

  const categories = [
    "All Products",
    ...Array.from(
      new Set(
        productList
          .map((product) => product.category)
          .filter(Boolean)
      )
    ),
  ];

  return (
    <main className="min-h-screen">
      <header className="border-b border-pink-100 bg-[#fff1f5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed6f91]">
              Product Management
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold text-[#4b3428]">
              Products
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-[#6b5548]">
              Manage menu items, prices, images, badges, and availability.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white transition hover:bg-[#d95f82]"
          >
            + Add Product
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    index === 0
                      ? "bg-[#ed6f91] text-white"
                      : "border border-pink-200 bg-white text-[#4b3428] hover:bg-pink-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-full border border-pink-200 px-5 py-3 text-[#4b3428] outline-none transition focus:border-[#ed6f91] focus:ring-2 focus:ring-pink-100 xl:max-w-sm"
            />
          </div>
        </section>

        {error ? (
          <section className="mt-8 rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">⚠️</div>

            <h2 className="mt-4 font-serif text-2xl font-bold text-[#4b3428]">
              Products could not be loaded
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#6b5548]">
              Check your Supabase environment variables and the products table
              permissions, then refresh this page.
            </p>
          </section>
        ) : (
          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {productList.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-56 overflow-hidden bg-pink-50">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🍰
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-[#ed6f91]">
                        {product.category}
                      </p>

                      <h2 className="mt-2 font-serif text-2xl font-bold text-[#4b3428]">
                        {product.name}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        product.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.is_available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  {product.description && (
                    <p className="mt-4 line-clamp-3 leading-7 text-[#6b5548]">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.is_featured && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        Featured
                      </span>
                    )}

                    {product.is_seasonal && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        Seasonal
                      </span>
                    )}

                    {product.badge && (
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-5 font-serif text-3xl font-bold text-[#ed6f91]">
                    {formatPrice(product)}
                  </p>

                  <div className="mt-6">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="block rounded-full border border-pink-200 px-4 py-3 text-center text-sm font-bold text-[#4b3428] transition hover:bg-pink-50"
                    >
                      Edit Product
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <Link
              href="/admin/products/new"
              className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-pink-200 bg-white p-8 text-center transition hover:border-[#ed6f91] hover:bg-pink-50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl">
                +
              </div>

              <h2 className="mt-5 font-serif text-2xl font-bold text-[#4b3428]">
                Add a New Product
              </h2>

              <p className="mt-3 max-w-xs leading-7 text-[#6b5548]">
                Create a new dessert, tea, seasonal item, or gift box.
              </p>
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}