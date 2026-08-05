"use client";

import ProductSection from "../Bakery/ProductSection";
import { products } from "./productData";

export default function Cupcakes() {
  return (
    <ProductSection
      badge="Fresh Daily"
      badgeColor="bg-pink-100 text-pink-700"
      title="Gourmet Cupcakes"
      description="Freshly baked gourmet cupcakes topped with rich homemade frosting and handcrafted with the same love and care that goes into every Sweet Tey's Pastries creation."
      products={products}
    />
  );
}