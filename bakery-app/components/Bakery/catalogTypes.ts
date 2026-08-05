export interface Flavor {
  id: string;
  name: string;
  image: string;
  description?: string;
  price?: number;
}

export interface ProductSize {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  disablesFlavorSelection?: boolean;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface DessertProduct {
  id: string;
  name: string;
  category?: string;
  badge?: string;
  description: string;
  buttonText?: string;
  priceLabel?: string;
  flavors: Flavor[];
  sizes?: ProductSize[];
  addons?: ProductAddon[];
  mysteryImage?: string;
}