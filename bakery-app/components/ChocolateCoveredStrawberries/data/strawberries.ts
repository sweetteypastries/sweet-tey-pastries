import type { DessertProduct } from "../../Bakery/catalogTypes";

export const strawberryProducts: DessertProduct[] = [
  {
    id: "chocolate-covered-strawberries",
    name: "Chocolate-Covered Strawberries",
    category: "strawberries",
    badge: "Best Seller",
    description:
      "Fresh, juicy strawberries hand-dipped in premium chocolate. Sold by the dozen.",
    buttonText: "Add to Cart",
    flavors: [
      {
        id: "milk",
        name: "Milk Chocolate",
        image: "/images/milk-chocolate-strawberries.jpg",
        description:
          "One dozen fresh strawberries dipped in rich milk chocolate.",
        price: 25,
      },
      {
        id: "white",
        name: "White Chocolate",
        image: "/images/white-chocolate-strawberries.jpg",
        description:
          "One dozen fresh strawberries dipped in creamy white chocolate.",
        price: 25,
      },
      {
        id: "mixed",
        name: "Mixed Chocolate",
        image: "/images/mixed-chocolate-strawberries.jpg",
        description:
          "A dozen strawberries dipped in a delicious mix of milk and white chocolate.",
        price: 25,
      },
      {
        id: "assorted",
        name: "Assorted Chocolate",
        image: "/images/assorted-chocolate-strawberries.jpg",
        description:
          "An assorted dozen featuring premium decorative finishes.",
        price: 30,
      },
    ],
    addons: [
      {
        id: "nuts",
        name: "Add Nuts",
        price: 3,
      },
      {
        id: "sprinkles",
        name: "Add Sprinkles",
        price: 3,
      },
      {
        id: "gold-flakes",
        name: "Gold Dust",
        price: 3,
      },
      {
        id: "personalized-colors",
        name: "Personalized Colors",
        price: 3,
      },
    ],
  },
];