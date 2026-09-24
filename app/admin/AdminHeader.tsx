"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href =
      "/admin/login";
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#ead8cf]/70 bg-[#fffaf8]/90 shadow-[0_8px_30px_rgba(70,45,38,0.05)] backdrop-blur-2xl">

      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-5">

        <div className="flex items-center justify-between gap-4">

          {/* Brand */}
          <Link
            href="/admin"
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d9b69f] bg-white shadow-sm">
              <img
                src="/images/logo/studlogo.png"
                alt="The Stud House Elite"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.25em] text-[#b98b67] sm:text-[10px]">
                The Stud House Elite
              </p>

              <h2 className="mt-0.5 truncate font-serif text-lg text-[#2a1f1d] sm:text-xl">
                Admin Panel
              </h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex">

            <nav className="flex items-center gap-1 rounded-full border border-[#ead8cf]/80 bg-white/70 p-1.5 shadow-sm">
              {navItems.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const isActive =
                    item.href ===
                    "/admin"
                      ? pathname ===
                        "/admin"
                      : pathname.startsWith(
                          item.href
                        );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                        isActive
                          ? "bg-[#2a1f1d] text-white shadow-[0_6px_16px_rgba(42,31,29,0.15)]"
                          : "text-[#6e5b55] hover:bg-[#fff3ed] hover:text-[#b98b67]"
                      }`}
                    >
                      <Icon
                        size={16}
                      />

                      {item.label}
                    </Link>
                  );
                }
              )}
            </nav>

            {/* Store */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ead8cf] bg-white text-[#6e5b55] transition hover:border-[#b98b67] hover:bg-[#fff4ee] hover:text-[#b98b67]"
              aria-label="Open Store"
              title="Open Store"
            >
              <ExternalLink
                size={17}
              />
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/60 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
            >
              <LogOut
                size={16}
              />

              Logout
            </button>
          </div>

          {/* Mobile Store + Logout */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">

            <Link
              href="/"
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8cf] bg-white text-[#6e5b55] transition hover:border-[#b98b67] hover:text-[#b98b67]"
              aria-label="Open Store"
            >
              <ExternalLink
                size={16}
              />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-500 hover:text-white"
              aria-label="Logout"
            >
              <LogOut
                size={16}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navItems.map(
            (item) => {
              const Icon =
                item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname ===
                    "/admin"
                  : pathname.startsWith(
                      item.href
                    );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#2a1f1d] text-white shadow-sm"
                      : "border border-[#ead8cf] bg-white/70 text-[#6e5b55] hover:border-[#b98b67] hover:text-[#b98b67]"
                  }`}
                >
                  <Icon
                    size={15}
                  />

                  {item.label}
                </Link>
              );
            }
          )}
        </nav>
      </div>
    </header>
  );
}