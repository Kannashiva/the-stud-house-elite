"use client";

import { useState } from "react";
import StoreHeader from "../StoreHeader";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { supabase } from "../../lib/supabase";

export default function CartPage() {
  const {
    cart,
    subtotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const router = useRouter();

  const [checkingAuth, setCheckingAuth] =
    useState(false);

  const handleCheckout = async () => {
    if (checkingAuth) return;

    setCheckingAuth(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(
          "/account/login?redirect=/checkout"
        );
        return;
      }

      router.push("/checkout");
    } finally {
      setCheckingAuth(false);
    }
  };

  /* ---------------- EMPTY CART ---------------- */

  if (cart.length === 0) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fff8f5] to-[#fff3ee] px-5 py-14 text-[#2a1f1d]">
          <div className="mx-auto flex min-h-[62vh] max-w-4xl items-center justify-center">
            <div className="w-full max-w-xl rounded-[32px] border border-[#ead8cf]/70 bg-white/75 px-6 py-12 text-center shadow-[0_20px_60px_rgba(70,45,38,0.08)] backdrop-blur-sm sm:px-10">

              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#fff4ef] to-[#f1d8cb] text-[#b98b67] shadow-sm">
                <ShoppingBag
                  size={32}
                  strokeWidth={1.6}
                />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
                Your Selection
              </p>

              <h1 className="mt-3 font-serif text-4xl md:text-5xl">
                Your Cart is Empty
              </h1>

              <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#b98b67] to-transparent" />

              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#6e5b55] sm:text-base">
                Discover something beautiful and add a little
                elegance to your collection.
              </p>

              <Link
                href="/shop"
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_10px_25px_rgba(42,31,29,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67]"
              >
                <ShoppingBag size={17} />
                Explore Collection
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  /* ---------------- CART ---------------- */

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-gradient-to-b from-[#fffaf8] via-[#fffaf8] to-[#fff3ee] px-5 pb-16 pt-10 text-[#2a1f1d] md:pb-20">

        <div className="mx-auto max-w-7xl">

          {/* Back */}
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#8a6248] transition hover:text-[#b98b67]"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
            Continue Shopping
          </Link>

          {/* Heading */}
          <div className="mb-9 mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b98b67]">
              Your Selection
            </p>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl">
                  Shopping Cart
                </h1>

                <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#b98b67] to-transparent" />
              </div>

              <p className="text-sm text-[#8b736b]">
                {cart.length} product
                {cart.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => {
                const isMaxStock =
                  item.quantity >= item.stock;

                const lineTotal =
                  item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-[26px] border border-[#ead8cf]/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(70,45,38,0.05)] backdrop-blur-sm transition duration-300 hover:border-[#dfc6b8] hover:shadow-[0_16px_40px_rgba(70,45,38,0.09)] sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">

                      {/* Image */}
                      <Link
                        href={`/product/${item.id}`}
                        className="shrink-0"
                      >
                        <div className="overflow-hidden rounded-[20px] bg-[#f8efeb]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={180}
                            height={180}
                            className="h-28 w-28 object-cover transition duration-500 group-hover:scale-105 sm:h-36 sm:w-36"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b98b67] sm:text-xs">
                            {item.category}
                          </p>

                          <Link
                            href={`/product/${item.id}`}
                            className="transition hover:text-[#b98b67]"
                          >
                            <h2 className="mt-1 line-clamp-2 font-serif text-lg leading-6 sm:text-xl">
                              {item.name}
                            </h2>
                          </Link>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="font-semibold">
                              ₹
                              {item.price.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <span className="text-xs text-[#9b837a]">
                              each
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-[#8b736b]">
                            {item.stock} item
                            {item.stock > 1
                              ? "s"
                              : ""}{" "}
                            currently available
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">

                          <div>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b837a]">
                              Quantity
                            </p>

                            <div className="flex items-center rounded-full border border-[#dcc9bf] bg-[#fffaf8] p-1">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id
                                  )
                                }
                                disabled={
                                  item.quantity <= 1
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#6e5b55] transition hover:bg-[#f4e3da] hover:text-[#b98b67] disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <Minus size={16} />
                              </button>

                              <span className="min-w-9 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  increaseQuantity(
                                    item.id
                                  )
                                }
                                disabled={isMaxStock}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#6e5b55] transition hover:bg-[#f4e3da] hover:text-[#b98b67] disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Item Total + Remove */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-[0.14em] text-[#9b837a]">
                                Total
                              </p>

                              <p className="mt-1 font-semibold">
                                ₹
                                {lineTotal.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(
                                  item.id
                                )
                              }
                              aria-label="Remove product"
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-50/60 text-red-500 transition hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>

                        {isMaxStock &&
                          item.stock > 0 && (
                            <p className="mt-3 text-xs font-semibold text-[#b98b67]">
                              Maximum available quantity reached.
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Small Trust Strip */}
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-[#ead8cf]/60 bg-white/60 px-4 py-3">
                  <ShieldCheck
                    size={19}
                    className="shrink-0 text-[#b98b67]"
                  />

                  <span className="text-xs font-semibold text-[#6e5b55]">
                    Secure Checkout
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-[#ead8cf]/60 bg-white/60 px-4 py-3">
                  <Truck
                    size={19}
                    className="shrink-0 text-[#b98b67]"
                  />

                  <span className="text-xs font-semibold text-[#6e5b55]">
                    Safe Delivery
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-[#ead8cf]/60 bg-white/60 px-4 py-3 sm:col-span-1">
                  <Sparkles
                    size={19}
                    className="shrink-0 text-[#b98b67]"
                  />

                  <span className="text-xs font-semibold text-[#6e5b55]">
                    Carefully Packed
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="h-fit overflow-hidden rounded-[30px] border border-[#b98b67]/20 bg-gradient-to-br from-[#241916] via-[#2b1d19] to-[#1f1512] p-7 text-white shadow-[0_22px_60px_rgba(42,31,29,0.18)] lg:sticky lg:top-36">

              {/* Decorative Glow */}
              <div className="pointer-events-none absolute" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d9aa86]">
                Your Order
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-4 h-px w-12 bg-[#b98b67]/70" />

              {/* Summary */}
              <div className="mt-7 space-y-4 border-b border-white/10 pb-6 text-sm">

                <div className="flex justify-between gap-4 text-white/70">
                  <span>Subtotal</span>

                  <span className="font-medium text-white/90">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-white/70">
                  <span>Shipping</span>

                  <span className="text-right text-xs leading-5 text-white/60">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Estimated Total
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>

                <span className="shrink-0 font-serif text-2xl text-[#e8c4ac]">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkingAuth}
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#e8c4ac] px-5 py-4 text-sm font-semibold tracking-wide text-[#2a1f1d] shadow-[0_10px_25px_rgba(232,196,172,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={18} />

                {checkingAuth
                  ? "Checking Account..."
                  : "Proceed to Checkout"}
              </button>

              <Link
                href="/shop"
                className="group mt-5 flex items-center justify-center gap-2 text-sm text-white/55 transition hover:text-white"
              >
                <ArrowLeft
                  size={15}
                  className="transition group-hover:-translate-x-1"
                />
                Continue Shopping
              </Link>

              {/* Secure Note */}
              <div className="mt-7 rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-sm">
                <ShieldCheck
                  size={20}
                  className="mx-auto text-[#e8c4ac]"
                />

                <p className="mt-2 text-xs font-semibold text-white/80">
                  Secure Checkout
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/45">
                  Your payment information is processed securely.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}