import { NextResponse } from "next/server";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";

type ProductRequest = {
  name?: unknown;
  slug?: unknown;
  category?: unknown;
  description?: unknown;
  imageUrl?: unknown;
  basePrice?: unknown;
  priceLabel?: unknown;
  badge?: unknown;
  buttonText?: unknown;
  isAvailable?: unknown;
  isFeatured?: unknown;
  isSeasonal?: unknown;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function requiredText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function optionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue || null;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        name,
        category,
        description,
        image_url,
        base_price,
        price_label,
        badge,
        button_text,
        is_available,
        is_featured,
        is_seasonal
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load product:", error);

    return NextResponse.json(
      { error: "The product could not be loaded." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    product: data,
  });
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as ProductRequest;

    const name = requiredText(body.name, "Product name");
    const category = requiredText(body.category, "Category");

    const slug = requiredText(body.slug, "Slug")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      return NextResponse.json(
        { error: "Enter a valid product slug." },
        { status: 400 }
      );
    }

    const basePrice = Number(body.basePrice);

    if (!Number.isFinite(basePrice) || basePrice < 0) {
      return NextResponse.json(
        {
          error:
            "Base price must be a valid positive number.",
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .update({
        slug,
        name,
        category,
        description: optionalText(body.description),
        image_url: optionalText(body.imageUrl),
        base_price: basePrice,
        price_label: optionalText(body.priceLabel),
        badge: optionalText(body.badge),
        button_text:
          optionalText(body.buttonText) ?? "Add to Cart",
        is_available: body.isAvailable === true,
        is_featured: body.isFeatured === true,
        is_seasonal: body.isSeasonal === true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Unable to update product:", error);

      return NextResponse.json(
        {
          error:
            error.code === "23505"
              ? "Another product already uses this slug."
              : "The product could not be updated.",
        },
        { status: error.code === "23505" ? 409 : 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: data.id,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("Update product route failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The product could not be updated.",
      },
      { status: 400 }
    );
  }
}