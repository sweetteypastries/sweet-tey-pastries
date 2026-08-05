import type { DessertProduct } from "../../Bakery/catalogTypes";

export const dessertProducts: DessertProduct[] = [
  {
    id: "banana-pudding",
    name: "Banana Pudding",
    category: "desserts",
    badge: "Best Seller",
    description:
      "Creamy homemade banana pudding layered with vanilla wafers and fresh bananas.",
    buttonText: "Add Banana Pudding",
    flavors: [
      {
        id: "individual-cup",
        name: "Individual Cup",
        image: "/images/banana-pudding-cup.jpg",
        description:
          "Single serving of our famous homemade banana pudding.",
        price: 5,
      },
      {
        id: "party-pack",
        name: "Party Pack — 12 Cups",
        image: "/images/banana-pudding-cup.jpg",
        description:
          "Twelve individual banana pudding cups for parties and events.",
        price: 55,
      },
    ],
  },
];