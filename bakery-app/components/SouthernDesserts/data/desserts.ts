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
    priceLabel: "$5 each • $55 for 12",
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

  {
    id: "cheesecake-parfait-cups",
    name: "Cheesecake Parfait Cups",
    category: "desserts",
    badge: "Customer Favorite",
    description:
      "Creamy cheesecake parfait cups layered with delicious toppings and made fresh for every order.",
    buttonText: "Add Cheesecake Parfait",
    priceLabel: "$5 each • $55 for 12",

    flavors: [
      {
        id: "strawberry",
        name: "Strawberry",
        image: "/images/cheesecake-cup.jpg",
        description:
          "Creamy cheesecake parfait layered with sweet strawberry flavor.",
        price: 5,
      },
      {
        id: "cookies-and-cream",
        name: "Cookies & Cream",
        image: "/images/cheesecake-cup.jpg",
        description:
          "Creamy cheesecake parfait layered with cookies and cream.",
        price: 5,
      },
      {
        id: "caramel-crunch",
        name: "Caramel Crunch",
        image: "/images/cheesecake-cup.jpg",
        description:
          "Creamy cheesecake parfait finished with rich caramel and a delicious crunch.",
        price: 5,
      },
    ],

    sizes: [
      {
        id: "individual-cup",
        name: "Individual Cup",
        price: 5,
        description:
          "One individual cheesecake parfait cup.",
      },
      {
        id: "party-pack",
        name: "Party Pack — 12 Cups",
        price: 55,
        description:
          "Twelve cheesecake parfait cups for parties, celebrations, and events.",
      },
    ],
  },

  {
    id: "panna-cotta-cups",
    name: "Panna Cotta with Berries",
    category: "desserts",
    badge: "Gluten-Free",
    description:
      "Smooth and creamy panna cotta topped with fresh berries. Naturally gluten-free.",
    buttonText: "Add Panna Cotta",
    priceLabel: "$5 each • $55 for 12",

    flavors: [
      {
        id: "berries",
        name: "Panna Cotta with Berries",
        image: "/images/panna-cotta.jpg",
        description:
          "Creamy panna cotta topped with fresh berries. Gluten-free.",
        price: 5,
      },
    ],

    sizes: [
      {
        id: "individual-cup",
        name: "Individual Cup",
        price: 5,
        description:
          "One individual panna cotta cup topped with berries.",
      },
      {
        id: "party-pack",
        name: "Party Pack — 12 Cups",
        price: 55,
        description:
          "Twelve panna cotta cups topped with berries.",
      },
    ],
  },
];
