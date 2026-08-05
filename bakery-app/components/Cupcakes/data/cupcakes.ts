import type { DessertProduct } from "../../Bakery/catalogTypes";

const regularCupcakeFlavors = [
  {
    id: "vanilla",
    name: "Vanilla",
    image: "/images/cupcakes.jpg",
    description: "Classic vanilla cupcakes topped with homemade buttercream.",
    price: 20,
  },
  {
    id: "chocolate",
    name: "Chocolate",
    image: "/images/cupcakes.jpg",
    description: "Rich chocolate cupcakes with chocolate buttercream frosting.",
    price: 20,
  },
  {
    id: "strawberry",
    name: "Strawberry",
    image: "/images/cupcakes.jpg",
    description: "Strawberry cupcakes topped with strawberry buttercream.",
    price: 20,
  },
  {
    id: "cookies-cream",
    name: "Cookies & Cream",
    image: "/images/cupcakes.jpg",
    description: "Cupcakes topped with cookies and cream frosting.",
    price: 20,
  },
  {
    id: "lemon",
    name: "Lemon",
    image: "/images/cupcakes.jpg",
    description: "Light lemon cupcakes with lemon buttercream frosting.",
    price: 20,
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    image: "/images/cupcakes.jpg",
    description: "Southern red velvet cupcakes with cream cheese frosting.",
    price: 20,
  },
  {
    id: "seasonal",
    name: "Seasonal Flavor",
    image: "/images/cupcakes.jpg",
    description: "Ask about the current seasonal cupcake flavor.",
    price: 20,
  },
];

const miniCupcakeFlavors = regularCupcakeFlavors.map((flavor) => ({
  ...flavor,
  price: 15,
}));

export const cupcakeProducts: DessertProduct[] = [
  {
    id: "regular-cupcakes",
    name: "Regular Cupcakes",
    category: "cupcakes",
    badge: "By the Dozen",
    description: "Freshly baked gourmet cupcakes available by the dozen.",
    buttonText: "Add to Cart",
    flavors: regularCupcakeFlavors,
    addons: [
      {
        id: "sprinkles",
        name: "Add Sprinkles",
        price: 2,
      },
    ],
  },
  {
    id: "mini-cupcakes",
    name: "Mini Cupcakes",
    category: "cupcakes",
    badge: "By the Dozen",
    description:
      "Mini cupcakes perfect for parties, events, and dessert tables.",
    buttonText: "Add to Cart",
    flavors: miniCupcakeFlavors,
    addons: [
      {
        id: "sprinkles",
        name: "Add Sprinkles",
        price: 2,
      },
    ],
  },
];