import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/components/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/admin/login";
  const isPasswordPage = pathname === "/admin/set-password";

  const isProtectedAdminPage =
    pathname.startsWith("/admin") &&
    !isLoginPage &&
    !isPasswordPage;

  const isProtectedAdminApi =
    pathname === "/api/products" ||
    pathname.startsWith("/api/products/") ||
    pathname === "/api/upload-image";

  const signedInEmail =
    typeof claims?.email === "string"
      ? claims.email.trim().toLowerCase()
      : "";

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";

  const isAdmin =
    Boolean(signedInEmail) &&
    Boolean(adminEmail) &&
    signedInEmail === adminEmail;

  if ((isProtectedAdminPage || isProtectedAdminApi) && !isAdmin) {
    if (isProtectedAdminApi) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/upload-image",
  ],
};