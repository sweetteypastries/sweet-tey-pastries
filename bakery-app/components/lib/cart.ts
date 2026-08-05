export interface CartProduct {
  id: string;
  name: string;
  option?: string;
  price: number;
}

export function createCartItem(product: CartProduct) {
  return {
    id: product.id,
    name: product.name,
    option: product.option ?? "",
    price: product.price,
    quantity: 1,
  };
}