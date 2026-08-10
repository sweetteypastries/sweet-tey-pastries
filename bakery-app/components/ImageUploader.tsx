"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

interface ImageUploaderProps {
  initialUrl?: string | null;
  inputName?: string;
  label?: string;
}

interface UploadResponse {
  url?: string;
  path?: string;
  error?: string;
}

const MAX_FILE_SIZE = 6 * 1024 * 1024;

const allowedFileTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export default function ImageUploader({
  initialUrl = "",
  inputName = "imageUrl",
  label = "Product image",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(
    initialUrl?.trim() ?? ""
  );

  const [previewUrl, setPreviewUrl] = useState(
    initialUrl?.trim() ?? ""
  );

  const [isUploading, setIsUploading] =
    useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function validateFile(file: File) {
    if (!allowedFileTypes.has(file.type)) {
      return "Choose a JPG, PNG, WebP, or GIF image.";
    }

    if (file.size === 0) {
      return "The selected image is empty.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "The image must be 6 MB or smaller.";
    }

    return null;
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setMessage(validationError);
      event.target.value = "";
      return;
    }

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreviewUrl =
      URL.createObjectURL(file);

    setPreviewUrl(localPreviewUrl);
    setMessage("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        (await response.json()) as UploadResponse;

      if (!response.ok || !result.url) {
        throw new Error(
          result.error ||
            "The image could not be uploaded."
        );
      }

      setImageUrl(result.url);
      setPreviewUrl(result.url);
      setMessage("Image uploaded successfully.");
    } catch (error) {
      console.error("Image upload failed:", error);

      setImageUrl("");
      setPreviewUrl("");

      setMessage(
        error instanceof Error
          ? error.message
          : "The image could not be uploaded."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  function handleRemoveImage() {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageUrl("");
    setPreviewUrl("");
    setMessage("Image removed from this product.");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="md:col-span-2">
      <input
        type="hidden"
        name={inputName}
        value={imageUrl}
      />

      <span className="mb-2 block text-sm font-bold text-[#4b3428]">
        {label}
      </span>

      <div className="overflow-hidden rounded-3xl border border-pink-100 bg-[#fffaf7]">
        <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-pink-50">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Product preview"
              className="h-72 w-full object-cover"
            />
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="text-6xl">📷</div>

              <p className="mt-4 font-serif text-2xl font-bold text-[#4b3428]">
                No image selected
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6b5548]">
                Upload a clear product photo in JPG,
                PNG, WebP, or GIF format.
              </p>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-[#ed6f91]" />

                <p className="mt-4 font-bold text-[#4b3428]">
                  Uploading image...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-pink-100 bg-white p-5 sm:flex-row sm:items-center">
          <label
            className={`inline-flex cursor-pointer items-center justify-center rounded-full bg-[#ed6f91] px-6 py-3 font-bold text-white transition hover:bg-[#d95f82] ${
              isUploading
                ? "pointer-events-none opacity-60"
                : ""
            }`}
          >
            {previewUrl
              ? "Choose Another Image"
              : "Choose Image"}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={isUploading}
              className="sr-only"
            />
          </label>

          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="rounded-full border border-pink-200 bg-white px-6 py-3 font-bold text-[#6b5548] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove Image
            </button>
          )}

          <span className="text-xs leading-5 text-[#7a6a61] sm:ml-auto sm:max-w-xs sm:text-right">
            Maximum file size: 6 MB
          </span>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className={`mt-3 text-sm font-bold ${
            imageUrl
              ? "text-[#6b8a64]"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}