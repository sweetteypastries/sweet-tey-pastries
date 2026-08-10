"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/components/supabase/client";

export default function AdminSignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignOut() {
    setMessage("");
    setIsSigningOut(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error) {
      setMessage("You could not be signed out. Please try again.");
      setIsSigningOut(false);
      return;
    }

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-full border border-pink-200 bg-white px-6 py-3 font-bold text-[#4b3428] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? "Signing out…" : "Sign out"}
      </button>

      {message && (
        <p className="mt-2 max-w-xs text-sm text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}