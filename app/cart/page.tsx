"use client";

import { useEffect, useState } from "react";
import StoreHeader from "../StoreHeader";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
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

  if (cart.length === 0) {
    return (
      <>
        <StoreHeader />

        <main className="min-h-screen bg-[#fffaf8] px-5 py-16 text-[#2a1f1d]">
          <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center text-center">
            <h1 className="font-serif text-4xl md:text-5xl">
              Your Cart is Empty
            </h1>

            <p className="mt-4 text-[#6e5b55]">
              Discover something beautiful for your collection.
            </p>

            <Link
              href="/shop"
              className="mt-8 rounded-full bg-[#2a1f1d] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#b98b67]"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <StoreHeader />

      <main className="min-h-screen bg-[#fffaf8] px-5 py-14 text-[#2a1f1d]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b98b67]">
              Your Selection
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Shopping Cart
            </h1>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <div className="space-y-5">
              {cart.map((item) => {
                const isMaxStock =
                  item.quantity >= item.stock;

                return (
                  <div
                    key={item.id}
                    className="flex gap-5 rounded-[24px] border border-[#ead8cf] bg-white p-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="h-28 w-28 rounded-[18px] object-cover sm:h-36 sm:w-36"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#b98b67]">
                          {item.category}
                        </p>

                        <h2 className="mt-1 font-serif text-lg sm:text-xl">
                          {item.name}
                        </h2>

                        <p className="mt-2 font-semibold">
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p className="mt-1 text-xs text-[#8b736b]">
                          {item.stock} item
                          {item.stock > 1
                            ? "s"
                            : ""}{" "}
                          available
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-[#dcc9bf]">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                            disabled={
                              item.quantity <= 1
                            }
                            className="px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="min-w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                            disabled={isMaxStock}
                            className="px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                          aria-label="Remove product"
                          className="text-red-600 transition hover:text-red-700"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>

                      {isMaxStock &&
                        item.stock > 0 && (
                          <p className="mt-2 text-xs font-medium text-[#b98b67]">
                            Maximum available
                            quantity reached
                          </p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <aside className="h-fit rounded-[28px] bg-[#2a1f1d] p-7 text-white lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4 border-b border-white/15 pb-6 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-semibold text-[#e8c4ac]">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkingAuth}
                className="mt-7 block w-full rounded-full bg-[#e8c4ac] py-4 text-center text-sm font-semibold text-[#2a1f1d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingAuth
                  ? "Checking Account..."
                  : "Proceed to Checkout"}
              </button>

              <Link
                href="/shop"
                className="mt-4 block text-center text-sm text-white/60 transition hover:text-white"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}