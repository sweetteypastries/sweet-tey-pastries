import { NextResponse } from "next/server";
import { createAdminClient } from "@/components/supabase/admin";
import { requireAdmin } from "@/components/supabase/require-admin";

export const runtime = "nodejs";

const BUCKET_NAME = "products";
const MAX_FILE_SIZE = 6 * 1024 * 1024;

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function cleanFileName(fileName: string) {
  const extension =
    fileName.split(".").pop()?.toLowerCase() || "jpg";

  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${baseName || "product"}-${crypto.randomUUID()}.${extension}`;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        {
          error: "Choose an image file to upload.",
        },
        {
          status: 400,
        }
      );
    }

    if (!allowedTypes.has(uploadedFile.type)) {
      return NextResponse.json(
        {
          error: "Only JPG, PNG, WebP, and GIF images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (uploadedFile.size === 0) {
      return NextResponse.json(
        {
          error: "The selected image is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (uploadedFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "The image must be 6 MB or smaller.",
        },
        {
          status: 400,
        }
      );
    }

    const fileName = cleanFileName(uploadedFile.name);
    const storagePath = `catalog/${fileName}`;

    const fileBuffer = await uploadedFile.arrayBuffer();
    const supabase = createAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: uploadedFile.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "Supabase image upload failed:",
        uploadError
      );

      return NextResponse.json(
        {
          error: "The image could not be uploaded.",
        },
        {
          status: 500,
        }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: storagePath,
    });
  } catch (error) {
    console.error("Image upload route failed:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while uploading the image.",
      },
      {
        status: 500,
      }
    );
  }
}