import type { DessertProduct } from "../../Bakery/catalogTypes";

const macaronProduct: DessertProduct = {
  id: "french-macarons",
  name: "French Macarons",
  category: "Macarons",

  badge: "Naturally Gluten-Free",

  description:
    "Light, crisp, and chewy French macarons handcrafted with premium almond flour. All of our macarons are naturally gluten-free and made in small batches for the perfect texture and flavor.",

  buttonText: "Add to Cart",

  priceLabel: "Choose your size",

  sizes: [
    {
      id: "dozen",
      name: "Dozen (12)",
      price: 34,
      description:
        "A dozen handcrafted French macarons in your favorite flavor.",
    },
    {
      id: "party-box",
      name: "Party Box (24)",
      price: 65,
      description:
        "Twenty-four handcrafted French macarons, perfect for parties and events.",
    },
  ],

  flavors: [
    {
      id: "vanilla-bean",
      name: "Vanilla Bean",
      image: "/images/vanilla-bean-macarons.jpg",
      description:
        "Classic vanilla bean buttercream with delicate almond shells.",
    },
    {
      id: "chocolate-ganache",
      name: "Chocolate Ganache",
      image: "/images/chocolate-ganache-macarons.jpg",
      description:
        "Rich chocolate ganache sandwiched between crisp almond shells.",
    },
    {
      id: "strawberry",
      name: "Strawberry",
      image: "/images/strawberry-macarons.jpg",
      description:
        "Sweet strawberry filling with a fresh berry flavor.",
    },
    {
      id: "lemon",
      name: "Lemon",
      image: "/images/lemon-macarons.jpg",
      description:
        "Bright citrus flavor with a smooth lemon buttercream.",
    },
    {
      id: "raspberry",
      name: "Raspberry",
      image: "/images/raspberry-macarons.jpg",
      description:
        "Tangy raspberry filling with a naturally fruity finish.",
    },
    {
      id: "cookies-cream",
      name: "Cookies & Cream",
      image: "/images/cookies-and-cream-macarons.jpg",
      description:
        "Creamy filling blended with chocolate cookie crumbs.",
    },
    {
      id: "matcha",
      name: "Matcha",
      image: "/images/matcha-macarons.jpg",
      description:
        "Premium matcha with a smooth, earthy sweetness.",
    },
    {
      id: "seasonal",
      name: "Seasonal Flavor",
      image: "/images/seasonal-macarons.jpg",
      description:
        "Ask about our current limited-edition seasonal macaron flavor.",
    },
  ],

  addons: [],
};

export default macaronProduct;