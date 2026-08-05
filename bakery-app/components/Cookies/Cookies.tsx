"use client";

import ProductSection from "../Bakery/ProductSection";
import { cookieProducts } from "./productData";

export default function Cookies() {
  return (
    <ProductSection
      badge="Baked Fresh"
      badgeColor="bg-amber-100 text-amber-800"
      title="Gourmet Cookies"
      description="Freshly baked gourmet cookies made from scratch using premium ingredients. Choose a Half Dozen, a Full Dozen, or Sweet Tey's Mystery Cookie Box filled with a surprise assortment of customer favorites."
      products={cookieProducts}
    />
  );
}