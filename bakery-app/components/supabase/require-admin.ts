import { createClient } from "@/components/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return false;
  }

  const signedInEmail =
    typeof data?.claims?.email === "string"
      ? data.claims.email.trim().toLowerCase()
      : "";

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";

  return (
    Boolean(signedInEmail) &&
    Boolean(adminEmail) &&
    signedInEmail === adminEmail
  );
}