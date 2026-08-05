"use client";

import ProductSection from "../Bakery/ProductSection";
import { macaronProducts } from "./productData";

export default function Macarons() {
  return (
    <ProductSection
      badge="Naturally Gluten-Free"
      badgeColor="bg-green-100 text-green-700"
      title="French Macarons"
      description="Light, crisp, and chewy French macarons handcrafted with premium almond flour. Every macaron is naturally gluten-free and made in small batches, with a delicious selection of classic and seasonal flavors."
      products={macaronProducts}
    />
  );
}