import Link from "next/link";
import type { ReactNode } from "react";

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "🏠",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: "📦",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: "🍰",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: "👥",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: "📊",
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fff8f8] lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-pink-100 bg-[#4b3428] text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:border-pink-100">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-200">
              Sweet Tey&apos;s Pastries
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold">
              Admin
            </h1>

            <p className="mt-2 text-sm leading-6 text-pink-100/80">
              Manage your bakery, orders, products, and customers.
            </p>
          </div>

          <nav className="grid gap-2 px-4 py-5 sm:grid-cols-2 lg:block lg:space-y-2">
            {adminLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-white transition hover:bg-white/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg">
                  {link.icon}
                </span>

                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/10 px-4 py-5">
            <Link
              href="/"
              className="flex items-center justify-center rounded-full bg-[#ed6f91] px-5 py-3 font-bold text-white transition hover:bg-[#d95f82]"
            >
              View Storefront
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}