"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/components/supabase/client";

export default function SetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmation) {
      setMessage("The passwords do not match.");
      return;
    }

    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(
        "Your invitation session has expired. Send yourself a new invitation and open the newest email."
      );
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-16">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-stone-900">
          Create your admin password
        </h1>

        <p className="mt-3 text-stone-600">
          Choose the password you will use to sign in to the bakery dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-semibold text-stone-800"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900"
            />
          </div>

          <div>
            <label
              htmlFor="confirmation"
              className="mb-2 block font-semibold text-stone-800"
            >
              Confirm password
            </label>

            <input
              id="confirmation"
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900"
            />
          </div>

          {message && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Create password"}
          </button>
        </form>
      </div>
    </main>
  );
}