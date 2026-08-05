"use client";

import type { Flavor } from "./catalogTypes";

interface FlavorSelectorProps {
  label: string;
  flavors: Flavor[];
  selected: Flavor;
  onChange: (flavor: Flavor) => void;
  disabled?: boolean;
}

export default function FlavorSelector({
  label,
  flavors,
  selected,
  onChange,
  disabled = false,
}: FlavorSelectorProps) {
  const handleChange = (flavorId: string) => {
    const flavor = flavors.find((item) => item.id === flavorId);

    if (flavor) {
      onChange(flavor);
    }
  };

  return (
    <div className="mt-6">
      <label
        htmlFor={`flavor-${selected.id}`}
        className="mb-2 block text-sm font-bold text-[#4b3428]"
      >
        {label}
      </label>

      <select
        id={`flavor-${selected.id}`}
        value={selected.id}
        onChange={(event) => handleChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#4b3428] outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      >
        {flavors.map((flavor) => (
          <option key={flavor.id} value={flavor.id}>
            {flavor.name}
            {typeof flavor.price === "number"
              ? ` — $${flavor.price}`
              : ""}
          </option>
        ))}
      </select>
    </div>
  );
}