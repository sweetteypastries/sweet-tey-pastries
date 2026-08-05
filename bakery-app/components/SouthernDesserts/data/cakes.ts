import type { DessertProduct } from "../../Bakery/catalogTypes";

export const cakeProducts: DessertProduct[] = [
  {
    id: "pound-cakes",
    name: "Southern Pound Cakes",
    category: "cakes",
    badge: "Best Seller",
    description:
      "Our famous homemade Southern pound cakes baked fresh with premium ingredients.",
    buttonText: "Add Pound Cake",
    flavors: [
      {
        id: "lemon",
        name: "Lemon Pound Cake",
        image: "/images/lemon-pound-cake.jpg",
        description:
          "Classic buttery Southern pound cake with fresh lemon flavor.",
        price: 45,
      },
      {
        id: "7up",
        name: "7 Up Pound Cake",
        image: "/images/7up-pound-cake.jpg",
        description:
          "Traditional Southern 7 Up Pound Cake that's moist, rich, and full of flavor.",
        price: 45,
      },
      {
        id: "caramel",
        name: "Caramel Pound Cake",
        image: "/images/caramel-pound-cake.jpg",
        description:
          "Scratch-made pound cake topped with our homemade caramel glaze.",
        price: 45,
      },
      {
        id: "chocolate",
        name: "Chocolate Pound Cake",
        image: "/images/chocolate-pound-cake.jpg",
        description:
          "Rich chocolate pound cake baked from scratch with premium cocoa.",
        price: 45,
      },
      {
        id: "red-velvet",
        name: "Red Velvet Pound Cake",
        image: "/images/red-velvet-pound-cake.jpg",
        description:
          "Southern Red Velvet Pound Cake finished with cream cheese glaze.",
        price: 45,
      },
      {
        id: "strawberry-crunch",
        name: "Strawberry Crunch Pound Cake",
        image: "/images/strawberry-crunch-pound-cake.jpg",
        description:
          "Southern pound cake topped with our signature strawberry crunch coating.",
        price: 45,
      },
      {
        id: "vanilla-sprinkles",
        name: "Vanilla Pound Cake with Sprinkles",
        image: "/images/vanilla-sprinkles-pound-cake.jpg",
        description:
          "Classic vanilla pound cake topped with colorful sprinkles.",
        price: 45,
      },
      {
        id: "cinnamon-pecan",
        name: "Cinnamon Pecan Pound Cake",
        image: "/images/cinnamon-pecan-pound-cake.jpg",
        description:
          "Warm cinnamon pound cake loaded with toasted pecans.",
        price: 45,
      },
    ],
  },
];