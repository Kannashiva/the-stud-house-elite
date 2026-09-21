import { supabase } from "../../../lib/supabase";
import AddToCart from "./AddToCart";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "../../StoreHeader";

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

    <main>
        <h1 className="font-serif text-4xl text-[#2a1f1d]">
          Product Not Found
        </h1>

        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-[#2a1f1d] px-7 py-3 text-sm font-semibold text-white"
        >
          Back to Shop
        </Link>
      </main>
        </>

    );
  }

  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
  <>
    <StoreHeader />

    <main className="min-h-screen bg-[#fffaf8] px-5 py-12 text-[#2a1f1d]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/shop"
            className="text-sm font-medium text-[#b98b67] transition hover:text-[#2a1f1d]"
          >
            ← Back to Shop
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-[32px] bg-white">
            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              {product.category}
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              <span className="text-lg text-[#9f8c85] line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>

              <span className="rounded-full bg-[#f4e3da] px-3 py-1 text-xs font-semibold text-[#8a6248]">
                {discount}% OFF
              </span>
            </div>

            <p className="mt-6 max-w-xl leading-7 text-[#6e5b55]">
              {product.description}
            </p>

            <div className="mt-6">
              <span className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                In Stock
              </span>
            </div>

            {/* Cart Controls */}
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image_url,
                category: product.category,
              }}
            />

            {/* Trust Info */}
            <div className="mt-10 grid gap-4 border-t border-[#ead8cf] pt-8 sm:grid-cols-3">
              <div>
                <p className="font-semibold">Secure Payment</p>
                <p className="mt-1 text-sm text-[#8b736b]">
                  Trusted checkout
                </p>
              </div>

              <div>
                <p className="font-semibold">Fast Dispatch</p>
                <p className="mt-1 text-sm text-[#8b736b]">
                  Carefully packed
                </p>
              </div>

              <div>
                <p className="font-semibold">Support</p>
                <p className="mt-1 text-sm text-[#8b736b]">
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