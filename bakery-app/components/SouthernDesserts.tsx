"use client";

import ProductSection from "./Bakery/ProductSection";
import { products } from "./SouthernDesserts/productData";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface SouthernDessertsProps {
  onAddToCart?: (item: CartItem) => void;
}

export default function SouthernDesserts({
  onAddToCart,
}: SouthernDessertsProps) {
  return (
    <ProductSection
      badge="Sweet Tey's Pastries"
      badgeColor="bg-pink-100 text-pink-700"
      title="Southern Desserts"
      description="Every dessert is handcrafted from scratch using family recipes, premium ingredients, and a whole lot of Southern love."
      products={products}
      onAddToCart={onAddToCart}
    />
  );
}