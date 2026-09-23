"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useCart } from "./context/CartContext";

export default function StoreHeader() {
  const router = useRouter();
  const { cartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim();

    if (!term) return;

    router.push(
      `/shop?search=${encodeURIComponent(term)}`
    );

    const searchBar =
      document.getElementById(
        "navbar-search"
      );

    searchBar?.classList.add("hidden");

    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="overflow-hidden bg-[#b98b67] py-2 text-white">
        <div className="ticker-track">
          <div className="ticker-group">
            <span>
              Free Shipping on Orders Above ₹999
            </span>
            <span>•</span>
            <span>Secure Payments</span>
            <span>•</span>
            <span>Easy Returns</span>
            <span>•</span>
            <span>New Arrivals Available</span>
            <span>•</span>

            <span>
              Free Shipping on Orders Above ₹999
            </span>
            <span>•</span>
            <span>Secure Payments</span>
            <span>•</span>
            <span>Easy Returns</span>
            <span>•</span>
            <span>New Arrivals Available</span>
            <span>•</span>

            <span>
              Free Shipping on Orders Above ₹999
            </span>
            <span>•</span>
            <span>Secure Payments</span>
            <span>•</span>
            <span>Easy Returns</span>
            <span>•</span>
            <span>New Arrivals Available</span>
            <span>•</span>
          </div>

          <div
            className="ticker-group"
            aria-hidden="true"
          >
            <span>
              Free Shipping on Orders Above ₹999
            </span>
            <span>•</span>
            <span>Secure Payments</span>
            <span>•</span>
            <span>Easy Returns</span>
            <span>•</span>
            <span>New Arrivals Available</span>
            <span>•</span>

            <span>
              Free Shipping on Orders Above ₹999
            </span>
            <span>•</span>
            <span>Secure Payments</span>
            <span>•</span>
            <span>Easy Returns</span>
            <span>•</span>
            <span>New Arrivals Available</span>
            <span>•</span>

            <span>
              Free Shipping on Orders Above ₹999
            </span>
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

      {/* Navbar + Mobile Expansion Wrapper */}
      <div className="relative mx-3 mt-3 max-w-7xl lg:mx-auto">
        {/* Main Navbar */}
        <div
          className={`relative z-50 flex min-h-[96px] items-center justify-between border border-[#ead8cf] px-5 transition-all duration-300 ${
            mobileMenuOpen
  ? "rounded-t-[24px] rounded-b-none border-b-0 lg:rounded-[28px] lg:border-b"
  : "rounded-[24px] lg:rounded-[28px]"
          } ${
            scrolled
              ? "bg-[#fffaf8]/72 shadow-[0_10px_30px_rgba(70,45,38,0.10)] backdrop-blur-2xl"
              : "bg-[#fffaf8]/88 shadow-[0_8px_28px_rgba(70,45,38,0.06)] backdrop-blur-2xl"
          }`}
        >
          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={
              mobileMenuOpen
            }
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4e3da] hover:text-[#b98b67] lg:hidden"
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
            onClick={closeMobileMenu}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0"
          >
            <Image
              src="/images/logo/studlogo.png"
              alt="The Stud House Elite"
              width={90}
              height={90}
              priority
              className={`rounded-full object-cover transition-all duration-300 ${
                scrolled
                  ? "h-[66px] w-[66px] md:h-[78px] md:w-[78px]"
                  : "h-[72px] w-[72px] md:h-[84px] md:w-[84px]"
              }`}
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <DesktopNavLink
              href="/"
              label="Home"
            />

            <DesktopNavLink
              href="/#new-arrivals"
              label="New Arrivals"
            />

            <DesktopNavLink
              href="/shop?category=Earrings"
              label="Earrings"
            />

            <DesktopNavLink
              href="/shop?category=Necklaces"
              label="Necklaces"
            />

            <DesktopNavLink
              href="/shop?category=Bracelets"
              label="Bracelets"
            />

            <DesktopNavLink
              href="/shop"
              label="Collections"
            />
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
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
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4e3da] hover:text-[#b98b67]"
            >
              <Search size={21} />
            </button>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Account"
              onClick={closeMobileMenu}
              className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4e3da] hover:text-[#b98b67] sm:flex"
            >
              <User size={21} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              onClick={closeMobileMenu}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4e3da] hover:text-[#b98b67]"
            >
              <ShoppingBag size={22} />

              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b98b67] px-1 text-[10px] text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu backdrop"
          onClick={closeMobileMenu}
          className={`fixed inset-x-0 bottom-0 top-[145px] z-30 bg-[#2a1f1d]/10 backdrop-blur-[3px] transition-all duration-300 lg:hidden ${
            mobileMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        />

        {/* Mobile Menu - Feels like Navbar Extension */}
        <div
          className={`absolute left-0 right-0 top-full z-40 origin-top overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            mobileMenuOpen
              ? "pointer-events-auto max-h-[720px] translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
          }`}
        >
          <div className="-mt-px overflow-hidden rounded-b-[24px] border-x border-b border-[#ead8cf] bg-[#fffaf8]/88 shadow-[0_20px_50px_rgba(75,45,35,0.16)] backdrop-blur-3xl">
            {/* Menu Heading */}
            <div className="border-b border-[#ead8cf]/60 bg-transparent px-6 pb-5 pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
                The Stud House Elite
              </p>

              <h2 className="mt-1 font-serif text-xl text-[#2a1f1d]">
                Explore Our Collection
              </h2>

              <div className="mt-3 h-px w-12 bg-[#b98b67]" />
            </div>

            {/* Links */}
            <nav className="px-4 py-3">
              <MobileMenuLink
                href="/"
                label="Home"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/#new-arrivals"
                label="New Arrivals"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/shop?category=Earrings"
                label="Earrings"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/shop?category=Necklaces"
                label="Necklaces"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/shop?category=Bracelets"
                label="Bracelets"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/shop"
                label="Collections"
                onClick={closeMobileMenu}
              />
            </nav>

            {/* Bottom Buttons */}
            <div className="grid grid-cols-2 gap-3 border-t border-[#ead8cf]/60 bg-[#fffaf8]/55 p-4 backdrop-blur-2xl">
              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#ead8cf] bg-white/75 px-3 py-3 text-sm font-semibold text-[#2a1f1d] transition hover:border-[#b98b67]"
              >
                <User size={17} />
                My Account
              </Link>

              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#2a1f1d] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
              >
                <ShoppingBag size={17} />
                Cart ({cartCount})
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        id="navbar-search"
        className="relative z-50 hidden border-b border-[#ead8cf] bg-white/95 backdrop-blur-xl"
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
                if (
                  e.key === "Enter"
                ) {
                  handleSearch();
                }

                if (
                  e.key === "Escape"
                ) {
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

function DesktopNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group relative py-2 text-sm font-medium text-[#2a1f1d] transition hover:text-[#b98b67]"
    >
      <span>{label}</span>

      <span className="absolute bottom-0 left-1/2 h-[1.5px] w-0 -translate-x-1/2 bg-[#b98b67] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileMenuLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center justify-between border-b border-[#efe4df] px-3 py-4 text-[15px] font-medium text-[#2a1f1d] transition last:border-b-0 hover:bg-[#fff7f3] hover:text-[#b98b67]"
    >
      <span>{label}</span>

      <ChevronRight
        size={17}
        className="text-[#cbb1a4] transition group-hover:translate-x-1 group-hover:text-[#b98b67]"
      />
    </Link>
  );
}