import type { DessertProduct, Flavor } from "../Bakery/catalogTypes";
import { strawberryProducts } from "./data/strawberries";

export type { DessertProduct, Flavor };

export const products: DessertProduct[] = [...strawberryProducts];