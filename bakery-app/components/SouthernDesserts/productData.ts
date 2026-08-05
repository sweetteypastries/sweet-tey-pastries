import type { DessertProduct, Flavor } from "../Bakery/catalogTypes";

import { cakeProducts } from "./data/cakes";
import { dessertProducts } from "./data/desserts";
import { pieProducts } from "./data/pies";
import { specialtyProducts } from "./data/specialty";

export type { DessertProduct, Flavor };

export const products: DessertProduct[] = [
  ...cakeProducts,
  ...pieProducts,
  ...dessertProducts,
  ...specialtyProducts,
];