import type { DessertProduct } from "../../Bakery/catalogTypes";

export const pieProducts: DessertProduct[] = [
  {
    id: "sweet-potato-pie",
    name: "Sweet Potato Pie",
    category: "pies",
    badge: "Homemade Daily",
    description:
      "Our signature Southern sweet potato pie baked with warm spices in a flaky homemade crust.",
    buttonText: "Add Sweet Potato Pie",
    flavors: [
      {
        id: "whole-pie",
        name: "Whole Sweet Potato Pie",
        image: "/images/sweet-potato-pie.png",
        description:
          "A full homemade Southern Sweet Potato Pie that's perfect for holidays and family dinners.",
        price: 35,
      },
      {
        id: "pie-bites",
        name: "Sweet Potato Pie Bites (12)",
        image: "/images/sweet-potato-pie-bites.jpg",
        description:
          "One dozen bite-sized Sweet Potato Pie treats made with our signature filling.",
        price: 20,
      },
    ],
  },
  {
    id: "pumpkin-pie",
    name: "Pumpkin Pie",
    category: "pies",
    badge: "Seasonal Favorite",
    description:
      "Classic pumpkin pie with warm spices in a flaky crust, perfect for your holiday table.",
    buttonText: "Add Pumpkin Pie",
    priceLabel: "$35 whole pie",
    flavors: [
      {
        id: "whole-pie",
        name: "Whole Pumpkin Pie",
        image: "/images/pumpkin-pie.jpg",
        description:
          "A whole pumpkin pie for holiday gatherings and family dinners.",
        price: 35,
      },
    ],
  },
];
