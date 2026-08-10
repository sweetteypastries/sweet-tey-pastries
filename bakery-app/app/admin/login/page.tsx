"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/components/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsSigningIn(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("The email address or password is incorrect.");
      setIsSigningIn(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-16">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-stone-900">
          Admin sign in
        </h1>

        <p className="mt-3 text-stone-600">
          Sign in to manage Sweet Tey&apos;s Pastries.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-semibold text-stone-800"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900"
            />
          </div>

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
              autoComplete="current-password"
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
            disabled={isSigningIn}
            className="w-full rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {isSigningIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}