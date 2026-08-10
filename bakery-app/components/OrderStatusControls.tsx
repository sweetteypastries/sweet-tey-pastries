"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatusControlsProps = {
  orderId: string;
  currentStatus: string;
};

const statuses = [
  { value: "new", label: "New" },
  { value: "baking", label: "Baking" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
];

export default function OrderStatusControls({
  orderId,
  currentStatus,
}: OrderStatusControlsProps) {
  const router = useRouter();

  const [savingStatus, setSavingStatus] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  async function changeStatus(status: string) {
    setSavingStatus(status);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fulfillmentStatus: status,
        }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || "The order status could not be updated."
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "The order status could not be updated."
      );
    } finally {
      setSavingStatus(null);
    }
  }

  return (
    <div className="w-full pt-2">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#7a6a61]">
        Update fulfillment
      </p>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => {
          const isCurrent = currentStatus === status.value;
          const isSaving = savingStatus === status.value;

          return (
            <button
              key={status.value}
              type="button"
              disabled={isCurrent || savingStatus !== null}
              onClick={() => changeStatus(status.value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                isCurrent
                  ? "bg-[#ed6f91] text-white"
                  : "border border-pink-200 bg-white text-[#4b3428] hover:bg-pink-50"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {isSaving ? "Saving..." : status.label}
            </button>
          );
        })}

        <button
          type="button"
          disabled={
            currentStatus === "cancelled" ||
            savingStatus !== null
          }
          onClick={() => changeStatus("cancelled")}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            currentStatus === "cancelled"
              ? "bg-red-600 text-white"
              : "border border-red-200 bg-white text-red-700 hover:bg-red-50"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {savingStatus === "cancelled"
            ? "Saving..."
            : "Cancelled"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
