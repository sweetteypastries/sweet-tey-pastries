"use client";

import { useState } from "react";
import { useCart } from "../Cart/CartContext";
import FlavorSelector from "./FlavorSelector";
import type {
  DessertProduct,
  Flavor,
  ProductAddon,
  ProductSize,
} from "./catalogTypes";

interface CartItem {
  id: string;
  productId: string;
  flavorId?: string;
  sizeId?: string;
  addonIds?: string[];
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ProductCardProps {
  product: DessertProduct;
  onAddToCart?: (item: CartItem) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { addItem } = useCart();

  const [selectedFlavor, setSelectedFlavor] = useState<Flavor>(
    product.flavors[0]
  );

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    product.sizes?.[0] ?? null
  );

  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [addedMessage, setAddedMessage] = useState("");

  const handleSizeChange = (sizeId: string) => {
    const size = product.sizes?.find((item) => item.id === sizeId);

    if (size) {
      setSelectedSize(size);
    }
  };

  const handleAddonChange = (
    addon: ProductAddon,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelectedAddons((current) => {
        const alreadySelected = current.some(
          (item) => item.id === addon.id
        );

        return alreadySelected ? current : [...current, addon];
      });

      return;
    }

    setSelectedAddons((current) =>
      current.filter((item) => item.id !== addon.id)
    );
  };

  const addonTotal = selectedAddons.reduce(
    (total, addon) => total + addon.price,
    0
  );

  const basePrice =
    selectedSize?.price ??
    selectedFlavor.price ??
    0;

  const totalPrice = basePrice + addonTotal;

  const flavorSelectionDisabled =
    selectedSize?.disablesFlavorSelection ?? false;

  const displayImage =
    selectedSize?.image ??
    (flavorSelectionDisabled
      ? product.mysteryImage ?? selectedFlavor.image
      : selectedFlavor.image);

  const displayImageAlt =
    selectedSize?.name ?? selectedFlavor.name;

  const handleAddToCart = () => {
    const addonNames = selectedAddons
      .map((addon) => addon.name)
      .join(", ");

    const productOptions: string[] = [];

    if (selectedSize) {
      productOptions.push(selectedSize.name);
    }

    if (!flavorSelectionDisabled) {
      productOptions.push(selectedFlavor.name);
    }

    const optionsText =
      productOptions.length > 0
        ? ` - ${productOptions.join(" - ")}`
        : "";

    const addonsText = addonNames
      ? ` with ${addonNames}`
      : "";

    const addonIds = selectedAddons
      .map((addon) => addon.id)
      .sort()
      .join("-");

    const cartItemId = [
      product.id,
      selectedSize?.id,
      flavorSelectionDisabled ? undefined : selectedFlavor.id,
      addonIds || undefined,
    ]
      .filter(Boolean)
      .join("-");

    const cartItem: CartItem = {
      id: cartItemId,
      productId: product.id,
      flavorId: flavorSelectionDisabled
        ? undefined
        : selectedFlavor.id,
      sizeId: selectedSize?.id,
      addonIds: selectedAddons
        .map((addon) => addon.id)
        .sort(),
      name: `${product.name}${optionsText}${addonsText}`,
      price: totalPrice,
      quantity: 1,
      image: displayImage,
    };

    addItem(cartItem);
    onAddToCart?.(cartItem);

    setAddedMessage("Added to cart!");

    window.setTimeout(() => {
      setAddedMessage("");
    }, 2000);
  };

  return (
    <article className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-pink-100 bg-[#fffaf7] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-64 overflow-hidden bg-pink-50">
        <img
          src={displayImage}
          alt={displayImageAlt}
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>

      <div className="p-6">
        {product.badge && (
          <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-pink-700">
            {product.badge}
          </span>
        )}

        <h3 className="mt-4 font-serif text-3xl font-bold text-[#4b3428]">
          {product.name}
        </h3>

        <p className="mt-3 text-[#6b5548]">
          {product.description}
        </p>

        {!flavorSelectionDisabled &&
          selectedFlavor.description && (
            <p className="mt-3 text-sm leading-6 text-[#6b5548]">
              {selectedFlavor.description}
            </p>
          )}

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-6">
            <label
              htmlFor={`size-${product.id}`}
              className="mb-2 block text-sm font-bold text-[#4b3428]"
            >
              Choose Your Size
            </label>

            <select
              id={`size-${product.id}`}
              value={selectedSize?.id ?? ""}
              onChange={(event) =>
                handleSizeChange(event.target.value)
              }
              className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              {product.sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name} — ${size.price.toFixed(2)}
                </option>
              ))}
            </select>

            {selectedSize?.description && (
              <p className="mt-2 text-sm leading-6 text-[#6b5548]">
                {selectedSize.description}
              </p>
            )}
          </div>
        )}

        <FlavorSelector
          label="Choose Your Flavor"
          flavors={product.flavors}
          selected={selectedFlavor}
          onChange={setSelectedFlavor}
          disabled={flavorSelectionDisabled}
        />

        {flavorSelectionDisabled && (
          <p className="mt-2 text-sm font-medium text-[#6b5548]">
            Flavors are selected as a surprise for this box.
          </p>
        )}

        {product.addons && product.addons.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-bold text-[#4b3428]">
              Add-ons
            </p>

            {product.addons.map((addon) => {
              const isChecked = selectedAddons.some(
                (item) => item.id === addon.id
              );

              return (
                <label
                  key={addon.id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-pink-200 bg-white px-4 py-3"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) =>
                        handleAddonChange(
                          addon,
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 accent-[#ed6f91]"
                    />

                    <span className="font-medium text-[#4b3428]">
                      {addon.name}
                    </span>
                  </span>

                  <span className="font-bold text-[#ed6f91]">
                    +${addon.price.toFixed(2)}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="block font-serif text-3xl font-bold text-[#ed6f91]">
              ${totalPrice.toFixed(2)}
            </span>

            <span className="text-sm text-[#6b5548]">
              {selectedSize?.name ??
                product.priceLabel ??
                "Selected item"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white transition hover:bg-[#d85d80]"
          >
            {product.buttonText ?? "Add to Cart"}
          </button>
        </div>

        {addedMessage && (
          <p
            role="status"
            className="mt-4 text-center text-sm font-bold text-green-700"
          >
            {addedMessage}
          </p>
        )}
      </div>
    </article>
  );
}
