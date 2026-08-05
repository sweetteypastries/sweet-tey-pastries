import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/Cart/CartContext";

export const metadata: Metadata = {
  title: "Sweet Tey's Pastries",
  description:
    "Southern desserts, fresh pastries, and Love Me Tea from Sausalito, California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}