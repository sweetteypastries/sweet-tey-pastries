import type { DessertProduct, Flavor } from "../Bakery/catalogTypes";
import { cupcakeProducts } from "./data/cupcakes";

export type { DessertProduct, Flavor };

export const products: DessertProduct[] = [...cupcakeProducts];