import type { DessertProduct } from "@/components/Bakery/catalogTypes";

export const LOVE_ME_TEA_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23fff3f6'/%3E%3Ctext x='400' y='335' text-anchor='middle' font-size='190'%3E%E2%98%95%3C/text%3E%3C/svg%3E";

export const loveMeTeaProduct: DessertProduct = {
  id: "love-me-loose-leaf-tea",
  name: "Love Me Loose Leaf Tea",
  category: "tea",
  badge: "Organic • Caffeine-Free",
  description:
    "Love Me organic caffeine-free loose leaf tea packaged in a compostable bag.",
  buttonText: "Add Tea to Cart",
  flavors: [
    {
      id: "one-bag",
      name: "One Bag",
      image: LOVE_ME_TEA_IMAGE,
      description:
        "One compostable bag of Love Me organic caffeine-free loose leaf tea.",
      price: 10.99,
    },
  ],
};
