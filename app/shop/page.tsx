"use client";

import StoreHeader from "../StoreHeader";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Explore The Collection
            </p>

            <h1 className="font-serif text-4xl md:text-6xl">
              {searchTerm
                ? `Search: ${searchTerm}`
                : selectedCategory
                ? selectedCategory
                : "Shop Jewellery"}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-[#6e5b55]">
              {searchTerm
                ? `Showing results for "${searchTerm}".`
                : selectedCategory
                ? `Explore our beautiful ${selectedCategory.toLowerCase()} collection.`
                : "Discover elegant studs, earrings, necklaces, bracelets and more."}
            </p>

            {(selectedCategory || searchTerm) && (
              <Link
                href="/shop"
                className="mt-6 inline-block rounded-full border border-[#b98b67] px-5 py-2 text-sm font-semibold transition hover:bg-[#b98b67] hover:text-white"
              >
                View All Products
              </Link>
            )}
          </div>

          {/* Products */}
          {loading ? (
            <div className="py-20 text-center text-[#6e5b55]">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="font-serif text-2xl">
                No products found
              </h2>

              <p className="mt-2 text-[#6e5b55]">
                {searchTerm
                  ? `We couldn't find any products matching "${searchTerm}".`
                  : "There are currently no products available in this category."}
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-block rounded-full bg-[#2a1f1d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
              >
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-[24px] bg-white">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={500}
                      height={600}
                      className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[360px]"
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#b98b67]">
                      {product.category}
                    </p>

                    <h2 className="mt-1 font-serif text-lg">
                      {product.name}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        ₹
                        {Number(product.price).toLocaleString("en-IN")}
                      </span>

                      {product.mrp > product.price && (
                        <span className="text-sm text-[#9f8c85] line-through">
                          ₹
                          {Number(product.mrp).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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

          <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
            <div className="mx-auto max-w-7xl py-20 text-center text-[#6e5b55]">
              Loading products...
            </div>
          </main>
        </>
      }
    >
      <ShopContent />
    </Suspense>
  );
}