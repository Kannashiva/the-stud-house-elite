import { supabase } from "../../../lib/supabase";
import AddToCart from "./AddToCart";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "../../StoreHeader";
import {
  ChevronLeft,
  ShieldCheck,
  PackageCheck,
  Headphones,
} from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .eq("is_active", true)
    .single();

  if (error || !product) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              The Stud House Elite
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Product Not Found
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#7c6a63]">
              This product may no longer be available or
              may have been removed from our collection.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#2a1f1d] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(42,31,29,0.16)] transition hover:-translate-y-0.5 hover:bg-[#b98b67]"
            >
              <ChevronLeft size={17} />
              Back to Shop
            </Link>
          </div>
        </main>
      </>
    );
  }

  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);

  const discount =
    mrp > price && mrp > 0
      ? Math.round(
          ((mrp - price) / mrp) * 100
        )
      : 0;

  const totalStock = Number(
    product.stock || 0
  );

  const reservedStock = Number(
    product.reserved_stock || 0
  );

  const availableStock = Math.max(
    0,
    totalStock - reservedStock
  );

  const isOutOfStock =
    availableStock <= 0;

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff5f0] text-[#2a1f1d]">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 md:pb-20 md:pt-10">

          {/* Back Link */}
          <Link
            href="/shop"
            className="group mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#8a6248] transition hover:text-[#b98b67]"
          >
            <ChevronLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
            Back to Shop
          </Link>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">

            {/* Product Image */}
            <div className="lg:sticky lg:top-44 lg:self-start">
              <div className="relative overflow-hidden rounded-[30px] border border-[#ead8cf]/70 bg-white shadow-[0_20px_55px_rgba(70,45,38,0.10)]">

                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={900}
                  height={1050}
                  priority
                  className="h-auto max-h-[720px] w-full object-cover"
                />

                {/* Image Top Badges */}
                <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                  {product.is_new && (
                    <span className="rounded-full border border-white/30 bg-[#2a1f1d]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      New Arrival
                    </span>
                  )}

                  {product.is_best_seller && (
                    <span className="rounded-full border border-white/30 bg-[#b98b67]/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      ★ Best Seller
                    </span>
                  )}
                </div>

                {discount > 0 && (
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#8a6248] shadow-sm backdrop-blur-md">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center rounded-[30px] border border-[#ead8cf]/70 bg-white/70 p-6 shadow-[0_18px_50px_rgba(70,45,38,0.06)] backdrop-blur-sm sm:p-8 lg:p-10">

              {/* Category */}
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
                {product.category}
              </p>

              {/* Product Name */}
              <h1 className="mt-3 font-serif text-4xl leading-[1.12] md:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />

              {/* Price */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold tracking-tight md:text-3xl">
                  ₹
                  {price.toLocaleString(
                    "en-IN"
                  )}
                </span>

                {mrp > price && (
                  <>
                    <span className="text-base text-[#9f8c85] line-through md:text-lg">
                      ₹
                      {mrp.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span className="rounded-full border border-[#e8cfc1] bg-[#fff3ed] px-3 py-1.5 text-xs font-semibold text-[#8a6248]">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {mrp > price && (
                <p className="mt-2 text-xs text-[#8b736b]">
                  You save ₹
                  {(
                    mrp - price
                  ).toLocaleString("en-IN")}
                </p>
              )}

              {/* Description */}
              <div className="mt-7 rounded-[22px] bg-[#fffaf8] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b98b67]">
                  Product Details
                </p>

                <p className="text-sm leading-7 text-[#6e5b55] sm:text-base">
                  {product.description}
                </p>
              </div>

              {/* Stock */}
              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isOutOfStock
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                />

                {isOutOfStock ? (
                  <p className="text-sm font-semibold text-red-600">
                    Currently Sold Out
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-green-700">
                    In Stock & Ready to Order
                  </p>
                )}
              </div>

              {/* Cart Controls */}
              <AddToCart
                product={{
                  id: String(product.id),
                  name: product.name,
                  price,
                  image: product.image_url,
                  category:
                    product.category,

                  // Available stock after
                  // reservations.
                  stock: availableStock,
                }}
              />

              {/* Trust Information */}
              <div className="mt-9 grid grid-cols-3 gap-2 border-t border-[#ead8cf] pt-7 sm:gap-4">

                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f6e7df] text-[#b98b67]">
                    <ShieldCheck
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="mt-3 text-xs font-semibold sm:text-sm">
                    Secure Payment
                  </p>

                  <p className="mt-1 hidden text-xs text-[#8b736b] sm:block">
                    Trusted checkout
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f6e7df] text-[#b98b67]">
                    <PackageCheck
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="mt-3 text-xs font-semibold sm:text-sm">
                    Fast Dispatch
                  </p>

                  <p className="mt-1 hidden text-xs text-[#8b736b] sm:block">
                    Carefully packed
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f6e7df] text-[#b98b67]">
                    <Headphones
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="mt-3 text-xs font-semibold sm:text-sm">
                    Support
                  </p>

                  <p className="mt-1 hidden text-xs text-[#8b736b] sm:block">
                    Easy assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}