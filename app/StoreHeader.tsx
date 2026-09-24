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
  LogOut,
} from "lucide-react";
import { useCart } from "./context/CartContext";
import { supabase } from "../lib/supabase";

export default function StoreHeader() {
  const router = useRouter();
  const { cartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [searchOpen, setSearchOpen] =
    useState(false);
  const [scrolled, setScrolled] =
    useState(false);
  const [isLoggedIn, setIsLoggedIn] =
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

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsLoggedIn(!!session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );
      return;
    }

    setMobileMenuOpen(false);
    setSearchOpen(false);

    router.replace("/");
    router.refresh();
  };

  const handleSearch = () => {
    const term = searchTerm.trim();

    if (!term) return;

    router.push(
      `/shop?search=${encodeURIComponent(term)}`
    );

    setSearchOpen(false);

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
          className={`relative z-50 flex min-h-[96px] items-center justify-between overflow-hidden border border-[#ead8cf] px-5 transition-all duration-300 ${
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
            aria-expanded={mobileMenuOpen}
            onClick={() => {
              setSearchOpen(false);
              setMobileMenuOpen(
                !mobileMenuOpen
              );
            }}
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
            className={`absolute top-1/2 z-[70] -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:z-auto lg:translate-x-0 lg:translate-y-0 ${
              searchOpen
                ? "left-[72px] -translate-x-0"
                : "left-1/2 -translate-x-1/2"
            }`}
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
                setSearchOpen(true);

                setTimeout(() => {
                  const desktopInput =
                    document.getElementById(
                      "navbar-search-input"
                    );

                  const mobileInput =
                    document.getElementById(
                      "navbar-search-input-mobile"
                    );

                  if (window.innerWidth >= 1024) {
                    desktopInput?.focus();
                  } else {
                    mobileInput?.focus();
                  }
                }, 300);
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

            {/* Logout - shown only when signed in */}
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4e3da] hover:text-[#b98b67]"
              >
                <LogOut size={21} />
              </button>
            )}
          </div>

          {/* Search Panel - expands from the right search icon towards the logo */}
          <div
            className={`absolute bottom-0 top-0 z-[60] hidden origin-right items-center overflow-hidden bg-[#fffaf8]/98 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
              searchOpen
                ? "left-[125px] right-[188px] scale-x-100 opacity-100"
                : "left-[125px] right-[188px] pointer-events-none scale-x-0 opacity-0"
            }`}
            aria-hidden={!searchOpen}
          >
            <div className="flex w-full items-center gap-3 rounded-full border border-[#d8aa88] bg-white/85 px-5 shadow-sm">
              <Search
                size={20}
                className="shrink-0 text-[#b98b67]"
              />

              <input
                id="navbar-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }

                  if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search jewellery..."
                tabIndex={searchOpen ? 0 : -1}
                className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#2a1f1d] outline-none placeholder:text-[#9f8c85] sm:text-base"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  tabIndex={searchOpen ? 0 : -1}
                  className="shrink-0 text-sm font-medium text-[#8b736b] transition hover:text-[#2a1f1d]"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(false)
                }
                tabIndex={searchOpen ? 0 : -1}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8b736b] transition hover:bg-[#f4e3da] hover:text-[#2a1f1d]"
                aria-label="Close search"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Mobile / tablet search - expands from right and stops before moving logo */}
          <div
            className={`absolute inset-y-0 left-[150px] right-3 z-[60] flex origin-right items-center overflow-hidden bg-[#fffaf8]/98 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
              searchOpen
                ? "scale-x-100 opacity-100"
                : "pointer-events-none scale-x-0 opacity-0"
            }`}
            aria-hidden={!searchOpen}
          >
            <div className="flex w-full items-center gap-2 rounded-full border border-[#d8aa88] bg-white/90 px-3 shadow-sm">
              <Search
                size={18}
                className="shrink-0 text-[#b98b67]"
              />

              <input
                id="navbar-search-input-mobile"
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }

                  if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search jewellery..."
                tabIndex={searchOpen ? 0 : -1}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#2a1f1d] outline-none placeholder:text-[#9f8c85]"
              />

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(false)
                }
                tabIndex={searchOpen ? 0 : -1}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8b736b]"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
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