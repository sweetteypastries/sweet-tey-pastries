import type { DessertProduct } from "../../Bakery/catalogTypes";

export const specialtyProducts: DessertProduct[] = [
  {
    id: "beignets",
    name: "New Orleans Beignets",
    category: "specialty",
    badge: "Made Fresh",
    description:
      "Light and fluffy New Orleans-style beignets dusted with powdered sugar.",
    buttonText: "Add Beignets",
    flavors: [
      {
        id: "classic-6",
        name: "Classic Beignets (6)",
        image: "/images/beignets.jpg",
        description:
          "Six freshly made New Orleans-style beignets dusted with powdered sugar.",
        price: 12,
      },
      {
        id: "classic-12",
        name: "Classic Beignets (12)",
        image: "/images/beignets.jpg",
        description:
          "Twelve freshly made New Orleans-style beignets dusted with powdered sugar.",
        price: 22,
      },
    ],
  },

  {
    id: "peach-cobbler",
    name: "Southern Peach Cobbler",
    category: "desserts",
    badge: "Southern Favorite",
    description:
      "Sweet peaches baked beneath a buttery homemade cobbler crust.",
    buttonText: "Add Peach Cobbler",
    flavors: [
      {
        id: "family-pan",
        name: "Family Pan",
        image: "/images/peach-cobbler.jpg",
        description:
          "A family-size pan of homemade Southern Peach Cobbler.",
        price: 35,
      },
    ],
  },

  {
    id: "southern-tea-cakes",
    name: "Southern Tea Cakes",
    category: "cookies",
    badge: "Homestyle",
    description:
      "Traditional Southern tea cakes baked from a treasured family-style recipe.",
    buttonText: "Add Tea Cakes",
    flavors: [
  {
  id: "dozen",
  name: "Dozen Tea Cakes",
  image: "/images/southern-tea-cakes.jpg",
  description:
    "One dozen soft, homemade Southern Tea Cakes.",
  price: 18,
},
    ],
  },
];