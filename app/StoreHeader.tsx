"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "./context/CartContext";

export default function StoreHeader() {
  const router = useRouter();
  const { cartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    const term = searchTerm.trim();

    if (!term) return;

    router.push(
      `/shop?search=${encodeURIComponent(term)}`
    );

    const searchBar =
      document.getElementById("navbar-search");

    searchBar?.classList.add("hidden");

    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#ead8cf] bg-[#fffaf8]/95 backdrop-blur-md">
      
{/* Continuous Announcement Bar */}
<div className="overflow-hidden bg-[#b98b67] py-2 text-white">
  <div className="ticker-track">
    <div className="ticker-group">
      <span>Free Shipping on Orders Above ₹999</span>
      <span>•</span>
      <span>Secure Payments</span>
      <span>•</span>
      <span>Easy Returns</span>
      <span>•</span>
      <span>New Arrivals Available</span>
      <span>•</span>

      <span>Free Shipping on Orders Above ₹999</span>
      <span>•</span>
      <span>Secure Payments</span>
      <span>•</span>
      <span>Easy Returns</span>
      <span>•</span>
      <span>New Arrivals Available</span>
      <span>•</span>

      <span>Free Shipping on Orders Above ₹999</span>
      <span>•</span>
      <span>Secure Payments</span>
      <span>•</span>
      <span>Easy Returns</span>
      <span>•</span>
      <span>New Arrivals Available</span>
      <span>•</span>
    </div>

    <div className="ticker-group" aria-hidden="true">
      <span>Free Shipping on Orders Above ₹999</span>
      <span>•</span>
      <span>Secure Payments</span>
      <span>•</span>
      <span>Easy Returns</span>
      <span>•</span>
      <span>New Arrivals Available</span>
      <span>•</span>

      <span>Free Shipping on Orders Above ₹999</span>
      <span>•</span>
      <span>Secure Payments</span>
      <span>•</span>
      <span>Easy Returns</span>
      <span>•</span>
      <span>New Arrivals Available</span>
      <span>•</span>

      <span>Free Shipping on Orders Above ₹999</span>
      <span>•</span>
      <span>Secure Payments</span>
      <span>•</span>
      <span>Easy Returns</span>
      <span>•</span>
      <span>New Arrivals Available</span>
      <span>•</span>
    </div>
  </div>
</div>



      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={
            mobileMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
          className="transition hover:text-[#b98b67] lg:hidden"
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        >
          <Image
            src="/images/logo/studlogo.png"
            alt="The Stud House Elite"
            width={90}
            height={90}
            priority
            className="h-[78px] w-[78px] rounded-full object-cover md:h-[88px] md:w-[88px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          <Link
            href="/"
            className="transition hover:text-[#b98b67]"
          >
            Home
          </Link>

          <Link
            href="/#new-arrivals"
            className="transition hover:text-[#b98b67]"
          >
            New Arrivals
          </Link>

          <Link
            href="/shop?category=Earrings"
            className="transition hover:text-[#b98b67]"
          >
            Earrings
          </Link>

          <Link
            href="/shop?category=Necklaces"
            className="transition hover:text-[#b98b67]"
          >
            Necklaces
          </Link>

          <Link
            href="/shop?category=Bracelets"
            className="transition hover:text-[#b98b67]"
          >
            Bracelets
          </Link>

          <Link
            href="/shop"
            className="transition hover:text-[#b98b67]"
          >
            Collections
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              setMobileMenuOpen(false);

              const searchBar =
                document.getElementById(
                  "navbar-search"
                );

              searchBar?.classList.toggle(
                "hidden"
              );

              setTimeout(() => {
                const searchInput =
                  document.getElementById(
                    "navbar-search-input"
                  );

                searchInput?.focus();
              }, 100);
            }}
            className="transition hover:text-[#b98b67]"
          >
            <Search size={21} />
          </button>

          {/* Account */}
          <button
            type="button"
            aria-label="Account"
            className="hidden transition hover:text-[#b98b67] sm:block"
          >
            <User size={21} />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Shopping cart"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="relative transition hover:text-[#b98b67]"
          >
            <ShoppingBag size={22} />

            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b98b67] px-1 text-[10px] text-white">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#ead8cf] bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3 text-sm font-medium">
            <Link
              href="/"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="border-b border-[#f0e4df] py-3 transition hover:text-[#b98b67]"
            >
              Home
            </Link>

            <Link
              href="/#new-arrivals"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="border-b border-[#f0e4df] py-3 transition hover:text-[#b98b67]"
            >
              New Arrivals
            </Link>

            <Link
              href="/shop?category=Earrings"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="border-b border-[#f0e4df] py-3 transition hover:text-[#b98b67]"
            >
              Earrings
            </Link>

            <Link
              href="/shop?category=Necklaces"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="border-b border-[#f0e4df] py-3 transition hover:text-[#b98b67]"
            >
              Necklaces
            </Link>

            <Link
              href="/shop?category=Bracelets"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="border-b border-[#f0e4df] py-3 transition hover:text-[#b98b67]"
            >
              Bracelets
            </Link>

            <Link
              href="/shop"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="py-3 transition hover:text-[#b98b67]"
            >
              Collections
            </Link>
          </nav>
        </div>
      )}

      {/* Search Bar */}
      <div
        id="navbar-search"
        className="hidden border-t border-[#ead8cf] bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2 rounded-full border border-[#eadbd4] bg-[#fffaf8] px-4 transition focus-within:border-[#b98b67] sm:gap-4 sm:px-5">
            <Search
              size={19}
              className="shrink-0 text-[#b98b67]"
            />

            <input
              id="navbar-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }

                if (e.key === "Escape") {
                  const searchBar =
                    document.getElementById(
                      "navbar-search"
                    );

                  searchBar?.classList.add(
                    "hidden"
                  );
                }
              }}
              placeholder="Search jewellery..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#2a1f1d] outline-none placeholder:text-[#9f8c85] sm:py-4"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
                className="hidden shrink-0 text-sm font-medium text-[#8b736b] transition hover:text-[#2a1f1d] sm:block"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const searchBar =
                  document.getElementById(
                    "navbar-search"
                  );

                searchBar?.classList.add(
                  "hidden"
                );
              }}
              className="shrink-0 text-[#8b736b] transition hover:text-[#2a1f1d]"
              aria-label="Close search"
            >
              <X size={19} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}