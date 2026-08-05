"use client";

import ProductSection from "../Bakery/ProductSection";
import { products } from "./productData";

export default function ChocolateCoveredStrawberries() {
  return (
    <ProductSection
      badge="Customer Favorite"
      badgeColor="bg-pink-100 text-pink-700"
      title="Chocolate-Covered Strawberries"
      description="Fresh strawberries hand-dipped in premium chocolate and made to order by the dozen. Choose your chocolate style and personalize your order with delicious add-ons."
      products={products}
    />
  );
}