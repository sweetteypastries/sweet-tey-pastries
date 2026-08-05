"use client";

import ProductCard from "./ProductCard";
import type { DessertProduct } from "./catalogTypes";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ProductSectionProps {
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  products: DessertProduct[];
  onAddToCart?: (item: CartItem) => void;
}

export default function ProductSection({
  badge,
  badgeColor = "bg-pink-100 text-pink-700",
  title,
  description,
  products,
  onAddToCart,
}: ProductSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-14 text-center">
        {badge && (
          <span
            className={`inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider ${badgeColor}`}
          >
            {badge}
          </span>
        )}

        <h2 className="mt-6 font-serif text-5xl font-bold text-[#4b3428]">
          {title}
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#6b5548]">
          {description}
        </p>
      </div>

      {products.length === 1 ? (
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <ProductCard
              product={products[0]}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}