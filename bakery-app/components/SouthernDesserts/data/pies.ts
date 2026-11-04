import type { DessertProduct } from "../../Bakery/catalogTypes";

export const pieProducts: DessertProduct[] = [
  {
    "id": "whole-pies",
    "name": "Pies",
    "category": "pies",
    "description": "Choose your favorite whole pie.",
    "buttonText": "Add Pie to Cart",
    "priceLabel": "Whole pie",
    "flavors": [
      {
        "id": "sweet-potato",
        "name": "Sweet Potato",
        "image": "/images/sweet-potato-pie.png",
        "price": 35
      },
      {
        "id": "pumpkin",
        "name": "Pumpkin",
        "image": "/images/pumpkin-pie.jpg",
        "price": 35
      },
      {
        "id": "mixed-berry",
        "name": "Mixed Berry",
        "image": "/images/mixed-berry-pie.png",
        "price": 35
      },
      {
        "id": "strawberry",
        "name": "Strawberry",
        "image": "/images/strawberry-pie.jpg",
        "price": 35
      },
      {
        "id": "apple",
        "name": "Apple",
        "image": "/images/apple-pie.jpg",
        "price": 35
      }
    ]
  },
  {
    "id": "no-bake-cheesecake",
    "name": "No-Bake Cheesecake",
    "category": "pies",
    "description": "Choose your favorite creamy no-bake cheesecake.",
    "buttonText": "Add Cheesecake to Cart",
    "priceLabel": "Whole cheesecake",
    "flavors": [
      {
        "id": "original",
        "name": "Original",
        "image": "/images/no-bake-cheesecake-original.png",
        "price": 35
      },
      {
        "id": "strawberry",
        "name": "Strawberry",
        "image": "/images/no-bake-cheesecake-strawberry.png",
        "price": 35
      },
      {
        "id": "cookies-and-cream",
        "name": "Cookies & Cream",
        "image": "/images/no-bake-cheesecake-cookies-and-cream.png",
        "price": 35
      },
      {
        "id": "blueberry-lavender",
        "name": "Blueberry Lavender",
        "image": "/images/no-bake-cheesecake-blueberry-lavender.png",
        "price": 35
      }
    ]
  },
  {
    "id": "sweet-potato-pie",
    "name": "Sweet Potato Pie Bites",
    "category": "pies",
    "description": "One dozen bite-sized treats made with our signature sweet potato filling.",
    "buttonText": "Add Pie Bites",
    "priceLabel": "12 pie bites",
    "flavors": [
      {
        "id": "pie-bites",
        "name": "Sweet Potato Pie Bites (12)",
        "image": "/images/sweet-potato-pie-bites.jpg",
        "price": 20
      }
    ]
  }
];
