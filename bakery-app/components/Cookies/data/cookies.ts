import type { DessertProduct } from "../../Bakery/catalogTypes";

export const cookieProduct: DessertProduct = {
  id: "gourmet-cookies",
  name: "Gourmet Cookies",
  category: "Cookies",
  badge: "Fresh Baked",
  description:
    "Freshly baked gourmet cookies made from scratch using premium ingredients. Perfect for parties, gifts, or satisfying your sweet tooth.",
  buttonText: "Add to Cart",
  priceLabel: "Choose your size",

  sizes: [
    {
      id: "half-dozen",
      name: "Half Dozen (6)",
      price: 15,
    },
    {
      id: "dozen",
      name: "Dozen (12)",
      price: 25,
    },
    {
      id: "mystery-box",
      name: "Sweet Tey's Mystery Cookie Box (12)",
      price: 30,
      description:
        "A surprise assortment of our favorite gourmet cookie flavors hand-selected by Sweet Tey's Pastries.",
      disablesFlavorSelection: true,
      image: "/images/mystery-cookie-box.jpg",
    },
  ],

  flavors: [
    {
      id: "confetti",
      name: "Confetti",
      image: "/images/confetti-cookies.jpg",
      description:
        "A colorful, celebration-inspired cookie filled with festive sprinkles.",
    },
    {
      id: "chocolate",
      name: "Chocolate",
      image: "/images/chocolate-cookies.jpg",
      description:
        "A rich chocolate cookie with a soft, indulgent center.",
    },
    {
      id: "strawberry",
      name: "Strawberry",
      image: "/images/strawberry-cookies.jpg",
      description:
        "A sweet strawberry cookie with a soft, fruity flavor.",
    },
    {
      id: "cookies-cream",
      name: "Cookies & Cream",
      image: "/images/cookies-and-cream-cookies.jpg",
      description:
        "A creamy cookies-and-cream cookie packed with chocolate sandwich cookie pieces.",
    },
    {
      id: "lemon",
      name: "Lemon",
      image: "/images/lemon-cookies.jpg",
      description:
        "A bright, buttery lemon cookie with a fresh citrus finish.",
    },
    {
      id: "red-velvet",
      name: "Red Velvet",
      image: "/images/red-velvet-cookies.jpg",
      description:
        "A soft red velvet cookie with a rich cocoa flavor.",
    },
    {
      id: "seasonal",
      name: "Seasonal Flavor",
      image: "/images/seasonal-cookies.jpg",
      description:
        "A limited-time cookie flavor inspired by the season.",
    },
    {
      id: "chocolate-chip",
      name: "Chocolate Chip",
      image: "/images/chocolate-chip-cookies.jpg",
      description:
        "A classic soft-baked cookie loaded with chocolate chips.",
    },
    {
      id: "peanut-butter",
      name: "Peanut Butter",
      image: "/images/peanut-butter-cookies.jpg",
      description:
        "A soft and chewy cookie with a rich peanut butter flavor.",
    },
  ],

  addons: [
    {
      id: "nuts",
      name: "Add Nuts",
      price: 3,
    },
  ],

  mysteryImage: "/images/mystery-cookie-box.jpg",
};

export default cookieProduct;