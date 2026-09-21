"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href = "/admin/login";
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
    },
    {
      label: "Products",
      href: "/admin/products",
    },
    {
      label: "Orders",
      href: "/admin/orders",
    },
  ];

  return (
    <header className="border-b border-[#ead8cf] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
            The Stud House Elite
          </p>

          <h2 className="mt-1 font-serif text-xl text-[#2a1f1d]">
            Admin Panel
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#2a1f1d] text-white"
                    : "border border-[#ead8cf] text-[#2a1f1d] hover:border-[#b98b67] hover:text-[#b98b67]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}