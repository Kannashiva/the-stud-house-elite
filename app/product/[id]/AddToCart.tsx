"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function AddToCart({
  product,
}: {
  product: Product;
}) {
  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  const [inCart, setInCart] =
    useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  const isOutOfStock =
    product.stock <= 0;

  const decrease = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increase = () => {
    setQuantity((current) =>
      Math.min(
        product.stock,
        current + 1
      )
    );
  };

  const handleAdd = () => {
    if (isOutOfStock) return;

    if (inCart) {
      router.push("/cart");
      return;
    }

    addToCart(
      product,
      quantity
    );

    setAdded(true);
    setInCart(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addToCart(
      product,
      quantity
    );

    router.push("/checkout");
  };

  return (
    <>
      {/* Quantity */}
      <div className="mt-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#2a1f1d]">
              Quantity
            </p>

            {!isOutOfStock && (
              <p className="mt-1 text-xs text-[#8b736b]">
                {product.stock} item
                {product.stock > 1
                  ? "s"
                  : ""}{" "}
                available
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center rounded-full border border-[#dcc9bf] bg-white p-1 shadow-sm">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={decrease}
              disabled={
                isOutOfStock ||
                quantity <= 1
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6e5b55] transition hover:bg-[#f6e7df] hover:text-[#b98b67] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={17} />
            </button>

            <span className="min-w-10 text-center text-sm font-semibold">
              {isOutOfStock
                ? 0
                : quantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              onClick={increase}
              disabled={
                isOutOfStock ||
                quantity >=
                  product.stock
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6e5b55] transition hover:bg-[#f6e7df] hover:text-[#b98b67] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={17} />
            </button>
          </div>
        </div>

        {isOutOfStock && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            This product is currently
            unavailable.
          </p>
        )}
      </div>

      {/* Purchase Buttons */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="group flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#2a1f1d] px-6 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_10px_25px_rgba(42,31,29,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:shadow-[0_14px_30px_rgba(185,139,103,0.25)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
        >
          {isOutOfStock ? (
            "Sold Out"
          ) : added ? (
            <>
              <Check size={18} />
              Added to Cart
            </>
          ) : inCart ? (
            <>
              <ShoppingBag size={18} />
              Go to Cart
            </>
          ) : (
            <>
              <ShoppingBag
                size={18}
                className="transition group-hover:scale-105"
              />
              Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="group flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-[#b98b67] bg-white/70 px-6 py-4 text-sm font-semibold tracking-wide text-[#2a1f1d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b98b67] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:translate-y-0 disabled:hover:bg-transparent"
        >
          {!isOutOfStock && (
            <Zap
              size={18}
              className="transition group-hover:scale-105"
            />
          )}

          {isOutOfStock
            ? "Unavailable"
            : "Buy Now"}
        </button>
      </div>
    </>
  );
}