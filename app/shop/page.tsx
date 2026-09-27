"use client";

import StoreHeader from "../StoreHeader";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image_url: string;
  description: string;
  stock: number;
  is_active: boolean;
  is_new: boolean;
  is_best_seller: boolean;
};

const categoryLinks = [
  { label: "All", href: "/shop" },
  { label: "Earrings", href: "/shop?category=Earrings" },
  { label: "Necklaces", href: "/shop?category=Necklaces" },
  { label: "Bracelets", href: "/shop?category=Bracelets" },
];

function ShopContent() {
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const searchTerm = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, [selectedCategory, searchTerm]);

  const pageTitle = useMemo(() => {
    if (searchTerm) return `Search Results`;
    if (selectedCategory) return selectedCategory;
    return "Shop Jewellery";
  }, [searchTerm, selectedCategory]);

  const pageDescription = useMemo(() => {
    if (searchTerm) {
      return `Showing results for “${searchTerm}”.`;
    }

    if (selectedCategory) {
      return `Explore our beautiful ${selectedCategory.toLowerCase()} collection, curated for everyday elegance and special moments.`;
    }

    return "Discover elegant studs, earrings, necklaces, bracelets and more, thoughtfully curated for every occasion.";
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff2ec] px-4 pb-16 pt-8 text-[#2a1f1d] sm:px-5 md:pb-20 md:pt-12">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-[30px] border border-[#ead8cf]/70 bg-gradient-to-br from-white via-[#fffaf8] to-[#f8e7de] px-5 py-9 shadow-[0_20px_60px_rgba(70,45,38,0.07)] sm:px-8 md:rounded-[36px] md:px-10 md:py-12">
            <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#f0d2c2]/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#e8c4ac]/20 blur-3xl" />

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2a1f1d] text-[#e8c4ac] shadow-[0_12px_28px_rgba(42,31,29,0.16)]">
                {searchTerm ? <Search size={20} /> : <Sparkles size={20} />}
              </div>

              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b98b67] sm:text-xs">
                Explore The Collection
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
                {pageTitle}
              </h1>

              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6e5b55] sm:text-base">
                {pageDescription}
              </p>

              {(selectedCategory || searchTerm) && (
                <Link
                  href="/shop"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full border border-[#b98b67] bg-white/70 px-5 py-3 text-sm font-semibold text-[#8a6248] transition hover:bg-[#b98b67] hover:text-white"
                >
                  View All Products
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              )}
            </div>
          </section>

          {/* Category navigation */}
          <section className="mt-6">
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2 rounded-full border border-[#ead8cf]/70 bg-white/75 p-2 shadow-[0_10px_30px_rgba(70,45,38,0.04)] backdrop-blur-sm">
                {categoryLinks.map((category) => {
                  const isActive =
                    category.label === "All"
                      ? !selectedCategory && !searchTerm
                      : selectedCategory === category.label;

                  return (
                    <Link
                      key={category.label}
                      href={category.href}
                      className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#2a1f1d] text-white shadow-sm"
                          : "text-[#7a625b] hover:bg-[#fff7f3] hover:text-[#2a1f1d]"
                      }`}
                    >
                      {category.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Result bar */}
          <section className="mt-7 flex flex-col gap-3 rounded-[24px] border border-[#ead8cf]/70 bg-white/70 px-5 py-4 shadow-[0_10px_30px_rgba(70,45,38,0.04)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                <ShoppingBag size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#9b837a]">
                  Collection
                </p>
                <p className="mt-0.5 text-sm font-semibold">
                  {loading
                    ? "Loading products..."
                    : `${products.length} ${products.length === 1 ? "product" : "products"}`}
                </p>
              </div>
            </div>

            {selectedCategory && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff7f3] px-4 py-2 text-xs font-semibold text-[#8a6248]">
                <Tag size={14} />
                {selectedCategory}
              </div>
            )}

            {searchTerm && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff7f3] px-4 py-2 text-xs font-semibold text-[#8a6248]">
                <Search size={14} />
                “{searchTerm}”
              </div>
            )}
          </section>

          {/* Products */}
          <section className="mt-7">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[24px] border border-[#ead8cf]/60 bg-white/75 p-3 shadow-[0_12px_30px_rgba(70,45,38,0.04)]"
                  >
                    <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-[#f3e5de]" />
                    <div className="mt-4 h-3 w-20 animate-pulse rounded-full bg-[#f3e5de]" />
                    <div className="mt-3 h-5 w-3/4 animate-pulse rounded-full bg-[#f3e5de]" />
                    <div className="mt-3 h-4 w-24 animate-pulse rounded-full bg-[#f3e5de]" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 px-6 py-14 text-center shadow-[0_16px_45px_rgba(70,45,38,0.05)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5e3da] text-[#b98b67]">
                  <Search size={24} />
                </div>

                <h2 className="mt-5 font-serif text-3xl">
                  No Products Found
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#6e5b55]">
                  {searchTerm
                    ? `We couldn't find any products matching “${searchTerm}”. Try another search or explore the full collection.`
                    : "There are currently no products available in this category."}
                </p>

                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
                >
                  View All Products
                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
                {products.map((product) => {
                  const discount =
                    product.mrp > product.price
                      ? Math.round(
                          ((product.mrp - product.price) / product.mrp) * 100
                        )
                      : 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group block"
                    >
                      <article className="h-full overflow-hidden rounded-[24px] border border-[#ead8cf]/65 bg-white/85 p-2.5 shadow-[0_12px_34px_rgba(70,45,38,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#dfc3b3] hover:shadow-[0_20px_48px_rgba(70,45,38,0.10)] sm:p-3">
                        <div className="relative overflow-hidden rounded-[20px] bg-[#f8efeb]">
                          <div className="aspect-[4/5]">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={500}
                              height={625}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="absolute left-3 top-3 flex flex-col gap-2">
                            {product.is_new && (
                              <span className="rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a6248] shadow-sm backdrop-blur">
                                New
                              </span>
                            )}

                            {discount > 0 && (
                              <span className="w-fit rounded-full bg-[#2a1f1d]/92 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur">
                                {discount}% Off
                              </span>
                            )}
                          </div>

                          {product.stock <= 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#2a1f1d]/35 backdrop-blur-[1px]">
                              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2a1f1d] shadow-sm">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="px-1 pb-2 pt-4 sm:px-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b98b67] sm:text-[11px]">
                            {product.category}
                          </p>

                          <h2 className="mt-1 line-clamp-2 min-h-[44px] font-serif text-[17px] leading-[1.3] transition group-hover:text-[#9a6e51] sm:text-xl">
                            {product.name}
                          </h2>

                          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="font-semibold text-[#2a1f1d]">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>

                            {product.mrp > product.price && (
                              <span className="text-xs text-[#a08b84] line-through sm:text-sm">
                                ₹{Number(product.mrp).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-[#ead8cf]/60 pt-3">
                            <span className="text-xs font-semibold text-[#8a6248]">
                              View Product
                            </span>

                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4ef] text-[#b98b67] transition group-hover:bg-[#2a1f1d] group-hover:text-white">
                              <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <>
          <StoreHeader />

          <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff2ec] px-4 py-12 text-[#2a1f1d] sm:px-5">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-[30px] border border-[#ead8cf]/70 bg-white/80 px-6 py-14 text-center shadow-[0_16px_45px_rgba(70,45,38,0.05)]">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ead8cf] border-t-[#b98b67]" />
                <p className="mt-4 text-sm text-[#6e5b55]">
                  Loading products...
                </p>
              </div>
            </div>
          </main>
        </>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
